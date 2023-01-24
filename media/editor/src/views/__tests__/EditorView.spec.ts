import { describe, it, expect, vi, afterEach, type Mock } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import EditorView from '../EditorView.vue';
import { VsCodeRpc } from '@/utils/vscode-rpc';
import type {
  DocumentObject,
  EditCommandArray,
  PlusValueCommand,
  RawDocument,
  RawJsonDocument
} from '@/components/editor/utils/types';
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

  it('no send updateInspector signal when inspector disabled', async () => {
    const wrapper = mount(EditorView, {
      props: { inspectorEnabled: false },
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
    expect(signalSpy).toBeCalledTimes(1);

    expect(signalSpy.mock.calls[0][0]).toBe('edit');
  });

  it('call destroy rpc on unmount component', async () => {
    const wrapper = mount(EditorView, { global: { plugins: [vscode] } });
    expect((VsCodeRpc as Mock).mock.instances).toHaveLength(1);
    expect((VsCodeRpc as Mock).mock.instances[0].destroy).toBeCalledTimes(0);

    wrapper.unmount();

    expect((VsCodeRpc as Mock).mock.instances[0].destroy).toBeCalledTimes(1);
  });

  it('call setInitialData rpc', async () => {
    const documentData = JSON.stringify({
      counter: 5
    } as DocumentObject) as RawJsonDocument;

    const editOperations = [
      { name: 'plus', payload: { value: 1 } } as PlusValueCommand
    ] as EditCommandArray;

    const rpcHandlers: Record<string, Function> = {};
    (
      VsCodeRpc.prototype.provider.registerRpcHandler as Mock
    ).mockImplementation((id, handler) => {
      rpcHandlers[id] = handler;
    });

    const wrapper = mount(EditorView, { global: { plugins: [vscode] } });
    expect(typeof rpcHandlers['setInitialData']).toBe('function');

    rpcHandlers['setInitialData']({ data: documentData, editOperations });
    await nextTick();

    expect(wrapper.find('.v-editor__input').text()).toBe('6');
  });

  it('pending initial data', async () => {
    const documentData = JSON.stringify({
      counter: 5
    } as DocumentObject) as RawJsonDocument;

    const editOperations = [
      { name: 'plus', payload: { value: 1 } } as PlusValueCommand
    ] as EditCommandArray;

    (
      VsCodeRpc.prototype.provider.registerRpcHandler as Mock
    ).mockImplementation((id, handler) => {
      if (id === 'setInitialData') {
        handler({ data: documentData, editOperations });
      }
    });

    const wrapper = mount(EditorView, { global: { plugins: [vscode] } });

    await nextTick();

    expect(wrapper.find('.v-editor__input').text()).toBe('6');
  });

  it('call getFileData rpc', async () => {
    const rpcHandlers: Record<string, Function> = {};
    (
      VsCodeRpc.prototype.provider.registerRpcHandler as Mock
    ).mockImplementation((id, handler) => {
      rpcHandlers[id] = handler;
    });

    const wrapper = mount(EditorView, { global: { plugins: [vscode] } });
    expect(typeof rpcHandlers['getFileData']).toBe('function');

    await wrapper
      .find('.v-editor__controls')
      .find('.v-button')
      .trigger('click');

    expect(wrapper.find('.v-editor__input').text()).toBe('-10');

    const rpcResult: string = rpcHandlers['getFileData']();

    expect(rpcResult).toBe(
      JSON.stringify({ counter: -10 } as DocumentObject, undefined, 2)
    );
  });

  it('call setFileData rpc', async () => {
    const rpcHandlers: Record<string, Function> = {};
    (
      VsCodeRpc.prototype.provider.registerRpcHandler as Mock
    ).mockImplementation((id, handler) => {
      rpcHandlers[id] = handler;
    });

    const wrapper = mount(EditorView, { global: { plugins: [vscode] } });
    expect(typeof rpcHandlers['setFileData']).toBe('function');

    expect(wrapper.find('.v-editor__input').text()).toBe('0');

    rpcHandlers['setFileData']({ counter: 20 } as RawDocument);

    await nextTick();

    expect(wrapper.find('.v-editor__input').text()).toBe('20');
  });

  it('call applyEdits rpc with notify', async () => {
    const editOperations = [
      { name: 'plus', payload: { value: 5 } } as PlusValueCommand
    ] as EditCommandArray;

    const rpcHandlers: Record<string, Function> = {};
    (
      VsCodeRpc.prototype.provider.registerRpcHandler as Mock
    ).mockImplementation((id, handler) => {
      rpcHandlers[id] = handler;
    });

    const wrapper = mount(EditorView, { global: { plugins: [vscode] } });
    expect(typeof rpcHandlers['applyEdits']).toBe('function');

    expect(wrapper.find('.v-editor__input').text()).toBe('0');

    rpcHandlers['applyEdits']({ editOperations, notify: true });

    await nextTick();

    expect(wrapper.find('.v-editor__input').text()).toBe('5');

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
            payload: { value: 5 }
          } as PlusValueCommand,
          reverse: {
            name: 'plus',
            payload: { value: -5 }
          } as PlusValueCommand
        }
      ],
      versionId: 1
    } as ChangeEvent);
  });

  it('call applyEdits rpc with no notify', async () => {
    const editOperations = [
      { name: 'plus', payload: { value: 5 } } as PlusValueCommand
    ] as EditCommandArray;

    const rpcHandlers: Record<string, Function> = {};
    (
      VsCodeRpc.prototype.provider.registerRpcHandler as Mock
    ).mockImplementation((id, handler) => {
      rpcHandlers[id] = handler;
    });

    const wrapper = mount(EditorView, { global: { plugins: [vscode] } });
    expect(typeof rpcHandlers['applyEdits']).toBe('function');

    expect(wrapper.find('.v-editor__input').text()).toBe('0');

    rpcHandlers['applyEdits']({ editOperations, notify: false });

    await nextTick();

    expect(wrapper.find('.v-editor__input').text()).toBe('5');

    expect((VsCodeRpc as Mock).mock.instances).toHaveLength(1);
    expect(
      (VsCodeRpc as Mock).mock.instances[0].provider.signal
    ).toBeCalledTimes(0);
  });

  it('call needUpdateInspector rpc', async () => {
    const buttons = createButtons().map(btn => ({
      id: btn.id,
      value: btn.value
    }));

    const rpcHandlers: Record<string, Function> = {};
    (
      VsCodeRpc.prototype.provider.registerSignalHandler as Mock
    ).mockImplementation((id, handler) => {
      rpcHandlers[id] = handler;
    });

    const wrapper = mount(EditorView, {
      props: { inspectorEnabled: true },
      global: { plugins: [vscode] }
    });

    expect(typeof rpcHandlers['needUpdateInspector']).toBe('function');

    await wrapper
      .find('.v-editor__controls')
      .find('.v-button')
      .trigger('click');

    expect(wrapper.find('.v-editor__input').text()).toBe('-10');

    expect((VsCodeRpc as Mock).mock.instances).toHaveLength(1);
    const signalSpy = (VsCodeRpc as Mock).mock.instances[0].provider
      .signal as Mock;
    expect(signalSpy).toBeCalledTimes(3);

    rpcHandlers['needUpdateInspector']();

    await nextTick();

    expect(signalSpy).toBeCalledTimes(4);

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

    expect(signalSpy.mock.calls[3][0]).toBe('updateInspector');
    expect(signalSpy.mock.calls[3][1]).toEqual({
      counterValue: -10,
      buttons
    } as InspectorDataModel);
  });

  it('no send inspector model when call applyEdits rpc with notify', async () => {
    const editOperations = [
      { name: 'plus', payload: { value: 5 } } as PlusValueCommand
    ] as EditCommandArray;

    const rpcHandlers: Record<string, Function> = {};
    (
      VsCodeRpc.prototype.provider.registerRpcHandler as Mock
    ).mockImplementation((id, handler) => {
      rpcHandlers[id] = handler;
    });

    const wrapper = mount(EditorView, {
      props: { inspectorEnabled: true },
      global: { plugins: [vscode] }
    });
    expect(typeof rpcHandlers['applyEdits']).toBe('function');

    expect(wrapper.find('.v-editor__input').text()).toBe('0');

    rpcHandlers['applyEdits']({ editOperations, notify: true });

    await nextTick();

    expect(wrapper.find('.v-editor__input').text()).toBe('5');

    expect((VsCodeRpc as Mock).mock.instances).toHaveLength(1);
    const signalSpy = (VsCodeRpc as Mock).mock.instances[0].provider.signal;
    expect(signalSpy).toBeCalledTimes(3);
    expect(signalSpy.mock.calls[0][0]).toBe('updateInspector');
    expect(signalSpy.mock.calls[1][0]).toBe('edit');
    expect(signalSpy.mock.calls[2][0]).toBe('updateInspector');
  });

  it('send inspector model when call applyEdits rpc with no notify', async () => {
    const editOperations = [
      { name: 'plus', payload: { value: 5 } } as PlusValueCommand
    ] as EditCommandArray;

    const rpcHandlers: Record<string, Function> = {};
    (
      VsCodeRpc.prototype.provider.registerRpcHandler as Mock
    ).mockImplementation((id, handler) => {
      rpcHandlers[id] = handler;
    });

    const wrapper = mount(EditorView, {
      props: { inspectorEnabled: true },
      global: { plugins: [vscode] }
    });
    expect(typeof rpcHandlers['applyEdits']).toBe('function');

    expect(wrapper.find('.v-editor__input').text()).toBe('0');

    rpcHandlers['applyEdits']({ editOperations, notify: false });

    await nextTick();

    expect(wrapper.find('.v-editor__input').text()).toBe('5');

    expect((VsCodeRpc as Mock).mock.instances).toHaveLength(1);
    const signalSpy = (VsCodeRpc as Mock).mock.instances[0].provider.signal;
    expect(signalSpy).toBeCalledTimes(2);
    expect(signalSpy.mock.calls[0][0]).toBe('updateInspector');
    expect(signalSpy.mock.calls[1][0]).toBe('updateInspector');
  });

  it('send inspector model when call setInitialData rpc', async () => {
    const documentData = JSON.stringify({
      counter: 5
    } as DocumentObject) as RawJsonDocument;

    const editOperations = [
      { name: 'plus', payload: { value: 1 } } as PlusValueCommand
    ] as EditCommandArray;

    const rpcHandlers: Record<string, Function> = {};
    (
      VsCodeRpc.prototype.provider.registerRpcHandler as Mock
    ).mockImplementation((id, handler) => {
      rpcHandlers[id] = handler;
    });

    const wrapper = mount(EditorView, {
      props: { inspectorEnabled: true },
      global: { plugins: [vscode] }
    });
    expect(typeof rpcHandlers['setInitialData']).toBe('function');

    rpcHandlers['setInitialData']({ data: documentData, editOperations });
    await nextTick();

    expect(wrapper.find('.v-editor__input').text()).toBe('6');

    expect((VsCodeRpc as Mock).mock.instances).toHaveLength(1);
    const signalSpy = (VsCodeRpc as Mock).mock.instances[0].provider.signal;
    expect(signalSpy).toBeCalledTimes(2);
    expect(signalSpy.mock.calls[0][0]).toBe('updateInspector');
    expect(signalSpy.mock.calls[1][0]).toBe('updateInspector');
  });
});
