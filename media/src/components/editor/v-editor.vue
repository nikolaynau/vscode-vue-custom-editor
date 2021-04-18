<template>
  <div class="v-editor">
    <div v-if="model.error" class="v-editor__error">
      The document could not be displayed because the content is in an invalid
      format.<br />Details: {{ model.error.message }}
    </div>
    <div v-else class="v-editor__content">
      <div class="v-editor__controls">
        <v-button @click="onPlus(-10)">-10</v-button>
        <v-button @click="onPlus(-5)">-5</v-button>
        <v-button @click="onPlus(-1)">-1</v-button>
      </div>
      <div class="v-editor__input" tabindex="-1">{{ model.counter }}</div>
      <div class="v-editor__controls">
        <v-button @click="onPlus(1)">+1</v-button>
        <v-button @click="onPlus(5)">+5</v-button>
        <v-button @click="onPlus(10)">+10</v-button>
      </div>
    </div>
  </div>
</template>

<script>
import { toRefs } from "vue";
import useEditor from "./composables/use-editor";

export default {
  name: "v-editor",
  props: {
    value: {
      type: String,
      default: null
    }
  },
  emits: ["change-value"],
  setup(props, { emit }) {
    const { value } = toRefs(props);
    const { model, onPlus } = useEditor({ value, emit });

    return {
      model,
      onPlus
    };
  }
};
</script>

<style>
@import "editor";
</style>
