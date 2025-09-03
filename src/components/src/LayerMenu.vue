<script setup lang="ts">
import { computed } from 'vue'
import { Types, Enums } from '@/resources'
import { OptionsMenu } from '@/components'
import { useLayers, useNodes } from '@/composables'

defineProps<{
  edit: boolean
}>()

const {
  layers,
  createLayer,
  deleteLayer,
  renameLayer,
  changeLayerColor
} = useLayers()

const {
  selectedNode
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

<template>
  <div class="flex items-start gap-2">
    <div class="bg-white rounded-lg shadow z-20 flex flex-col overflow-hidden">
      <template v-for="layer in layers" :key="layer.id">
        <div class="min-h-8 flex items-center justify-between gap-6">
          <div class="flex items-center gap-6">
            <div class="flex">
              <VBtn class="rounded-0"
                    :color="layer.color"
                    size="small"
                    variant="plain"
                    :icon="layer.visible ? 'mdi-eye' : 'mdi-eye-off'"
                    @click="layer.visible = !layer.visible"
              />
              <VBtn v-if="selectedNode && edit"
                    class="rounded-0"
                    :color="layer.color"
                    size="small"
                    variant="plain"
                    icon="mdi-arrow-right-bold-circle"
                    :disabled="hasSelectedNode(layer)"
                    @click="assignSelectedNodeToLayer(layer)"
              />
            </div>
            <div class="text-sm">{{ layer.label }}</div>
          </div>
          <div>
            <!--            <ColorMenu v-model="layer.color" class="rounded-0">-->
            <!--              <template #button="{ props }">-->
            <!--                <VBtn class="rounded-0" v-bind="props" icon="mdi-palette" variant="plain" size="small"/>-->
            <!--              </template>-->
            <!--            </ColorMenu>-->
            <OptionsMenu v-if="edit" :items="layerMenuItems" :layer="layer" :module="Enums.Module.LAYER"/>
          </div>
        </div>
        <hr class="border-neutral-200"/>
      </template>
      <VBtn prepend-icon="mdi-plus" @click="createLayer">
        <div class="text-sm">Add Layer</div>
      </VBtn>
    </div>
  </div>
</template>
