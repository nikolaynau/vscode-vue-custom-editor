export interface ShortcutDefinition {
  title: string;
  key: string;
}

export default [
  {
    title: 'Increase Сounter',
    key: 'UpArrow'
  },
  {
    title: 'Decrease Сounter',
    key: 'DownArrow'
  },
  {
    title: 'Clear Сounter',
    key: 'Delete'
  },
  {
    title: 'Clear Сounter',
    key: 'Backspace'
  }
] as Array<ShortcutDefinition>;
