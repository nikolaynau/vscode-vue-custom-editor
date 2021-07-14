import { computed } from "vue";
import debounce from "debounce";
import { toInt } from "@/utils/numbers";
import { isDefined } from "@/utils/types";

export default function useInspector({ dataModel, editDelay, emit }) {
  const updateCounter = debounce((val) => {
    notifyEdit({ name: "replace", payload: { value: val } });
  }, editDelay.value);

  const updateButton = debounce((buttonId, val) => {
    notifyEdit({ name: "change-button", payload: { buttonId, value: val } });
  }, editDelay.value);

  const buttonInputs = computed(() => {
    return dataModel.value?.buttons ?? []
  });

  const counterValueModel = computed({
    get: () => dataModel.value?.counterValue,
    set: (val) => {
      val = toInt(val);
      if (isDefined(val)) {
        updateCounter(val);
      }
    }
  });

  const onUpdateButton = (button, val) => {
    val = toInt(val);
    if (isDefined(val)) {
      updateButton(button.id, val);
    }
  };

  function notifyEdit(editCommand) {
    emit("edit", [editCommand]);
  }

  return {
    counterValueModel,
    buttonInputs,
    onUpdateButton
  }
}
