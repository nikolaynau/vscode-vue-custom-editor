import { describe, it, expect } from 'vitest';
import { ref, nextTick } from 'vue';
import { useDocumentModel } from '../composables/use-document-model';
import type { DocumentObject } from '../utils/types';

describe('useDocumentModel', () => {
  it('rawData as object', () => {
    const rawData = ref<DocumentObject>({ counter: 10 });
    const { documentData, error, versionId } = useDocumentModel(rawData);
    expect(documentData).toEqual({ counter: 10 });
    expect(error.value).toBeNull();
    expect(versionId.value).toBe(0);
  });

  it('rawData as string', () => {
    const rawData = ref<string>(JSON.stringify({ counter: 10 }));
    const { documentData, error, versionId } = useDocumentModel(rawData);
    expect(documentData).toEqual({ counter: 10 });
    expect(error.value).toBeNull();
    expect(versionId.value).toBe(0);
  });

  it('not valid rawData as object', () => {
    const rawData = ref<any>({ badCounter: 10 });
    const { documentData, error, versionId } = useDocumentModel(rawData);
    expect(documentData).toEqual({ counter: 0 });
    expect(error.value).not.toBeNull();
    expect(versionId.value).toBe(0);
  });

  it('not valid rawData as string', () => {
    const rawData = ref<any>(JSON.stringify({ badCounter: 10 }));
    const { documentData, error, versionId } = useDocumentModel(rawData);
    expect(documentData).toEqual({ counter: 0 });
    expect(error.value).not.toBeNull();
    expect(versionId.value).toBe(0);
  });

  it('toJSON', () => {
    const rawData = ref<DocumentObject>({ counter: 10 });
    const { toJSON } = useDocumentModel(rawData);
    expect(toJSON()).toEqual({ counter: 10 });
  });

  it('toString', () => {
    const rawData = ref<DocumentObject>({ counter: 10 });
    const { toString } = useDocumentModel(rawData);
    expect(toString()).toBe(JSON.stringify({ counter: 10 }));
  });

  it('increase version', async () => {
    const rawData = ref<DocumentObject>({ counter: 10 });
    const { documentData, versionId } = useDocumentModel(rawData);
    expect(documentData).toEqual({ counter: 10 });
    expect(versionId.value).toBe(0);

    rawData.value = { counter: 20 };
    await nextTick();

    expect(documentData).toEqual({ counter: 20 });
    expect(versionId.value).toBe(1);
  });
});
