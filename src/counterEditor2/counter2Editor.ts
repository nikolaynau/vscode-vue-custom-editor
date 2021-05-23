import type * as vscode from 'vscode';
import { BaseEditor } from '../common/editor';
import { Counter2Document } from './counter2Document';
import { Counter2EditorPanel } from './counter2EditorPanel';

export class Counter2Editor extends BaseEditor<Counter2Document, Counter2EditorPanel> {

  public static create(extensionUri: vscode.Uri, document: Counter2Document): Counter2Editor {
    return new Counter2Editor(extensionUri, document);
  }

  protected createEditorPanel(webviewPanel: vscode.WebviewPanel): Counter2EditorPanel {
    return new Counter2EditorPanel(webviewPanel, this.extensionUri);
  }
}
