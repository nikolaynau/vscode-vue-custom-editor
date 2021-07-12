<template>
  <div class="v-inspector">vue inspector: data model {{ dataModel }}</div>
</template>

<script>
export default {
  name: "v-inspector",
  props: {
    dataModel: {
      type: Object,
      default: null
    }
  }
};
</script>
