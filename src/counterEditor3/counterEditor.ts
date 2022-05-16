import type * as vscode from 'vscode';
import { BaseEditorWithInspector } from '../common/editorWithInspector';
import { InspectorView } from '../common/inspectorView';
import { CounterDocument } from './counterDocument';
import { CounterEditorPanel } from './counterEditorPanel';

export class CounterEditor extends BaseEditorWithInspector<
  CounterDocument,
  CounterEditorPanel
> {
  public static create(
    extensionUri: vscode.Uri,
    document: CounterDocument,
    inspectorView: InspectorView
  ): CounterEditor {
    return new CounterEditor(extensionUri, document, inspectorView);
  }

  protected createEditorPanel(
    webviewPanel: vscode.WebviewPanel
  ): CounterEditorPanel {
    return new CounterEditorPanel(webviewPanel, this.extensionUri);
  }
}
