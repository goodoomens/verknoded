<script setup lang="ts">
import { defineModel } from 'vue'

const model = defineModel()
</script>

<template lang="pug">
  v-menu(:offset="20" :close-on-content-click="false")
    template(#activator="{ props }")
      slot(name="button" :props="props")
    .max-w-fit.p-2.bg-white.rounded.shadow-sm
      v-text-field.w-64(
        v-model="model"
        label="Label"
        variant="outlined"
        density="compact"
        hide-details
      )
</template>
