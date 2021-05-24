<template>
  <component
    ref="button"
    :is="tag"
    class="v-button"
    :class="cssClasses"
    :tabindex="tabIndex"
    @click="disabled ? null : onClick($event)"
    @keyup.esc="disabled ? null : onEscKey($event)"
    @keyup.space.enter="disabled ? null : onClick($event)"
  >
    <slot />
  </component>
</template>

<script>
import { computed, ref, toRefs } from "vue";

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
    const button = ref(null);

    const cssClasses = computed(() => ({
      "v-button--disabled": disabled.value
    }));

    const onClick = (e) => {
      emit("click", e);
    };

    const onEscKey = () => {
      button.value?.blur();
    };

    return {
      button,
      cssClasses,
      onClick,
      onEscKey
    };
  }
};
</script>

<style>
@import "button";
</style>
