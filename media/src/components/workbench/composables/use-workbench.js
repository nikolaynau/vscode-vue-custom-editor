import { ref, onBeforeUnmount } from "vue"
import { WorkbenchRpc } from './workbench-rpc';

export default function useWorkbench(vscode) {
  const value = ref(null);
  const editor = ref(null);

  const rpc = new WorkbenchRpc(vscode);
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const setValue = (val) => {
    if (editor.value) {
      editor.value.model.setValue(val);
    } else {
      value.value = val;
    }
  }

  rpc.provider.registerRpcHandler("getFileData", () => {
    if (!editor.value) return [];
    const data = JSON.stringify(editor.value.model.getValue(), null, 2);
    const bytes = encoder.encode(data);
    return Array.from(bytes);
  });

  rpc.provider.registerRpcHandler("setFileData", (data) => {
    if (Array.isArray(data)) {
      const val = decoder.decode(new Uint8Array(data));
      setValue(val);
    }
  });

  rpc.provider.registerRpcHandler("applyEdits", (editOperations) => {
    editor.value?.model.applyEdits(editOperations, false);
  });

  const onChangeValue = (e) => {
    rpc.provider.signal("edit", e);
  }

  onBeforeUnmount(() => {
    rpc.destroy();
  });

  return {
    editor,
    value,
    onChangeValue
  }
}
