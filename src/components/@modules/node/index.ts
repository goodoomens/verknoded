import { computed, ref } from 'vue'
import * as Types from '@/components/@resources/types'
import * as Enums from '@/components/@resources/enums'
import * as Utils from '@/components/@utils'
import { InitialNodeState } from './types'
import generate from './generate'

const nodes = ref<Types.Node[]>([])
const selectedNode = ref<Types.Node | null>(null)
const selectNode = (node: Types.Node) => selectedNode.value = node
const createNode = () => nodes.value.push(generate(nodes))
const deleteNode = (node: Types.Node) => nodes.value = nodes.value.filter((n: Types.Node) => n !== node)
const isNodeSelected = (node: Types.Node) => selectedNode.value === node
const isDragging = computed(() => selectedNode.value?.state === Enums.NodeState.DRAGGING)
const isResizing = computed(() => selectedNode.value?.state === Enums.NodeState.RESIZING)
const addSocketToNode = (type: Types.SocketType, node: Types.Node) => node.io[type]++

export default (globalConfig?: Types.GlobalConfig) => {
  const gridSize = globalConfig?.gridSize ?? 20

  const startInteraction = (
    event: MouseEvent,
    node: Types.Node,
    interactionType: Enums.NodeState,
    onMove: (deltaX: number, deltaY: number, initialNode: InitialNodeState) => void
  ) => {
    if (node.state !== Enums.NodeState.IDLE) return
    selectNode(node)
    node.state = interactionType

    const {
      clientX: startX,
      clientY: startY
    } = event
    const initialNodeState: InitialNodeState = {
      position: { ...node.position },
      size: { ...node.size }
    }

    const onMouseMove = ({
      clientX,
      clientY
    }: MouseEvent) => {
      const deltaX = clientX - startX
      const deltaY = clientY - startY
      onMove(deltaX, deltaY, initialNodeState)
    }

    const stopInteraction = () => {
      node.state = Enums.NodeState.IDLE
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', stopInteraction)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', stopInteraction, { once: true })
  }

  const dragNode = (event: MouseEvent, node: Types.Node) => {
    startInteraction(
      event,
      node,
      Enums.NodeState.DRAGGING,
      (deltaX, deltaY, initialNode) => {
        node.position.x = Utils.snapToGrid(initialNode.position.x + deltaX, gridSize)
        node.position.y = Utils.snapToGrid(initialNode.position.y + deltaY, gridSize)
      })
  }

  const resizeNode = (event: MouseEvent, node: Types.Node) => {
    startInteraction(
      event,
      node,
      Enums.NodeState.RESIZING,
      (deltaX, deltaY, initialNode) => {
        node.size.width = Utils.snapToGrid(initialNode.size.width + deltaX, gridSize)
        node.size.height = Utils.snapToGrid(initialNode.size.height + deltaY, gridSize)
      })
  }

  return {
    nodes,
    selectedNode,
    createNode,
    deleteNode,
    dragNode,
    isDragging,
    resizeNode,
    isResizing,
    isNodeSelected,
    addSocketToNode
  }
}
