import * as vscode from 'vscode';
import { BaseEditorProvider, EditorProviderOptions } from '../common/editorProvider';
import { Counter2Document } from './counter2Document';
import { Counter2Editor } from './counter2Editor';

export class Counter2EditorProvider extends BaseEditorProvider<Counter2Document, Counter2Editor> {
  public static readonly viewType = "vscodeVueCustomEditor.counterEditor2";

  private static options: EditorProviderOptions = {
    webviewOptions: {
      retainContextWhenHidden: true
    },
    supportsMultipleEditorsPerDocument: false
  };

  public static register(context: vscode.ExtensionContext): vscode.Disposable {
    return vscode.window.registerCustomEditorProvider(
      Counter2EditorProvider.viewType,
      new Counter2EditorProvider(context),
      Counter2EditorProvider.options
    );
  }

  protected createDocument(uri: vscode.Uri, openContext: vscode.CustomDocumentOpenContext): Promise<Counter2Document> {
    return Counter2Document.create(uri, openContext.backupId);
  }

  protected createEditor(extensionUri: vscode.Uri, document: Counter2Document): Counter2Editor {
    return Counter2Editor.create(extensionUri, document);
  }
}
