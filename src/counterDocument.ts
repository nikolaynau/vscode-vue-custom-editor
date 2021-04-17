import * as vscode from 'vscode';
import { Disposable } from "./dispose";

export interface CounterDocumentDelegate {
  getFileData(): Promise<Uint8Array>
}

export interface EditOperation {
  readonly name: string;
  readonly payload: any;
}

export interface CounterDocumentEdit {
  readonly versionId: number
  readonly changes: Array<{
    readonly applied: EditOperation
    readonly reverse: EditOperation
  }>
}

export class CounterDocument extends Disposable implements vscode.CustomDocument {

  public static async create(
    uri: vscode.Uri,
    backupId: string | undefined,
  ): Promise<CounterDocument | PromiseLike<CounterDocument>> {
    const dataFile = typeof backupId === 'string' ? vscode.Uri.parse(backupId) : uri;
    const fileData = await CounterDocument.readFile(dataFile);
    return new CounterDocument(uri, fileData);
  }

  private static async readFile(uri: vscode.Uri): Promise<Uint8Array> {
    if (uri.scheme === 'untitled') {
      return new Uint8Array();
    }
    return vscode.workspace.fs.readFile(uri);
  }

  private readonly _onDidDispose = this._register(new vscode.EventEmitter<void>());
  public readonly onDidDispose = this._onDidDispose.event;

  private readonly _onDidChangeContent = this._register(new vscode.EventEmitter<void>());
  public readonly onDidChangeContent = this._onDidChangeContent.event;

  private readonly _onDidChange = this._register(new vscode.EventEmitter<vscode.CustomDocumentEditEvent<CounterDocument>>());
  public readonly onDidChange = this._onDidChange.event;

  private _delegate: CounterDocumentDelegate | undefined = undefined;

  private constructor(
    private readonly _uri: vscode.Uri,
    private _documentData: Uint8Array
  ) {
    super();
  }

  public get uri() { return this._uri; }

  public get documentData() { return this._documentData; }

  public dispose() {
    this._onDidDispose.fire();
    super.dispose();
  }

  public setDelegate(delegate: CounterDocumentDelegate): void {
    this._delegate = delegate;
  }

  public makeEdit(edit: CounterDocumentEdit) {
  }

  public async save(cancellation: vscode.CancellationToken): Promise<void> {
    await this.saveAs(this.uri, cancellation);
  }

  public async saveAs(targetResource: vscode.Uri, cancellation: vscode.CancellationToken): Promise<void> {
    const fileData = await this._delegate?.getFileData() ?? new Uint8Array();
    if (cancellation.isCancellationRequested) {
      return;
    }
    await vscode.workspace.fs.writeFile(targetResource, fileData);
  }

  public async revert(_cancellation: vscode.CancellationToken): Promise<void> {
    const diskContent = await CounterDocument.readFile(this.uri);
    this._documentData = diskContent;
    this._onDidChangeContent.fire();
  }

  public async backup(destination: vscode.Uri, cancellation: vscode.CancellationToken): Promise<vscode.CustomDocumentBackup> {
    await this.saveAs(destination, cancellation);

    return {
      id: destination.toString(),
      delete: async () => {
        try {
          await vscode.workspace.fs.delete(destination);
        } catch {
          // noop
        }
      }
    };
  }
}
