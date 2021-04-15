import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "vscode-test-vue-custom-editor" is now active!');

  let disposable = vscode.commands.registerCommand('vscode-test-vue-custom-editor.helloWorld', () => {
    vscode.window.showInformationMessage('Hello World from vscode-test-vue-custom-editor!');
  });

  context.subscriptions.push(disposable);
}

export function deactivate() { }
