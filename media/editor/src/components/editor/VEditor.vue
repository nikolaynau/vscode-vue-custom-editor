<script setup lang="ts">
import {
  reactive,
  toRefs,
  computed,
  ref,
  unref,
  nextTick,
  onMounted
} from 'vue';
import shortcutDefinitions from './utils/shortcuts';
import type { PlusValueCommand, ReplaceValueCommand } from './utils/types';
import type { ButtonDefinition } from './utils/buttons';
import { nextFocusElement, prevFocusElement } from './utils/focus';
import { useDocumentModel } from './composables/use-document-model';
import VEditorButtons from './VEditorButtons.vue';
import VKeyboardShortcuts from '../keyboard-shortcuts/VKeyboardShortcuts.vue';
import VAction from '../action/VAction.vue';

export interface Props {
  value?: string;
  focusOnStart?: boolean;
  keyboardEnabled?: boolean;
  inspectorEnabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  value: undefined,
  focusOnStart: false,
  keyboardEnabled: false,
  inspectorEnabled: false
});

const { value, focusOnStart } = toRefs(props);
const shortcuts = reactive(shortcutDefinitions);
const output = ref<HTMLElement | null>(null);

const { documentData, buttons, error, applyEdits } = useDocumentModel(value);

const leftButtons = computed(() => buttons.filter(b => b.side === 'left'));
const rightButtons = computed(() => buttons.filter(b => b.side === 'right'));

function plus(value: number) {
  applyEdits([{ name: 'plus', payload: { value } } as PlusValueCommand]);
}

function replace(value: number) {
  applyEdits([{ name: 'replace', payload: { value } } as ReplaceValueCommand]);
}

function onBtnPlus(button: ButtonDefinition) {
  plus(button.value);
}

function onClear() {
  replace(0);
  nextTick(focusOutput);
}

function onClick() {
  focusOutput();
}

function onUpKey() {
  plus(1);
}

function onDownKey() {
  plus(-1);
}

function onLeftKey() {
  prevFocusElement();
}

function onRightKey() {
  nextFocusElement();
}

function onDeleteKey() {
  replace(0);
}

function focusOutput() {
  output.value?.focus();
}

onMounted(() => {
  if (unref(focusOnStart)) {
    focusOutput();
  }
});
</script>

<template>
  <div
    class="v-editor"
    @keydown.up="keyboardEnabled ? onUpKey() : null"
    @keydown.down="keyboardEnabled ? onDownKey() : null"
    @keydown.left="keyboardEnabled ? onLeftKey() : null"
    @keydown.right="keyboardEnabled ? onRightKey() : null"
    @keyup.delete="keyboardEnabled ? onDeleteKey() : null"
    @click.self="onClick"
  >
    <div v-if="error" class="v-editor__error">
      The document could not be displayed because the content is in an invalid
      format.
      <br />
      Details: {{ error.message }}
    </div>
    <div v-else class="v-editor__content">
      <div class="v-editor__controls">
        <VEditorButtons :items="leftButtons" @click="onBtnPlus" />
      </div>
      <div ref="output" class="v-editor__input" tabindex="0">
        {{ documentData.counter }}
      </div>
      <div class="v-editor__controls">
        <VAction
          @click="onClear"
          title="Clear Counter (Delete)"
          icon="clear-all"
        />
        <VEditorButtons :items="rightButtons" @click="onBtnPlus" />
      </div>
    </div>
    <div class="v-editor__shortcuts">
      <VKeyboardShortcuts :items="shortcuts" label-align="right" />
    </div>
  </div>
</template>

<style>
@import 'editor';
</style>
