import * as vscode from 'vscode';
import { Disposable } from "./dispose";
import { DocumentBackup, DocumentChangeContentEvent, DocumentEdit, DocumentModel, EditOperation } from './documents';

export interface CounterDocumentDelegate {
  getFileData(): Promise<string>;
}

export class CounterDocument extends Disposable implements vscode.CustomDocument {

  public static async create(uri: vscode.Uri, backupId: string | undefined,): Promise<CounterDocument | PromiseLike<CounterDocument>> {
    const dataFile = typeof backupId === 'string' ? vscode.Uri.parse(backupId) : uri;
    const fileData = await CounterDocument.readFile(dataFile);
    return new CounterDocument(uri, fileData);
  }

  private static async readFile(uri: vscode.Uri): Promise<string> {
    if (uri.scheme === 'untitled') {
      return "";
    }
    const diskContent = await vscode.workspace.fs.readFile(uri);
    return Buffer.from(diskContent).toString("utf8");
  }

  private readonly _onDidDispose = this._register(new vscode.EventEmitter<void>());
  public readonly onDidDispose = this._onDidDispose.event;

  private readonly _onDidChangeContent = this._register(new vscode.EventEmitter<DocumentChangeContentEvent>());
  public readonly onDidChangeContent = this._onDidChangeContent.event;

  private readonly _onDidChange = this._register(new vscode.EventEmitter<vscode.CustomDocumentEditEvent<CounterDocument>>());
  public readonly onDidChange = this._onDidChange.event;

  private _delegate: CounterDocumentDelegate | undefined = undefined;

  private readonly _documentModel: DocumentModel;

  private constructor(
    private readonly _uri: vscode.Uri,
    initialData: string
  ) {
    super();
    this._documentModel = new DocumentModel(initialData);
    this._register(this._documentModel.onDidChangeValue(e => this._onDidChangeContent.fire(e)));
  }

  public get uri() { return this._uri; }

  public get documentData() { return this._documentModel.getValue(); }

  public dispose() {
    this._delegate = undefined;
    this._onDidDispose.fire();
    super.dispose();
  }

  public setDelegate(delegate: CounterDocumentDelegate): void {
    this._delegate = delegate;
  }

  public getUnsavedChanges(): EditOperation[] {
    return this._documentModel.getUnsavedChanges();
  }

  public makeEdit(edit: DocumentEdit, panelId?: number) {
    this._documentModel.makeEdit(edit.changes, panelId, true);
    const stackElement = this._documentModel.getLastStackElement();
    this.fireChangeEvent(stackElement?.label ?? "edit");
  }

  public async save(cancellation: vscode.CancellationToken): Promise<void> {
    const result = await this.doSave(this.uri, cancellation);
    if (result !== false) {
      this._documentModel.saveValue(result as string);
    }
  }

  public async saveAs(targetResource: vscode.Uri, cancellation: vscode.CancellationToken): Promise<void> {
    await this.doSave(targetResource, cancellation);
  }

  public async revert(_cancellation: vscode.CancellationToken): Promise<void> {
    const diskContent = await CounterDocument.readFile(this.uri);
    this._documentModel.revertValue(diskContent, true);
  }

  public async backup(destination: vscode.Uri, cancellation: vscode.CancellationToken): Promise<vscode.CustomDocumentBackup> {
    await this.doSave(destination, cancellation);
    return DocumentBackup.create(destination);
  }

  private async doSave(targetResource: vscode.Uri, cancellation: vscode.CancellationToken): Promise<string | boolean> {
    const fileData = await this._delegate?.getFileData() ?? "";
    if (cancellation.isCancellationRequested) {
      return false;
    }
    const writeData = Buffer.from(fileData, "utf8");
    await vscode.workspace.fs.writeFile(targetResource, writeData);
    return fileData;
  }

  private fireChangeEvent(label: string): void {
    this._onDidChange.fire({
      label,
      document: this,
      undo: async () => { this._documentModel.undo(); },
      redo: async () => { this._documentModel.redo(); }
    });
  }
}
