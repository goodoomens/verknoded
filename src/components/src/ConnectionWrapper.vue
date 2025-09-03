<script setup lang="ts">
import { defineProps, ref } from 'vue'
import { Types } from '@/resources'
import { useNodes, useLayers, useConnections } from '@/composables'
import { ColorMenu, Connection, ConnectionTemp } from '@/components'

defineProps<{
  edit: boolean
}>()

const {nodes} = useNodes()
const {layers} = useLayers()
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
} = useConnections(nodes, layers)

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
  if (!hoveredConnection.value) return
  deleteConnection(hoveredConnection.value.id)
  hoveredConnection.value = null
}

const getShade = (color: string): number => {
  const [_, s] = color.split('-')
  return Number(s)
}

const getTextColor = (color: string) => {
  return getShade(color) > 400 ? 'text-white' : 'text-black'
}

const formatBold = () => {
  if (!hoveredConnection.value) return
  const textarea = document.querySelector('textarea')
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
  if (!hoveredConnection.value) return
  const textarea = document.querySelector('textarea')
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

<template>
  <div class="absolute overflow-visible" v-for="connection in connections" :key="connection.id"
       :style="getConnectionBoundingBox(connection)">
    <div class="relative w-full h-full whitespace-nowrap flex items-center justify-center"
         v-if="isConnectionVisible(connection) && connection.label">
      <div class="rounded px-2 py-1 z-20" :class="`bg-${connection.color}`">
        <div class="text-xs font-weight-medium" :class="getTextColor(connection.color)" v-if="connection.label"
             v-html="connection.label"/>
      </div>
    </div>
  </div>

  <div class="absolute"
       v-if="hoveredConnection && edit"
       :style="getConnectionBoundingBox(hoveredConnection)"
  >
    <div class="relative w-full h-full">
      <div class="absolute bg-white rounded shadow-sm p-2 z-20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
           @mouseenter="menuInteraction = true"
           @mouseleave="menuInteraction = false"
      >
        <div class="flex gap-1">
          <VMenu :offset="20" :close-on-content-click="false" @mouseenter="menuInteraction = true"
                 @mouseleave="menuInteraction = false">
            <template #activator="{ props }">
              <VBtn class="rounded" v-bind="props" icon="mdi-format-text" variant="plain" size="x-small"/>
            </template>
            <VTextarea bg-color="white" variant="outlined" v-model="hoveredConnection.label" rows="3" dense solo flat
                       placeholder="Enter label text..."/>
            <div class="flex justify-end gap-2">
              <VBtn class="rounded" icon="mdi-format-bold" @click="formatBold" variant="tonal" size="x-small"/>
              <VBtn class="rounded" icon="mdi-format-italic" @click="formatItalic" variant="tonal" size="x-small"/>
            </div>
          </VMenu>
          <ColorMenu v-model="hoveredConnection.color" @mouseenter="menuInteraction = true"
                     @mouseleave="menuInteraction = false">
            <template #button="{ props }">
              <VBtn class="rounded" v-bind="props" icon="mdi-palette" variant="plain" size="x-small"/>
            </template>
          </ColorMenu>
          <VBtn class="rounded" color="red" @click="onDelete" icon="mdi-delete" variant="tonal" size="x-small"/>
        </div>
      </div>
    </div>
  </div>

  <svg class="absolute top-0 left-0 w-full h-full outline z-10">
    <ConnectionTemp
        :key="'connectionTemp'"
        :path="calcPathTemp()"
    />
    <Connection
        v-show="isConnectionVisible(connection)"
        v-for="connection in connections"
        :key="connection.id"
        :path="calcPath(connection)"
        :edit="edit"
        :color="connection.color"
        :menu-interaction="menuInteraction"
        @hover="hoverConnection(connection)"
        @leave="resetHoverConnection"
    />
  </svg>
</template>
