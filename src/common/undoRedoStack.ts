export interface EditStackElement {
  undo(): void;
  redo(): void;
}

export class UndoRedoStack<T extends EditStackElement> {

  private readonly _elements: T[] = [];
  private _savePointIndex: number = -1;
  private _currentEditIndex: number = -1;

  public get isDitry(): boolean {
    return this._savePointIndex !== this._currentEditIndex;
  }

  public get saveIndex(): number {
    return this._savePointIndex;
  }

  public get currentIndex(): number {
    return this._currentEditIndex;
  }

  public savePoint(): void {
    this._savePointIndex = this._currentEditIndex;
  }

  public restorePoint(): void {
    const lastIndex = this._elements.length - 1;
    if (this._savePointIndex > lastIndex) {
      this._savePointIndex = lastIndex;
    }
    this._currentEditIndex = this._savePointIndex;
  }

  public getElements(): T[] {
    return this._elements.slice();
  }

  public getLastElement(): T | undefined {
    if (this._elements.length === 0) {
      return undefined;
    }
    return this._elements[this._elements.length - 1];
  }

  public getLeftElements(): T[] {
    if (this._currentEditIndex < this._savePointIndex) {
      return this._elements.slice(this._currentEditIndex + 1, this._savePointIndex + 1);
    }
    return [];
  }

  public getRightElements() {
    if (this._currentEditIndex > this._savePointIndex) {
      return this._elements.slice(this._savePointIndex + 1, this._currentEditIndex + 1);
    }
    return [];
  }

  public pushElement(element: T): void {
    if (this._currentEditIndex < 0) {
      this._elements.length = 0;
    } else if (this._currentEditIndex < this._elements.length - 1) {
      this._elements.splice(this._currentEditIndex + 1, this._elements.length);
    }

    this._elements.push(element);
    this._currentEditIndex = this._elements.length - 1;
  }

  public undo(): void {
    if (this._currentEditIndex < 0) {
      return;
    }
    const undoElement = this._elements[this._currentEditIndex];
    if (!undoElement) {
      return;
    }
    undoElement.undo();
    this._currentEditIndex--;
  }

  public redo(): void {
    if (this._currentEditIndex >= this._elements.length - 1) {
      return;
    }
    const redoElement = this._elements[this._currentEditIndex + 1];
    if (!redoElement) {
      return;
    }
    redoElement.redo();
    this._currentEditIndex++;
  }

  public clear(): void {
    this._elements.length = 0;
    this._currentEditIndex = -1;
    this._savePointIndex = -1;
  }
}
