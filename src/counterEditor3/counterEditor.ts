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
    this._registerListeners();
  }

  private _registerListeners() {
    this._register(this._inspectorView.onDidEdit((e) => {
      this.getActivePanel()?.applyEdits(e.changes, true);
    }));

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
