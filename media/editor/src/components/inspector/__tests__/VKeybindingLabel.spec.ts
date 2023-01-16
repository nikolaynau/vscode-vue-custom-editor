import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VInspector from '../VInspector.vue';
import type { EditorDataModel } from '@/utils/editor';

describe('VInspector', () => {
  it('default render props', () => {
    const wrapper = mount(VInspector);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('render inspector with data model', () => {
    const dataModel: EditorDataModel = {
      counterValue: 1,
      buttons: [
        { id: 1, value: 2 },
        { id: 2, value: 3 }
      ]
    };
    const wrapper = mount(VInspector, { props: { dataModel } });
    expect(wrapper.html()).toMatchSnapshot();

    const inputs = wrapper.findAll('input');
    expect(inputs).toHaveLength(3);
    expect(+inputs[0].element.value).toBe(dataModel.counterValue);
    expect(+inputs[1].element.value).toBe(dataModel.buttons[0].value);
    expect(+inputs[2].element.value).toBe(dataModel.buttons[1].value);
  });
});
