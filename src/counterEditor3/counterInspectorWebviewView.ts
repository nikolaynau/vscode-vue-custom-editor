import * as vscode from 'vscode';
import { BaseInspectorWebviewView } from "../common/inspectorWebviewView";
import { getNonce } from '../common/util';

export class CounterInspectorWebviewView extends BaseInspectorWebviewView {

  protected getHtmlForWebview(webview: vscode.Webview): string {
    const scriptPathOnDisk = vscode.Uri.joinPath(this.extensionUri, "media", 'editor', 'dist', 'index.js');
    const scriptUri = webview.asWebviewUri(scriptPathOnDisk);

    const stylesPathOnDisk = vscode.Uri.joinPath(this.extensionUri, "media", 'editor', 'dist', 'style.css');
    const stylesUri = webview.asWebviewUri(stylesPathOnDisk);

    const nonce = getNonce();

    return `
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource}; font-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Inspector</title>

        <script defer="defer" nonce="${nonce}" src="${scriptUri}"></script>
        <link href="${stylesUri}" rel="stylesheet">
      </head>
      <body>
        <div id="app"></div>
        <script nonce="${nonce}">window.location.hash="/inspector";</script>
      </body>
      </html>
    `;
  }
}
