<template>
  <div class="v-inspector">
    <v-fieldset b-border label="Some input group">
      <v-field-layout vertical>
        <template #label>
          <v-label truncate>Some property</v-label>
        </template>
        <template #value>
          <v-input
            v-model="form.text"
            type="text"
            placeholder="Enter your text"
          >
            <template #icon>
              <span class="codicon codicon-file-code"></span>
            </template>
          </v-input>
        </template>
      </v-field-layout>
      <v-field-layout vertical>
        <template #label>
          <v-label truncate>Some property</v-label>
        </template>
        <template #value>
          <v-input
            v-model="form.text"
            type="text"
            placeholder="Enter your text"
          >
            <template #icon>
              <span class="codicon codicon-file-code"></span>
            </template>
          </v-input>
        </template>
      </v-field-layout>
    </v-fieldset>
    <v-fieldset label="Some input group">
      <v-field-layout vertical>
        <template #label>
          <v-label truncate>Some property</v-label>
        </template>
        <template #value>
          <v-input
            v-model="form.text"
            type="text"
            placeholder="Enter your text"
          >
            <template #icon>
              <span class="codicon codicon-file-code"></span>
            </template>
          </v-input>
        </template>
      </v-field-layout>
      <v-field-layout vertical>
        <template #label>
          <v-label truncate>Some property</v-label>
        </template>
        <template #value>
          <v-input
            v-model="form.text"
            type="text"
            placeholder="Enter your text"
          >
            <template #icon>
              <span class="codicon codicon-file-code"></span>
            </template>
          </v-input>
        </template>
      </v-field-layout>
    </v-fieldset>
  </div>
</template>

<script>
export default {
  name: "v-inspector",
  props: {
    dataModel: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      form: {
        text: null
      }
    };
  }
};
</script>
