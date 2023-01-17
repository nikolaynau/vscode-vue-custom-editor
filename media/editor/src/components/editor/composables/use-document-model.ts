import { type Ref, reactive, ref, watchEffect, unref } from 'vue';
import type { EditCommandArray } from '../utils/types';
import { createButtons, type ButtonDefinition } from '../utils/buttons';
import { parseDocument } from '../utils/parser';
import type { DocumentObject, RawDocument } from '../utils/types';

export function useDocumentModel(rawData: Ref<RawDocument | null | undefined>) {
  const documentData = reactive<DocumentObject>({ counter: 0 });
  const error = ref<Error | null>(null);
  const versionId = ref(0);
  const buttons = reactive<ButtonDefinition[]>(createButtons());

  watchEffect(() => {
    const { doc, err } = parseDocument(unref(rawData));
    documentData.counter = doc?.counter ?? 0;
    error.value = err;
    increaseVersion();
  });

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

  function applyEdits(edits: EditCommandArray, emitChangeEvent = true) {}

  return {
    documentData,
    buttons,
    error,
    applyEdits,
    toJSON,
    toString
  };
}

export type UseDocumentModelReturn = ReturnType<typeof useDocumentModel>;
