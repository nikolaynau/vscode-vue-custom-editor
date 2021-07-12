import { ref, watch, onBeforeUnmount } from "vue"
import { EditorRpc } from './editor-rpc';

export default function useEditor(vscode) {
  const rpc = new EditorRpc(vscode);
  const editor = ref(null);
  let pendingInitialData = null;

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

  rpc.provider.registerRpcHandler("getFileData", getFileData);
  rpc.provider.registerRpcHandler("setFileData", setFileData);
  rpc.provider.registerRpcHandler("applyEdits", applyEdits);
  rpc.provider.registerRpcHandler("setInitialData", setInitialData);

  function getFileData() {
    if (!editor.value) return "";
    return JSON.stringify(editor.value.model.getValue(), null, 2);
  }

  function setFileData(data) {
    editor.value?.model.setValue(data);
  }

  function applyEdits({ editOperations, notify }) {
    editor.value?.model.applyEdits(editOperations, notify);
  }

  function setInitialData({ data, editOperations }) {
    if (editor.value) {
      editor.value.model.setValue(data);
      editor.value.model.applyEdits(editOperations, false);
    } else {
      pendingInitialData = { data, editOperations };
    }
  }

  return {
    editor,
    onChangeValue
  }
}
