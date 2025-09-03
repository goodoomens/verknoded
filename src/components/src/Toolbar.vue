<script setup lang="ts">
import { Enums } from '@/resources'
import { useModes, useNodes } from '@/composables'

import { logo } from '@/assets'

const {
  mode,
  toggleMode
} = useModes()

const {
  createNode,
  deleteNode,
  selectedNode
} = useNodes()

</script>

<template>
  <div class="w-full z-10 relative select-none">
    <div class="bg-white flex items-center justify-between px-6 py-4 rounded-lg shadow">
      <div class="flex text-2xl text-blue-500 tracking-wider uppercase">
        <img class="w-48" :src="logo" alt="Verknoded Logo"/>
      </div>
      <span class="text-xs font-weight-bold text-grey-lighten-1">v0.1b</span>
    </div>
    <div class="w-full h-14 absolute top-full left-0 -mt-3 bg-gray-100 rounded-lg flex items-end overflow-hidden"
         style="z-index: -1;">
      <div class="w-full flex justify-between p-2">
        <VBtn variant="text" size="small" prepend-icon="mdi-delete" :disabled="!selectedNode"
              @click="deleteNode(selectedNode)">
          Delete
        </VBtn>
        <div>
          <VBtn variant="text" size="small" prepend-icon="mdi-plus" @click="createNode">New</VBtn>
          <VBtn variant="text" size="small"
                :prepend-icon="mode !== Enums.Mode.EDIT ? 'mdi-pencil' : 'mdi-close'"
                @click="toggleMode(Enums.Mode.EDIT)">Edit
          </VBtn>
          <VBtn variant="text" size="small"
                :prepend-icon="mode !== Enums.Mode.DEV ? 'mdi-dev-to' : 'mdi-close'"
                @click="toggleMode(Enums.Mode.DEV)">Dev
          </VBtn>
        </div>
      </div>
    </div>
  </div>
</template>
