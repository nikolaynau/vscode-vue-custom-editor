import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VInput from '../VInput.vue';

describe('VInput', () => {
  it('default render props', () => {
    const wrapper = mount(VInput);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('model value event', async () => {
    const wrapper = mount(VInput);
    const inputText = 'input text';
    await wrapper.find('input').setValue(inputText);
    const updateModelValueEvent = wrapper.emitted(
      'update:modelValue'
    ) as string[][];
    expect(updateModelValueEvent).toHaveLength(1);
    expect(updateModelValueEvent[0][0] as string).toBe(inputText);
  });

  it('disabled input', async () => {
    const wrapper = mount(VInput, { props: { disabled: true } });
    expect(wrapper.classes('v-input-layout--disabled')).toBe(true);
    expect(wrapper.find('input').element.disabled).toBe(true);
  });
});
