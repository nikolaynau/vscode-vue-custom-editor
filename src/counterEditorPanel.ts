import * as vscode from 'vscode';
import { Disposable, DisposableEvent } from './dispose';
import { getNonce } from './util';

export class CounterEditorPanel extends Disposable implements DisposableEvent {

  private readonly _onDidDispose = this._register(new vscode.EventEmitter<void>());
  public readonly onDidDispose = this._onDidDispose.event;

  constructor(
    private readonly _panel: vscode.WebviewPanel,
    private readonly _extensionUri: vscode.Uri
  ) {
    super();
    this._panel.webview.options = { enableScripts: true };
    this._panel.webview.html = this.getHtmlForWebview(this._panel.webview);
    this.regiserListeners();
  }

  private regiserListeners() {
    this._register(this._panel.onDidDispose(() => this.dispose()));
  }

  public dispose() {
    this._onDidDispose.fire();
    super.dispose();
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




/*export function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
  return {
    enableScripts: true,
    localResourceRoots: [vscode.Uri.joinPath(extensionUri, "media")]
  };
}

export class CounterEditorPanel {
  public static currentPanel: CounterEditorPanel | undefined;

  public static readonly viewType = 'counterEditor';

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;

    if (CounterEditorPanel.currentPanel) {
      CounterEditorPanel.currentPanel._panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      CounterEditorPanel.viewType,
      "Counter Editor",
      column || vscode.ViewColumn.One,
      getWebviewOptions(extensionUri)
    );

    CounterEditorPanel.currentPanel = new CounterEditorPanel(panel, extensionUri);
  }

  public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    CounterEditorPanel.currentPanel = new CounterEditorPanel(panel, extensionUri);
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._extensionUri = extensionUri;
    this._update();
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
  }

  public dispose() {
    CounterEditorPanel.currentPanel = undefined;
    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private _update() {
    this._panel.webview.html = getHtmlForWebview(this._panel.webview, this._extensionUri);
  }
}

function getHtmlForWebview(webview: vscode.Webview, extensionUri: vscode.Uri): string {
  const scriptPathOnDisk = vscode.Uri.joinPath(extensionUri, 'media', 'dist', 'assets', 'js', 'app.js');
  const scriptUri = webview.asWebviewUri(scriptPathOnDisk);

  const stylesPathOnDisk = vscode.Uri.joinPath(extensionUri, 'media', 'dist', 'assets', 'css', 'app.css');
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
*/
