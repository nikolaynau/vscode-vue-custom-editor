<template>
  <div v-if="value" class="v-keybinding-label" :title="value">
    <template v-for="(part, index) in parts" :key="index">
      <span v-if="index > 0" class="v-keybinding-label__separator">
        {{ separator }}
      </span>
      <span class="v-keybinding-label__key">{{ part }}</span>
    </template>
  </div>
</template>

<script>
import { computed, toRefs } from "vue";

export default {
  name: "v-keybinding-label",
  props: {
    value: {
      type: String,
      default: null
    },
    separator: {
      type: String,
      default: "+"
    }
  },
  setup(props) {
    const { value, separator } = toRefs(props);

    const parts = computed(() => {
      const keyParts = (value.value || "")
        .split(separator.value)
        .filter((item) => !!item);
      return keyParts;
    });

    return {
      parts
    };
  }
};
</script>

<style>
@import "keybinding-label";
</style>
