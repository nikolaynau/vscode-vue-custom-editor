import logger from '@/utils/logger';
import { RpcProvider } from 'worker-rpc';

export class WorkbenchRpc {
  constructor(vscode) {
    this.provider = new RpcProvider(message => vscode.postMessage(message));

    this.onMessage = this.onMessage.bind(this);
    this.handleError = this.handleError.bind(this);

    this.provider.error.addHandler(this.handleError);
    window.addEventListener("message", this.onMessage);
  }

  onMessage(e) {
    this.provider.dispatch(e.data);
  }

  handleError(err) {
    logger.error("[WorkbenchApi]: rpc provider error", err);
  }

  destroy() {
    window.removeEventListener("message", this.onMessage);
    this.provider._dispatch = null;
    this.provider._rpcHandlers = [];
    this.provider._signalHandlers = {};
  }
}
