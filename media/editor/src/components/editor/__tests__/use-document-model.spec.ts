import { describe, it, expect, vi } from 'vitest';
import { ref, nextTick } from 'vue';
import {
  useDocumentModel,
  type ChangeEvent
} from '../composables/use-document-model';
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

  it('formatted toString', () => {
    const rawData = ref<DocumentObject>({ counter: 10 });
    const { toString } = useDocumentModel(rawData);
    expect(toString(true)).toBe(JSON.stringify({ counter: 10 }, null, 2));
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

  it('apply multiple operations', async () => {
    const onChange = vi.fn();
    const { documentData, buttons, versionId, applyEdits } = useDocumentModel(
      ref(null),
      {
        onChange
      }
    );

    const btnId = 2;

    expect(documentData).toEqual({ counter: 0 });
    expect(buttons.find(b => b.id === btnId)?.value).toBe(-5);
    expect(versionId.value).toBe(0);

    const operations = [
      { name: 'replace', payload: { value: 2 } } as ReplaceValueCommand,
      { name: 'plus', payload: { value: 5 } } as PlusValueCommand,
      {
        name: 'change-button',
        payload: { btnId, value: 15 }
      } as ChangeButtonValueCommand
    ];
    applyEdits(operations);

    expect(documentData).toEqual({ counter: 7 });
    expect(buttons.find(b => b.id === btnId)?.value).toBe(15);
    expect(versionId.value).toBe(1);

    expect(onChange.mock.calls).toHaveLength(1);
    expect(onChange.mock.calls[0][0]).toEqual({
      changes: [
        {
          applied: { name: 'replace', payload: { value: 2 } },
          reverse: { name: 'replace', payload: { value: 0 } }
        },
        {
          applied: { name: 'plus', payload: { value: 5 } },
          reverse: { name: 'plus', payload: { value: -5 } }
        },
        {
          applied: { name: 'change-button', payload: { btnId, value: 15 } },
          reverse: { name: 'change-button', payload: { btnId, value: -5 } }
        }
      ] as ChangeBlock[],
      versionId: 1
    });
  });

  it('undo multiple operations', async () => {
    const btnId = 2;
    let changes: ChangeBlock[] = [];

    const onChange = (event: ChangeEvent) => {
      changes = event.changes;
    };

    const { documentData, buttons, versionId, applyEdits } = useDocumentModel(
      ref({ counter: 1 }),
      {
        onChange
      }
    );

    // Initial state
    expect(documentData).toEqual({ counter: 1 });
    expect(buttons.find(b => b.id === btnId)?.value).toBe(-5);
    expect(versionId.value).toBe(0);

    const operations = [
      { name: 'replace', payload: { value: 2 } } as ReplaceValueCommand,
      { name: 'plus', payload: { value: 5 } } as PlusValueCommand,
      {
        name: 'change-button',
        payload: { btnId, value: 15 }
      } as ChangeButtonValueCommand
    ];
    applyEdits(operations);

    // New state
    expect(documentData).toEqual({ counter: 7 });
    expect(buttons.find(b => b.id === btnId)?.value).toBe(15);
    expect(versionId.value).toBe(1);
    expect(changes).toHaveLength(3);

    // Undo operations
    const undoOperations = changes.map(({ reverse }) => reverse).reverse();
    applyEdits(undoOperations);

    // Undo state
    expect(documentData).toEqual({ counter: 1 });
    expect(buttons.find(b => b.id === btnId)?.value).toBe(-5);
    expect(versionId.value).toBe(2);
  });

  it('no call change callback', async () => {
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
    applyEdits(operations, false);

    expect(documentData).toEqual({ counter: 5 });
    expect(versionId.value).toBe(1);

    expect(onChange.mock.calls).toHaveLength(0);
  });
});
