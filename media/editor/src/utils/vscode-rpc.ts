import logger from '@/utils/logger';
import { RpcProvider } from 'worker-rpc';

export class VsCodeRpc {
  public provider: RpcProvider;

  public constructor(vscode: VsCodeApi) {
    this.provider = new RpcProvider(message => vscode.postMessage(message));

    this.handleMessage = this.handleMessage.bind(this);
    this.handleError = this.handleError.bind(this);

    this.provider.error.addHandler(this.handleError);
    window.addEventListener('message', this.handleMessage);
  }

  private handleMessage(e: MessageEvent) {
    this.provider.dispatch(e.data);
  }

  private handleError(err: Error) {
    logger.error('[Rpc]: rpc provider error', err);
  }

  public destroy() {
    window.removeEventListener('message', this.handleMessage);
    const provider = this.provider as any;
    provider._dispatch = null;
    provider._rpcHandlers = [];
    provider._signalHandlers = {};
  }
}
