<script setup lang="ts">
import useNodes from '@/components/@modules/node'
import * as Enums from './@resources/enums'
import useMode from '@/components/@modules/mode'

import logo from '@/assets/verknoded_logo.svg'

const {
  createNode,
  deleteNode,
  selectedNode
} = useNodes()
const {
  mode,
  toggleMode
} = useMode()
</script>

<template lang="pug">
  .w-full.z-10.relative.select-none
    .bg-white.flex.items-center.justify-between.px-6.py-4.rounded-lg.shadow
      .flex.text-2xl.text-blue-500.tracking-wider.uppercase
        img(class="w-48" :src="logo")
      span.text-xs.font-weight-bold.text-grey-lighten-1 v0.1a
    .w-full.h-14.absolute.top-full.left-0.-mt-3.bg-gray-100.rounded-lg.flex.items-end.overflow-hidden(style="z-index: -1;")
      .w-full.flex.justify-between.p-2
        div
          template(v-if="selectedNode")
            v-btn(size="small" prepend-icon="mdi-delete" @click="deleteNode(selectedNode)") Delete
        div
          v-btn(size="small" prepend-icon="mdi-plus" @click="createNode") New
          v-btn(size="small" :prepend-icon="mode !== Enums.Mode.EDIT ? 'mdi-pencil' : 'mdi-close'" @click="toggleMode(Enums.Mode.EDIT)") Edit
          v-btn(size="small" :prepend-icon="mode !== Enums.Mode.DEV ? 'mdi-dev-to' : 'mdi-close'" @click="toggleMode(Enums.Mode.DEV)") Developer
</template>

<style scoped>

</style>
