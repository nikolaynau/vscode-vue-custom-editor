import * as vscode from 'vscode';
import { Disposable, DisposableEvent } from './dispose';
import { getNonce } from './util';
import { RpcProvider } from 'worker-rpc';
import { CounterDocumentEdit, EditOperation } from './counterDocument';

export class CounterEditorPanel extends Disposable implements DisposableEvent {
  private static _nextPanelId: number = 1;

  private readonly _onDidDispose = this._register(new vscode.EventEmitter<void>());
  public readonly onDidDispose = this._onDidDispose.event;

  private readonly _onDidRecieveEdit = this._register(new vscode.EventEmitter<CounterDocumentEdit>());
  public readonly onDidReceiveEdit = this._onDidRecieveEdit.event;

  private readonly _rpcProvider: RpcProvider;

  public readonly id: number = CounterEditorPanel._nextPanelId++;

  constructor(
    private readonly _panel: vscode.WebviewPanel,
    private readonly _extensionUri: vscode.Uri
  ) {
    super();

    this._panel.webview.options = this.getWebviewOptions();
    this._panel.webview.html = this.getHtmlForWebview(this._panel.webview);

    this._rpcProvider = new RpcProvider((message) => this._panel.webview.postMessage(message));
    this._register(this._panel.webview.onDidReceiveMessage(e => this._rpcProvider.dispatch(e)));

    this._rpcProvider.error.addHandler((err) => {
      console.error("[CounterEditorPanel]: rpc provider error:", err);
    });

    this._rpcProvider.registerSignalHandler<CounterDocumentEdit>("edit", (e) => {
      this._onDidRecieveEdit.fire(e);
    });

    this.regiserListeners();
  }

  private regiserListeners() {
    this._register(this._panel.onDidDispose(() => this.dispose()));
  }

  private getWebviewOptions(): vscode.WebviewOptions {
    return {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this._extensionUri, "media")]
    };
  }

  public dispose() {
    this._onDidDispose.fire();
    super.dispose();
  }

  public async getFileData(): Promise<Uint8Array> {
    const response = await this._rpcProvider.rpc<void, number[]>("getFileData");
    return new Uint8Array(response);
  }

  public setFileData(data: Uint8Array): Promise<void> {
    return this._rpcProvider.rpc("setFileData", Array.from(data));
  }

  public applyEdits(editOperations: EditOperation[]): Promise<void> {
    return this._rpcProvider.rpc("applyEdits", editOperations);
  }

  private getHtmlForWebview(webview: vscode.Webview): string {
    const scriptPathOnDisk = vscode.Uri.joinPath(this._extensionUri, 'media', 'dist', 'assets', 'js', 'app.js');
    const scriptUri = webview.asWebviewUri(scriptPathOnDisk);

    const stylesPathOnDisk = vscode.Uri.joinPath(this._extensionUri, 'media', 'dist', 'assets', 'css', 'app.css');
    const stylesUri = webview.asWebviewUri(stylesPathOnDisk);

    const nonce = getNonce();

    return `
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Counter Editor</title>

        <script defer="defer" nonce="${nonce}" src="${scriptUri}"></script>
        <link href="${stylesUri}" rel="stylesheet">
      </head>
      <body>
        <div id="app"></div>
      </body>
      </html>
    `;
  }
}
