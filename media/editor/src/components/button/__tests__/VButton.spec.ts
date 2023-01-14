import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VButton from '../VButton.vue';

describe('VButton', () => {
  it('default render props', () => {
    const wrapper = mount(VButton);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('tag prop', () => {
    const wrapper = mount(VButton, { props: { tag: 'button' } });
    expect(wrapper.element.tagName).toBe('BUTTON');
  });

  it('tabIndex prop', () => {
    const wrapper = mount(VButton, { props: { tabIndex: 1 } });
    expect(wrapper.attributes('tabindex')).toBe('1');
  });

  it('disabled prop', () => {
    const wrapper = mount(VButton, { props: { disabled: true } });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('default slot', () => {
    const wrapper = mount(VButton, { slots: { default: 'Button' } });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('click event', () => {
    const wrapper = mount(VButton, {
      props: { tag: 'button', type: 'button' }
    });
    wrapper.findComponent('button').trigger('click');
    const clickEvent = wrapper.emitted('click');
    expect(clickEvent).toHaveLength(1);
  });

  it('no click event when button is disabled', () => {
    const wrapper = mount(VButton, {
      props: { tag: 'button', type: 'button', disabled: true }
    });
    wrapper.findComponent('button').trigger('click');
    const clickEvent = wrapper.emitted('click');
    expect(clickEvent).toBeUndefined();
  });
});
