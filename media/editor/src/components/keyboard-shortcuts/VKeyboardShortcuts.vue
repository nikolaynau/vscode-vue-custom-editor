<script setup lang="ts">
import { computed, toRefs } from 'vue';
import VKeybindingLabel from '../keybinding-label/VKeybindingLabel.vue';

export interface KeyItem {
  title: string;
  key: string;
}

export interface Props {
  items?: Array<KeyItem>;
  labelAlign?: 'left' | 'right';
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  labelAlign: 'left'
});

const { labelAlign } = toRefs(props);

const cssClasses = computed(() => ({
  'v-keyboard-shortcuts--label-left': labelAlign.value === 'left',
  'v-keyboard-shortcuts--label-right': labelAlign.value === 'right'
}));
</script>

<template>
  <div class="v-keyboard-shortcuts" :class="cssClasses">
    <dl v-for="(item, index) in items" :key="index">
      <dt>{{ item.title }}</dt>
      <dd>
        <VKeybindingLabel :value="item.key" />
      </dd>
    </dl>
  </div>
</template>

<style>
@import 'keyboard-shortcuts';
</style>
