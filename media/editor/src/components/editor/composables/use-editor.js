import { ref, watch, onMounted, nextTick } from 'vue';
import createModel from './document-model';

export default function useEditor({ value, focusOnStart, emit }) {
  const input = ref(null);
  const model = ref(createModel(value.value));

  model.value.on('change', e => {
    emit('change-value', e);
  });

  watch(value, () => {
    model.value.setValue(value.value);
  });

  onMounted(() => {
    if (focusOnStart.value) {
      focusInput();
    }
  });

  const onPlus = num => {
    const editOperation = { name: 'plus', payload: { value: num } };
    model.value.applyEdits([editOperation]);
  };

  const onReplace = num => {
    const editOperation = { name: 'replace', payload: { value: num } };
    model.value.applyEdits([editOperation]);
  };

  const onClear = () => {
    onReplace(0);
    nextTick(focusInput);
  };

  const onClick = () => {
    focusInput();
  };

  function focusInput() {
    input.value?.focus();
  }

  return {
    model,
    input,
    onPlus,
    onReplace,
    onClear,
    onClick
  };
}
