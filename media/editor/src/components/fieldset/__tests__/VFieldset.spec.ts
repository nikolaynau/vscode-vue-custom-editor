import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VFieldset from '../VFieldset.vue';

describe('VFieldset', () => {
  it('default render props', () => {
    const wrapper = mount(VFieldset);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('label prop', () => {
    const wrapper = mount(VFieldset, { props: { label: 'Some label' } });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('default slot', () => {
    const wrapper = mount(VFieldset, { slots: { default: 'Text' } });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('tag prop', () => {
    const wrapper = mount(VFieldset, { props: { tag: 'span' } });
    expect(wrapper.element.tagName).toBe('SPAN');
  });

  it('tBorder prop', () => {
    const wrapper = mount(VFieldset, { props: { tBorder: true } });
    expect(wrapper.classes('v-fieldset--t-border')).toBe(true);
  });

  it('bBorder prop', () => {
    const wrapper = mount(VFieldset, { props: { bBorder: true } });
    expect(wrapper.classes('v-fieldset--b-border')).toBe(true);
  });

  it('padding prop', () => {
    const wrapper = mount(VFieldset, { props: { padding: true } });
    expect(wrapper.classes('v-fieldset--padding')).toBe(true);
  });

  it('render label prop with text', () => {
    const wrapper = mount(VFieldset, {
      props: { label: 'Some label' },
      slots: { default: 'Text' }
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
