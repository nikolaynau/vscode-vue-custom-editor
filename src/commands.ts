import * as vscode from 'vscode';
import { CounterEditorProvider } from './counterEditorProvider';

export class NewCounterFileCommand {
  public static readonly id = "vscodeVueCustomEditor.counterEditor.new";

  private static newUntitledId = 1;

  public static execute(): any {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      vscode.window.showErrorMessage("Creating new Counter files currently requires opening a workspace");
      return;
    }

    const uri = vscode.Uri.joinPath(workspaceFolders[0].uri, `new-${NewCounterFileCommand.newUntitledId++}.counter`)
      .with({ scheme: 'untitled' });

    vscode.commands.executeCommand('vscode.openWith', uri, CounterEditorProvider.viewType);
  }
}

export class NewCounter2FileCommand {
  public static readonly id = "vscodeVueCustomEditor.counterEditor2.new";

  private static newUntitledId = 1;

  public static execute(): any {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      vscode.window.showErrorMessage("Creating new Counter 2 files currently requires opening a workspace");
      return;
    }

    const uri = vscode.Uri.joinPath(workspaceFolders[0].uri, `new-${NewCounter2FileCommand.newUntitledId++}.counter2`)
      .with({ scheme: 'untitled' });

    vscode.commands.executeCommand('vscode.openWith', uri, CounterEditorProvider.viewType);
  }
}
