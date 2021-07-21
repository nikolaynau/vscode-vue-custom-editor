import * as vscode from 'vscode';
import { EditorProviderOptions } from '../common/editorProvider';
import { BaseEditorProviderWithInspector } from '../common/editorProviderWithInspector';
import { InspectorView } from '../common/inspectorView';
import { CounterDocument } from './counterDocument';
import { CounterEditor } from './counterEditor';

export class CounterEditorProvider extends BaseEditorProviderWithInspector<CounterDocument, CounterEditor> {
  public static readonly viewType = "vscodeVueCustomEditor.counterEditor3";

  private static options: EditorProviderOptions = {
    webviewOptions: {
      retainContextWhenHidden: true
    },
    supportsMultipleEditorsPerDocument: false
  };

  public static register(context: vscode.ExtensionContext, inspectorView: InspectorView): vscode.Disposable {
    return vscode.window.registerCustomEditorProvider(
      CounterEditorProvider.viewType,
      new CounterEditorProvider(context, inspectorView),
      CounterEditorProvider.options
    );
  }

  protected createDocument(uri: vscode.Uri, openContext: vscode.CustomDocumentOpenContext): Promise<CounterDocument> {
    return CounterDocument.create(uri, openContext.backupId);
  }

  protected createEditor(extensionUri: vscode.Uri, document: CounterDocument): CounterEditor {
    return CounterEditor.create(extensionUri, document, this.inspectorView);
  }
}
