import { Webview } from "vscode";
import { BaseInspectorWebviewView } from "../common/inspectorWebviewView";

let a = 0;

export class CounterInspectorWebviewView extends BaseInspectorWebviewView {

  protected getHtmlForWebview(webview: Webview): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Inspector</title>
      </head>
      <body>
        <div id="inspector">
          Inspector ${a++}
        </div>
      </body>
      </html>
    `;
  }
}
