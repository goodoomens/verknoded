<script setup lang="ts">
import { defineProps, withDefaults } from 'vue'
import { Types, Enums } from '@/resources'

const props = withDefaults(defineProps<{
  items: Types.OptionsMenuItem[]
  module?: Enums.Module
  node?: Types.Node
  layer?: any | null
  rounded?: boolean
}>(), {
  rounded: false
})

const onClick = (item: Types.OptionsMenuItem) => {
  if (!item.action) return
  switch (props.module) {
    case Enums.Module.NODE:
      item.action(props.node)
      break
    case Enums.Module.LAYER:
      item.action(props.layer)
      break
    default:
      item.action()
  }
}
</script>

<template>
  <VMenu :close-on-content-click="false">
    <template #activator="{ props }">
      <VBtn v-bind="props" :class="rounded ? 'rounded' : 'rounded-0'" variant="plain" icon="mdi-dots-vertical"
            size="small"></VBtn>
    </template>
    <VList>
      <template v-for="(item, idx) in items" :key="item.label">
        <VListItem @click="onClick(item)" density="compact">
          <slot :item="item"></slot>
          <div class="flex items-center gap-6 justify-between">
            <div class="flex items-center gap-3">
              <VIcon size="small" :color="item.color">{{ item.icon }}</VIcon>
              <div class="text-sm">{{ item.label }}</div>
            </div>
            <VIcon size="small" v-if="item.subMenuItems">mdi-chevron-right</VIcon>
          </div>
        </VListItem>
        <hr class="border-neutral-200" v-if="idx &lt; items.length - 1"/>
      </template>
    </VList>
  </VMenu>
</template>
