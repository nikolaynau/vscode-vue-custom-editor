export default function useKeyboard({ onPlus, onReplace }) {
  const onUpKey = () => {
    onPlus(1);
  };

  const onDownKey = () => {
    onPlus(-1);
  };

  const onDeleteKey = () => {
    onReplace(0);
  };

  return {
    onUpKey,
    onDownKey,
    onDeleteKey
  }
}
