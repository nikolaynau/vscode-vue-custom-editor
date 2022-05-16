import * as vscode from 'vscode';
import { Disposable } from './dispose';
import { DocumentBackup } from './documentBackup';
import {
  DocumentChangeContentEvent,
  DocumentEdit,
  EditOperation,
  IDocumentModel
} from './documentModel';
import { isDefined } from './types';

export interface DocumentDelegate<TData> {
  getFileData(): Promise<TData>;
}

export interface Document<TData> extends vscode.CustomDocument {
  readonly documentData: TData;

  readonly onDidDispose: vscode.Event<void>;
  readonly onDidChange: vscode.Event<
    vscode.CustomDocumentEditEvent<vscode.CustomDocument>
  >;
  readonly onDidChangeContent: vscode.Event<DocumentChangeContentEvent<TData>>;

  setDelegate(delegate: DocumentDelegate<TData>): void;
  getUnsavedChanges(): EditOperation[];

  makeEdit(edit: DocumentEdit, panelId?: number): void;

  save(cancellation: vscode.CancellationToken): Promise<void>;
  saveAs(
    targetResource: vscode.Uri,
    cancellation: vscode.CancellationToken
  ): Promise<void>;
  revert(_cancellation: vscode.CancellationToken): Promise<void>;
  backup(
    destination: vscode.Uri,
    cancellation: vscode.CancellationToken
  ): Promise<vscode.CustomDocumentBackup>;
}

export abstract class BaseDocument<TData, TModel extends IDocumentModel<TData>>
  extends Disposable
  implements Document<TData>
{
  public static async readFile<TData>(
    uri: vscode.Uri,
    converter: (data?: Uint8Array) => TData
  ): Promise<TData> {
    if (uri.scheme === 'untitled') {
      return converter();
    }
    return converter(await vscode.workspace.fs.readFile(uri));
  }

  public static async writeFile<TData>(
    uri: vscode.Uri,
    data: TData,
    converter: (data: TData) => Uint8Array
  ): Promise<void> {
    await vscode.workspace.fs.writeFile(uri, converter(data));
  }

  protected readonly _onDidDispose = this._register(
    new vscode.EventEmitter<void>()
  );
  public readonly onDidDispose = this._onDidDispose.event;

  protected readonly _onDidChangeContent = this._register(
    new vscode.EventEmitter<DocumentChangeContentEvent<TData>>()
  );
  public readonly onDidChangeContent = this._onDidChangeContent.event;

  protected readonly _onDidChange = this._register(
    new vscode.EventEmitter<
      vscode.CustomDocumentEditEvent<vscode.CustomDocument>
    >()
  );
  public readonly onDidChange = this._onDidChange.event;

  private readonly _uri: vscode.Uri;
  private readonly _documentModel: TModel;

  private _delegate: DocumentDelegate<TData> | undefined = undefined;

  protected constructor(uri: vscode.Uri, initialData: TData) {
    super();
    this._uri = uri;
    this._documentModel = this.createDocumentModel(initialData);
    this.registerListeners();
  }

  public get uri() {
    return this._uri;
  }

  public get documentData() {
    return this._documentModel.getValue();
  }

  public get documentModel() {
    return this._documentModel;
  }

  protected abstract createDocumentModel(initialData: TData): TModel;
  protected abstract readFile(uri: vscode.Uri): Promise<TData>;
  protected abstract writeFile(uri: vscode.Uri, data: TData): Promise<void>;

  protected registerListeners(): void {
    this._register(
      this._documentModel.onDidChangeValue(e =>
        this._onDidChangeContent.fire(e)
      )
    );
  }

  public setDelegate(delegate: DocumentDelegate<TData>): void {
    this._delegate = delegate;
  }

  public getUnsavedChanges(): EditOperation[] {
    return this._documentModel.getUnsavedChanges();
  }

  public makeEdit(edit: DocumentEdit, panelId?: number): void {
    const stackElement = this._documentModel.makeEdit(
      edit.changes,
      panelId,
      true
    );
    this.doChange(stackElement?.label);
  }

  public async save(cancellation: vscode.CancellationToken): Promise<void> {
    const savedData = await this.doSave(this.uri, cancellation);
    if (savedData !== false) {
      this._documentModel.saveValue(savedData as TData);
    }
  }

  public async saveAs(
    targetResource: vscode.Uri,
    cancellation: vscode.CancellationToken
  ): Promise<void> {
    await this.doSave(targetResource, cancellation);
  }

  public async revert(_cancellation: vscode.CancellationToken): Promise<void> {
    const diskContent = await this.readFile(this.uri);
    this._documentModel.revertValue(diskContent, true);
  }

  public async backup(
    destination: vscode.Uri,
    cancellation: vscode.CancellationToken
  ): Promise<vscode.CustomDocumentBackup> {
    await this.doSave(destination, cancellation);
    return DocumentBackup.create(destination);
  }

  public dispose() {
    this._delegate = undefined;
    this._onDidDispose.fire();
    super.dispose();
  }

  protected async doSave(
    targetResource: vscode.Uri,
    cancellation: vscode.CancellationToken
  ): Promise<TData | boolean> {
    const fileData = await this._delegate?.getFileData();
    if (cancellation.isCancellationRequested) {
      return false;
    }

    if (isDefined(fileData)) {
      await this.writeFile(targetResource, fileData as TData);
      return fileData as TData;
    }
    return false;
  }

  protected doChange(label?: string): void {
    this._onDidChange.fire({
      label: label ?? 'edit',
      document: this,
      undo: async () => {
        this._documentModel.undo();
      },
      redo: async () => {
        this._documentModel.redo();
      }
    });
  }
}
