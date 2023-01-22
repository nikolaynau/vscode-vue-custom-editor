import {
  describe,
  it,
  expect,
  vi,
  afterEach,
  beforeEach,
  type Mock
} from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import InspectorView from '../InspectorView.vue';
import { VsCodeRpc } from '@/utils/vscode-rpc';
import type { InspectorDataModel } from '@/components/inspector/composables/use-inspector';
import type {
  ChangeButtonValueCommand,
  EditCommandArray,
  ReplaceValueCommand
} from '@/components/editor/utils/types';
import vscode from '@/plugins/vscode';

vi.mock('../../utils/vscode-rpc.ts', () => {
  const VsCodeRpc = vi.fn();
  VsCodeRpc.prototype.provider = {
    signal: vi.fn(),
    registerRpcHandler: vi.fn()
  };
  VsCodeRpc.prototype.destroy = vi.fn();
  return { VsCodeRpc };
});

describe('InspectorView', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('send ready signal', () => {
    const wrapper = mount(InspectorView, { global: { plugins: [vscode] } });
    expect(wrapper.html()).toMatchSnapshot();

    expect((VsCodeRpc as any).mock.instances).toHaveLength(1);
    expect(
      (VsCodeRpc as any).mock.instances[0].provider.signal
    ).toBeCalledTimes(1);
    expect((VsCodeRpc as any).mock.instances[0].provider.signal).toBeCalledWith(
      'ready'
    );
  });

  it('setData rpc', async () => {
    const inspectorDataModel = {
      counterValue: 10,
      buttons: [
        { id: 1, value: 2 },
        { id: 2, value: 3 }
      ]
    } as InspectorDataModel;

    const rpcHandlers: Record<string, Function> = {};
    (
      VsCodeRpc.prototype.provider.registerRpcHandler as Mock
    ).mockImplementation((id, handler) => {
      rpcHandlers[id] = handler;
    });

    const wrapper = mount(InspectorView, { global: { plugins: [vscode] } });
    expect(typeof rpcHandlers['setData']).toBe('function');

    rpcHandlers['setData'](inspectorDataModel);
    await nextTick();

    expect(wrapper.html()).toMatchSnapshot();

    const inputs = wrapper.findAll('input');
    expect(inputs).toHaveLength(3);
    expect(+inputs[0].element.value).toBe(inspectorDataModel.counterValue);
    expect(+inputs[1].element.value).toBe(inspectorDataModel.buttons[0].value);
    expect(+inputs[2].element.value).toBe(inspectorDataModel.buttons[1].value);
  });

  it('edit signal', async () => {
    const inspectorDataModel = {
      counterValue: 10,
      buttons: [
        { id: 1, value: 2 },
        { id: 2, value: 3 }
      ]
    } as InspectorDataModel;

    const rpcHandlers: Record<string, Function> = {};
    (
      VsCodeRpc.prototype.provider.registerRpcHandler as Mock
    ).mockImplementation((id, handler) => {
      rpcHandlers[id] = handler;
    });

    const wrapper = mount(InspectorView, { global: { plugins: [vscode] } });
    expect(typeof rpcHandlers['setData']).toBe('function');

    rpcHandlers['setData'](inspectorDataModel);
    await nextTick();

    const inputs = wrapper.findAll('input');
    expect(inputs).toHaveLength(3);

    await inputs[0].setValue(10);
    await inputs[1].setValue(11);
    await inputs[2].setValue(12);

    vi.runAllTimers();

    await nextTick();

    expect((VsCodeRpc as any).mock.instances).toHaveLength(1);
    const signalSpy = (VsCodeRpc as any).mock.instances[0].provider
      .signal as Mock;
    expect(signalSpy).toBeCalledTimes(4);
    expect(signalSpy.mock.calls[0][0]).toBe('ready');

    expect(signalSpy.mock.calls[1][0]).toBe('edit');
    expect(signalSpy.mock.calls[1][1]).toEqual([
      { name: 'replace', payload: { value: 10 } } as ReplaceValueCommand
    ] as EditCommandArray);

    expect(signalSpy.mock.calls[2][0]).toBe('edit');
    expect(signalSpy.mock.calls[2][1]).toEqual([
      {
        name: 'change-button',
        payload: { btnId: 1, value: 11 }
      } as ChangeButtonValueCommand
    ] as EditCommandArray);

    expect(signalSpy.mock.calls[3][0]).toBe('edit');
    expect(signalSpy.mock.calls[3][1]).toEqual([
      {
        name: 'change-button',
        payload: { btnId: 2, value: 12 }
      } as ChangeButtonValueCommand
    ] as EditCommandArray);
  });

  it('call destroy rpc on unmount component', async () => {
    const wrapper = mount(InspectorView, { global: { plugins: [vscode] } });
    expect((VsCodeRpc as any).mock.instances).toHaveLength(1);
    expect((VsCodeRpc as any).mock.instances[0].destroy).toBeCalledTimes(0);

    wrapper.unmount();

    expect((VsCodeRpc as any).mock.instances[0].destroy).toBeCalledTimes(1);
  });
});
