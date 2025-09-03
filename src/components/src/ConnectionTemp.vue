<script setup lang="ts">
defineProps<{
  path: string
}>()
</script>

<template>
  <path
      :d="path"
      fill="none"
      stroke-width="2"
      stroke-dasharray="5, 5"
      stroke="rgb(147 197 253)"
  />
</template>
