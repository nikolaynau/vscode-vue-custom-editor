import { describe, it, expect, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import EditorView from '../EditorView.vue';
import { VsCodeRpc } from '@/utils/vscode-rpc';
import type { PlusValueCommand } from '@/components/editor/utils/types';
import vscode from '@/plugins/vscode';
import type { ChangeEvent } from '@/components/editor/composables/use-document-model';

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

    expect((VsCodeRpc as any).mock.instances).toHaveLength(1);
    expect(
      (VsCodeRpc as any).mock.instances[0].provider.signal
    ).toBeCalledTimes(1);
    expect((VsCodeRpc as any).mock.instances[0].provider.signal).toBeCalledWith(
      'edit',
      {
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
      } as ChangeEvent
    );
  });
});
