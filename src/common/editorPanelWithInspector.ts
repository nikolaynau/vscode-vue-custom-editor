import * as vscode from 'vscode';
import { BaseEditorPanel, EditorPanel } from './editorPanel';
import { RpcProvider } from 'worker-rpc';

export interface EditorPanelWithInspector<TData> extends EditorPanel<TData> {
  readonly onDidUpdateInspector: vscode.Event<any>;
  needUpdateInspector(): void;
}

export abstract class BaseEditorPanelWithInspector<TData>
  extends BaseEditorPanel<TData>
  implements EditorPanelWithInspector<TData>
{
  private readonly _onDidUpdateInspector = this._register(
    new vscode.EventEmitter<any>()
  );
  public readonly onDidUpdateInspector = this._onDidUpdateInspector.event;

  protected registerRpcHandlers(rpcProvider: RpcProvider): void {
    super.registerRpcHandlers(rpcProvider);

    rpcProvider.registerSignalHandler<any>('updateInspector', e => {
      this._onDidUpdateInspector.fire(e);
    });
  }

  public needUpdateInspector(): void {
    this._rpcProvider.signal('needUpdateInspector');
  }
}
