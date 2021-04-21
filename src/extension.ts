import * as vscode from 'vscode';
import { NewCounter2FileCommand, NewCounterFileCommand } from './commands';
import { CounterEditorProvider } from './counterEditorProvider';
import { CounterEditorProvider as CounterEditorProvider2 } from './counter2/counterEditorProvider';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(vscode.commands.registerCommand(NewCounterFileCommand.ID, NewCounterFileCommand.execute));
  context.subscriptions.push(CounterEditorProvider.register(context));

  context.subscriptions.push(vscode.commands.registerCommand(NewCounter2FileCommand.ID, NewCounter2FileCommand.execute));
  context.subscriptions.push(CounterEditorProvider2.register(context));
}
