import type * as vscode from 'vscode';
import { Disposable, DisposableEvent } from './dispose';

export class EditorCollection<T extends DisposableEvent> {

  private readonly _editors = new Map<string, T>();

  public add(uri: vscode.Uri, editor: T) {
    const key = uri.toString();
    this._editors.set(key, editor);

    editor.onDidDispose(() => {
      this._editors.delete(key);
    });
  }

  public get(uri: vscode.Uri): T | undefined {
    const key = uri.toString();
    return this._editors.get(key);
  }

  public clear(): void {
    this._editors.clear();
  }
}
