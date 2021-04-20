import * as vscode from 'vscode';

export class DocumentBackup implements vscode.CustomDocumentBackup {

  public static create(destination: vscode.Uri): DocumentBackup {
    return new DocumentBackup(destination);
  }

  private readonly _id: string;

  constructor(
    private readonly _uri: vscode.Uri
  ) {
    this._id = this._uri.toString();
  }

  public get uri() { return this._uri; }

  public get id() { return this._id; }

  public async delete(): Promise<void> {
    try {
      await vscode.workspace.fs.delete(this._uri);
    } catch {
      // noop
    }
  }
}
