<script setup lang="ts">
const model = defineModel()
const shades = [300, 400, 500, 600]
const colors = [
  'gray',
  'red',
  'orange',
  'yellow',
  'lime',
  'green',
  'teal',
  'cyan',
  'blue',
  'indigo',
  'purple',
  'pink'
]

const isColorSet = (color: string, shade: number) => model.value === `${color}-${String(shade)}`
const setColor = (color: string) => model.value = color
</script>

<template lang="pug">
  v-menu(:offset="20" :close-on-content-click="false")
    template(#activator="{ props }")
      v-btn.rounded(v-bind="props" icon="mdi-palette" variant="tonal" size="x-small")
    .max-w-fit.p-2.bg-white.rounded.shadow-sm
      .flex.flex-col.gap-1
        template(v-for="shade in shades" :key="shade")
          .flex.gap-1
            template(v-for="(color, idx) in colors" :key="color")
              .w-6.h-6.rounded.cursor-pointer.text-white.flex.items-center.justify-center(:class="`bg-${color}-${shade} hover:bg-${color}-${shade-200}`" @click="setColor(`${color}-${shade}`)")
                v-icon(v-if="isColorSet(color, shade)" size="x-small") mdi-check-bold
</template>
