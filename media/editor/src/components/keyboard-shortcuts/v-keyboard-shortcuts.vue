<template>
  <div class="v-keyboard-shortcuts" :class="cssClasses">
    <dl v-for="(item, index) in items" :key="index">
      <dt>{{ item.title }}</dt>
      <dd>
        <v-keybinding-label :value="item.key" />
      </dd>
    </dl>
  </div>
</template>

<script>
import { computed, toRefs } from 'vue';

export default {
  name: 'v-keyboard-shortcuts',
  props: {
    items: {
      type: Array,
      default: () => []
    },
    labelAlign: {
      type: String,
      default: 'left'
    }
  },
  setup(props) {
    const { labelAlign } = toRefs(props);

    const cssClasses = computed(() => ({
      'v-keyboard-shortcuts--label-left': labelAlign.value === 'left',
      'v-keyboard-shortcuts--label-right': labelAlign.value === 'right'
    }));

    return {
      cssClasses
    };
  }
};
</script>

<style>
@import 'keyboard-shortcuts';
</style>
