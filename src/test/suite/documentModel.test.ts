import * as assert from 'assert';
import {
  DocumentChangeElement,
  DocumentModel,
  EditOperation
} from '../../common/documentModel';

suite('Document Model', () => {
  test('Init model', () => {
    const instance = new DocumentModel<string>('init value');

    assert.strictEqual(instance.getUnsavedChanges().length, 0);
  });

  test('getUnsavedChanges for |sxxxxc|', () => {
    const instance = new DocumentModel<string>('init value');

    instance.makeEdit(createChanges());
    const result = instance.getUnsavedChanges();

    assert.strictEqual(result.length, 4);
    assert.strictEqual(result[0].payload.value, 1);
    assert.strictEqual(result[1].payload.value, 5);
    assert.strictEqual(result[2].payload.value, 10);
    assert.strictEqual(result[3].payload.value, 20);
  });

  test('getUnsavedChanges for |xxxxcs|', () => {
    const instance = new DocumentModel<string>('init value');

    instance.makeEdit(createChanges());
    instance.saveValue('some value');
    const result = instance.getUnsavedChanges();

    assert.strictEqual(result.length, 0);
  });

  test('getUnsavedChanges for |xxsxxc|', () => {
    const instance = new DocumentModel<string>('init value');
    const changes = createChanges();

    instance.makeEdit([changes[0]]);
    instance.makeEdit([changes[1]]);
    instance.saveValue('some value');
    instance.makeEdit([changes[2]]);
    instance.makeEdit([changes[3]]);
    const result = instance.getUnsavedChanges();

    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0].payload.value, 10);
    assert.strictEqual(result[1].payload.value, 20);
  });

  test('getUnsavedChanges for |sxcx--|', () => {
    const instance = new DocumentModel<string>('init value');
    const changes = createChanges();

    instance.makeEdit([changes[0]]);
    instance.makeEdit([changes[1]]);
    instance.undo();
    const result = instance.getUnsavedChanges();

    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].payload.value, 1);
  });

  test('getUnsavedChanges for |xxsxxc|', () => {
    const instance = new DocumentModel<string>('init value');
    const changes = createChanges();

    instance.makeEdit([changes[0]]);
    instance.makeEdit([changes[1]]);
    instance.saveValue('some value');
    instance.makeEdit([changes[2]]);
    instance.makeEdit([changes[3]]);
    instance.undo();
    const result = instance.getUnsavedChanges();

    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].payload.value, 10);
  });

  test('getUnsavedChanges for |xxcsxx|', () => {
    const instance = new DocumentModel<string>('init value');
    const changes = createChanges();

    instance.makeEdit([changes[0]]);
    instance.makeEdit([changes[1]]);
    instance.saveValue('some value');
    instance.makeEdit([changes[2]]);
    instance.makeEdit([changes[3]]);
    instance.undo();
    instance.undo();
    const result = instance.getUnsavedChanges();

    assert.strictEqual(result.length, 0);
  });

  test('getUnsavedChanges for |cxxsxx|', () => {
    const instance = new DocumentModel<string>('init value');
    const changes = createChanges();

    instance.makeEdit([changes[0]]);
    instance.makeEdit([changes[1]]);
    instance.saveValue('some value');
    instance.makeEdit([changes[2]]);
    instance.makeEdit([changes[3]]);
    instance.undo();
    instance.undo();
    instance.undo();
    instance.undo();
    const result = instance.getUnsavedChanges();

    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0].payload.value, -5);
    assert.strictEqual(result[1].payload.value, -1);
  });

  test('getUnsavedChanges for |cxxxxs|', () => {
    const instance = new DocumentModel<string>('init value');
    const changes = createChanges();

    instance.makeEdit([changes[0]]);
    instance.makeEdit([changes[1]]);
    instance.makeEdit([changes[2]]);
    instance.makeEdit([changes[3]]);
    instance.saveValue('some value');
    instance.undo();
    instance.undo();
    instance.undo();
    instance.undo();
    const result = instance.getUnsavedChanges();

    assert.strictEqual(result.length, 4);
    assert.strictEqual(result[0].payload.value, -20);
    assert.strictEqual(result[1].payload.value, -10);
    assert.strictEqual(result[2].payload.value, -5);
    assert.strictEqual(result[3].payload.value, -1);
  });

  test('getUnsavedChanges for |xcxxxs|', () => {
    const instance = new DocumentModel<string>('init value');
    const changes = createChanges();

    instance.makeEdit([changes[0]]);
    instance.makeEdit([changes[1]]);
    instance.makeEdit([changes[2]]);
    instance.makeEdit([changes[3]]);
    instance.saveValue('some value');
    instance.undo();
    instance.undo();
    instance.undo();
    const result = instance.getUnsavedChanges();

    assert.strictEqual(result.length, 3);
    assert.strictEqual(result[0].payload.value, -20);
    assert.strictEqual(result[1].payload.value, -10);
    assert.strictEqual(result[2].payload.value, -5);
  });
});

class DocumentChangeElementTest implements DocumentChangeElement {
  constructor(
    public readonly id: number,
    public readonly applied: EditOperation,
    public readonly reverse: EditOperation
  ) {}
}

function createChanges(): DocumentChangeElementTest[] {
  return [
    new DocumentChangeElementTest(
      1,
      {
        name: 'plus',
        payload: { value: 1 }
      },
      {
        name: 'plus',
        payload: { value: -1 }
      }
    ),
    new DocumentChangeElementTest(
      2,
      {
        name: 'plus',
        payload: { value: 5 }
      },
      {
        name: 'plus',
        payload: { value: -5 }
      }
    ),
    new DocumentChangeElementTest(
      3,
      {
        name: 'plus',
        payload: { value: 10 }
      },
      {
        name: 'plus',
        payload: { value: -10 }
      }
    ),
    new DocumentChangeElementTest(
      4,
      {
        name: 'plus',
        payload: { value: 20 }
      },
      {
        name: 'plus',
        payload: { value: -20 }
      }
    )
  ];
}
