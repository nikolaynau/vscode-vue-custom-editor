import * as vscode from 'vscode';
import { CounterDocument, CounterDocumentDelegate } from './counterDocument';
import { Disposable } from './dispose';
import { EditorItem } from "./editorCollection";

export class CounterEditor extends Disposable implements EditorItem, CounterDocumentDelegate {

  public static create(
    extensionUri: vscode.Uri,
    documentUri: vscode.Uri,
    documentOpenContext: vscode.CustomDocumentOpenContext
  ): CounterEditor {
    return new CounterEditor(extensionUri, documentUri, documentOpenContext);
  }

  private _document: CounterDocument | null = null;

  private readonly _onDidChangeDocument = this._register(new vscode.EventEmitter<vscode.CustomDocumentEditEvent<CounterDocument>>());
  public readonly onDidChangeDocument = this._onDidChangeDocument.event;

  private readonly _onDidDispose = this._register(new vscode.EventEmitter<void>());
  public readonly onDidDispose = this._onDidDispose.event;

  private constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly _documentUri: vscode.Uri,
    private readonly _documentOpenContext: vscode.CustomDocumentOpenContext
  ) {
    super();
  }

  public get document() { return this._document; }

  public get extensionUri() { return this._extensionUri; }

  public async openDocument(): Promise<CounterDocument> {
    if (this._document) {
      this._document.dispose();
    }
    this._document = await CounterDocument.create(
      this._documentUri,
      this._documentOpenContext.backupId,
      this
    );
    return this._document;
  }

  public createView(webviewPanel: vscode.WebviewPanel): void {

  }

  public async getFileData(): Promise<Uint8Array> {
    return new Uint8Array();
  }
}
