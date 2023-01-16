import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VInput from '../VInput.vue';

describe('VInput', () => {
  it('default render props', () => {
    const wrapper = mount(VInput);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('update model value event', async () => {
    const inputText = 'input text';

    const wrapper = mount(VInput);
    await wrapper.find('input').setValue(inputText);

    const updateModelValueEvent = wrapper.emitted(
      'update:modelValue'
    ) as string[][];

    expect(updateModelValueEvent).toHaveLength(1);
    expect(updateModelValueEvent[0][0] as string).toBe(inputText);
  });

  it('disabled input', () => {
    const wrapper = mount(VInput, { props: { disabled: true } });
    expect(wrapper.classes('v-input-layout--disabled')).toBe(true);
    expect(wrapper.find('input').element.disabled).toBe(true);
  });

  it('readonly input', () => {
    const wrapper = mount(VInput, { props: { readonly: true } });
    expect(wrapper.classes('v-input-layout--readonly')).toBe(true);
    expect(wrapper.find('input').element.readOnly).toBe(true);
  });

  it('type prop', () => {
    const wrapper = mount(VInput, { props: { type: 'checkbox' } });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('tabIndex prop', () => {
    const wrapper = mount(VInput, { props: { tabIndex: 1 } });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('custom layout class name prop', () => {
    const wrapper = mount(VInput, {
      props: { className: 'custom-layout-input' }
    });
    expect(wrapper.classes('custom-layout-input')).toBe(true);
  });

  it('input with icon', () => {
    const wrapper = mount(VInput, {
      slots: { icon: 'edit icon' }
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('no clickable icon', async () => {
    const wrapper = mount(VInput, {
      slots: { icon: 'edit icon' }
    });

    await wrapper.find('.v-input__icon').trigger('click');
    const iconClickEvent = wrapper.emitted('icon-click');

    expect(iconClickEvent).toBeUndefined();
  });

  it('clickable icon', async () => {
    const wrapper = mount(VInput, {
      props: {
        iconClickable: true
      },
      slots: { icon: 'edit icon' }
    });

    const iconWrapper = wrapper.find('.v-input__icon');
    await iconWrapper.trigger('click');
    const iconClickEvent = wrapper.emitted('icon-click');

    expect(iconClickEvent).toHaveLength(1);
    expect(iconWrapper.classes('v-input__icon--clickable')).toBe(true);
  });

  it('no clickable icon when input is disabled', async () => {
    const wrapper = mount(VInput, {
      props: { disabled: true },
      slots: { icon: 'edit icon' }
    });

    await wrapper.find('.v-input__icon').trigger('click');
    const iconClickEvent = wrapper.emitted('icon-click');

    expect(iconClickEvent).toBeUndefined();
  });

  it('no clickable icon when input is readonly', async () => {
    const wrapper = mount(VInput, {
      props: { readonly: true },
      slots: { icon: 'edit icon' }
    });

    await wrapper.find('.v-input__icon').trigger('click');
    const iconClickEvent = wrapper.emitted('icon-click');

    expect(iconClickEvent).toBeUndefined();
  });
});
