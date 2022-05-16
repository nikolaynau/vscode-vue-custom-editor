import * as vscode from 'vscode';
import { Disposable } from './dispose';
import { Document } from './document';
import { Editor } from './editor';
import { EditorCollection } from './editorCollection';

export interface EditorProviderOptions {
  readonly webviewOptions?: vscode.WebviewPanelOptions;
  readonly supportsMultipleEditorsPerDocument?: boolean;
}

export interface EditorProvider<TDocument extends vscode.CustomDocument>
  extends vscode.CustomEditorProvider<TDocument> {}

export abstract class BaseEditorProvider<
  TDocument extends Document<any>,
  TEditor extends Editor
> implements EditorProvider<TDocument>
{
  protected readonly _onDidChangeCustomDocument = new vscode.EventEmitter<
    vscode.CustomDocumentEditEvent<TDocument>
  >();
  public readonly onDidChangeCustomDocument =
    this._onDidChangeCustomDocument.event;

  private readonly _editors = new EditorCollection<TEditor>();

  public constructor(private readonly _context: vscode.ExtensionContext) {}

  protected abstract createDocument(
    uri: vscode.Uri,
    openContext: vscode.CustomDocumentOpenContext
  ): Promise<TDocument>;
  protected abstract createEditor(
    extensionUri: vscode.Uri,
    document: TDocument
  ): TEditor;

  public get context() {
    return this._context;
  }
  public get editors() {
    return this._editors;
  }

  public async openCustomDocument(
    uri: vscode.Uri,
    openContext: vscode.CustomDocumentOpenContext,
    token: vscode.CancellationToken
  ): Promise<TDocument> {
    const document = await this.createDocument(uri, openContext);
    document.onDidChange(e => {
      this._onDidChangeCustomDocument.fire(
        e as vscode.CustomDocumentEditEvent<TDocument>
      );
    });
    return document;
  }

  public async resolveCustomEditor(
    document: TDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    const editor = this.getOrCreateEditor(document);
    editor.createViewPanel(webviewPanel);
  }

  public saveCustomDocument(
    document: TDocument,
    cancellation: vscode.CancellationToken
  ): Thenable<void> {
    return document.save(cancellation);
  }

  public saveCustomDocumentAs(
    document: TDocument,
    destination: vscode.Uri,
    cancellation: vscode.CancellationToken
  ): Thenable<void> {
    return document.saveAs(destination, cancellation);
  }

  public revertCustomDocument(
    document: TDocument,
    cancellation: vscode.CancellationToken
  ): Thenable<void> {
    return document.revert(cancellation);
  }

  public backupCustomDocument(
    document: TDocument,
    context: vscode.CustomDocumentBackupContext,
    cancellation: vscode.CancellationToken
  ): Thenable<vscode.CustomDocumentBackup> {
    return document.backup(context.destination, cancellation);
  }

  public get activeCustomEditor(): TEditor | undefined {
    return this._editors.values().find(editor => editor.isActive);
  }

  private getOrCreateEditor(document: TDocument): TEditor {
    let editor = this._editors.get(document.uri);
    if (!editor) {
      editor = this.createEditor(this._context.extensionUri, document);
      this._editors.add(document.uri, editor);
    }
    return editor;
  }
}
