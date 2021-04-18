import * as vscode from 'vscode';
import { CounterDocument, CounterDocumentChangeContent, CounterDocumentDelegate } from './counterDocument';
import { CounterEditorPanel } from './counterEditorPanel';
import { Disposable, DisposableEvent } from './dispose';
import { EditorPanelCollection } from './editorPanelCollection';

export class CounterEditor extends Disposable implements DisposableEvent {

  public static create(extensionUri: vscode.Uri, document: CounterDocument): CounterEditor {
    return new CounterEditor(extensionUri, document);
  }

  private _panels = new EditorPanelCollection<CounterEditorPanel>();

  private readonly _onDidDispose = this._register(new vscode.EventEmitter<void>());
  public readonly onDidDispose = this._onDidDispose.event;

  private constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly _document: CounterDocument
  ) {
    super();
    this._document.setDelegate(this._createDocumentDelegate());
    this.registerListeners();
  }

  public get document() { return this._document; }

  private registerListeners() {
    this._register(this._document.onDidDispose(() => this.dispose()));
    this._register(this._document.onDidChangeContent((e) => this.updateViewPanels(e)));
  }

  public dispose() {
    this._onDidDispose.fire();
    super.dispose();
  }

  public createViewPanel(webviewPanel: vscode.WebviewPanel): void {
    const panel = new CounterEditorPanel(webviewPanel, this._extensionUri);
    panel.onDidReceiveEdit(e => this._document.makeEdit(e, panel.id));

    panel.setFileData(this._document.documentData);
    this._panels.add(this._document.uri, panel);
  }

  private updateViewPanels(e: CounterDocumentChangeContent) {
    for (const panel of this._panels.get(this._document.uri)) {
      if (e.panelId !== panel.id) {
        this.updateViewPanel(panel, e);
      }
    }
  }

  private async updateViewPanel(panel: CounterEditorPanel, e: CounterDocumentChangeContent) {
    if (e.content) {
      await panel.setFileData(e.content);
    }
    if (e.changes) {
      await panel.applyEdits(e.changes);
    }
  }

  private async getFileData(): Promise<Uint8Array> {
    const panelsForDocument = Array.from(this._panels.get(this._document.uri));
    if (!panelsForDocument.length) {
      throw new Error('Could not find editor panel to save for');
    }
    const panel = panelsForDocument[0];
    return await panel.getFileData();
  }

  private _createDocumentDelegate(): CounterDocumentDelegate {
    return {
      getFileData: () => {
        return this.getFileData();
      }
    };
  }
}
