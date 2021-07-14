<template>
  <div
    class="v-editor"
    @keydown.up="keyboardEnabled ? onUpKey($event) : null"
    @keydown.down="keyboardEnabled ? onDownKey($event) : null"
    @keydown.left="keyboardEnabled ? onLeftKey($event) : null"
    @keydown.right="keyboardEnabled ? onRightKey($event) : null"
    @keyup.delete="keyboardEnabled ? onDeleteKey($event) : null"
    @click.self="onClick"
  >
    <div v-if="model.error" class="v-editor__error">
      The document could not be displayed because the content is in an invalid
      format.<br />Details: {{ model.error.message }}
    </div>
    <div v-else class="v-editor__content">
      <div class="v-editor__controls">
        <v-editor-buttons :items="model.leftButtons" @click="onPlus($event)" />
      </div>
      <div ref="input" class="v-editor__input" tabindex="0">
        {{ model.counter }}
      </div>
      <div class="v-editor__controls">
        <v-action
          @click="onClear"
          title="Clear Counter (Delete)"
          icon="clear-all"
        />
        <v-editor-buttons :items="model.rightButtons" @click="onPlus($event)" />
      </div>
    </div>
    <div class="v-editor__shortcuts">
      <v-keyboard-shortcuts :items="shortcuts" title-right />
    </div>
  </div>
</template>

<script>
import { toRefs } from "vue";
import useEditor from "./composables/use-editor";
import useKeyboard from "./composables/use-keyboard";
import useInspector from "./composables/use-inspector";

export default {
  name: "v-editor",
  props: {
    value: {
      type: String,
      default: null
    },
    focusOnStart: {
      type: Boolean,
      default: false
    },
    keyboardEnabled: {
      type: Boolean,
      default: false
    },
    inspectorEnabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ["change-value", "update-inspector"],
  setup(props, { emit }) {
    const { value, focusOnStart, inspectorEnabled } = toRefs(props);

    const { model, input, onPlus, onReplace, onClick, onClear } = useEditor({
      value,
      focusOnStart,
      emit
    });

    const { updateInspector } = useInspector({ model, inspectorEnabled, emit });

    const {
      shortcuts,
      onUpKey,
      onDownKey,
      onLeftKey,
      onRightKey,
      onDeleteKey
    } = useKeyboard({
      onPlus,
      onReplace
    });

    return {
      model,
      input,
      shortcuts,
      onPlus,
      onClick,
      onClear,
      onUpKey,
      onDownKey,
      onLeftKey,
      onRightKey,
      onDeleteKey,
      updateInspector
    };
  }
};
</script>

<style>
@import "editor";
</style>
