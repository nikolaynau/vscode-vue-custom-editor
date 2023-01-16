import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VKeyboardShortcuts from '../VKeyboardShortcuts.vue';

describe('VKeyboardShortcuts', () => {
  it('default render props', () => {
    const wrapper = mount(VKeyboardShortcuts);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('items prop', () => {
    const items = [
      {
        title: 'Increase Сounter',
        key: 'UpArrow'
      },
      {
        title: 'Decrease Сounter',
        key: 'DownArrow'
      },
      {
        title: 'Clear Сounter',
        key: 'Delete'
      },
      {
        title: 'Clear Сounter',
        key: 'Ctrl+Backspace'
      }
    ];

    const wrapper = mount(VKeyboardShortcuts, {
      props: { items }
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('labelAlign prop', async () => {
    const wrapper = mount(VKeyboardShortcuts);
    expect(wrapper.classes('v-keyboard-shortcuts--label-left')).toBe(true);

    await wrapper.setProps({ labelAlign: 'right' });

    expect(wrapper.classes('v-keyboard-shortcuts--label-right')).toBe(true);
  });
});
