import * as vscode from 'vscode';
import { CounterEditorProvider } from './counterEditorProvider';
import { CounterEditorProvider as CounterEditorProvider2 } from './counter2/counterEditorProvider';
import { isDefined } from './common/types';

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

export class AddNumberCommand {
  public static readonly id = "vscodeVueCustomEditor.counterEditor.add";

  public static async execute(): Promise<any> {
    const activeEditorPanel = CounterEditorProvider.current?.activeCustomEditor?.getActivePanel();
    if (!activeEditorPanel) {
      return;
    }

    const result = await showInputNumber();
    if (!isDefined(result)) {
      return;
    }

    const editOperation = {
      name: "plus",
      payload: {
        value: result
      }
    };
    activeEditorPanel.applyEdits([editOperation], true);
  }
}

export class SubtractNumberCommand {
  public static readonly id = "vscodeVueCustomEditor.counterEditor.subtract";

  public static async execute(): Promise<any> {
    const activeEditorPanel = CounterEditorProvider.current?.activeCustomEditor?.getActivePanel();
    if (!activeEditorPanel) {
      return;
    }

    const result = await showInputNumber();
    if (!isDefined(result)) {
      return;
    }

    const editOperation = {
      name: "plus",
      payload: {
        value: -result!
      }
    };
    activeEditorPanel.applyEdits([editOperation], true);
  }
}

async function showInputNumber(): Promise<number | undefined> {
  const result = await vscode.window.showInputBox({
    placeHolder: "Enter the number",
    validateInput: text => {
      if (!text) {
        return null;
      }
      const num = Number.parseInt(text, 10);
      if (Number.isNaN(num)) {
        return "Please enter the correct number";
      }
      return null;
    }
  });
  if (!result) {
    return undefined;
  }
  return Number.parseInt(result!, 10);
}
