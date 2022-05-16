import type * as vscode from 'vscode';
import { Document } from './document';
import { BaseEditorProvider, EditorProvider } from './editorProvider';
import { EditorWithInspector } from './editorWithInspector';
import { InspectorView } from './inspectorView';

export interface EditorProviderWithInspector<
  TDocument extends vscode.CustomDocument
> extends EditorProvider<TDocument> {
  readonly inspectorView: InspectorView;
}

export abstract class BaseEditorProviderWithInspector<
    TDocument extends Document<any>,
    TEditor extends EditorWithInspector
  >
  extends BaseEditorProvider<TDocument, TEditor>
  implements EditorProviderWithInspector<TDocument>
{
  public constructor(
    context: vscode.ExtensionContext,
    private readonly _inspectorView: InspectorView
  ) {
    super(context);
  }

  public get inspectorView() {
    return this._inspectorView;
  }
}
