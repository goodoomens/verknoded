<script setup lang="ts">
import { onMounted } from 'vue'
import * as Enums from './@resources/enums'
import * as Types from './@resources/types'
import useNodes from './@modules/node'
import useLayers from './@modules/layer'
import useMode from './@modules/mode'
import useConnections from './@modules/connection'

const globalConfig: Types.GlobalConfig = {
  gridSize: 20
}

const {
  nodes,
  createNode,
  isDragging,
  isResizing,
  selectedNode,
  selectNode
} = useNodes(globalConfig)

const {
  layers,
  createLayer
} = useLayers()

const {
  mode,
  editMode,
  devMode
} = useMode()

const {
  connections,
  createConnection
} = useConnections(nodes, layers, mode)

onMounted(createLayer)
</script>

<template lang="pug">
  Connections(:edit="editMode")
  .h-full.flex.flex-col.items-center.gap-14.z-10
    Toolbar
    .w-full.h-full.flex.items-start.justify-between
      .text-xs.opacity-50.flex
        pre.pr-5.border-r(v-if="devMode") Nodes: {{ nodes }}
        pre.pl-5(v-if="devMode") Connections: {{ connections }}
      Layer
      Nodes(:edit="editMode")

    // Grid
    svg.absolute.w-full.h-full(v-if="isDragging || isResizing" class="top-[90px] left-2.5")
      defs
        pattern#gridDots(
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        )
          circle.fill-gray-300(cx="10" cy="10" r="1")
      rect(x="0" y="0" width="100%" height="100%" fill="url(#gridDots)")
</template>
