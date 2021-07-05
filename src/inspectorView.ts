import * as vscode from "vscode";

export class InspectorView implements vscode.WebviewViewProvider {
  public static readonly viewType = "vscodeVueCustomEditor.inpsectorView";
  private _view?: vscode.WebviewView;

  public constructor(private readonly _extensionUri: vscode.Uri) { }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void {
    this._view = webviewView;

    webviewView.webview.options = this.getWebviewOptions();
    webviewView.webview.html = this.getHtmlForWebview(webviewView.webview);

    this._view.onDidDispose(() => this._view = undefined);
  }

  protected getWebviewOptions(): vscode.WebviewOptions {
    return {
      enableScripts: true,
      localResourceRoots: [
        this._extensionUri
      ]
    };
  }

  protected getHtmlForWebview(webview: vscode.Webview): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Inspector</title>
      </head>
      <body>
        <div id="inspector">
          Inspector
        </div>
      </body>
      </html>
    `;
  }
}
