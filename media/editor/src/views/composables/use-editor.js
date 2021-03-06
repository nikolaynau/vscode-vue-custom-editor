import { ref, watch, onBeforeUnmount } from 'vue';
import { ExthostRpc } from './exthost-rpc';

export default function useEditor(vscode, inspectorEnabled) {
  const rpc = new ExthostRpc(vscode);
  const editor = ref(null);
  let pendingInitialData = null;

  watch(editor, () => {
    if (pendingInitialData && editor.value) {
      editor.value.model.setValue(pendingInitialData.data);
      editor.value.model.applyEdits(pendingInitialData.editOperations, false);
      pendingInitialData = null;
      needUpdateInspector();
    }
  });

  const onChangeValue = e => {
    rpc.provider.signal('edit', e);
  };

  const onUpdateInspector = e => {
    if (inspectorEnabled.value) {
      rpc.provider.signal('updateInspector', e);
    }
  };

  onBeforeUnmount(() => {
    rpc.destroy();
  });

  rpc.provider.registerRpcHandler('getFileData', getFileData);
  rpc.provider.registerRpcHandler('setFileData', setFileData);
  rpc.provider.registerRpcHandler('applyEdits', applyEdits);
  rpc.provider.registerRpcHandler('setInitialData', setInitialData);
  rpc.provider.registerSignalHandler(
    'needUpdateInspector',
    needUpdateInspector
  );

  function getFileData() {
    if (!editor.value) {
      return '';
    }
    return JSON.stringify(editor.value.model.getValue(), null, 2);
  }

  function setFileData(data) {
    editor.value?.model.setValue(data);
  }

  function applyEdits({ editOperations, notify }) {
    editor.value?.model.applyEdits(editOperations, !!notify);

    if (!notify) {
      needUpdateInspector();
    }
  }

  function setInitialData({ data, editOperations }) {
    if (editor.value) {
      editor.value.model.setValue(data);
      editor.value.model.applyEdits(editOperations, false);
      needUpdateInspector();
    } else {
      pendingInitialData = { data, editOperations };
    }
  }

  function needUpdateInspector() {
    editor.value?.updateInspector();
  }

  return {
    editor,
    onChangeValue,
    onUpdateInspector
  };
}
