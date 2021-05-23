import * as vscode from 'vscode';
import { BaseDocument } from '../common/document';
import { DocumentEdit, DocumentModel } from '../common/documentModel';

export class Counter2Document extends BaseDocument<string, DocumentModel<string>> {

  public static async create(uri: vscode.Uri, backupId: string | undefined): Promise<Counter2Document> {
    const dataFile = typeof backupId === 'string' ? vscode.Uri.parse(backupId) : uri;
    const fileData = await BaseDocument.readFile<string>(dataFile, Counter2Document.readConverter);
    return new Counter2Document(uri, fileData);
  }

  protected createDocumentModel(initialData: string): DocumentModel<string> {
    const model = new DocumentModel<string>(initialData);
    model.storeChanges = false;
    return model;
  }

  private static readConverter(data?: Uint8Array): string {
    if (!data) { return ""; }
    return Buffer.from(data).toString("utf8");
  }

  private static writeConverter(data: string): Uint8Array {
    return Buffer.from(data, "utf8");
  }

  protected readFile(uri: vscode.Uri): Promise<string> {
    return BaseDocument.readFile<string>(uri, Counter2Document.readConverter);
  }

  protected writeFile(uri: vscode.Uri, data: string): Promise<void> {
    return BaseDocument.writeFile<string>(uri, data, Counter2Document.writeConverter);
  }

  public makeEdit(edit: DocumentEdit, panelId?: number): void {
    const stackElement = this.documentModel.makeEdit(edit.changes, panelId, true);

    if (stackElement) {
      this._onDidChange.fire({
        label: stackElement.label,
        document: this,
        undo: async () => { stackElement.undo(); },
        redo: async () => { stackElement.redo(); }
      });
    }
  }
}
