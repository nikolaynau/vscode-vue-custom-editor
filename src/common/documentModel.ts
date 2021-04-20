import * as vscode from 'vscode';
import { EditStackElement, UndoRedoStack } from './undoRedoStack';

export interface EditOperation {
  readonly name: string;
  readonly payload: any;
}

export interface DocumentEdit {
  readonly versionId: number;
  readonly changes: DocumentChangeElement[];
}

export interface DocumentChangeElement {
  readonly applied: EditOperation;
  readonly reverse: EditOperation;
}

export interface DocumentChangeContentEvent<T> {
  readonly content?: T;
  readonly changes?: EditOperation[];
  readonly panelId?: number;
  readonly isUndo?: boolean;
  readonly isRedo?: boolean;
}

export class DocumentEditStackElement<T> implements EditStackElement {

  private readonly _label: string;
  private readonly _appliedChanges: EditOperation[];
  private readonly _reverseChanges: EditOperation[];

  constructor(
    private readonly _model: DocumentModel<T>,
    private readonly _changes: DocumentChangeElement[]
  ) {
    this._label = this._changes[0]?.applied?.name ?? "unknown edit";
    this._appliedChanges = this._changes.map(c => c.applied);
    this._reverseChanges = this._changes.map(c => c.reverse).reverse();
  }

  public get changes() { return this._changes; }

  public get label() { return this._label; }

  public get appliedChanges() { return this._appliedChanges; }

  public get reverseChanges() { return this._reverseChanges; }

  public undo(): void {
    this._model.applyUndo(this._reverseChanges, true);
  }

  public redo(): void {
    this._model.applyRedo(this._appliedChanges, true);
  }
}

export class DocumentModel<TData> {

  private readonly _onDidChangeValue = new vscode.EventEmitter<DocumentChangeContentEvent<TData>>();
  public readonly onDidChangeValue = this._onDidChangeValue.event;

  private readonly _undoEditStack = new UndoRedoStack<DocumentEditStackElement<TData>>();

  constructor(private _value: TData) { }

  public getValue(): TData {
    return this._value;
  }

  public setValue(value: TData): void {
    this._value = value;
  }

  public revertValue(value: TData, notify?: boolean): void {
    this._value = value;
    this._undoEditStack.restorePoint();
    if (notify) {
      this._onDidChangeValue.fire({ content: this._value });
    }
  }

  public saveValue(value: TData, notify?: boolean): void {
    this._value = value;
    this._undoEditStack.savePoint();
    if (notify) {
      this._onDidChangeValue.fire({ content: this._value });
    }
  }

  public makeEdit(changes: DocumentChangeElement[], panelId?: number, notify?: boolean): void {
    if (changes.length > 0) {
      const stackElement = new DocumentEditStackElement(this, changes);
      this._undoEditStack.pushElement(stackElement);
      if (notify) {
        this._onDidChangeValue.fire({ changes: stackElement.appliedChanges, panelId });
      }
    }
  }

  public applyUndo(editOperations: EditOperation[], notify?: boolean) {
    if (notify) {
      this._onDidChangeValue.fire({ changes: editOperations, isUndo: true });
    }
  }

  public applyRedo(editOperations: EditOperation[], notify?: boolean) {
    if (notify) {
      this._onDidChangeValue.fire({ changes: editOperations, isRedo: true });
    }
  }

  public undo(): void {
    this._undoEditStack.undo();
  }

  public redo(): void {
    this._undoEditStack.redo();
  }

  public getLastStackElement(): DocumentEditStackElement<TData> | undefined {
    return this._undoEditStack.getLastElement();
  }

  public getUnsavedChanges(): EditOperation[] {
    const result: EditOperation[] = [];

    const reverseOperations: EditOperation[] = [];
    this._undoEditStack.getLeftElements().forEach(element => {
      reverseOperations.push(...element.reverseChanges);
    });
    result.push(...reverseOperations.reverse());

    this._undoEditStack.getRightElements().forEach(element => {
      result.push(...element.appliedChanges);
    });

    return result;
  }
}
