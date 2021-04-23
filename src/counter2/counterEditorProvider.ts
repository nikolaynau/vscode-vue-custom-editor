import * as vscode from 'vscode';
import { BaseEditorProvider, EditorProviderOptions } from '../common/editorProvider';
import { CounterDocument } from './counterDocument';
import { CounterEditor } from './counterEditor';

export class CounterEditorProvider extends BaseEditorProvider<CounterDocument, CounterEditor> {
  public static readonly viewType = "vscodeVueCustomEditor.counterEditor2";

  private static options: EditorProviderOptions = {
    webviewOptions: {
      retainContextWhenHidden: true
    },
    supportsMultipleEditorsPerDocument: false
  };

  public static register(context: vscode.ExtensionContext): vscode.Disposable {
    return vscode.window.registerCustomEditorProvider(
      CounterEditorProvider.viewType,
      new CounterEditorProvider(context),
      CounterEditorProvider.options
    );
  }

  protected createDocument(uri: vscode.Uri, openContext: vscode.CustomDocumentOpenContext): Promise<CounterDocument> {
    return CounterDocument.create(uri, openContext.backupId);
  }

  protected createEditor(extensionUri: vscode.Uri, document: CounterDocument): CounterEditor {
    return CounterEditor.create(extensionUri, document);
  }
}
