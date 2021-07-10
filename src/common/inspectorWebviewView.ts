import * as vscode from "vscode";
import { RpcProvider } from 'worker-rpc';
import { Disposable, DisposableEvent } from "./dispose";
import { EditOperation } from "./documentModel";

export interface InspectorViewEditEvent {
  readonly changes: EditOperation[];
}

export interface InspectorWebviewView extends DisposableEvent {
  readonly webviewView: vscode.WebviewView;
  readonly extensionUri: vscode.Uri;

  readonly onDidReceiveEdit: vscode.Event<InspectorViewEditEvent>;
  readonly onDidReady: vscode.Event<void>;

  setData(data: any): Promise<void>;
}

export abstract class BaseInspectorWebviewView extends Disposable implements InspectorWebviewView {

  private readonly _onDidDispose = this._register(new vscode.EventEmitter<void>());
  public readonly onDidDispose = this._onDidDispose.event;

  private readonly _onDidRecieveEdit = this._register(new vscode.EventEmitter<InspectorViewEditEvent>());
  public readonly onDidReceiveEdit = this._onDidRecieveEdit.event;

  private readonly _onDidReady = this._register(new vscode.EventEmitter<void>());
  public readonly onDidReady = this._onDidReady.event;

  private readonly _rpcProvider: RpcProvider;

  constructor(
    private readonly _view: vscode.WebviewView,
    private readonly _extensionUri: vscode.Uri
  ) {
    super();
    this._view.webview.options = this.getWebviewOptions();
    this._view.webview.html = this.getHtmlForWebview(this._view.webview);
    this._rpcProvider = this.createRpcProvider();
    this.regiserListeners();
  }

  private regiserListeners() {
    this._register(this._view.onDidDispose(() => this.dispose()));
  }

  public get webviewView() { return this._view; }

  public get extensionUri() { return this._extensionUri; }

  protected abstract getHtmlForWebview(webview: vscode.Webview): string;

  protected getWebviewOptions(): vscode.WebviewOptions {
    return {
      enableScripts: true,
      localResourceRoots: [
        this._extensionUri
      ]
    };
  }

  public setData(data: any): Promise<void> {
    return this._rpcProvider.rpc<any>("setData", data);
  }

  protected createRpcProvider(): RpcProvider {
    const rpcProvider = new RpcProvider((message) => this._view.webview.postMessage(message));
    this._view.webview.onDidReceiveMessage(e => rpcProvider.dispatch(e));

    rpcProvider.error.addHandler((err) => {
      console.error("[InspectorWebviewView]: rpc provider error:", err);
    });

    rpcProvider.registerSignalHandler<EditOperation[]>("edit", (e) => {
      this._onDidRecieveEdit.fire({ changes: e });
    });

    rpcProvider.registerSignalHandler<void>("ready", () => {
      this._onDidReady.fire();
    });

    return rpcProvider;
  }

  public dispose() {
    this._onDidDispose.fire();
    super.dispose();
  }
}
