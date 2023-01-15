<script setup lang="ts">
import { computed, toRefs } from 'vue';

export interface Props {
  tag?: string;
  label?: string;
  tBorder?: boolean;
  bBorder?: boolean;
  padding?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'div',
  label: undefined,
  tBorder: false,
  bBorder: false,
  padding: true
});

const { padding, tBorder, bBorder } = toRefs(props);

const cssClasses = computed(() => ({
  'v-fieldset--t-border': tBorder.value,
  'v-fieldset--b-border': bBorder.value,
  'v-fieldset--padding': padding.value
}));
</script>

<template>
  <component class="v-fieldset" :class="cssClasses" :is="tag">
    <div v-if="label" class="v-fieldset__label">{{ label }}</div>
    <slot></slot>
  </component>
</template>

<style>
@import 'fieldset';
</style>
