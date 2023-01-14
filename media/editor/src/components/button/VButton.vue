<script setup lang="ts">
import { ref, computed, toRefs } from 'vue';

export interface Props {
  tag?: string;
  tabIndex?: number;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'a',
  tabIndex: 0,
  disabled: false
});

const emit = defineEmits<{
  (e: 'click', ev: MouseEvent | KeyboardEvent): void;
}>();

const { disabled } = toRefs(props);
const button = ref<HTMLElement | null>(null);

const cssClasses = computed(() => ({
  'v-button--disabled': disabled.value
}));

function onClick(e: MouseEvent | KeyboardEvent) {
  emit('click', e);
}

function onEscKey() {
  button.value?.blur();
}
</script>

<template>
  <component
    ref="button"
    :is="tag"
    class="v-button"
    :class="cssClasses"
    :tabindex="disabled ? null : tabIndex"
    @click="disabled ? null : onClick($event)"
    @keyup.esc="disabled ? null : onEscKey()"
    @keyup.space.enter="disabled ? null : onClick($event)"
  >
    <slot></slot>
  </component>
</template>

<style>
@import 'button';
</style>
