<script setup lang="ts">
import { defineProps } from 'vue'
import * as Types from './@resources/types'
import useNodes from '@/components/@modules/node'
import useLayers from '@/components/@modules/layer'
import useConnections from '@/components/@modules/connection'
import useMode from '@/components/@modules/mode'

const props = defineProps<{
  edit: boolean
}>()

const {
  layers,
  getNodeLayer,
  isNodeVisible
} = useLayers()

const {
  nodes,
  deleteNode,
  dragNode,
  resizeNode,
  isNodeSelected,
  addSocketToNode
} = useNodes()

const {
  mode
} = useMode()

const {
  connections,
  startConnection
} = useConnections(nodes, layers, mode)

const menuItems = (node: Types.Node) => {
  const nodeLayer = getNodeLayer(node)
  return [
    {
      label: nodeLayer?.label || 'Assign to layer',
      icon: 'mdi-layers',
      color: nodeLayer?.color || 'grey',
      subMenuItems: Object.values(layers.value).map((layer: Types.Layer) => ({
        label: layer.label,
        icon: nodeLayer?.id === layer.id ? 'mdi-circle' : 'mdi-circle-outline',
        color: layer.color,
        action: (node: Types.Node) => node.layer = layer.id
      }))
    },
    {
      label: 'Delete',
      icon: 'mdi-delete',
      color: 'red',
      action: deleteNode
    }
  ]
}

const isSocketActuallyConnected = (node: Types.Node, type: 'input' | 'output', index: number) =>
  connections.value.some((connection: Types.Connection) =>
    type === 'input'
      ? connection.toNodeId === node.id && connection.toInputIndex === index
      : connection.fromNodeId === node.id && connection.fromOutputIndex === index
  )

</script>

<template lang="pug">
  transition-group(name="nodes")
    template(
      v-for="node in nodes"
      :key="node.id"
    )
      Node(
        :node="node"
        :edit="edit"
        :visible="isNodeVisible(node)"
        :selected="isNodeSelected(node)"
        :menu-items="menuItems(node)"
        :layer-color="getNodeLayer(node)?.color"
        @drag="dragNode"
        @resize="resizeNode"
      )
        template(#inputs-left)
          template(v-for="(input, idx) in node.io.input")
            Socket(
              v-if="edit"
              :data-node-id="node.id"
              :data-socket-type="'input'"
              :data-socket-index="idx"
              @mousedown="(e) => startConnection(e, node, 'input', idx)"
            )
          AddSocket(v-if="edit" @click="addSocketToNode('input', node)")
        template(#outputs-right)
          template(v-for="(output, idx) in node.io.output")
            Socket(
              v-if="edit"
              :data-node-id="node.id"
              :data-socket-type="'output'"
              :data-socket-index="idx"
              @mousedown="(e) => startConnection(e, node, 'output', idx)"
            )
          AddSocket(v-if="edit" @click="addSocketToNode('output', node)")
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
