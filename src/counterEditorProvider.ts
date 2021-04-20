import type * as vscode from 'vscode';
import { BaseEditorProvider, EditorProviderOptions } from './common/editorProvider';
import { CounterDocument } from './counterDocument';
import { CounterEditor } from './counterEditor';

export class CounterEditorProvider extends BaseEditorProvider<CounterDocument, CounterEditor> {

  public static readonly viewType = "vscodeTestVueCustomEditor.counterEditor";

  public getOptions(): EditorProviderOptions {
    return {
      webviewOptions: {
        retainContextWhenHidden: true
      },
      supportsMultipleEditorsPerDocument: true
    };
  }

  public getViewType(): string {
    return CounterEditorProvider.viewType;
  }

  protected createDocument(uri: vscode.Uri, openContext: vscode.CustomDocumentOpenContext): Promise<CounterDocument> {
    return CounterDocument.create(uri, openContext.backupId);
  }

  protected createEditor(extensionUri: vscode.Uri, document: CounterDocument): CounterEditor {
    return CounterEditor.create(extensionUri, document);
  }
}
