<template>
  <div class="v-workbench">
    <v-editor ref="editor" @change-value="onChangeValue" />
  </div>
</template>

<script>
import { inject } from "vue";
import useWorkbench from "./composables/use-workbench";

export default {
  name: "v-workbench",
  setup() {
    const vscode = inject("$vscode");
    const { editor, onChangeValue } = useWorkbench(vscode);

    return {
      editor,
      onChangeValue
    };
  }
};
</script>

<style>
@import "workbench";
</style>
