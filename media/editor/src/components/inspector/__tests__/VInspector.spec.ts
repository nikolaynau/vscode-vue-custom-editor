import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import VInspector from '../VInspector.vue';
import type { InspectorDataModel } from '../composables/use-inspector';

describe('VInspector', () => {
  it('render default props', () => {
    const wrapper = mount(VInspector);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('render inspector with data model', () => {
    const dataModel: InspectorDataModel = {
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

  describe('inspector events', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('edit event', async () => {
      const dataModel: InspectorDataModel = {
        counterValue: 1,
        buttons: [
          { id: 1, value: 2 },
          { id: 2, value: 3 }
        ]
      };
      const wrapper = mount(VInspector, {
        props: { dataModel, editDelay: 300 }
      });

      const inputs = wrapper.findAll('input');
      expect(inputs).toHaveLength(3);

      await inputs[0].setValue(10);
      await inputs[1].setValue(11);
      await inputs[2].setValue(12);

      vi.runAllTimers();

      await nextTick();

      const editEvent = wrapper.emitted('edit') as unknown[][];
      expect(editEvent).toHaveLength(3);

      expect(editEvent[0][0]).toEqual([
        {
          name: 'replace',
          payload: { value: 10 }
        }
      ]);
      expect(editEvent[1][0]).toEqual([
        {
          name: 'change-button',
          payload: { btnId: 1, value: 11 }
        }
      ]);
      expect(editEvent[2][0]).toEqual([
        {
          name: 'change-button',
          payload: { btnId: 2, value: 12 }
        }
      ]);

      wrapper.unmount();
    });
  });
});
