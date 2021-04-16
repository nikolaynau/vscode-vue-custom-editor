import * as vscode from 'vscode';

export class NewCounterFileCommand {
  private static newUntitledId = 1;

  public static register(): vscode.Disposable {
    return vscode.commands.registerCommand("vscodeTestVueCustomEditor.counterEditor.new", () => {
      const workspaceFolders = vscode
    });
  }
}
