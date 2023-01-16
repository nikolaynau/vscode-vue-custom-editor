import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VLabel from '../VLabel.vue';

describe('VLabel', () => {
  it('default render props', () => {
    const wrapper = mount(VLabel);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('tag prop', () => {
    const wrapper = mount(VLabel, { props: { tag: 'span' } });
    expect(wrapper.element.tagName).toBe('SPAN');
  });

  it('truncate prop', () => {
    const wrapper = mount(VLabel, { props: { truncate: true } });
    expect(wrapper.classes('v-label--truncate')).toBe(true);
  });

  it('default slot', () => {
    const wrapper = mount(VLabel, { slots: { default: 'Label text' } });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
