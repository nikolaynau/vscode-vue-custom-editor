import { ref, watch, onBeforeUnmount } from "vue"
import { WorkbenchRpc } from './workbench-rpc';

export default function useWorkbench(vscode) {
  const rpc = new WorkbenchRpc(vscode);
  const editor = ref(null);
  let pendingInitialData = null;

  rpc.provider.registerRpcHandler("getFileData", () => {
    if (!editor.value) return "";
    return JSON.stringify(editor.value.model.getValue(), null, 2);
  });

  rpc.provider.registerRpcHandler("setFileData", (data) => {
    editor.value?.model.setValue(data);
  });

  rpc.provider.registerRpcHandler("applyEdits", ({ editOperations, notify }) => {
    editor.value?.model.applyEdits(editOperations, notify);
  });

  rpc.provider.registerRpcHandler("setInitialData", ({ data, editOperations }) => {
    if (editor.value) {
      editor.value.model.setValue(data);
      editor.value.model.applyEdits(editOperations, false);
    } else {
      pendingInitialData = { data, editOperations };
    }
  });

  watch(editor, () => {
    if (pendingInitialData && editor.value) {
      editor.value.model.setValue(pendingInitialData.data);
      editor.value.model.applyEdits(pendingInitialData.editOperations, false);
      pendingInitialData = null;
    }
  });

  const onChangeValue = (e) => {
    rpc.provider.signal("edit", e);
  }

  onBeforeUnmount(() => {
    rpc.destroy();
  });

  return {
    editor,
    onChangeValue
  }
}
