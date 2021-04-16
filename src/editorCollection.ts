import * as vscode from 'vscode';
import { Disposable } from './dispose';

export interface EditorItem {
  readonly onDidDispose: vscode.Event<void>;
}

export class EditorCollection<T extends EditorItem> extends Disposable {
  private readonly _editors = new Map<string, T>();

  public add(uri: vscode.Uri, editor: T) {
    const key = uri.toString();
    this._register(editor.onDidDispose(() => {
      this._editors.delete(key);
    }));
    this._editors.set(key, editor);
  }

  public get(uri: vscode.Uri): T | undefined {
    const key = uri.toString();
    return this._editors.get(key);
  }

  public dispose(): any {
    this._editors.clear();
    super.dispose();
  }
}
