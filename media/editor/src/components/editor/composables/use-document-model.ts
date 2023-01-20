import { type Ref, reactive, ref, unref, watch } from 'vue';
import type {
  ChangeBlock,
  EditCommand,
  EditCommandArray
} from '../utils/types';
import { createButtons, type ButtonDefinition } from '../utils/buttons';
import { parseDocument } from '../utils/parser';
import type { DocumentObject, RawDocument } from '../utils/types';
import { isDefined } from '@/utils/types';
import { isPlainObject } from 'is-plain-object';

export interface ChangeEvent {
  changes: Array<ChangeBlock>;
  versionId: number;
}

export interface UseDocumentModelOptions {
  onChange?: (event: ChangeEvent) => void;
}

interface OprationHandler {
  (name: string, payload: Record<string, unknown>): ChangeBlock | null;
}

export function useDocumentModel(
  rawData: Ref<RawDocument | null | undefined>,
  options?: UseDocumentModelOptions
) {
  const { onChange } = options ?? {};

  const documentData = reactive<DocumentObject>({ counter: 0 });
  const error = ref<Error | null>(null);
  const versionId = ref(0);
  const buttons = reactive<ButtonDefinition[]>(createButtons());
  const operationHandlers: Record<string, OprationHandler> = {};

  function setData(data: RawDocument | null | undefined) {
    const { doc, err } = parseDocument(data);
    documentData.counter = doc?.counter ?? 0;
    error.value = err;
  }

  function increaseVersion(): void {
    versionId.value++;
  }

  function toJSON(): DocumentObject {
    return {
      counter: documentData.counter
    };
  }

  function toString(formatted = false): string {
    return JSON.stringify(toJSON(), undefined, formatted ? 2 : undefined);
  }

  function applyEdits(operations: EditCommandArray, triggerChangeEvent = true) {
    const changes = applyEditOperations(operations);
    if (changes.length > 0) {
      increaseVersion();

      if (triggerChangeEvent) {
        onChange?.({ changes, versionId: versionId.value });
      }
    }
  }

  function applyEditOperations(
    operations: EditCommandArray
  ): Array<ChangeBlock> {
    const changes: ChangeBlock[] = [];
    for (let i = 0, len = operations.length; i < len; i++) {
      const result = applyEditOperation(operations[i]);
      if (result) {
        changes.push(result);
      }
    }
    return changes;
  }

  function applyEditOperation(
    operation: EditCommand | null | undefined
  ): ChangeBlock | null | undefined {
    if (!validateEditOperation(operation)) {
      return null;
    }

    const { name, payload } = operation as EditCommand;
    const handler = getOperationHandler(name);
    return handler?.(name, payload as Record<string, unknown>);
  }

  function validateEditOperation(
    operation: EditCommand | null | undefined
  ): boolean {
    let valid = true;
    valid = valid && isDefined(operation);
    valid = valid && isPlainObject(operation);
    valid = valid && typeof operation?.name === 'string';
    valid = valid && isDefined(operation?.payload);
    valid = valid && isPlainObject(operation?.payload);
    return valid;
  }

  function getValueFromPayload(
    payload: Record<string, unknown>
  ): number | undefined {
    const { value } = payload;
    return typeof value === 'number' ? value : undefined;
  }

  function getOperationHandler(name: string): OprationHandler | undefined {
    return operationHandlers[name];
  }

  function registerOperationHandler(name: string, handler: OprationHandler) {
    operationHandlers[name] = handler;
  }

  function plusValueHandler(
    name: string,
    payload: Record<string, unknown>
  ): ChangeBlock | null {
    const value = getValueFromPayload(payload);
    if (!isDefined(value)) {
      return null;
    }
    documentData.counter += value as number;
    return {
      applied: {
        name,
        payload: {
          value
        }
      },
      reverse: {
        name,
        payload: {
          value: -(value as number)
        }
      }
    };
  }

  function replaceValueHandler(
    name: string,
    payload: Record<string, unknown>
  ): ChangeBlock | null {
    const value = getValueFromPayload(payload);
    if (!isDefined(value)) {
      return null;
    }
    const oldValue = documentData.counter;
    documentData.counter = value as number;
    const newValue = documentData.counter;
    return {
      applied: {
        name,
        payload: {
          value: newValue
        }
      },
      reverse: {
        name,
        payload: {
          value: oldValue
        }
      }
    };
  }

  function changeButtonValueHandler(
    name: string,
    payload: Record<string, unknown>
  ): ChangeBlock | null {
    const value = getValueFromPayload(payload);
    if (!isDefined(value)) {
      return null;
    }

    const button = buttons.find(button => button.id === payload.btnId);
    if (!button) {
      return null;
    }

    const oldValue = button.value;
    button.value = value as number;
    const newValue = button.value;

    return {
      applied: {
        name,
        payload: {
          btnId: button.id,
          value: newValue
        }
      },
      reverse: {
        name,
        payload: {
          btnId: button.id,
          value: oldValue
        }
      }
    };
  }

  watch(rawData, () => {
    setData(unref(rawData));
    increaseVersion();
  });

  setData(unref(rawData));

  registerOperationHandler('plus', plusValueHandler);
  registerOperationHandler('replace', replaceValueHandler);
  registerOperationHandler('change-button', changeButtonValueHandler);

  return {
    documentData,
    buttons,
    error,
    versionId,
    applyEdits,
    toJSON,
    toString,
    setData
  };
}

export type UseDocumentModelReturn = ReturnType<typeof useDocumentModel>;
