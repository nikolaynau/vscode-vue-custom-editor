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

<script>
export default {
  name: 'v-action',
  props: {
    tag: {
      type: String,
      default: 'a'
    },
    icon: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: null
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const onClick = e => {
      emit('click', e);
    };

    return {
      onClick
    };
  }
};
</script>

<style>
@import 'action';
</style>
