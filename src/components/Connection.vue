<script setup lang="ts">
import { computed, defineEmits, ref, watch } from 'vue'

const props = defineProps<{
  path: string;
  edit: boolean;
  color: string;
  menuInteraction: boolean;
}>()

const emit = defineEmits<{
  (e: 'hover'): void;
  (e: 'leave'): void;
}>()

const shade = computed(() => {
  const [c, s] = props.color.split('-')
  return `${c}-${Number(s) + 200}`
})
const pathClasses = computed(() => `stroke-3 stroke-${props.color} cursor-pointer`)
const hoveredPathClasses = computed(() => `stroke-[6px] stroke-${shade.value} cursor-pointer`)

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

<template lang="pug">
  g
    path(
      v-if="hoveredVisible"
      :d="path"
      :class="hoveredPathClasses"
      fill="none"
      style="pointer-events: visiblePainted"
    )
    path(
      :d="path"
      :class="pathClasses"
      fill="none"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
    )
</template>
