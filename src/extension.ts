import * as vscode from 'vscode';
import {
  NewCounterFileCommand,
  AddNumberCommand,
  ResetCounterCommand,
  SubtractNumberCommand,
  NewCounter2FileCommand,
  NewCounter3FileCommand
} from './commands';
import { CounterEditorProvider } from './counterEditor/counterEditorProvider';
import { CounterEditorProvider as CounterEditorProvider2 } from './counterEditor2/counterEditorProvider';
import { CounterEditorProvider as CounterEditorProvider3 } from './counterEditor3/counterEditorProvider';
import { CounterInspectorView } from './counterEditor3/counterInspectorView';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      NewCounterFileCommand.id,
      NewCounterFileCommand.execute
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      ResetCounterCommand.id,
      ResetCounterCommand.execute
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      AddNumberCommand.id,
      AddNumberCommand.execute
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      SubtractNumberCommand.id,
      SubtractNumberCommand.execute
    )
  );
  context.subscriptions.push(CounterEditorProvider.register(context));

  context.subscriptions.push(
    vscode.commands.registerCommand(
      NewCounter2FileCommand.id,
      NewCounter2FileCommand.execute
    )
  );
  context.subscriptions.push(CounterEditorProvider2.register(context));

  context.subscriptions.push(CounterInspectorView.register(context));
  context.subscriptions.push(
    vscode.commands.registerCommand(
      NewCounter3FileCommand.id,
      NewCounter3FileCommand.execute
    )
  );
  context.subscriptions.push(
    CounterEditorProvider3.register(context, CounterInspectorView.current!)
  );
}
