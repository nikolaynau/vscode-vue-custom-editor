export interface DocumentObject {
  counter: number;
}
export type RawJsonDocument = string;
export type RawDocument = RawJsonDocument | DocumentObject;

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

export interface PlusValueCommand extends EditCommand<{ value: number }> {
  name: 'plus';
}

export type EditCommandArray<T = unknown> = Array<EditCommand<T>>;

export interface ChangeBlock<TCommand extends EditCommand = EditCommand> {
  applied: TCommand;
  reverse: TCommand;
}
