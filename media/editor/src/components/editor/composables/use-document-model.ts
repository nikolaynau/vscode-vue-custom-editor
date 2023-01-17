import { type Ref, reactive, ref, unref, watch } from 'vue';
import type { ChangeBlock, EditCommandArray } from '../utils/types';
import { createButtons, type ButtonDefinition } from '../utils/buttons';
import { parseDocument } from '../utils/parser';
import type { DocumentObject, RawDocument } from '../utils/types';

export interface ChangeEvent {
  changes: Array<ChangeBlock>;
  versionId: number;
}

export interface UseDocumentModelOptions {
  onChange?: (event: ChangeEvent) => void;
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

  watch(rawData, () => {
    parse(unref(rawData));
    increaseVersion();
  });

  parse(unref(rawData));

  function parse(data: RawDocument | null | undefined) {
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

  function toString(): string {
    return JSON.stringify(toJSON());
  }

  function applyEdits(edits: EditCommandArray, triggerChangeEvent = true) {
    const changes = applyEditOperations(edits);
    if (changes.length > 0) {
      increaseVersion();

      if (triggerChangeEvent) {
        onChange?.({ changes, versionId: versionId.value });
      }
    }
  }

  function applyEditOperations(
    editOperations: EditCommandArray
  ): Array<ChangeBlock> {
    return [];
  }

  return {
    documentData,
    buttons,
    error,
    versionId,
    applyEdits,
    toJSON,
    toString
  };
}

export type UseDocumentModelReturn = ReturnType<typeof useDocumentModel>;
