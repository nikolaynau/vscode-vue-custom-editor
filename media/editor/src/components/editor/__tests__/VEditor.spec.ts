import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VEditor from '../VEditor.vue';

describe('VEditor', () => {
  it('render default props', () => {
    const wrapper = mount(VEditor);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
