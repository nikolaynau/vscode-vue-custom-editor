<template>
  <div class="editor-container">
    <v-editor
      ref="editor"
      @change-value="onChangeValue"
      keyboard-enabled
      focus-on-start
    />
  </div>
</template>

<script>
import { inject } from "vue";
import useEditor from "./composables/use-editor";

export default {
  name: "editor",
  setup() {
    const vscode = inject("$vscode");
    const { editor, onChangeValue } = useEditor(vscode);

    return {
      editor,
      onChangeValue
    };
  }
};
</script>

<style>
@import "editor";
</style>
