<script setup lang="ts">
import { computed, toRefs } from 'vue';

export interface Props {
  tag?: string;
  truncate?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'label',
  truncate: false
});

const { truncate } = toRefs(props);

const cssClasses = computed(() => ({
  'v-label--truncate': truncate.value
}));
</script>

<template>
  <component class="v-label" :class="cssClasses" :is="tag">
    <slot></slot>
  </component>
</template>

<style>
@import 'label';
</style>
