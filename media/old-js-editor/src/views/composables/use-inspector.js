import { ref, onBeforeUnmount } from 'vue';
import { ExthostRpc } from './exthost-rpc';

export default function useInspector(vscode) {
  const rpc = new ExthostRpc(vscode);
  const dataModel = ref(null);

  const onEdit = e => {
    rpc.provider.signal('edit', e);
  };

  onBeforeUnmount(() => {
    rpc.destroy();
  });

  function ready() {
    rpc.provider.signal('ready');
  }

  rpc.provider.registerRpcHandler('setData', setData);

  function setData(data) {
    dataModel.value = data;
  }

  ready();

  return {
    dataModel,
    onEdit
  };
}
