import * as vscode from 'vscode';
import { Disposable } from "./dispose";

export interface CounterDocumentDelegate {
  getFileData(): Promise<Uint8Array>;
}

export interface EditOperation {
  readonly name: string;
  readonly payload: any;
}

export interface CounterDocumentEdit {
  readonly versionId: number;
  readonly changes: Array<{
    readonly applied: EditOperation;
    readonly reverse: EditOperation;
  }>;
}

export interface CounterDocumentChangeContent {
  readonly content?: Uint8Array;
  readonly changes?: EditOperation[];
  readonly panelId?: number;
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

  private readonly _onDidChangeContent = this._register(new vscode.EventEmitter<CounterDocumentChangeContent>());
  public readonly onDidChangeContent = this._onDidChangeContent.event;

  private readonly _onDidChange = this._register(new vscode.EventEmitter<vscode.CustomDocumentEditEvent<CounterDocument>>());
  public readonly onDidChange = this._onDidChange.event;

  private _delegate: CounterDocumentDelegate | undefined = undefined;

  private _edits: CounterDocumentEdit[] = [];
  private _savedEdits: CounterDocumentEdit[] = [];

  private constructor(
    private readonly _uri: vscode.Uri,
    private _documentData: Uint8Array
  ) {
    super();
  }

  public get uri() { return this._uri; }

  public get documentData() { return this._documentData; }

  public dispose() {
    this._delegate = undefined;
    this._onDidDispose.fire();
    super.dispose();
  }

  public setDelegate(delegate: CounterDocumentDelegate): void {
    this._delegate = delegate;
  }

  public makeEdit(edit: CounterDocumentEdit, panelId?: number) {
    this._edits.push(edit);
    const label = edit.changes[0]?.applied?.name ?? "Unknown edit";

    this._onDidChange.fire({
      label,
      document: this,
      undo: async () => {
        const edit = this._edits.pop();
        if (edit) {
          const changes = edit.changes.reverse().map(c => c.reverse);
          this._onDidChangeContent.fire({ changes });
        }
      },
      redo: async () => {
        this._edits.push(edit);
        const changes = edit.changes.map(c => c.applied);
        this._onDidChangeContent.fire({ changes });
      }
    });

    const changes = edit.changes.map(c => c.applied);
    this._onDidChangeContent.fire({ changes, panelId });
  }

  public async save(cancellation: vscode.CancellationToken): Promise<void> {
    await this.saveAs(this.uri, cancellation);
    this._savedEdits = Array.from(this._edits);
    // this._documentData = fileData;
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
    this._edits = this._savedEdits;
    this._onDidChangeContent.fire({ content: diskContent });
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
