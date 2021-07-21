import * as vscode from "vscode";
import { RunOnceScheduler } from "./async";
import { InspectorViewEditEvent, InspectorWebviewView } from "./inspectorWebviewView";

export interface InspectorView {
  readonly view?: InspectorWebviewView;
  readonly isAutoReveal: boolean;
  readonly revealDelay: number;

  readonly onDidEdit: vscode.Event<InspectorViewEditEvent>;

  setData(data: any): Promise<void>;
  show(forceFocus?: boolean): void;
  scheduleShow(forceFocus?: boolean): void;
  focusView(): void;
}

export abstract class BaseInspectorView implements vscode.WebviewViewProvider, InspectorView {

  private _view?: InspectorWebviewView;
  private _lastData: any;

  private readonly _onDidEdit = new vscode.EventEmitter<InspectorViewEditEvent>();
  public readonly onDidEdit = this._onDidEdit.event;

  public constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly _viewType: string
  ) { }

  public get view() { return this._view; }

  public get isAutoReveal(): boolean { return true; }

  public get revealDelay(): number { return 0; }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void {
    this._view = this.createView(webviewView, this._extensionUri);
    this._view.onDidDispose(() => this._view = undefined);
    this._view.onDidReady(() => this._view?.webviewView.show());
    this._view.onDidReceiveEdit(e => this._onDidEdit.fire(e));

    this._view.webviewView.onDidChangeVisibility(() => {
      if (this._view?.webviewView.visible && this._lastData) {
        this._view.setData(this._lastData);
      }
    });

    if (this._lastData) {
      this._view.setData(this._lastData);
    }
  }

  protected abstract createView(webviewView: vscode.WebviewView, extensionUri: vscode.Uri): InspectorWebviewView;

  public async setData(data: any): Promise<void> {
    this._lastData = data;
    if (this._view) {
      await this._view.setData(data);
    }
  }

  public show(forceFocus?: boolean): void {
    if (!this.isAutoReveal) {
      return;
    }

    if (this._view && !forceFocus) {
      this._view.webviewView.show();
    } else {
      this.focusView();
    }

    if (this._lastData) {
      this._view?.setData(this._lastData);
    }
  }

  public scheduleShow(forceFocus?: boolean): void {
    if (!this.isAutoReveal) {
      return;
    }

    const showView = new RunOnceScheduler(() => { this.show(forceFocus); }, this.revealDelay);
    showView.schedule();
  }

  public focusView(): void {
    vscode.commands.executeCommand(`${this._viewType}.focus`);
  }
}
