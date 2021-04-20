import * as vscode from 'vscode';
import { Disposable } from './dispose';
import { Document } from './document';
import { Editor } from './editor';
import { EditorCollection } from './editorCollection';

export interface EditorProviderOptions {
  readonly webviewOptions?: vscode.WebviewPanelOptions;
  readonly supportsMultipleEditorsPerDocument?: boolean;
}

export interface EditorProvider<TDocument extends vscode.CustomDocument> extends vscode.CustomEditorProvider<TDocument> {
  getViewType(): string;
  getOptions(): EditorProviderOptions;
}

export abstract class BaseEditorProvider<TDocument extends Document<any>, TEditor extends Editor>
  extends Disposable
  implements EditorProvider<TDocument>
{
  protected readonly _onDidChangeCustomDocument = this._register(new vscode.EventEmitter<vscode.CustomDocumentEditEvent<TDocument>>());
  public readonly onDidChangeCustomDocument = this._onDidChangeCustomDocument.event;

  protected readonly _onDidDispose = this._register(new vscode.EventEmitter<void>());
  public readonly onDidDispose = this._onDidDispose.event;

  private readonly _context: vscode.ExtensionContext;
  private readonly _editors = this._register(new EditorCollection<TEditor>());

  public constructor(context: vscode.ExtensionContext) {
    super();
    this._context = context;
    this._register(this.registerProvider());
  }

  public abstract getViewType(): string;
  public abstract getOptions(): EditorProviderOptions;

  protected abstract createDocument(uri: vscode.Uri, openContext: vscode.CustomDocumentOpenContext): Promise<TDocument>;
  protected abstract createEditor(extensionUri: vscode.Uri, document: TDocument): TEditor;

  public get context() { return this._context; }

  protected registerProvider(): vscode.Disposable {
    return vscode.window.registerCustomEditorProvider(this.getViewType(), this, this.getOptions());
  }

  public async openCustomDocument(uri: vscode.Uri, openContext: vscode.CustomDocumentOpenContext, token: vscode.CancellationToken): Promise<TDocument> {
    const document = await this.createDocument(uri, openContext);
    document.onDidChange(e => { this._onDidChangeCustomDocument.fire(e as vscode.CustomDocumentEditEvent<TDocument>); });
    return document;
  }

  public async resolveCustomEditor(document: TDocument, webviewPanel: vscode.WebviewPanel, _token: vscode.CancellationToken): Promise<void> {
    const editor = this.getOrCreateEditor(document);
    editor.createViewPanel(webviewPanel);
  }

  public saveCustomDocument(document: TDocument, cancellation: vscode.CancellationToken): Thenable<void> {
    return document.save(cancellation);
  }

  public saveCustomDocumentAs(document: TDocument, destination: vscode.Uri, cancellation: vscode.CancellationToken): Thenable<void> {
    return document.saveAs(destination, cancellation);
  }

  public revertCustomDocument(document: TDocument, cancellation: vscode.CancellationToken): Thenable<void> {
    return document.revert(cancellation);
  }

  public backupCustomDocument(document: TDocument, context: vscode.CustomDocumentBackupContext, cancellation: vscode.CancellationToken): Thenable<vscode.CustomDocumentBackup> {
    return document.backup(context.destination, cancellation);
  }

  private getOrCreateEditor(document: TDocument): TEditor {
    let editor = this._editors.get(document.uri);
    if (!editor) {
      editor = this.createEditor(this._context.extensionUri, document);
      this._editors.add(document.uri, editor);
    }
    return editor;
  }

  public dispose() {
    this._onDidDispose.fire();
    super.dispose();
  }
}
