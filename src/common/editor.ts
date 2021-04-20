import * as vscode from 'vscode';
import { Disposable, DisposableEvent } from './dispose';
import { Document, DocumentDelegate } from './document';
import { EditOperation } from './documentModel';
import { EditorPanel } from './editorPanel';
import { EditorPanelCollection } from './editorPanelCollection';
import { isDefined } from './types';

export interface Editor extends DisposableEvent {
  createViewPanel(webviewPanel: vscode.WebviewPanel): void;
}

export abstract class BaseEditor<TDocument extends Document<any>, TPanel extends EditorPanel<any>> extends Disposable implements Editor {

  private readonly _onDidDispose = this._register(new vscode.EventEmitter<void>());
  public readonly onDidDispose = this._onDidDispose.event;

  private _panels = new EditorPanelCollection<TPanel>();

  public constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly _document: TDocument
  ) {
    super();
    this._document.setDelegate(this.createDocumentDelegate());
    this.registerListeners();
  }

  public get document() { return this._document; }

  public get extensionUri() { return this._extensionUri; }

  protected abstract createEditorPanel(webviewPanel: vscode.WebviewPanel): TPanel;

  public dispose() {
    this._onDidDispose.fire();
    super.dispose();
  }

  private registerListeners() {
    this._register(this._document.onDidDispose(() => this.dispose()));
    this._register(this._document.onDidChangeContent(e => this.updateViewPanels(e.content, e.changes, e.panelId)));
  }

  public createViewPanel(webviewPanel: vscode.WebviewPanel): void {
    const panel = this.createEditorPanel(webviewPanel);
    panel.onDidReceiveEdit(e => this._document.makeEdit(e, panel.id));

    panel.setInitialData(this._document.documentData, this._document.getUnsavedChanges());
    this._panels.add(this._document.uri, panel);
  }

  private updateViewPanels(content?: any, changes?: EditOperation[], skipPanelId?: number): void {
    for (const panel of this._panels.get(this._document.uri)) {
      if (skipPanelId !== panel.id) {
        this.updateViewPanel(panel, content, changes);
      }
    }
  }

  private async updateViewPanel(panel: TPanel, content?: string, changes?: EditOperation[]): Promise<void> {
    if (isDefined(content)) {
      await panel.setFileData(content);
    }

    if (Array.isArray(changes)) {
      await panel.applyEdits(changes);
    }
  }

  private async getFileDataFromPanel(): Promise<any> {
    const panelsForDocument = Array.from(this._panels.get(this._document.uri));
    if (!panelsForDocument.length) {
      throw new Error('Could not find editor panel to save for');
    }
    const panel = panelsForDocument[0];
    return await panel.getFileData();
  }

  protected createDocumentDelegate(): DocumentDelegate<any> {
    return {
      getFileData: () => {
        return this.getFileDataFromPanel();
      }
    };
  }
}
