import * as vscode from 'vscode';
import { CounterDocument, CounterDocumentDelegate } from './counterDocument';
import { CounterEditorPanel } from './counterEditorPanel';
import { Disposable, DisposableEvent } from './dispose';
import { EditorPanelCollection } from './editorPanelCollection';

export class CounterEditor extends Disposable implements DisposableEvent {

  public static async create(
    extensionUri: vscode.Uri,
    documentUri: vscode.Uri,
    documentOpenContext: vscode.CustomDocumentOpenContext
  ): Promise<CounterEditor> {
    const document = await CounterDocument.create(documentUri, documentOpenContext.backupId);
    return new CounterEditor(extensionUri, document);
  }

  private _panels = new EditorPanelCollection<CounterEditorPanel>();

  private readonly _onDidChangeDocument = this._register(new vscode.EventEmitter<vscode.CustomDocumentEditEvent<CounterDocument>>());
  public readonly onDidChangeDocument = this._onDidChangeDocument.event;

  private readonly _onDidDispose = this._register(new vscode.EventEmitter<void>());
  public readonly onDidDispose = this._onDidDispose.event;

  private constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly _document: CounterDocument
  ) {
    super();
    this.registerListeners();
  }

  public get document() { return this._document; }

  private registerListeners() {
    this._register(this._document.onDidDispose(() => this.dispose()));
    this._register(this._document.onDidChange((e) => this._onDidChangeDocument.fire(e)));
    this._register(this._document.onDidChangeContent(() => this.updateViewPanel()));

    this._document.setDelegate(this._createDocumentDelegate());
  }

  public dispose() {
    this._onDidDispose.fire();
    super.dispose();
  }

  public createViewPanel(webviewPanel: vscode.WebviewPanel): void {
    this._panels.add(this._document.uri, new CounterEditorPanel(webviewPanel, this._extensionUri));
  }

  private updateViewPanel() {
  }

  private async getFileData(): Promise<Uint8Array> {
    return new Uint8Array();
  }

  private _createDocumentDelegate(): CounterDocumentDelegate {
    return {
      getFileData: () => {
        return this.getFileData();
      }
    };
  }
}
