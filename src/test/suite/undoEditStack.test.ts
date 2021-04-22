import * as assert from 'assert';
import { EditStackElement, UndoRedoStack } from '../../common/undoRedoStack';

suite('Undo edit stack', () => {
  test('Init currentIndex and saveIndex', () => {
    const instance = new UndoRedoStack();

    assert.strictEqual(instance.currentIndex, -1);
    assert.strictEqual(instance.saveIndex, -1);
  });

  test('left and right elements for stack |cs------|', () => {
    const instance = new UndoRedoStack();

    assert.strictEqual(instance.currentIndex === instance.saveIndex, true);
    assert.strictEqual(instance.getLeftElements().length, 0);
    assert.strictEqual(instance.getRightElements().length, 0);
  });

  test('left and right elements for stack |------cs|', () => {
    const instance = new UndoRedoStack();
    instance.pushElement(new EditStackElementTest(1));
    instance.pushElement(new EditStackElementTest(2));
    instance.savePoint();

    assert.strictEqual(instance.currentIndex === instance.saveIndex, true);
    assert.strictEqual(instance.getLeftElements().length, 0);
    assert.strictEqual(instance.getRightElements().length, 0);
  });

  test('left and right elements for stack |---cs---|', () => {
    const instance = new UndoRedoStack();
    instance.pushElement(new EditStackElementTest(1));
    instance.savePoint();
    instance.pushElement(new EditStackElementTest(2));
    instance.undo();

    assert.strictEqual(instance.currentIndex === instance.saveIndex, true);
    assert.strictEqual(instance.getLeftElements().length, 0);
    assert.strictEqual(instance.getRightElements().length, 0);
  });

  test('left and right elements for stack |s-x-c---|', () => {
    const instance = new UndoRedoStack<EditStackElementTest>();
    instance.pushElement(new EditStackElementTest(1));

    assert.strictEqual(instance.currentIndex > instance.saveIndex, true);
    assert.strictEqual(instance.getLeftElements().length, 0);
    assert.strictEqual(instance.getRightElements().length, 1);
    assert.strictEqual(instance.getRightElements()[0].id, 1);
  });

  test('left and right elements for stack |s-xx-c--|', () => {
    const instance = new UndoRedoStack<EditStackElementTest>();
    instance.pushElement(new EditStackElementTest(1));
    instance.pushElement(new EditStackElementTest(2));

    assert.strictEqual(instance.currentIndex > instance.saveIndex, true);
    assert.strictEqual(instance.getLeftElements().length, 0);
    assert.strictEqual(instance.getRightElements().length, 2);
    assert.strictEqual(instance.getRightElements()[0].id, 1);
    assert.strictEqual(instance.getRightElements()[1].id, 2);
  });

  test('left and right elements for stack |---c-x-s|', () => {
    const instance = new UndoRedoStack<EditStackElementTest>();
    instance.pushElement(new EditStackElementTest(1));
    instance.savePoint();
    instance.undo();

    assert.strictEqual(instance.currentIndex < instance.saveIndex, true);
    assert.strictEqual(instance.getLeftElements().length, 1);
    assert.strictEqual(instance.getLeftElements()[0].id, 1);
    assert.strictEqual(instance.getRightElements().length, 0);
  });

  test('left and right elements for stack |--c-xx-s|', () => {
    const instance = new UndoRedoStack<EditStackElementTest>();
    instance.pushElement(new EditStackElementTest(1));
    instance.pushElement(new EditStackElementTest(2));
    instance.savePoint();
    instance.undo();
    instance.undo();

    assert.strictEqual(instance.currentIndex < instance.saveIndex, true);
    assert.strictEqual(instance.getLeftElements().length, 2);
    assert.strictEqual(instance.getLeftElements()[0].id, 1);
    assert.strictEqual(instance.getLeftElements()[1].id, 2);
    assert.strictEqual(instance.getRightElements().length, 0);
  });

  test('left and right elements for stack |-xcxsxx-|', () => {
    const instance = new UndoRedoStack<EditStackElementTest>();
    instance.pushElement(new EditStackElementTest(1));
    instance.pushElement(new EditStackElementTest(2));
    instance.savePoint();
    instance.pushElement(new EditStackElementTest(3));
    instance.pushElement(new EditStackElementTest(4));
    instance.undo();
    instance.undo();
    instance.undo();

    assert.strictEqual(instance.currentIndex < instance.saveIndex, true);
    assert.strictEqual(instance.getLeftElements().length, 1);
    assert.strictEqual(instance.getLeftElements()[0].id, 2);
    assert.strictEqual(instance.getRightElements().length, 0);
  });

  test('left and right elements for stack |-xxsxcx-|', () => {
    const instance = new UndoRedoStack<EditStackElementTest>();
    instance.pushElement(new EditStackElementTest(1));
    instance.pushElement(new EditStackElementTest(2));
    instance.savePoint();
    instance.pushElement(new EditStackElementTest(3));
    instance.pushElement(new EditStackElementTest(4));
    instance.undo();

    assert.strictEqual(instance.currentIndex > instance.saveIndex, true);
    assert.strictEqual(instance.getLeftElements().length, 0);
    assert.strictEqual(instance.getRightElements().length, 1);
    assert.strictEqual(instance.getRightElements()[0].id, 3);
  });
});

class EditStackElementTest implements EditStackElement {
  constructor(public id: number) { }

  undo(): void { }
  redo(): void { }
}
