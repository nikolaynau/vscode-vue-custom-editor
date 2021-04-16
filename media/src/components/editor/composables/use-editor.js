import { ref, watch } from "vue";
import createModel from "./document-model";

export default function useEditor({ value, emit }) {
  const model = ref(createModel(value.value));

  model.value.on("change", e => {
    emit("change-value", e);
  });

  watch(value, () => {
    model.value.setValue(value.value);
  });

  const onPlus = (num) => {
    const editOperations = [{ name: "plus", payload: { value: num } }]
    model.value.applyEdits(editOperations);
  }

  return {
    model,
    onPlus
  };
}
