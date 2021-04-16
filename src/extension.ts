import * as vscode from 'vscode';
import { CounterEditorProvider } from './counterEditorProvider';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(...CounterEditorProvider.register(context));
}
