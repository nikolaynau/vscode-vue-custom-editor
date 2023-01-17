import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VEditorButtons from '../VEditorButtons.vue';
import type { ButtonDefinition } from '../utils/buttons';

describe('VEditorButtons', () => {
  it('render default props', () => {
    const wrapper = mount(VEditorButtons);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('items prop', () => {
    const items: ButtonDefinition[] = [
      {
        id: 1,
        label: '-10',
        value: -10,
        side: 'left'
      },
      {
        id: 2,
        label: '-5',
        value: -5,
        side: 'left'
      }
    ];
    const wrapper = mount(VEditorButtons, { props: { items } });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('click event', async () => {
    const items: ButtonDefinition[] = [
      {
        id: 1,
        label: '-10',
        value: -10,
        side: 'left'
      },
      {
        id: 2,
        label: '-5',
        value: -5,
        side: 'left'
      }
    ];
    const wrapper = mount(VEditorButtons, { props: { items } });
    const buttons = wrapper.findAllComponents({ name: 'VButton' });
    expect(buttons).toHaveLength(2);

    await buttons[0].trigger('click');

    const clickEvent = wrapper.emitted('click') as unknown[][];
    expect(clickEvent).toHaveLength(1);
    expect(clickEvent[0][0]).toEqual(items[0]);
  });
});
