import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VAction from '../VAction.vue';

describe('VAction', () => {
  it('render default props', () => {
    const wrapper = mount(VAction);
    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.classes('v-action')).toBe(true);
    expect(wrapper.attributes('tabindex')).toBe('0');
    expect(wrapper.attributes('title')).toBeUndefined();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('tag prop', () => {
    const wrapper = mount(VAction, { props: { tag: 'span' } });
    expect(wrapper.element.tagName).toBe('SPAN');
  });

  it('title prop', () => {
    const wrapper = mount(VAction, { props: { title: 'some title' } });
    expect(wrapper.attributes('title')).toBe('some title');
  });

  it('icon prop', () => {
    const wrapper = mount(VAction, { props: { icon: 'clear-all' } });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
