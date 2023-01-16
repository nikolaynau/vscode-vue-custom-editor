<script setup lang="ts">
import { computed, toRefs } from 'vue';

export interface Props {
  value?: string;
  separator?: string;
}

const props = withDefaults(defineProps<Props>(), {
  value: undefined,
  separator: '+'
});

const { value, separator } = toRefs(props);

const keyParts = computed(() =>
  (value.value || '').split(separator.value).filter(item => !!item)
);
</script>

<template>
  <div v-if="value" class="v-keybinding-label" :title="value">
    <template v-for="(part, index) in keyParts" :key="index">
      <span v-if="index > 0" class="v-keybinding-label__separator">
        {{ separator }}
      </span>
      <span class="v-keybinding-label__key">{{ part }}</span>
    </template>
  </div>
</template>

<style>
@import 'keybinding-label';
</style>
