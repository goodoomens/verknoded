<script setup lang="ts">
import { computed, defineEmits, ref, watch } from 'vue'
import { Mappings } from '@/resources'

const props = defineProps<{
  path: string
  edit: boolean
  color: string
  menuInteraction: boolean
}>()

const emit = defineEmits<{
  (e: 'hover'): void
  (e: 'leave'): void
}>()

const shade = ((color: string) => {
  const [c, s] = color.split('-')
  return `${c}-${Number(s) - 200}`
})
const pathClasses = computed(() => `stroke-3 ${Mappings.twColorStroke[props.color]} ${props.edit && `cursor-pointer`}`)
const hoveredPathClasses = computed(() => props.edit && `stroke-[6px] ${Mappings.twColorStroke[shade(props.color)]} cursor-pointer`)

const hovered = ref(false)
const hoveredVisible = ref(false)
const blockedOrHovered = computed(() => props.menuInteraction || hovered.value)

const leave = () => {
  if (blockedOrHovered.value) return
  setTimeout(() => {
    if (blockedOrHovered.value) return
    hoveredVisible.value = false
    emit('leave')
  }, 2000)
}

const onMouseEnter = () => {
  hovered.value = true
  hoveredVisible.value = true
  emit('hover')
}

const onMouseLeave = () => {
  hovered.value = false
  leave()
}

watch(() => props.menuInteraction, leave)
</script>

<template>
  <g>
    <path v-if="hoveredVisible"
          :d="path"
          :class="hoveredPathClasses"
          fill="none"
          style="pointer-events: visiblePainted"
    />
    <path :d="path"
          :class="pathClasses"
          fill="none"
          @mouseenter="onMouseEnter"
          @mouseleave="onMouseLeave"
    />
  </g>
</template>
