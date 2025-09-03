<script setup lang="ts">
import { Mappings } from '@/resources'

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
const setColor = (color: string) => {
  console.log(color)
  model.value = color
}
</script>

<template>
  <VMenu :offset="20" :close-on-content-click="false">
    <template #activator="{ props }">
      <slot :props="props" name="button" />
    </template>

    <div class="max-w-fit p-2 bg-white rounded shadow-sm">
      <div class="flex flex-col gap-1">
        <template v-for="shade in shades" :key="shade">
          <div class="flex gap-1">
            <template v-for="(color) in colors" :key="color">
              <div class="w-6 h-6 rounded cursor-pointer text-white flex items-center justify-center"
                   :class="`${Mappings.twColorBg[`${color}-${shade}`]} hover:${Mappings.twColorBg[`${color}-${shade+100}`]}`"
                   @click="setColor(`${color}-${shade}`)"
              >
                <VIcon v-if="isColorSet(color, shade)" size="x-small"> mdi-check-bold</VIcon>
              </div>
            </template>
          </div>
        </template>
      </div>
    </div>
  </VMenu>
</template>
