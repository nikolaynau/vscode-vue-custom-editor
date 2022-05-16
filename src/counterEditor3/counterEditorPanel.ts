import * as vscode from 'vscode';
import { BaseEditorPanelWithInspector } from '../common/editorPanelWithInspector';
import { getNonce } from '../common/util';

export class CounterEditorPanel extends BaseEditorPanelWithInspector<string> {
  protected getHtmlForWebview(webview: vscode.Webview): string {
    const scriptPathOnDisk = vscode.Uri.joinPath(
      this.extensionUri,
      this.mediaFolderName,
      'editor',
      'dist',
      'index.js'
    );
    const scriptUri = webview.asWebviewUri(scriptPathOnDisk);

    const stylesPathOnDisk = vscode.Uri.joinPath(
      this.extensionUri,
      this.mediaFolderName,
      'editor',
      'dist',
      'style.css'
    );
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
        <script nonce="${nonce}">window.location.hash="/editor-with-inspector";</script>
      </body>
      </html>
    `;
  }
}
