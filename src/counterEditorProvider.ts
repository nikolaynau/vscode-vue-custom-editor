import * as vscode from 'vscode';
import { CounterDocument } from './counterDocument';
import { CounterEditor } from './counterEditor';
import { disposeAll } from './dispose';
import { EditorCollection } from './editorCollection';
import { NewCounterFileCommand } from './newCounterFileCommand';

export class CounterEditorProvider implements vscode.CustomEditorProvider<CounterDocument> {
  public static readonly viewType = "vscodeTestVueCustomEditor.counterEditor";

  private static readonly _options = {
    webviewOptions: {
      retainContextWhenHidden: true
    },
    supportsMultipleEditorsPerDocument: false
  };

  public static register(context: vscode.ExtensionContext): vscode.Disposable[] {
    const disposables: vscode.Disposable[] = [];
    disposables.push(NewCounterFileCommand.register());

    disposables.push(vscode.window.registerCustomEditorProvider(
      CounterEditorProvider.viewType,
      new CounterEditorProvider(context),
      CounterEditorProvider._options
    ));
    return disposables;
  }

  private readonly _editors = new EditorCollection<CounterEditor>();

  private readonly _onDidChangeCustomDocument = new vscode.EventEmitter<vscode.CustomDocumentEditEvent<CounterDocument>>();
  public readonly onDidChangeCustomDocument = this._onDidChangeCustomDocument.event;

  constructor(
    private readonly _context: vscode.ExtensionContext
  ) { }

  public async openCustomDocument(
    uri: vscode.Uri,
    openContext: vscode.CustomDocumentOpenContext,
    token: vscode.CancellationToken
  ): Promise<CounterDocument> {
    const editor = await CounterEditor.create(this._context.extensionUri, uri, openContext);

    const listeners: vscode.Disposable[] = [];
    listeners.push(editor.onDidChangeDocument(e => { this._onDidChangeCustomDocument.fire(e); }));
    editor.onDidDispose(() => disposeAll(listeners));

    this._editors.add(uri, editor);
    return editor.document;
  }

  public async resolveCustomEditor(
    document: CounterDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    const editor = this._editors.get(document.uri);
    if (!editor) {
      throw new Error(`Could not find editor for uri: ${document.uri.toString()}`);
    }
    editor.createViewPanel(webviewPanel);
  }

  public saveCustomDocument(document: CounterDocument, cancellation: vscode.CancellationToken): Thenable<void> {
    return document.save(cancellation);
  }

  public saveCustomDocumentAs(document: CounterDocument, destination: vscode.Uri, cancellation: vscode.CancellationToken): Thenable<void> {
    return document.saveAs(destination, cancellation);
  }

  public revertCustomDocument(document: CounterDocument, cancellation: vscode.CancellationToken): Thenable<void> {
    return document.revert(cancellation);
  }

  public backupCustomDocument(document: CounterDocument, context: vscode.CustomDocumentBackupContext, cancellation: vscode.CancellationToken): Thenable<vscode.CustomDocumentBackup> {
    return document.backup(context.destination, cancellation);
  }
}
