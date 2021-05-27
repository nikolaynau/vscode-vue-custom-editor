<template>
  <div class="v-keyboard-shortcuts">
    <dl v-for="(item, index) in items" :key="index">
      <dt>{{ item.title }}</dt>
      <dd>
        <v-keybinding-label :value="item.key" />
      </dd>
    </dl>
  </div>
</template>

<script>
export default {
  name: "v-keyboard-shortcuts",
  props: {
    items: {
      type: Array,
      default: () => []
    }
  }
};
</script>

<style>
@import "keyboard-shortcuts";
</style>
