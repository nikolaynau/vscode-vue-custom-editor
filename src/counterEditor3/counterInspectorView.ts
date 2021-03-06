import * as vscode from 'vscode';
import { BaseInspectorView } from '../common/inspectorView';
import { InspectorWebviewView } from '../common/inspectorWebviewView';
import { CounterInspectorWebviewView } from './counterInspectorWebviewView';

export class CounterInspectorView extends BaseInspectorView {
  public static readonly viewType = 'vscodeVueCustomEditor.inpsectorView';

  public static current: CounterInspectorView | undefined;

  public static register(context: vscode.ExtensionContext): { dispose(): any } {
    CounterInspectorView.current = new CounterInspectorView(
      context.extensionUri,
      CounterInspectorView.viewType
    );

    const disposable = vscode.window.registerWebviewViewProvider(
      CounterInspectorView.viewType,
      CounterInspectorView.current
    );

    return {
      dispose: () => {
        CounterInspectorView.current = undefined;
        disposable.dispose();
      }
    };
  }

  public get isAutoReveal(): boolean {
    return vscode.workspace
      .getConfiguration('vscodeVueCustomEditor.inspector')
      .get('autoReveal', false);
  }

  public get revealDelay(): number {
    return vscode.workspace
      .getConfiguration('vscodeVueCustomEditor.inspector')
      .get('revealDelay', 0);
  }

  protected createView(
    webviewView: vscode.WebviewView,
    extensionUri: vscode.Uri
  ): InspectorWebviewView {
    return new CounterInspectorWebviewView(webviewView, extensionUri);
  }
}
