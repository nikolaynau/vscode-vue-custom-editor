<script setup lang="ts">
import { RouterView } from 'vue-router';

if (import.meta.env.MODE === 'development') {
  document.body.classList.add('vscode-dark'); // or vscode-light
}
</script>

<template>
  <RouterView />
</template>
