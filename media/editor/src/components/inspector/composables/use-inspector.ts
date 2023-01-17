import { computed, type Ref, onUnmounted } from 'vue';
import debounce from 'debounce';
import type {
  ReplaceValueCommand,
  ChangeButtonValueCommand,
  EditCommandArray
} from '@/components/editor/utils/types';
import { toInt } from '@/utils/numbers';
import { isDefined } from '@/utils/types';

export interface UseInspectorOptions {
  editDelay?: number;
  onEdit?: (edits: EditCommandArray) => void;
}

export interface InspectorDataModel {
  counterValue: number;
  buttons: Array<{ id: number; value: number }>;
}

type UpdateValueFunction = (value: number) => void;

export function useInspector(
  dataModel: Ref<InspectorDataModel | undefined>,
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
      updateButtonValueFns[btnId] = createUpdateButtonValueFn(btnId);
    }
    return updateButtonValueFns[btnId];
  }

  function createUpdateButtonValueFn(btnId: number): UpdateValueFunction {
    return debounce<UpdateValueFunction>(value => {
      const command = {
        name: 'change-button',
        payload: { btnId, value }
      } as ChangeButtonValueCommand;
      onEdit?.([command]);
    }, editDelay);
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
