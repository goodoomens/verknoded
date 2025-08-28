<script setup lang="ts">
import { defineProps, withDefaults } from 'vue'
import type { Node, OptionsMenuItem } from './@resources/types'
import { Module } from './@resources/enums'

const props = withDefaults(defineProps<{
  items: OptionsMenuItem[]
  module?: Module
  node?: Node | null
  layer?: any | null
  rounded?: boolean
}>(), {
  rounded: false
})

const onClick = (item: OptionsMenuItem) => {
  if (!item.action) return
  switch (props.module) {
    case Module.NODE:
      item.action(props.node)
      break
    case Module.LAYER:
      item.action(props.layer)
      break
    default:
      item.action()
  }
}
</script>

<template lang="pug">
  v-menu(:close-on-content-click="false")
    template(#activator="{ props }")
      v-btn(v-bind="props" :class="rounded ? 'rounded' : 'rounded-0'" variant="plain" icon="mdi-dots-vertical" size="small")
    v-list
      template(v-for="(item, idx) in items" :key="item.label")
        v-list-item(
          @click="onClick(item)"
          density="compact"
        )
          slot(:item="item")
          .flex.items-center.gap-6.justify-between
            .flex.items-center.gap-3
              v-icon(size="small" :color="item.color") {{ item.icon }}
              .text-sm {{ item.label }}
            v-icon(size="small" v-if="item.subMenuItems") mdi-chevron-right
        hr(v-if="idx < items.length - 1")
</template>
