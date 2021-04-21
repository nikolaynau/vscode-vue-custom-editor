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

export interface IDocumentEditStackElement extends EditStackElement {
  readonly label: string;
  readonly changes: DocumentChangeElement[];
  readonly appliedChanges: EditOperation[];
  readonly reverseChanges: EditOperation[];
}

export interface IDocumentModel<TData> {
  storeChanges: boolean;

  readonly onDidChangeValue: vscode.Event<DocumentChangeContentEvent<TData>>;

  getValue(): TData;
  setValue(value: TData): void;
  revertValue(value: TData, notify?: boolean): void;
  saveValue(value: TData, notify?: boolean): void;

  makeEdit(changes: DocumentChangeElement[], panelId?: number, notify?: boolean): IDocumentEditStackElement | undefined;
  applyUndo(editOperations: EditOperation[], notify?: boolean): void;
  applyRedo(editOperations: EditOperation[], notify?: boolean): void;

  undo(): void;
  redo(): void;

  getUnsavedChanges(): EditOperation[];
}

export class DocumentEditStackElement<T> implements IDocumentEditStackElement {

  private readonly _label: string;
  private readonly _appliedChanges: EditOperation[];
  private readonly _reverseChanges: EditOperation[];

  constructor(
    private readonly _model: IDocumentModel<T>,
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

export class DocumentModel<TData> implements IDocumentModel<TData> {

  private readonly _onDidChangeValue = new vscode.EventEmitter<DocumentChangeContentEvent<TData>>();
  public readonly onDidChangeValue = this._onDidChangeValue.event;

  private readonly _undoEditStack = new UndoRedoStack<DocumentEditStackElement<TData>>();

  public storeChanges: boolean = true;

  constructor(private _value: TData) { }

  public get undoEditStack() { return this._undoEditStack; }

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

  public makeEdit(changes: DocumentChangeElement[], panelId?: number, notify?: boolean): DocumentEditStackElement<TData> | undefined {
    if (changes.length === 0) {
      return undefined;
    }

    const stackElement = new DocumentEditStackElement(this, changes);
    if (this.storeChanges) {
      this._undoEditStack.pushElement(stackElement);
    }

    if (notify) {
      this._onDidChangeValue.fire({ changes: stackElement.appliedChanges, panelId });
    }

    return stackElement;
  }

  public applyUndo(editOperations: EditOperation[], notify?: boolean): void {
    if (notify) {
      this._onDidChangeValue.fire({ changes: editOperations, isUndo: true });
    }
  }

  public applyRedo(editOperations: EditOperation[], notify?: boolean): void {
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
