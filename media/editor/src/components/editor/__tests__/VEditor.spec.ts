import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VEditor from '../VEditor.vue';
import type {
  ChangeBlock,
  DocumentObject,
  PlusValueCommand
} from '../utils/types';
import type { InspectorDataModel } from '@/components/inspector/composables/use-inspector';

describe('VEditor', () => {
  it('render default props', () => {
    const wrapper = mount(VEditor);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('value prop as string', () => {
    const value = JSON.stringify({ counter: 10 } as DocumentObject);
    const wrapper = mount(VEditor, { props: { value } });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('value prop as object', () => {
    const value = { counter: 10 } as DocumentObject;
    const wrapper = mount(VEditor, { props: { value } });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('change value', async () => {
    const value = JSON.stringify({ counter: 10 } as DocumentObject);
    const wrapper = mount(VEditor, { props: { value } });

    expect(wrapper.find({ ref: 'output' }).text()).toBe('10');

    const newValue = JSON.stringify({ counter: 7 } as DocumentObject);
    await wrapper.setProps({ value: newValue });

    expect(wrapper.find({ ref: 'output' }).text()).toBe('7');
  });

  it('click plus button', async () => {
    const value = JSON.stringify({ counter: 20 } as DocumentObject);
    const wrapper = mount(VEditor, { props: { value } });

    await Promise.all(
      wrapper
        .find('.v-editor__controls')
        .findAll('.v-button')
        .map(w => w.trigger('click'))
    );

    expect(wrapper.find({ ref: 'output' }).text()).toBe('4');
  });

  it('clear value button', async () => {
    const value = JSON.stringify({ counter: 20 } as DocumentObject);
    const wrapper = mount(VEditor, { props: { value } });

    await wrapper.find('.v-action').trigger('click');
    expect(wrapper.find({ ref: 'output' }).text()).toBe('0');
  });

  it('increment value on key up', async () => {
    const wrapper = mount(VEditor, { props: { keyboardEnabled: true } });

    await wrapper.find('.v-editor').trigger('keydown.up');
    expect(wrapper.find({ ref: 'output' }).text()).toBe('1');
  });

  it('decrement value on key down', async () => {
    const wrapper = mount(VEditor, { props: { keyboardEnabled: true } });

    await wrapper.find('.v-editor').trigger('keydown.down');
    expect(wrapper.find({ ref: 'output' }).text()).toBe('-1');
  });

  it('clear value on key delete', async () => {
    const wrapper = mount(VEditor, { props: { keyboardEnabled: true } });

    await wrapper.find('.v-editor').trigger('keydown.up');
    expect(wrapper.find({ ref: 'output' }).text()).toBe('1');

    await wrapper.find('.v-editor').trigger('keyup.delete');
    expect(wrapper.find({ ref: 'output' }).text()).toBe('0');
  });

  it('error editor state when json value is not valid', async () => {
    const value = JSON.stringify({ badCounter: 20 });
    const wrapper = mount(VEditor, { props: { value } });

    expect(wrapper.find('.v-editor__error').text()).toContain('invalid format');
    expect(wrapper.find('.v-editor__content').exists()).toBeFalsy();
    expect(wrapper.find('.v-editor__shortcuts').exists()).toBeFalsy();
  });

  it('no error state when json value is empty', async () => {
    const value = '';
    const wrapper = mount(VEditor, { props: { value } });

    expect(wrapper.find('.v-editor__error').exists()).toBeFalsy();
    expect(wrapper.find('.v-editor__content').exists()).toBeTruthy();
    expect(wrapper.find('.v-editor__shortcuts').exists()).toBeTruthy();
  });

  it('change value event', async () => {
    const value = JSON.stringify({ counter: 20 } as DocumentObject);
    const wrapper = mount(VEditor, { props: { value } });

    await Promise.all(
      wrapper
        .find('.v-editor__controls')
        .findAll('.v-button')
        .map(w => w.trigger('click'))
    );

    expect(wrapper.find({ ref: 'output' }).text()).toBe('4');

    const changeValueEvent = wrapper.emitted('change-value') as unknown[][];
    expect(changeValueEvent).toHaveLength(3);

    expect(changeValueEvent[0][0]).toEqual({
      changes: [
        {
          applied: {
            name: 'plus',
            payload: { value: -10 }
          } as PlusValueCommand,
          reverse: { name: 'plus', payload: { value: 10 } } as PlusValueCommand
        }
      ] as ChangeBlock[],
      versionId: 1
    });

    expect(changeValueEvent[1][0]).toEqual({
      changes: [
        {
          applied: {
            name: 'plus',
            payload: { value: -5 }
          } as PlusValueCommand,
          reverse: { name: 'plus', payload: { value: 5 } } as PlusValueCommand
        }
      ] as ChangeBlock[],
      versionId: 2
    });

    expect(changeValueEvent[2][0]).toEqual({
      changes: [
        {
          applied: {
            name: 'plus',
            payload: { value: -1 }
          } as PlusValueCommand,
          reverse: { name: 'plus', payload: { value: 1 } } as PlusValueCommand
        }
      ] as ChangeBlock[],
      versionId: 3
    });
  });

  it('disable keyboard events', async () => {
    const wrapper = mount(VEditor, { props: { keyboardEnabled: false } });

    await wrapper.find('.v-editor').trigger('keydown.up');
    expect(wrapper.find({ ref: 'output' }).text()).toBe('0');

    const changeValueEvent = wrapper.emitted('change-value');
    expect(changeValueEvent).toBeUndefined();
  });

  it('update inspector first event', async () => {
    const value = JSON.stringify({ counter: 20 } as DocumentObject);
    const wrapper = mount(VEditor, {
      props: { value, inspectorEnabled: true }
    });

    const updateInspectorEvent = wrapper.emitted(
      'update-inspector'
    ) as unknown[][];

    expect(updateInspectorEvent).toHaveLength(1);
    expect(updateInspectorEvent[0][0]).toEqual({
      counterValue: 20,
      buttons: [
        { id: 1, value: -10 },
        { id: 2, value: -5 },
        { id: 3, value: -1 },
        { id: 4, value: 1 },
        { id: 5, value: 5 },
        { id: 6, value: 10 }
      ]
    } as InspectorDataModel);
  });

  it('update inspector event', async () => {
    const value = JSON.stringify({ counter: 20 } as DocumentObject);
    const wrapper = mount(VEditor, {
      props: { value, inspectorEnabled: true }
    });

    await wrapper
      .find('.v-editor__controls')
      .find('.v-button')
      .trigger('click');

    expect(wrapper.find({ ref: 'output' }).text()).toBe('10');

    const updateInspectorEvent = wrapper.emitted(
      'update-inspector'
    ) as unknown[][];

    expect(updateInspectorEvent).toHaveLength(2);
    expect(updateInspectorEvent[0][0]).toEqual({
      counterValue: 20,
      buttons: [
        { id: 1, value: -10 },
        { id: 2, value: -5 },
        { id: 3, value: -1 },
        { id: 4, value: 1 },
        { id: 5, value: 5 },
        { id: 6, value: 10 }
      ]
    } as InspectorDataModel);
    expect(updateInspectorEvent[1][0]).toEqual({
      counterValue: 10,
      buttons: [
        { id: 1, value: -10 },
        { id: 2, value: -5 },
        { id: 3, value: -1 },
        { id: 4, value: 1 },
        { id: 5, value: 5 },
        { id: 6, value: 10 }
      ]
    } as InspectorDataModel);
  });

  it('disable inspector event', async () => {
    const value = JSON.stringify({ counter: 20 } as DocumentObject);
    const wrapper = mount(VEditor, {
      props: { value, inspectorEnabled: false }
    });

    await wrapper
      .find('.v-editor__controls')
      .find('.v-button')
      .trigger('click');

    expect(wrapper.find({ ref: 'output' }).text()).toBe('10');

    const updateInspectorEvent = wrapper.emitted(
      'update-inspector'
    ) as unknown[][];

    expect(updateInspectorEvent).toBeUndefined();
  });
});
