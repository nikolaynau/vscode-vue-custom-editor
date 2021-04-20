import type * as vscode from 'vscode';
import { BaseEditor } from './common/editor';
import { CounterDocument } from './counterDocument';
import { CounterEditorPanel } from './counterEditorPanel';

export class CounterEditor extends BaseEditor<CounterDocument, CounterEditorPanel> {

  public static create(extensionUri: vscode.Uri, document: CounterDocument): CounterEditor {
    return new CounterEditor(extensionUri, document);
  }

  protected createEditorPanel(webviewPanel: vscode.WebviewPanel): CounterEditorPanel {
    return new CounterEditorPanel(webviewPanel, this.extensionUri);
  }
}
