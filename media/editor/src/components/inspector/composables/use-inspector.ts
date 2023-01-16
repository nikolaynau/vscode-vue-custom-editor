import { computed, type Ref } from 'vue';
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

export function useInspector(
  dataModel: Ref<EditorDataModel | undefined>,
  options?: UseInspectorOptions
) {
  const { editDelay, onEdit } = options ?? {};

  const updateCounterValue = debounce<(value: number) => void>(value => {
    const command = {
      name: 'replace',
      payload: { value }
    } as ReplaceValueCommand;
    onEdit?.([command]);
  }, editDelay);

  const updateButtonValue = debounce<(btnId: number, value: number) => void>(
    (btnId, value) => {
      const command = {
        name: 'change-button',
        payload: { btnId, value }
      } as ChangeButtonValueCommand;
      onEdit?.([command]);
    },
    editDelay
  );

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
    const numericalValue = toInt(val);
    if (isDefined(numericalValue)) {
      updateButtonValue(btnId, numericalValue as number);
    }
  }

  return {
    inputs,
    currentValue,
    onButtonInput
  };
}

export type UseInspectorReturn = ReturnType<typeof useInspector>;
