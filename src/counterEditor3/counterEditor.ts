import * as vscode from 'vscode';
import { BaseEditor } from '../common/editor';
import { InspectorView } from '../common/inspectorView';
import { CounterDocument } from './counterDocument';
import { CounterEditorPanel } from './counterEditorPanel';

export class CounterEditor extends BaseEditor<CounterDocument, CounterEditorPanel> {

  public static create(
    extensionUri: vscode.Uri,
    document: CounterDocument,
    inspectorView: InspectorView
  ): CounterEditor {
    return new CounterEditor(extensionUri, document, inspectorView);
  }

  public constructor(
    extensionUri: vscode.Uri,
    document: CounterDocument,
    private readonly _inspectorView: InspectorView
  ) {
    super(extensionUri, document);
  }

  protected registerListeners() {
    super.registerListeners();

    this.onDidCreateViewPanel((e) => {
      const { editorPanel } = e;
      this._inspectorView.scheduleShow();

      editorPanel.onDidUpdateInspector((e) => {
        this._inspectorView.setData(e);
      });

      editorPanel.panel.onDidChangeViewState(e => {
        if (e.webviewPanel.visible) {
          editorPanel.needUpdateInspector();
          this._inspectorView.show(true);
        }
      });
    });
  }

  protected createEditorPanel(webviewPanel: vscode.WebviewPanel): CounterEditorPanel {
    return new CounterEditorPanel(webviewPanel, this.extensionUri);
  }
}
