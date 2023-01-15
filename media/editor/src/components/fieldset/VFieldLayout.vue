<script setup lang="ts">
import { toRefs, computed } from 'vue';

export interface Props {
  vertical?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  vertical: false
});

const { vertical } = toRefs(props);

const cssClasses = computed(() => ({
  'v-field-layout--horizontal': !vertical.value,
  'v-field-layout--vertical': vertical.value
}));
</script>

<template>
  <div
    v-if="$slots.label || $slots.value"
    class="v-field-layout"
    :class="cssClasses"
  >
    <div v-if="$slots.label" class="v-field-layout__label">
      <slot name="label"></slot>
    </div>
    <div v-if="$slots.value" class="v-field-layout__value">
      <slot name="value"></slot>
    </div>
  </div>
</template>

<style>
@import 'field-layout';
</style>
