<template>
  <component
    :is="tag"
    class="v-button"
    :class="cssClasses"
    :tabindex="tabIndex"
    @click="onClick"
  >
    <slot />
  </component>
</template>

<script>
import { computed, toRefs } from "vue";

export default {
  name: "v-button",
  props: {
    tag: {
      type: String,
      default: "a"
    },
    tabIndex: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ["click"],
  setup(props, { emit }) {
    const { disabled } = toRefs(props);

    const cssClasses = computed(() => ({
      "v-button--disabled": disabled.value
    }));

    const stopEvent = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const onClick = (e) => {
      if (disabled.value) {
        stopEvent(e);
        return;
      }
      emit("click", e);
    };

    return {
      cssClasses,
      onClick
    };
  }
};
</script>

<style>
@import "button";
</style>
