import { describe, it, expect, vi } from 'vitest';
import { ref, nextTick } from 'vue';
import { useDocumentModel } from '../composables/use-document-model';
import type {
  ChangeBlock,
  ChangeButtonValueCommand,
  DocumentObject,
  PlusValueCommand,
  ReplaceValueCommand
} from '../utils/types';

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

  it('apply plus value operation', async () => {
    const rawData = ref<DocumentObject>({ counter: 10 });
    const onChange = vi.fn();
    const { documentData, versionId, applyEdits } = useDocumentModel(rawData, {
      onChange
    });
    expect(documentData).toEqual({ counter: 10 });
    expect(versionId.value).toBe(0);

    const operations = [
      { name: 'plus', payload: { value: 5 } } as PlusValueCommand
    ];
    applyEdits(operations);

    expect(documentData).toEqual({ counter: 15 });
    expect(versionId.value).toBe(1);

    expect(onChange.mock.calls).toHaveLength(1);
    expect(onChange.mock.calls[0][0]).toEqual({
      changes: [
        {
          applied: { name: 'plus', payload: { value: 5 } },
          reverse: { name: 'plus', payload: { value: -5 } }
        }
      ] as ChangeBlock[],
      versionId: 1
    });
  });

  it('apply replace value operation', async () => {
    const rawData = ref<DocumentObject>({ counter: 10 });
    const onChange = vi.fn();
    const { documentData, versionId, applyEdits } = useDocumentModel(rawData, {
      onChange
    });
    expect(documentData).toEqual({ counter: 10 });
    expect(versionId.value).toBe(0);

    const operations = [
      { name: 'replace', payload: { value: 5 } } as ReplaceValueCommand
    ];
    applyEdits(operations);

    expect(documentData).toEqual({ counter: 5 });
    expect(versionId.value).toBe(1);

    expect(onChange.mock.calls).toHaveLength(1);
    expect(onChange.mock.calls[0][0]).toEqual({
      changes: [
        {
          applied: { name: 'replace', payload: { value: 5 } },
          reverse: { name: 'replace', payload: { value: 10 } }
        }
      ] as ChangeBlock[],
      versionId: 1
    });
  });

  it('apply change button value operation', async () => {
    const rawData = ref<DocumentObject>({ counter: 10 });
    const onChange = vi.fn();
    const { buttons, versionId, applyEdits } = useDocumentModel(rawData, {
      onChange
    });

    const btnId = 1;

    expect(buttons.find(b => b.id === btnId)?.value).toBe(-10);
    expect(versionId.value).toBe(0);

    const operations = [
      {
        name: 'change-button',
        payload: { btnId, value: -2 }
      } as ChangeButtonValueCommand
    ];
    applyEdits(operations);

    expect(buttons.find(b => b.id === btnId)?.value).toBe(-2);
    expect(versionId.value).toBe(1);

    expect(onChange.mock.calls).toHaveLength(1);
    expect(onChange.mock.calls[0][0]).toEqual({
      changes: [
        {
          applied: { name: 'change-button', payload: { btnId, value: -2 } },
          reverse: { name: 'change-button', payload: { btnId, value: -10 } }
        }
      ] as ChangeBlock[],
      versionId: 1
    });
  });
});
