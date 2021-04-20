import * as vscode from 'vscode';
import { NewCounterFileCommand } from './commands';
import { CounterEditorProvider } from './counterEditorProvider';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(vscode.commands.registerCommand(NewCounterFileCommand.ID, NewCounterFileCommand.execute));
  context.subscriptions.push(CounterEditorProvider.register(context));
}
