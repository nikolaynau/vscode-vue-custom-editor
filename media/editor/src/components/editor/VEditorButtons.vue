<script setup lang="ts">
import VButton from '../button/VButton.vue';
import type { ButtonDefinition } from './utils/buttons';

export interface Props {
  items?: Array<ButtonDefinition>;
}

withDefaults(defineProps<Props>(), {
  items: () => []
});

const emit = defineEmits<{
  (e: 'click', button: ButtonDefinition): void;
}>();

function onClick(button: ButtonDefinition) {
  emit('click', button);
}
</script>

<template>
  <VButton v-for="button in items" :key="button.id" @click="onClick(button)">
    {{ button.label }}
  </VButton>
</template>
