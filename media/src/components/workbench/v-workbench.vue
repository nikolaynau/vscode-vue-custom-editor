<template>
  <div class="v-workbench">
    <v-editor ref="editor" :value="value" @change-value="onChangeValue" />
  </div>
</template>

<script>
import { inject } from "vue";
import useWorkbench from "./composables/use-workbench";

export default {
  name: "v-workbench",
  setup() {
    const vscode = inject("$vscode");
    const { value, editor, onChangeValue } = useWorkbench(vscode);

    return {
      editor,
      value,
      onChangeValue
    };
  }
};
</script>

<style>
@import "workbench";
</style>
