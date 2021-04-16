import * as vscode from 'vscode';
import { CounterDocument } from './counterDocument';
import { NewCounterFileCommand } from './newCounterFileCommand';
import { WebviewCollection } from './webviewCollection';

export class CounterEditorProvider implements vscode.CustomEditorProvider<CounterDocument> {
  private static readonly viewType = "vscodeTestVueCustomEditor.counterEditor";

  private readonly webviews = new WebviewCollection();

  public static register(context: vscode.ExtensionContext): vscode.Disposable[] {
    const disposables: vscode.Disposable[] = [];
    disposables.push(NewCounterFileCommand.register());
    return disposables;
  }
}
