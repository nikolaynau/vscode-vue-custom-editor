<template>
  <v-button v-for="button in items" :key="button.id" @click="onClick(button)">
    {{ button.label }}
  </v-button>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const onClick = button => {
      emit('click', button.value);
    };

    return {
      onClick
    };
  }
};
</script>
