<template>
  <div class="v-inspector">
    <v-fieldset b-border label="General">
      <v-field-layout vertical>
        <template #label>
          <v-label truncate>Counter</v-label>
        </template>
        <template #value>
          <v-input
            v-model="counterValueModel"
            type="text"
            placeholder="Enter number"
          >
            <template #icon>
              <span class="codicon codicon-info"></span>
            </template>
          </v-input>
        </template>
      </v-field-layout>
    </v-fieldset>
    <v-fieldset label="Controls">
      <v-field-layout v-for="button in buttonInputs" :key="button.id" vertical>
        <template #label>
          <v-label truncate>Button #{{ button.id }}</v-label>
        </template>
        <template #value>
          <v-input
            :model-value="button.value"
            @update:model-value="onUpdateButton(button, $event)"
            type="text"
            placeholder="Enter number"
          />
        </template>
      </v-field-layout>
    </v-fieldset>
  </div>
</template>

<script>
import { toRefs } from 'vue';
import useInspector from './composables/use-inspector';

export default {
  name: 'v-inspector',
  props: {
    dataModel: {
      type: Object,
      default: null
    },
    editDelay: {
      type: Number,
      default: 500
    }
  },
  emits: ['edit'],
  setup(props, { emit }) {
    const { dataModel, editDelay } = toRefs(props);
    const { counterValueModel, buttonInputs, onUpdateButton } = useInspector({
      dataModel,
      editDelay,
      emit
    });

    return {
      counterValueModel,
      buttonInputs,
      onUpdateButton
    };
  }
};
</script>
