<template>
  <component class="v-action" :is="tag" :title="title" tabindex="0">
    <span v-if="icon" :class="`codicon codicon-${icon}`" />
  </component>
</template>

<script>
export default {
  name: "v-action",
  props: {
    tag: {
      type: String,
      default: "a"
    },
    icon: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: null
    }
  }
};
</script>

<style>
@import "action";
</style>
