<script setup lang="ts">
import { toRefs } from 'vue';
import VFieldLayout from '../fieldset/VFieldLayout.vue';
import VFieldset from '../fieldset/VFieldset.vue';
import VInput from '../input/VInput.vue';
import VLabel from '../label/VLabel.vue';
import {
  useInspector,
  type InspectorDataModel
} from './composables/use-inspector';
import type { EditCommandArray } from '../editor/utils/types';

export interface Props {
  dataModel?: InspectorDataModel;
  editDelay?: number;
}

const props = withDefaults(defineProps<Props>(), {
  dataModel: undefined,
  editDelay: 500
});

const emit = defineEmits<{
  (e: 'edit', edits: EditCommandArray): void;
}>();

const { dataModel } = toRefs(props);

const { currentValue, inputs, onButtonInput } = useInspector(dataModel, {
  editDelay: props.editDelay,
  onEdit: edits => {
    emit('edit', edits);
  }
});
</script>

<template>
  <div class="v-inspector">
    <VFieldset b-border label="General">
      <VFieldLayout vertical>
        <template #label>
          <VLabel truncate>Counter</VLabel>
        </template>
        <template #value>
          <VInput v-model="currentValue" type="text" placeholder="Enter number">
            <template #icon>
              <span class="codicon codicon-info"></span>
            </template>
          </VInput>
        </template>
      </VFieldLayout>
    </VFieldset>
    <VFieldset label="Controls">
      <VFieldLayout v-for="{ btnId, value } in inputs" :key="btnId" vertical>
        <template #label>
          <VLabel truncate>Button #{{ btnId }}</VLabel>
        </template>
        <template #value>
          <VInput
            :model-value="value"
            @update:model-value="onButtonInput(btnId, $event)"
            type="text"
            placeholder="Enter number"
          />
        </template>
      </VFieldLayout>
    </VFieldset>
  </div>
</template>
