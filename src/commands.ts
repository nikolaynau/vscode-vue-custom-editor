import * as vscode from 'vscode';
import { CounterEditorProvider } from './counterEditorProvider';
import { CounterEditorProvider as CounterEditorProvider2 } from './counter2/counterEditorProvider';

export class NewCounterFileCommand {
  public static readonly id = "vscodeVueCustomEditor.counterEditor.new";

  private static newUntitledId = 1;

  public static execute(): any {
    const newFileName = `new-${NewCounterFileCommand.newUntitledId++}.counter`;
    const workspaceFolders = vscode.workspace.workspaceFolders;

    let uri;
    if (workspaceFolders) {
      uri = vscode.Uri.joinPath(workspaceFolders[0].uri, newFileName).with({ scheme: 'untitled' });
    } else {
      uri = vscode.Uri.parse(`untitled:${newFileName}`);
    }

    vscode.commands.executeCommand('vscode.openWith', uri, CounterEditorProvider.viewType);
  }
}

export class NewCounter2FileCommand {
  public static readonly id = "vscodeVueCustomEditor.counterEditor2.new";

  private static newUntitledId = 1;

  public static execute(): any {
    const newFileName = `new-${NewCounter2FileCommand.newUntitledId++}.counter2`;
    const workspaceFolders = vscode.workspace.workspaceFolders;

    let uri;
    if (workspaceFolders) {
      uri = vscode.Uri.joinPath(workspaceFolders[0].uri, newFileName).with({ scheme: 'untitled' });
    } else {
      uri = vscode.Uri.parse(`untitled:${newFileName}`);
    }

    vscode.commands.executeCommand('vscode.openWith', uri, CounterEditorProvider2.viewType);
  }
}

export class ResetCounterCommand {
  public static readonly id = "vscodeVueCustomEditor.counterEditor.reset";

  public static execute(): any {
    const activeEditorPanel = CounterEditorProvider.current?.activeCustomEditor?.getActivePanel();
    if (!activeEditorPanel) {
      return;
    }
    const editOperation = {
      name: "replace",
      payload: {
        value: 0
      }
    };
    activeEditorPanel.applyEdits([editOperation], true);
  }
}
