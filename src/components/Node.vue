<script setup lang="ts">
import { defineEmits, defineProps, withDefaults } from 'vue'
import * as Enums from './@resources/enums'
import * as Types from './@resources/types'

const props = withDefaults(
  defineProps<{
    node: Types.Node
    edit: boolean
    visible: boolean
    selected: boolean
    menuItems: Types.OptionsMenuItem[]
    layerColor?: string
  }>(),
  {
    layerColor: 'grey'
  }
)

const emit = defineEmits<{
  (e: 'drag', event: MouseEvent, node: Types.Node): void
  (e: 'resize', event: MouseEvent, node: Types.Node): void
}>()
</script>

<template lang="pug">
  .z-10.px-12.min-w-fit.min-h-fit.absolute.bg-white.rounded-lg.shadow.cursor-move.select-none.flex.items-center.justify-center.gap-3(
    v-if="visible"
    :style="{ top: node.position.y + 'px', left: node.position.x + 'px', width: node.size.width + 'px', height: node.size.height + 'px' }"
    :class="selected ? 'outline outline-2 outline-blue-200 -outline-offset-1' : ''"
    @mousedown="(e) => emit('drag', e, node)"
  )
    .absolute.top-0.left-0.h-100.flex.items-center(class="-translate-x-1/2")
      .flex.flex-col.gap-2
        slot(name="inputs-left")
    .absolute.top-0.right-0.h-100.flex.items-center(class="translate-x-1/2")
      .flex.flex-col.gap-2
        slot(name="outputs-right")
    .absolute.cursor-se-resize.bottom-0.right-0.w-8.aspect-square.flex.items-start.justify-start(
      @mousedown="(e) => emit('resize', e, node)"
    )
      v-icon.text-gray-400(icon="mdi-resize-bottom-right")

    template(v-if="edit")
      v-text-field(v-model="node.label" variant="outlined" density="compact" hide-details)
      OptionsMenu(:show="edit" :module="Enums.Module.NODE" :node="node" :items="menuItems" rounded @delete-node="console.log")
        template(#default="{ item }")
          v-menu(
            v-if="item.subMenuItems"
            :open-on-focus="false"
            activator="parent"
            open-on-hover
            submenu
            :close-on-content-click="false"
          )
            v-list
              template(v-for="(subMenuItem, idx) in item.subMenuItems" :key="subMenuItem.label")
                v-list-item(@click="subMenuItem.action(node)" density="compact")
                  .flex.items-center.gap-3
                    v-icon(size="small" :color="subMenuItem.color") {{ subMenuItem.icon }}
                    .text-sm {{ subMenuItem.label }}
                hr(v-if="idx < item.subMenuItems.length - 1")
    template(v-else)
      span {{ node.label }}
    v-icon(size="x-small" :color="layerColor") mdi-layers
</template>
