import * as vscode from 'vscode';
import { CounterDocument, CounterDocumentDelegate } from './counterDocument';
import { CounterEditorPanel } from './counterEditorPanel';
import { Disposable, DisposableEvent } from './dispose';
import { EditOperation } from './documents';
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
    this._register(this._document.onDidChangeContent(
      e => this.updateViewPanels(e.content, e.changes, e.panelId))
    );
  }

  public dispose() {
    this._onDidDispose.fire();
    super.dispose();
  }

  public createViewPanel(webviewPanel: vscode.WebviewPanel): void {
    const panel = new CounterEditorPanel(webviewPanel, this._extensionUri);
    panel.onDidReceiveEdit(e => this._document.makeEdit(e, panel.id));
    panel.setInitialData(this._document.documentData, this._document.getUnsavedChanges());
    this._panels.add(this._document.uri, panel);
  }

  private updateViewPanels(content?: string, changes?: EditOperation[], skipPanelId?: number) {
    for (const panel of this._panels.get(this._document.uri)) {
      if (skipPanelId !== panel.id) {
        this.updateViewPanel(panel, content, changes);
      }
    }
  }

  private async updateViewPanel(panel: CounterEditorPanel, content?: string, changes?: EditOperation[]) {
    if (typeof content === "string") {
      await panel.setFileData(content);
    }
    if (Array.isArray(changes)) {
      await panel.applyEdits(changes);
    }
  }

  private async getFileDataFromPanel(): Promise<string> {
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
        return this.getFileDataFromPanel();
      }
    };
  }
}
