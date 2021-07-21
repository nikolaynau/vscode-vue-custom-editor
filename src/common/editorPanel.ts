import * as vscode from 'vscode';
import { RpcProvider } from 'worker-rpc';
import { Disposable, DisposableEvent } from './dispose';
import { DocumentEdit, EditOperation } from './documentModel';

export interface EditorPanel<TData> extends DisposableEvent {
  readonly id: number;
  readonly visible: boolean;
  readonly active: boolean;
  readonly panel: vscode.WebviewPanel;

  readonly onDidReceiveEdit: vscode.Event<DocumentEdit>;

  getFileData(): Promise<TData>;
  setFileData(data: TData): Promise<void>;
  applyEdits(editOperations: EditOperation[], notify: boolean): Promise<void>;
  setInitialData(data: TData, editOperations: EditOperation[]): Promise<void>;
}

export abstract class BaseEditorPanel<TData> extends Disposable implements EditorPanel<TData> {
  private static _nextId: number = 1;

  private readonly _onDidDispose = this._register(new vscode.EventEmitter<void>());
  public readonly onDidDispose = this._onDidDispose.event;

  private readonly _onDidRecieveEdit = this._register(new vscode.EventEmitter<DocumentEdit>());
  public readonly onDidReceiveEdit = this._onDidRecieveEdit.event;

  protected readonly _rpcProvider: RpcProvider;

  public readonly id: number = BaseEditorPanel._nextId++;

  constructor(
    private readonly _panel: vscode.WebviewPanel,
    private readonly _extensionUri: vscode.Uri
  ) {
    super();
    this._panel.webview.options = this.getWebviewOptions();
    this._panel.webview.html = this.getHtmlForWebview(this._panel.webview);
    this._rpcProvider = this.createRpcProvider();
    this.regiserListeners();
  }

  private regiserListeners() {
    this._register(this._panel.onDidDispose(() => this.dispose()));
  }

  public get panel() { return this._panel; }

  public get extensionUri() { return this._extensionUri; }

  public get visible() { return this._panel.visible; }

  public get active() { return this._panel.active; }

  public get mediaFolderName() { return "media"; }

  protected abstract getHtmlForWebview(webview: vscode.Webview): string;

  protected getWebviewOptions(): vscode.WebviewOptions {
    return {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this._extensionUri, this.mediaFolderName)]
    };
  }

  public getFileData(): Promise<TData> {
    return this._rpcProvider.rpc<void, TData>("getFileData");
  }

  public setFileData(data: TData): Promise<void> {
    return this._rpcProvider.rpc<TData>("setFileData", data);
  }

  public applyEdits(editOperations: EditOperation[], notify: boolean): Promise<void> {
    return this._rpcProvider.rpc("applyEdits", { editOperations, notify });
  }

  public setInitialData(data: TData, editOperations: EditOperation[]): Promise<void> {
    return this._rpcProvider.rpc("setInitialData", { data, editOperations });
  }

  protected createRpcProvider(): RpcProvider {
    const rpcProvider = new RpcProvider((message) => this._panel.webview.postMessage(message));
    this._register(this._panel.webview.onDidReceiveMessage(e => rpcProvider.dispatch(e)));

    rpcProvider.error.addHandler((err) => {
      console.error("[EditorPanel]: rpc provider error:", err);
    });

    this.registerRpcHandlers(rpcProvider);
    return rpcProvider;
  }

  protected registerRpcHandlers(rpcProvider: RpcProvider): void {
    rpcProvider.registerSignalHandler<DocumentEdit>("edit", (e) => {
      this._onDidRecieveEdit.fire(e);
    });
  }

  public dispose() {
    this._onDidDispose.fire();
    super.dispose();
  }
}
