import type * as vscode from 'vscode';
import { Document } from './document';
import { BaseEditor, Editor } from './editor';
import { EditorPanelWithInspector } from './editorPanelWithInspector';
import { InspectorView } from './inspectorView';

export interface EditorWithInspector extends Editor {
  readonly inspectorView: InspectorView;
}

export abstract class BaseEditorWithInspector<
    TDocument extends Document<any>,
    TPanel extends EditorPanelWithInspector<any>
  >
  extends BaseEditor<TDocument, TPanel>
  implements EditorWithInspector
{
  public constructor(
    extensionUri: vscode.Uri,
    document: TDocument,
    private readonly _inspectorView: InspectorView
  ) {
    super(extensionUri, document);
    this._registerInspectorListeners();
  }

  public get inspectorView() {
    return this._inspectorView;
  }

  private _registerInspectorListeners() {
    this._register(
      this._inspectorView.onDidEdit(e => {
        this.getActivePanel()?.applyEdits(e.changes, true);
      })
    );

    this.onDidCreateViewPanel(e => {
      const { editorPanel } = e;
      this._inspectorView.scheduleShow();

      editorPanel.onDidUpdateInspector(e => {
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
}
