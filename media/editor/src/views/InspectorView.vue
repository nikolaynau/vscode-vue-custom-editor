<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue';
import type { InspectorDataModel } from '@/components/inspector/composables/use-inspector';
import { useVsCode } from '@/plugins/vscode/use-vscode';
import { VsCodeRpc } from '@/utils/vscode-rpc';
import type { EditCommandArray } from '@/components/editor/utils/types';
import VInspector from '@/components/inspector/VInspector.vue';

const dataModel = ref<InspectorDataModel | undefined>(undefined);
const vscode = useVsCode();

const rpc = new VsCodeRpc(vscode);
rpc.provider.registerRpcHandler('setData', setData);

function setData(data: InspectorDataModel) {
  dataModel.value = data;
}

function ready() {
  rpc.provider.signal('ready');
}

function onEdit(edits: EditCommandArray) {
  rpc.provider.signal('edit', edits);
}

onBeforeUnmount(() => {
  rpc.destroy();
});

ready();
</script>

<template>
  <div class="inspector-container">
    <VInspector :data-model="dataModel" @edit="onEdit" />
  </div>
</template>

<style>
@import 'inspector-view';
</style>
