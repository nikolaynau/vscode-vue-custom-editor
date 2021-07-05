import * as vscode from 'vscode';
import { NewCounterFileCommand, AddNumberCommand, ResetCounterCommand, SubtractNumberCommand, NewCounter2FileCommand, NewCounter3FileCommand } from './commands';
import { CounterEditorProvider } from './counterEditor/counterEditorProvider';
import { Counter2EditorProvider } from './counterEditor2/counter2EditorProvider';
import { CounterEditorProvider as CounterEditorProvider3 } from './counterEditor3/counterEditorProvider';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(vscode.commands.registerCommand(NewCounterFileCommand.id, NewCounterFileCommand.execute));
  context.subscriptions.push(vscode.commands.registerCommand(ResetCounterCommand.id, ResetCounterCommand.execute));
  context.subscriptions.push(vscode.commands.registerCommand(AddNumberCommand.id, AddNumberCommand.execute));
  context.subscriptions.push(vscode.commands.registerCommand(SubtractNumberCommand.id, SubtractNumberCommand.execute));
  context.subscriptions.push(CounterEditorProvider.register(context));

  context.subscriptions.push(vscode.commands.registerCommand(NewCounter2FileCommand.id, NewCounter2FileCommand.execute));
  context.subscriptions.push(Counter2EditorProvider.register(context));

  context.subscriptions.push(vscode.commands.registerCommand(NewCounter3FileCommand.id, NewCounter3FileCommand.execute));
  context.subscriptions.push(CounterEditorProvider3.register(context));
}
