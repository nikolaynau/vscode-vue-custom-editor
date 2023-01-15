import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VInput from '../VInput.vue';

describe('VInput', () => {
  it('default render props', () => {
    const wrapper = mount(VInput);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
