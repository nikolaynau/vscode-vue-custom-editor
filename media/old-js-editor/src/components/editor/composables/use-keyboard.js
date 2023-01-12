import { reactive } from 'vue';
import { nextFocusElement, prevFocusElement } from './util';

export default function useKeyboard({ onPlus, onReplace }) {
  const shortcuts = reactive([
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
  ]);

  const onUpKey = () => {
    onPlus(1);
  };

  const onDownKey = () => {
    onPlus(-1);
  };

  const onDeleteKey = () => {
    onReplace(0);
  };

  const onLeftKey = () => {
    prevFocusElement();
  };

  const onRightKey = () => {
    nextFocusElement();
  };

  return {
    shortcuts,
    onUpKey,
    onDownKey,
    onLeftKey,
    onRightKey,
    onDeleteKey
  };
}
