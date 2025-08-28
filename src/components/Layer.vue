<script setup lang="ts">
import * as Types from './@resources/types'
import * as Enums from './@resources/enums'
import useLayers from '@/components/@modules/layer'
import useNodes from '@/components/@modules/node'

const {
  layers,
  createLayer,
  deleteLayer,
  renameLayer,
  changeLayerColor
} = useLayers()

const {
  selectedNode,
  selectNode
} = useNodes()

const layerMenuItems = computed(() => [
  {
    label: 'Rename',
    icon: 'mdi-rename',
    action: renameLayer
  },
  {
    label: 'Color',
    icon: 'mdi-palette',
    action: changeLayerColor
  },
  {
    label: 'Delete',
    icon: 'mdi-delete',
    color: 'red',
    action: deleteLayer
  }
])

const hasSelectedNode = (layer: Types.Layer) => layer.id === selectedNode?.value?.layer
const assignSelectedNodeToLayer = (layer: Types.Layer) => {
  if (!selectedNode.value) return
  selectedNode.value.layer = layer.id
}
</script>

<template lang="pug">
  .flex.items-start.gap-2
    .flex.flex-col.z-20.rounded-l.overflow-hidden(v-if="selectedNode")
      template(v-for="(layer, idx) in layers" :key="layer.id")

        hr.opacity-0

    .bg-white.rounded-lg.shadow.z-20.flex.flex-col.overflow-hidden
      template(v-for="(layer, idx) in layers" :key="layer.id")
        .min-h-8.flex.items-center.justify-between.gap-6
          .flex.items-center.gap-6
            .flex
              v-btn.rounded-0(size="small" :color="layer.color" variant="plain" :icon="layer.visible ? 'mdi-eye' : 'mdi-eye-off'" @click="layer.visible = !layer.visible")
              v-btn.rounded-0(size="small" :color="layer.color" v-if="selectedNode" icon="mdi-arrow-right-bold-circle" :disabled="hasSelectedNode(layer)" @click="assignSelectedNodeToLayer(layer)")
            .text-sm {{ layer.label }}
          OptionsMenu(:items="layerMenuItems" :layer="layer" :module="Enums.Module.LAYER")
        hr
      v-btn(prepend-icon="mdi-plus" @click="createLayer")
        .text-sm Add Layer
</template>
