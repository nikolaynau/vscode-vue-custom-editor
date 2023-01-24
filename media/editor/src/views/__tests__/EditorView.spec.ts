import { describe, it, expect, vi, afterEach, type Mock } from 'vitest';
import { mount } from '@vue/test-utils';
import EditorView from '../EditorView.vue';
import { VsCodeRpc } from '@/utils/vscode-rpc';
import type { PlusValueCommand } from '@/components/editor/utils/types';
import vscode from '@/plugins/vscode';
import type { ChangeEvent } from '@/components/editor/composables/use-document-model';
import type { InspectorDataModel } from '@/components/inspector/composables/use-inspector';
import { createButtons } from '@/components/editor/utils/buttons';

vi.mock('../../utils/vscode-rpc.ts', () => {
  const VsCodeRpc = vi.fn();
  VsCodeRpc.prototype.provider = {
    signal: vi.fn(),
    registerRpcHandler: vi.fn(),
    registerSignalHandler: vi.fn()
  };
  VsCodeRpc.prototype.destroy = vi.fn();
  return { VsCodeRpc };
});

describe('EditorView', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('render default props', () => {
    const wrapper = mount(EditorView, { global: { plugins: [vscode] } });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('send edit signal', async () => {
    const wrapper = mount(EditorView, { global: { plugins: [vscode] } });

    await wrapper
      .find('.v-editor__controls')
      .find('.v-button')
      .trigger('click');

    expect(wrapper.find('.v-editor__input').text()).toBe('-10');

    expect((VsCodeRpc as Mock).mock.instances).toHaveLength(1);
    expect(
      (VsCodeRpc as Mock).mock.instances[0].provider.signal
    ).toBeCalledTimes(1);
    expect(
      (VsCodeRpc as Mock).mock.instances[0].provider.signal
    ).toBeCalledWith('edit', {
      changes: [
        {
          applied: {
            name: 'plus',
            payload: { value: -10 }
          } as PlusValueCommand,
          reverse: {
            name: 'plus',
            payload: { value: 10 }
          } as PlusValueCommand
        }
      ],
      versionId: 1
    } as ChangeEvent);
  });

  it('send updateInspector signal', async () => {
    const buttons = createButtons().map(btn => ({
      id: btn.id,
      value: btn.value
    }));

    const wrapper = mount(EditorView, {
      props: { inspectorEnabled: true },
      global: { plugins: [vscode] }
    });

    await wrapper
      .find('.v-editor__controls')
      .find('.v-button')
      .trigger('click');

    expect(wrapper.find('.v-editor__input').text()).toBe('-10');

    expect((VsCodeRpc as Mock).mock.instances).toHaveLength(1);
    const signalSpy = (VsCodeRpc as Mock).mock.instances[0].provider
      .signal as Mock;
    expect(signalSpy).toBeCalledTimes(3);

    expect(signalSpy.mock.calls[0][0]).toBe('updateInspector');
    expect(signalSpy.mock.calls[0][1]).toEqual({
      counterValue: 0,
      buttons
    } as InspectorDataModel);

    expect(signalSpy.mock.calls[1][0]).toBe('edit');

    expect(signalSpy.mock.calls[2][0]).toBe('updateInspector');
    expect(signalSpy.mock.calls[2][1]).toEqual({
      counterValue: -10,
      buttons
    } as InspectorDataModel);
  });

  it('call destroy rpc on unmount component', async () => {
    const wrapper = mount(EditorView, { global: { plugins: [vscode] } });
    expect((VsCodeRpc as Mock).mock.instances).toHaveLength(1);
    expect((VsCodeRpc as Mock).mock.instances[0].destroy).toBeCalledTimes(0);

    wrapper.unmount();

    expect((VsCodeRpc as Mock).mock.instances[0].destroy).toBeCalledTimes(1);
  });
});
