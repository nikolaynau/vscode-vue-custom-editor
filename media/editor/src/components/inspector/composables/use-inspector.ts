import { computed, type Ref, onUnmounted } from 'vue';
import debounce from 'debounce';
import type {
  EditorDataModel,
  ReplaceValueCommand,
  ChangeButtonValueCommand,
  EditCommandArray
} from '@/utils/editor';
import { toInt } from '@/utils/numbers';
import { isDefined } from '@/utils/types';

export interface UseInspectorOptions {
  editDelay?: number;
  onEdit?: (edits: EditCommandArray) => void;
}

type UpdateValueFunction = (value: number) => void;

export function useInspector(
  dataModel: Ref<EditorDataModel | undefined>,
  options?: UseInspectorOptions
) {
  const { editDelay, onEdit } = options ?? {};
  let updateButtonValueFns: Record<number, UpdateValueFunction> | undefined =
    undefined;

  const updateCounterValue = debounce<UpdateValueFunction>(value => {
    const command = {
      name: 'replace',
      payload: { value }
    } as ReplaceValueCommand;
    onEdit?.([command]);
  }, editDelay);

  const inputs = computed<Array<{ btnId: number; value: number }>>(
    () =>
      dataModel.value?.buttons.map(btn => ({
        btnId: btn.id,
        value: btn.value
      })) ?? []
  );

  const currentValue = computed({
    get: () => dataModel.value?.counterValue,
    set: val => {
      val = toInt(val as unknown as string);
      if (isDefined(val)) {
        updateCounterValue(val as number);
      }
    }
  });

  function onButtonInput(btnId: number, val: string) {
    const intValue = toInt(val);
    if (isDefined(intValue)) {
      getOrCreateUpdateButtonValueFn(btnId)(intValue as number);
    }
  }

  function getOrCreateUpdateButtonValueFn(
    btnId: number
  ): (value: number) => void {
    if (!updateButtonValueFns) {
      updateButtonValueFns = {};
    }
    if (!updateButtonValueFns[btnId]) {
      updateButtonValueFns[btnId] = debounce<UpdateValueFunction>(value => {
        const command = {
          name: 'change-button',
          payload: { btnId, value }
        } as ChangeButtonValueCommand;
        onEdit?.([command]);
      }, editDelay);
    }
    return updateButtonValueFns[btnId];
  }

  onUnmounted(() => {
    updateButtonValueFns = undefined;
  });

  return {
    inputs,
    currentValue,
    onButtonInput
  };
}

export type UseInspectorReturn = ReturnType<typeof useInspector>;
