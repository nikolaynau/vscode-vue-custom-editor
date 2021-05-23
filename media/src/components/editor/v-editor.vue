<template>
  <div
    class="v-editor"
    @keydown.up="keyboardEnabled ? onUpKey($event) : null"
    @keydown.down="keyboardEnabled ? onDownKey($event) : null"
    @keyup.delete="keyboardEnabled ? onDeleteKey($event) : null"
    @click.self="onClick"
  >
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
      <div ref="input" class="v-editor__input" tabindex="0">
        {{ model.counter }}
      </div>
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
import useKeyboard from "./composables/use-keyboard";

export default {
  name: "v-editor",
  props: {
    value: {
      type: String,
      default: null
    },
    focus: {
      type: Boolean,
      default: false
    },
    keyboardEnabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ["change-value"],
  setup(props, { emit }) {
    const { value, focus } = toRefs(props);
    const { model, input, onPlus, onReplace, onClick } = useEditor({
      value,
      focus,
      emit
    });
    const { onUpKey, onDownKey, onDeleteKey } = useKeyboard({
      onPlus,
      onReplace
    });

    return {
      model,
      input,
      onPlus,
      onClick,
      onUpKey,
      onDownKey,
      onDeleteKey
    };
  }
};
</script>

<style>
@import "editor";
</style>
