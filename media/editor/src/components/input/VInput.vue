<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  inheritAttrs: false
});
</script>

<script setup lang="ts">
import { ref, computed, toRefs } from 'vue';

export interface Props {
  modelValue?: string | number;
  type?: string;
  tabIndex?: number;
  className?: string;
  iconClickable?: boolean;
  disabled?: boolean;
  readonly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  type: 'text',
  tabIndex: 0,
  className: undefined,
  iconClickable: false,
  disabled: false,
  readonly: false
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'icon-click', ev: MouseEvent): void;
}>();

const { modelValue, iconClickable, className, disabled, readonly } =
  toRefs(props);
const inputEl = ref(null);

const value = computed<string>({
  get: () => modelValue.value as string,
  set: val => emit('update:modelValue', val)
});

const layoutClasses = computed(() => ({
  [className.value as string]: !!className.value,
  'v-input-layout--disabled': disabled.value,
  'v-input-layout--readonly': readonly.value
}));

const iconClickDisabled = computed(
  () => !iconClickable.value || disabled.value || readonly.value
);

const iconClasses = computed(() => ({
  'v-input__icon--clickable': !iconClickDisabled.value
}));

function onIconClick(e: MouseEvent) {
  emit('icon-click', e);
}

defineExpose({
  inputEl
});
</script>

<template>
  <div class="v-input-layout" :class="layoutClasses">
    <input
      ref="inputEl"
      class="v-input"
      :class="{ 'v-input--icon': $slots.icon }"
      v-model="value"
      v-bind="$attrs"
      :type="type"
      :disabled="disabled"
      :readonly="readonly"
      :tabindex="tabIndex"
    />
    <span
      v-if="$slots.icon"
      class="v-input__icon"
      :class="iconClasses"
      @click="iconClickDisabled ? null : onIconClick($event)"
    >
      <slot name="icon"></slot>
    </span>
  </div>
</template>

<style>
@import 'input';
</style>
