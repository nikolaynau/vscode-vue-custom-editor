export interface EditorDataModel {
  counterValue: number;
  buttons: Array<{ id: number; value: number }>;
}

export interface EditCommand<T = unknown> {
  name: string;
  payload: T;
}

export interface ReplaceValueCommand extends EditCommand<{ value: number }> {
  name: 'replace';
}

export interface ChangeButtonValueCommand
  extends EditCommand<{ btnId: number; value: number }> {
  name: 'change-button';
}

export type EditCommandArray<T = unknown> = Array<EditCommand<T>>;
