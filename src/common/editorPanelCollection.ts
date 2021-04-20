import type * as vscode from 'vscode';
import { DisposableEvent } from './dispose';

export class EditorPanelCollection<T extends DisposableEvent> {

  private readonly _panels = new Set<{
    readonly resource: string;
    readonly editorPanel: T;
  }>();

  public *get(uri: vscode.Uri): Iterable<T> {
    const key = uri.toString();
    for (const entry of this._panels) {
      if (entry.resource === key) {
        yield entry.editorPanel;
      }
    }
  }

  public add(uri: vscode.Uri, editorPanel: T) {
    const entry = { resource: uri.toString(), editorPanel };
    this._panels.add(entry);

    editorPanel.onDidDispose(() => {
      this._panels.delete(entry);
    });
  }
}
