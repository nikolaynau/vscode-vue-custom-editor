<template>
  <div class="editor-container">
    <v-editor
      ref="editor"
      keyboard-enabled
      :inspector-enabled="inspectorEnabled"
      focus-on-start
      @change-value="onChangeValue"
      @update-inspector="onUpdateInspector"
    />
  </div>
</template>

<script>
import { inject } from 'vue';
import useEditor from './composables/use-editor';

export default {
  props: {
    inspectorEnabled: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const vscode = inject('$vscode');
    const { editor, onChangeValue, onUpdateInspector } = useEditor(vscode);

    return {
      editor,
      onChangeValue,
      onUpdateInspector
    };
  }
};
</script>

<style>
@import 'editor';
</style>
