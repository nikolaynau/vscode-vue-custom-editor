import * as vscode from 'vscode';
import { NewCounterFileCommand } from './commands';
import { CounterDocument } from './counterDocument';
import { CounterEditor } from './counterEditor';
import { EditorCollection } from './editorCollection';

export class CounterEditorProvider implements vscode.CustomEditorProvider<CounterDocument> {

  public static readonly viewType = "vscodeTestVueCustomEditor.counterEditor";

  private static readonly _options = {
    webviewOptions: {
      retainContextWhenHidden: true
    },
    supportsMultipleEditorsPerDocument: true
  };

  public static register(context: vscode.ExtensionContext): vscode.Disposable[] {
    const disposables: vscode.Disposable[] = [];
    disposables.push(vscode.commands.registerCommand(NewCounterFileCommand.ID, NewCounterFileCommand.execute));
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

  public async openCustomDocument(uri: vscode.Uri, openContext: vscode.CustomDocumentOpenContext, token: vscode.CancellationToken): Promise<CounterDocument> {
    const document = await CounterDocument.create(uri, openContext.backupId);
    document.onDidChange(e => { this._onDidChangeCustomDocument.fire(e); });
    return document;
  }

  public async resolveCustomEditor(document: CounterDocument, webviewPanel: vscode.WebviewPanel, _token: vscode.CancellationToken): Promise<void> {
    const editor = this.getOrCreateEditor(document);
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

  private getOrCreateEditor(document: CounterDocument): CounterEditor {
    let editor = this._editors.get(document.uri);
    if (!editor) {
      editor = CounterEditor.create(this._context.extensionUri, document);
      this._editors.add(document.uri, editor);
    }
    return editor;
  }
}
