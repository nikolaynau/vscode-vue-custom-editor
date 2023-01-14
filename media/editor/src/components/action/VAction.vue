<script setup lang="ts">
export interface Props {
  tag?: string;
  icon?: string;
  title?: string;
}

withDefaults(defineProps<Props>(), {
  tag: 'div',
  icon: undefined,
  title: undefined
});

const emit = defineEmits<{
  (e: 'click', ev: MouseEvent | KeyboardEvent): void;
}>();

function onClick(e: MouseEvent | KeyboardEvent) {
  emit('click', e);
}
</script>

<template>
  <component
    class="v-action"
    :is="tag"
    :title="title"
    tabindex="0"
    @click="onClick"
    @keyup.space.enter="onClick"
  >
    <span v-if="icon" :class="`codicon codicon-${icon}`" />
  </component>
</template>

<style>
@import 'action';
</style>
