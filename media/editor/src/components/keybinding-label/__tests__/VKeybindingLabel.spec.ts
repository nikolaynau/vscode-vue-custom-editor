import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VKeybindingLabel from '../VKeybindingLabel.vue';

describe('VKeybindingLabel', () => {
  it('render default props', () => {
    const wrapper = mount(VKeybindingLabel);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('value prop', () => {
    const wrapper = mount(VKeybindingLabel, { props: { value: 'Ctrl+Enter' } });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('separator prop', () => {
    const wrapper = mount(VKeybindingLabel, {
      props: { value: 'Ctrl Enter', separator: ' ' }
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
