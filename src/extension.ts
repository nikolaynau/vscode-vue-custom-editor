import * as vscode from 'vscode';
import { CounterEditorPanel, getWebviewOptions } from './CounterEditorPanel';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('vscodeTestVueCustomEditor.start', () => {
      CounterEditorPanel.createOrShow(context.extensionUri);
    })
  );

  if (vscode.window.registerWebviewPanelSerializer) {
    vscode.window.registerWebviewPanelSerializer(CounterEditorPanel.viewType, {
      async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
        console.log(`Got state: ${state}`);
        webviewPanel.webview.options = getWebviewOptions(context.extensionUri);
        CounterEditorPanel.revive(webviewPanel, context.extensionUri);
      }
    });
  }
}
