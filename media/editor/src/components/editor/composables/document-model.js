import { reactive, computed } from "vue";
import { isPlainObject } from "is-plain-object";
import { isDefined } from "@/utils/types";
import EventEmitter from "eventemitter3";
import { createButtons } from "./buttons";

export class DocumentModel extends EventEmitter {
  constructor(value) {
    super();
    this.counter = 0;
    this.versionId = 0;
    this.error = null;
    this.buttons = createButtons();
    this._parseValue(value);
  }

  initComputed() {
    this.leftButtons = computed(() =>
      this.buttons.filter(b => b.side === "left"));
    this.rightButtons = computed(() =>
      this.buttons.filter(b => b.side === "right"));
  }

  getValue() {
    return this._buildValue();
  }

  setValue(value) {
    this.error = null;
    this.counter = 0;
    this._increaseVersionId();
    this._parseValue(value);
  }

  toJSON() {
    return this.getValue();
  }

  toString() {
    return JSON.stringify(this.getValue());
  }

  plus(num) {
    this.counter += num;
  }

  replace(num) {
    this.counter = num;
  }

  applyEdits(editOperations, emitChangeEvent = true) {
    const changes = this._applyEditOperations(editOperations);

    if (changes.length > 0) {
      this._increaseVersionId();

      if (emitChangeEvent) {
        this._emitChangeEvent(changes);
      }
    }
  }

  _applyEditOperations(editOperations) {
    if (!Array.isArray(editOperations)) {
      return [];
    }

    const changes = [];
    for (let i = 0, len = editOperations.length; i < len; i++) {
      const result = this._applyEditOperation(editOperations[i]);
      if (result) {
        changes.push(result);
      }
    }

    return changes;
  }

  _applyEditOperation(editOperation) {
    if (!isDefined(editOperation) || !isPlainObject(editOperation)) {
      return null;
    }

    const { name, payload } = editOperation;

    switch (name) {
      case "plus":
        return this._applyPlusOperation(name, payload);
      case "replace":
        return this._applyReplaceOperation(name, payload);
      case "change-button":
        return this._applyChangeButtonOperation(name, payload);
    }

    return null;
  }

  _applyPlusOperation(name, payload) {
    const value = this._getValueFromPayload(payload);
    if (!isDefined(value)) {
      return null;
    }

    this.plus(value);

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
          value: -value
        }
      }
    }
  }

  _applyReplaceOperation(name, payload) {
    const value = this._getValueFromPayload(payload);
    if (!isDefined(value)) {
      return null;
    }

    const oldValue = this.counter;
    this.replace(value);
    const newValue = this.counter;

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
    }
  }

  _applyChangeButtonOperation(name, payload) {
    if (!isDefined(payload) || !isPlainObject(payload)) {
      return null;
    }

    const { buttonId, value } = payload;
    if (typeof value !== "number") {
      return null;
    }

    const button = this.buttons.find(button => button.id === buttonId);
    if (!button) {
      return null;
    }

    const oldValue = button.value;
    button.value = value;
    button.label = value > 0 ? `+${value}` : `${value}`;

    return {
      applied: {
        name,
        payload: {
          buttonId: button.id,
          value: button.value
        }
      },
      reverse: {
        name,
        payload: {
          buttonId: button.id,
          value: oldValue
        }
      }
    }
  }

  _getValueFromPayload(payload) {
    if (!isDefined(payload) || !isPlainObject(payload)) {
      return null;
    }

    const { value } = payload;
    if (typeof value !== "number") {
      return null;
    }

    return value;
  }

  _increaseVersionId() {
    this.versionId = this.versionId + 1;
  }

  _buildValue() {
    return {
      counter: this.counter
    }
  }

  _parseValue(value) {
    if (value === null || value === undefined) {
      return;
    }
    if (isDefined(value) && isPlainObject(value)) {
      try {
        this._parseData(value);
      } catch (err) {
        this.error = err;
      }
      return;
    }
    if (typeof value !== "string") {
      this.error = new Error("Argument value must be a string");
      return;
    }
    if (!value.length) {
      return;
    }
    try {
      const data = JSON.parse(value);
      if (isDefined(data) && isPlainObject(data)) {
        this._parseData(data);
      } else {
        this.error = new Error("The value must contain an object");
      }
    } catch (err) {
      this.error = err;
    }
  }

  _parseData(data) {
    if (typeof data.counter === "number") {
      this.counter = data.counter;
    }
  }

  _emitChangeEvent(changes) {
    this.emit("change", {
      changes,
      versionId: this.versionId
    });
  }
}

export default function createModel(value) {
  const instance = reactive(new DocumentModel(value));
  instance.initComputed();
  return instance;
}
