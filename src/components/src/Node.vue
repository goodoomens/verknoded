<script setup lang="ts">
import { computed } from 'vue'
import { Types, Enums } from '@/resources'
import { Socket, OptionsMenu } from '@/components'
import { useLayers, useNodes, useConnections, useModes } from '@/composables'

const {
  layers,
  getNodeLayer,
  isNodeVisible
} = useLayers()

const {
  nodes,
  deleteNode,
  isNodeSelected
} = useNodes()

const {
  editMode
} = useModes()

const {
  startConnection
} = useConnections(nodes, layers)

const props = defineProps<{ node: Types.Node }>()
const emit = defineEmits<{
  (e: 'drag', event: MouseEvent, node: Types.Node): void
  (e: 'resize', event: MouseEvent, node: Types.Node): void
}>()

const nodeLayer = computed<Types.Layer | undefined>(() => getNodeLayer(props.node))
const menuItems = computed(() => {
  return [
    {
      label: nodeLayer.value?.label || 'Assign to layer',
      icon: 'mdi-layers',
      color: nodeLayer.value?.color || 'grey',
      subMenuItems: Object.values(layers.value).map((layer: Types.Layer) => ({
        label: layer.label,
        icon: nodeLayer.value?.id === layer.id ? 'mdi-circle' : 'mdi-circle-outline',
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
})

const visible = computed(() => isNodeVisible(props.node))
const selected = computed(() => isNodeSelected(props.node))
</script>

<template>
  <div
      v-show="visible"
      class="absolute z-10 px-6 min-w-fit min-h-fit bg-white rounded-lg shadow cursor-move select-none flex items-center justify-center gap-3"
      :class="selected ? 'outline-2 outline-blue-200 -outline-offset-1' : ''"
      :style="{ top: node.position.y + 'px', left: node.position.x + 'px', width: node.size.width + 'px', height: node.size.height + 'px' }"
      @mousedown="(e) => emit('drag', e, node)"
  >
    <div class="absolute top-0 left-0 h-full flex items-center -translate-x-1/2">
      <div class="flex flex-col gap-2">
        <Socket
            v-if="editMode"
            :data-node-id="node.id"
            data-socket-type="input"
            @mousedown="(e: MouseEvent) => startConnection(e, node.id, 'input')"
        />
      </div>
    </div>

    <div class="absolute top-0 right-0 h-full flex items-center translate-x-1/2">
      <div class="flex flex-col gap-2">
        <Socket
            v-if="editMode"
            :data-node-id="node.id"
            data-socket-type="output"
            @mousedown="(e: MouseEvent) => startConnection(e, node.id, 'output')"
        />
      </div>
    </div>

    <div
        class="absolute bottom-0 right-0 w-8 aspect-square flex items-start justify-start"
        @mousedown="(e) => emit('resize', e, node)"
    >
      <VIcon class="text-gray-400" icon="mdi-resize-bottom-right"/>
    </div>

    <template v-if="editMode">
      <VTextField v-model="node.label" variant="outlined" density="compact" hide-details/>
      <OptionsMenu
          :show="editMode"
          :items="menuItems"
          :module="Enums.Module.NODE"
          :node="node"
          rounded
          @delete-node="console.log"
      >
        <template #default="{ item }">
          <VMenu
              v-if="item.subMenuItems"
              :open-on-focus="false"
              activator="parent"
              open-on-hover
              submenu
              :close-on-content-click="false"
          >
            <VList>
              <template v-for="(subMenuItem, idx) in item.subMenuItems" :key="subMenuItem.label">
                <VListItem @click="subMenuItem.action && subMenuItem.action(node)" density="compact">
                  <div class="flex items-center gap-3">
                    <VIcon size="small" :color="subMenuItem.color">{{ subMenuItem.icon }}</VIcon>
                    <div class="text-sm">{{ subMenuItem.label }}</div>
                  </div>
                </VListItem>
                <hr class="border-neutral-200" v-if="idx < item.subMenuItems.length - 1"/>
              </template>
            </VList>
          </VMenu>
        </template>
      </OptionsMenu>
    </template>

    <template v-else>
      <span>{{ node.label }}</span>
    </template>
    <VIcon size="x-small" :color="nodeLayer?.color || 'grey'">mdi-layers</VIcon>
  </div>
</template>
