<script setup lang="ts">
import { onMounted } from 'vue'
import { Types } from '@/resources'
import { ConnectionWrapper, Node, LayerMenu, Toolbar } from '@/components'
import { useLayers, useModes, useNodes, useConnections } from '@/composables'

const globalConfig: Types.GlobalConfig = {
  gridSize: 20
}

const {
  isNodeVisible,
  layers,
  createLayer
} = useLayers()

const {
  editMode,
  devMode
} = useModes()

const {
  nodes,
  isDragging,
  isResizing,
  dragNode,
  resizeNode,
  isNodeSelected
} = useNodes(globalConfig)

const {
  connections
} = useConnections(nodes, layers)

onMounted(createLayer)
</script>

<template>
  <ConnectionWrapper :edit="editMode"/>
  <div class="h-full min-h-dvh bg-gray-50 p-5 flex flex-col gap-14 relative">

    <Toolbar/>
    <LayerMenu :edit="editMode" class="self-end"/>

    <div class="absolute top-40 w-full h-full flex items-start justify-between">
      <div v-if="devMode" class="text-xs opacity-50 flex">
        <pre class="pr-5">Nodes: {{ nodes }}</pre>
        <pre class="pl-5">Connections: {{ connections }}</pre>
      </div>
    </div>

    <TransitionGroup name="nodes">
      <template v-for="node in nodes" :key="node.id">
        <Node
            :node="node"
            :visible="isNodeVisible(node)"
            :selected="isNodeSelected(node)"
            @drag="dragNode"
            @resize="resizeNode"
        />
      </template>
    </TransitionGroup>

    <svg class="absolute w-full h-full top-[130px] left-2.5" v-if="isDragging || isResizing">
      <defs>
        <pattern id="gridDots"
                 width="20"
                 height="20"
                 patternUnits="userSpaceOnUse"
        >
          <circle class="fill-gray-300" cx="10" cy="10" r="1"/>
        </pattern>
      </defs>
      <rect x="0" y="0" width="100%" height="100%" fill="url(#gridDots)"/>
    </svg>
  </div>
</template>

<style scoped>
.nodes-enter-active,
.nodes-leave-active {
  transition: all 0.1s ease
}

.nodes-enter-from,
.nodes-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.nodes-enter-to,
.nodes-leave-from {
  opacity: 1;
}
</style>
