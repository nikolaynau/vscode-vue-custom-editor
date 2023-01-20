import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import VEditor from '../VEditor.vue';
import type { DocumentObject } from '../utils/types';

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

  it('change value prop', async () => {
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

  it('error editor value', async () => {
    const value = JSON.stringify({ badCounter: 20 });
    const wrapper = mount(VEditor, { props: { value } });

    expect(wrapper.find('.v-editor__error').text()).toContain('invalid format');
  });
});
