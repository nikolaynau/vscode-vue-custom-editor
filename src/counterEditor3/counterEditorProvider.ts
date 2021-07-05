import * as vscode from 'vscode';
import { BaseEditorProvider, EditorProviderOptions } from '../common/editorProvider';
import { InspectorView } from '../inspectorView';
import { CounterDocument } from './counterDocument';
import { CounterEditor } from './counterEditor';

export class CounterEditorProvider extends BaseEditorProvider<CounterDocument, CounterEditor> {
  public static readonly viewType = "vscodeVueCustomEditor.counterEditor3";

  private static options: EditorProviderOptions = {
    webviewOptions: {
      retainContextWhenHidden: true
    },
    supportsMultipleEditorsPerDocument: false
  };

  public constructor(
    context: vscode.ExtensionContext,
    private readonly _inspectorView: InspectorView
  ) {
    super(context);
  }

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
    return CounterEditor.create(extensionUri, document, this._inspectorView);
  }
}
