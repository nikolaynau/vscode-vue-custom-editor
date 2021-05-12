import * as vscode from 'vscode';
import { BaseEditorProvider, EditorProviderOptions } from './common/editorProvider';
import { CounterDocument } from './counterDocument';
import { CounterEditor } from './counterEditor';

export class CounterEditorProvider extends BaseEditorProvider<CounterDocument, CounterEditor> {
  public static readonly viewType = "vscodeVueCustomEditor.counterEditor";
  public static current: CounterEditorProvider | undefined;

  private static options: EditorProviderOptions = {
    webviewOptions: {
      retainContextWhenHidden: true
    },
    supportsMultipleEditorsPerDocument: true
  };

  public static register(context: vscode.ExtensionContext): { dispose(): any } {
    CounterEditorProvider.current = new CounterEditorProvider(context);

    const provider = vscode.window.registerCustomEditorProvider(
      CounterEditorProvider.viewType,
      CounterEditorProvider.current,
      CounterEditorProvider.options
    );

    return {
      dispose: () => {
        CounterEditorProvider.current = undefined;
        provider.dispose();
      }
    };
  }

  protected createDocument(uri: vscode.Uri, openContext: vscode.CustomDocumentOpenContext): Promise<CounterDocument> {
    return CounterDocument.create(uri, openContext.backupId);
  }

  protected createEditor(extensionUri: vscode.Uri, document: CounterDocument): CounterEditor {
    return CounterEditor.create(extensionUri, document);
  }
}
