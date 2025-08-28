<script setup lang="ts">
import ColorMenu from '@/components/ColorMenu.vue'
import LabelMenu from '@/components/LabelMenu.vue'
import { defineProps, ref } from 'vue'
import * as Types from './@resources/types'
import useNodes from './@modules/node'
import useLayers from './@modules/layer'
import useMode from './@modules/mode'
import useConnections from './@modules/connection'

defineProps<{
  edit: boolean
}>()

const { nodes } = useNodes()
const { layers } = useLayers()
const { mode } = useMode()
const {
  connections,
  deleteConnection,
  calcPathTemp,
  calcPath,
  isConnectionVisible,
  calcConnectionPoints,
  hoveredConnection,
  hoverConnection,
  resetHoverConnection
} = useConnections(nodes, layers, mode)

const getConnectedNodeCoords = (connection: Types.Connection) => {
  const {
    fromX,
    fromY,
    toX,
    toY
  } = calcConnectionPoints(connection)
  return {
    position: {
      x: fromX < toX ? fromX : toX,
      y: fromY < toY ? fromY : toY
    },
    size: {
      width: fromX < toX ? toX - fromX : fromX - toX,
      height: fromY < toY ? toY - fromY : fromY - toY
    }
  }
}

const getConnectionBoundingBox = (connection: Types.Connection) => {
  const coords = getConnectedNodeCoords(connection)
  return `
    top: ${coords.position.y}px;
    left: ${coords.position.x}px;
    width: ${coords.size.width}px;
    height: ${coords.size.height}px;
  `
}

const menuInteraction = ref(false)
const onDelete = () => {
  deleteConnection(hoveredConnection.value)
  hoveredConnection.value = null
}

const setConnectionColor = (color: string) => {
  hoveredConnection.value.color = color
}

const getShade = (color: string) => {
  const [c, s] = color.split('-')
  return s
}

const getTextColor = (color: string) => {
  return getShade(color) > 400 ? 'text-white' : 'text-black'
}

const formatBold = () => {
  const textarea = document.querySelector('textarea') // Target the v-text-area
  if (textarea) {
    const {
      selectionStart,
      selectionEnd
    } = textarea
    const text = hoveredConnection.value.label
    hoveredConnection.value.label =
      text.slice(0, selectionStart) +
      `<b>${text.slice(selectionStart, selectionEnd)}</b>` +
      text.slice(selectionEnd)
  }
}

const formatItalic = () => {
  const textarea = document.querySelector('textarea') // Target the v-text-area
  if (textarea) {
    const {
      selectionStart,
      selectionEnd
    } = textarea
    const text = hoveredConnection.value.label
    hoveredConnection.value.label =
      text.slice(0, selectionStart) +
      `<i>${text.slice(selectionStart, selectionEnd)}</i>` +
      text.slice(selectionEnd)
  }
}
</script>

<template lang="pug">
  // Labels
  .absolute.overflow-visible(v-for="connection in connections" :key="connection.id" :style="getConnectionBoundingBox(connection)")
    .relative.w-full.h-full.whitespace-nowrap.flex.items-center.justify-center(v-if="isConnectionVisible(connection) && connection.label")
      .rounded.px-2.py-1.z-20(:class="`bg-${connection.color}`")
        .text-xs.font-weight-medium(:class="getTextColor(connection.color)" v-if="connection.label" v-html="connection.label")

  // Menu
  .absolute(
    v-if="hoveredConnection"
    :style="getConnectionBoundingBox(hoveredConnection)"
  )
    .relative.w-full.h-full
      .absolute.bg-white.rounded.shadow-sm.p-2.z-20(
        @mouseenter="menuInteraction = true"
        @mouseleave="menuInteraction = false"
        class="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      )
        .flex.gap-1
          v-menu(:offset="20" :close-on-content-click="false"  @mouseenter="menuInteraction = true" @mouseleave="menuInteraction = false")
            template(#activator="{ props }")
              v-btn.rounded(v-bind="props" icon="mdi-format-text" variant="tonal" size="x-small")
            v-textarea(bg-color="white" variant="outlined" v-model="hoveredConnection.label" rows="3" dense solo flat placeholder="Enter label text...")
            .flex.justify-end.gap-2
              v-btn.rounded(icon="mdi-format-bold" @click="formatBold" variant="tonal" size="x-small")
              v-btn.rounded(icon="mdi-format-italic" @click="formatItalic" variant="tonal" size="x-small")
          //LabelMenu(v-model="hoveredConnection.label" @mouseenter="menuInteraction = true" @mouseleave="menuInteraction = false")
          //  template(#button="{ props }")
          //    v-btn.rounded(v-bind="props" icon="mdi-text-short" variant="tonal" size="x-small")
          ColorMenu(v-model="hoveredConnection.color" @mouseenter="menuInteraction = true" @mouseleave="menuInteraction = false")
            template(#button="{ props }")
              v-btn.rounded(v-bind="props" icon="mdi-palette" variant="tonal" size="x-small")
          v-btn.rounded(color="red" @click="onDelete" icon="mdi-delete" variant="tonal" size="x-small")

  // Connections
  svg.absolute.top-0.left-0.w-full.h-full.outline.z-10
    ConnectionTemp(
      :key="'connectionTemp'"
      :path="calcPathTemp()"
    )
    Connection(
      v-show="isConnectionVisible(connection)"
      v-for="connection in connections"
      :key="connection.id"
      :path="calcPath(connection)"
      :edit="edit"
      :color="connection.color"
      :menu-interaction="menuInteraction"
      @hover="hoverConnection(connection)"
      @leave="resetHoverConnection"
    )
</template>
