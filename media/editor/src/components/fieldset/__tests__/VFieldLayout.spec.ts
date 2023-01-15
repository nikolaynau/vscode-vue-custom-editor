import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VFieldLayout from '../VFieldLayout.vue';

describe('VFieldLayout', () => {
  it('default render props', () => {
    const wrapper = mount(VFieldLayout);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('label slot', () => {
    const wrapper = mount(VFieldLayout, { slots: { label: 'Some label' } });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('value slot', () => {
    const wrapper = mount(VFieldLayout, { slots: { value: 'Input' } });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('render label and value slots', () => {
    const wrapper = mount(VFieldLayout, {
      slots: { label: 'Label', value: 'Input' }
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('vertical prop', async () => {
    const wrapper = mount(VFieldLayout, {
      props: { vertical: false },
      slots: { label: 'Label', value: 'Input' }
    });
    expect(wrapper.classes('v-field-layout--horizontal')).toBe(true);

    await wrapper.setProps({ vertical: true });

    expect(wrapper.classes('v-field-layout--vertical')).toBe(true);
  });
});
