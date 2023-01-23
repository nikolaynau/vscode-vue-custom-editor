<script setup lang="ts">
import { toRefs, ref, onBeforeMount, watch } from 'vue';
import VEditor from '@/components/editor/VEditor.vue';
import type { ChangeEvent } from '@/components/editor/composables/use-document-model';
import type { InspectorDataModel } from '@/components/inspector/composables/use-inspector';
import { useVsCode } from '@/plugins/vscode/use-vscode';
import { VsCodeRpc } from '@/utils/vscode-rpc';
import type {
  EditCommandArray,
  RawDocument,
  RawJsonDocument
} from '@/components/editor/utils/types';

export interface Props {
  inspectorEnabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  inspectorEnabled: false
});

const { inspectorEnabled } = toRefs(props);
const editor = ref<InstanceType<typeof VEditor> | null>(null);
const vscode = useVsCode();
const rpc = new VsCodeRpc(vscode);
let pendingInitialData:
  | {
      data: RawDocument;
      editOperations: EditCommandArray;
    }
  | undefined = undefined;

function onChangeValue(event: ChangeEvent) {
  rpc.provider.signal('edit', event);
}

function onUpdateInspector(model: InspectorDataModel) {
  if (inspectorEnabled.value) {
    rpc.provider.signal('updateInspector', model);
  }
}

function handleSetInitialData({
  data,
  editOperations
}: {
  data: RawDocument;
  editOperations: EditCommandArray;
}) {
  if (editor.value) {
    const { setData, applyEdits, sendInspectorModel } = editor.value;
    setData(data);
    applyEdits(editOperations, false);
    sendInspectorModel();
  } else {
    pendingInitialData = { data, editOperations };
  }
}

function handleGetFileData(): RawJsonDocument {
  return editor.value?.toString(true) ?? '';
}

function handleSetFileData(data: RawDocument) {
  editor.value?.setData(data);
}

function handleApplyEdits({
  editOperations,
  notify
}: {
  editOperations: EditCommandArray;
  notify: boolean;
}) {
  editor.value?.applyEdits(editOperations, notify);

  if (!notify) {
    editor.value?.sendInspectorModel();
  }
}

function handleNeedUpdateInspector() {
  editor.value?.sendInspectorModel();
}

rpc.provider.registerRpcHandler('getFileData', handleGetFileData);
rpc.provider.registerRpcHandler('setFileData', handleSetFileData);
rpc.provider.registerRpcHandler('applyEdits', handleApplyEdits);
rpc.provider.registerRpcHandler('setInitialData', handleSetInitialData);
rpc.provider.registerSignalHandler(
  'needUpdateInspector',
  handleNeedUpdateInspector
);

onBeforeMount(() => {
  rpc.destroy();
});

watch(editor, () => {
  if (pendingInitialData && editor.value) {
    handleSetInitialData(pendingInitialData);
    pendingInitialData = undefined;
  }
});
</script>

<template>
  <div class="editor-container">
    <VEditor
      ref="editor"
      keyboard-enabled
      focus-on-start
      :inspector-enabled="inspectorEnabled"
      @change-value="onChangeValue"
      @update-inspector="onUpdateInspector"
    />
  </div>
</template>

<style>
@import 'editor-view';
</style>
