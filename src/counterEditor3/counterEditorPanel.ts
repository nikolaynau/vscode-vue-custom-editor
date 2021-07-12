import * as vscode from 'vscode';
import { BaseEditorPanel } from '../common/editorPanel';
import { getNonce } from '../common/util';
import { RpcProvider } from 'worker-rpc';

export class CounterEditorPanel extends BaseEditorPanel<string> {

  private readonly _onDidUpdateInspector = this._register(new vscode.EventEmitter<any>());
  public readonly onDidUpdateInspector = this._onDidUpdateInspector.event;

  protected createRpcProvider(): RpcProvider {
    const rpcProvider = super.createRpcProvider();

    rpcProvider.registerSignalHandler<any>("inspector", (e) => {
      this._onDidUpdateInspector.fire(e);
    });

    return rpcProvider;
  }

  public needUpdateInspector() {
    this._rpcProvider.signal("needUpdateInspector");
  }

  protected getHtmlForWebview(webview: vscode.Webview): string {
    const scriptPathOnDisk = vscode.Uri.joinPath(this.extensionUri, this.mediaFolderName, 'editor', 'dist', 'assets', 'js', 'app.js');
    const scriptUri = webview.asWebviewUri(scriptPathOnDisk);

    const stylesPathOnDisk = vscode.Uri.joinPath(this.extensionUri, this.mediaFolderName, 'editor', 'dist', 'assets', 'css', 'app.css');
    const stylesUri = webview.asWebviewUri(stylesPathOnDisk);

    const nonce = getNonce();

    return `
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource}; font-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Counter Editor 3</title>

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
