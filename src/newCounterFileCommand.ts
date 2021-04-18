import * as vscode from 'vscode';
import { CounterEditorProvider } from './counterEditorProvider';

export class NewCounterFileCommand {

  private static newUntitledId = 1;

  public static register(): vscode.Disposable {
    return vscode.commands.registerCommand("vscodeTestVueCustomEditor.counterEditor.new", () => {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) {
        vscode.window.showErrorMessage("Creating new Counter files currently requires opening a workspace");
        return;
      }

      const uri = vscode.Uri.joinPath(workspaceFolders[0].uri, `new-${NewCounterFileCommand.newUntitledId++}.counter`)
        .with({ scheme: 'untitled' });

      vscode.commands.executeCommand('vscode.openWith', uri, CounterEditorProvider.viewType);
    });
  }
}
