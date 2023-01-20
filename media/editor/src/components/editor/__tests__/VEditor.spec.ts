import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import VEditor from '../VEditor.vue';
import type { DocumentObject } from '../utils/types';

describe('VEditor', () => {
  it('render default props', () => {
    const wrapper = mount(VEditor);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('value prop', () => {
    const value = JSON.stringify({ counter: 10 } as DocumentObject);
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
});
