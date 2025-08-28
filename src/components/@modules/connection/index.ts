import { ref, Ref } from 'vue'
import * as Types from '@/components/@resources/types'
import * as Enums from '@/components/@resources/enums'
import * as Utils from '@/components/@utils'

const mousePosition = ref<Types.MousePosition | null>(null)
const connections = ref<Types.Connection[]>([])
const activeConnection = ref<Types.Connection | {}>({})
const hoveredConnection = ref<Types.Connection | null>(null)

const hoverConnection = (connection: Types.Connection) =>
  hoveredConnection.value = connection
const resetHoverConnection = () =>
  hoveredConnection.value = null
const resetConnection = () =>
  activeConnection.value = {}
const deleteConnection = (connection: Types.Connection) =>
  connections.value = connections.value.filter((c: Types.Connection) => c !== connection)
const onMouseMove = (e: MouseEvent) => {
  mousePosition.value = {
    x: e.clientX,
    y: e.clientY
  }
}
export default (nodes: Ref<Types.Node[]>, layers: Ref<Types.Layer[]>, mode: Ref<Enums.Mode>) => {
  const onMouseUp = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    const targetNodeId = target?.getAttribute('data-node-id')
    const socketType = target?.getAttribute('data-socket-type')
    const socketIndex = target?.getAttribute('data-socket-index')
    if (!targetNodeId || socketType !== 'input') {
      resetConnection()
    } else {
      completeConnection(targetNodeId, Number(socketIndex))
    }
    mousePosition.value = null
    document.removeEventListener('mousemove', onMouseMove)
  }

  const startConnection = (e: MouseEvent, node: Types.Node, type: 'input' | 'output', index: number) => {
    e.stopPropagation()
    if (type === 'output') {
      activeConnection.value.fromNodeId = node.id
      activeConnection.value.fromOutputIndex = index
      mousePosition.value = {
        x: e.clientX,
        y: e.clientY
      }
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp, { once: true })

    }
  }

  const completeConnection = (toNodeId: string, toInputIndex: number) => {
    if (activeConnection.value.fromNodeId !== null && activeConnection.value.fromOutputIndex !== null) {
      connections.value.push({
        id: Utils.generateUniqueId(),
        label: '',
        color: 'blue-500',
        fromNodeId: activeConnection.value.fromNodeId,
        fromOutputIndex: activeConnection.value.fromOutputIndex,
        toNodeId,
        toInputIndex
      })
      resetConnection()
    }
  }

  const calculateAnchorPosition = (nodeY: number, nodeHeight: number, totalAnchors: number, index: number) => {
    const gap = 8
    const socketSize = 16

    const anchorsForGaps = mode.value === Enums.Mode.EDIT ? totalAnchors : totalAnchors - 1
    const anchorsForSockets = mode.value === Enums.Mode.EDIT ? (totalAnchors + 1) : totalAnchors
    const socketsTotalHeight = anchorsForSockets * socketSize + anchorsForGaps * gap

    const startY = nodeY + (nodeHeight - socketsTotalHeight) / 2
    return startY + index * (socketSize + gap) + socketSize / 2
  }

  const calcPathTemp = () => {
    const fromNode = nodes.value.find(n => n.id === activeConnection.value.fromNodeId)
    if (!fromNode || !mousePosition.value) return ''
    const fromX = fromNode.position.x + fromNode.size.width
    const fromY = calculateAnchorPosition(fromNode.position.y, fromNode.size.height, fromNode.io.output, activeConnection.value.fromOutputIndex)
    const toX = mousePosition.value.x
    const toY = mousePosition.value.y
    const midX = (fromX + toX) / 2
    return `M ${fromX},${fromY} C ${midX},${fromY} ${midX},${toY} ${toX},${toY}`
  }

  const calcPath = ({
    fromNodeId,
    fromOutputIndex,
    toNodeId,
    toInputIndex
  }: Types.Connection) => {
    const fromNode = nodes.value.find(n => n.id === fromNodeId)
    const toNode = nodes.value.find(n => n.id === toNodeId)
    if (!fromNode || !toNode) return ''
    const fromX = fromNode.position.x + fromNode.size.width
    const fromY = calculateAnchorPosition(fromNode.position.y, fromNode.size.height, fromNode.io.output, fromOutputIndex)
    const toX = toNode.position.x
    const toY = calculateAnchorPosition(toNode.position.y, toNode.size.height, toNode.io.input, toInputIndex)
    const midX = (fromX + toX) / 2
    return `M ${fromX},${fromY} C ${midX},${fromY} ${midX},${toY} ${toX},${toY}`
  }

  const calcConnectionPoints = ({
    fromNodeId,
    fromOutputIndex,
    toNodeId,
    toInputIndex
  }: Types.Connection) => {
    const fromNode = nodes.value.find(n => n.id === fromNodeId)
    const toNode = nodes.value.find(n => n.id === toNodeId)
    if (!fromNode || !toNode) return ''
    const fromX = fromNode.position.x + fromNode.size.width
    const fromY = calculateAnchorPosition(fromNode.position.y, fromNode.size.height, fromNode.io.output, fromOutputIndex)
    const toX = toNode.position.x
    const toY = calculateAnchorPosition(toNode.position.y, toNode.size.height, toNode.io.input, toInputIndex)
    return {
      fromX,
      fromY,
      toX,
      toY
    }
  }

  const isConnectionVisible = ({
    fromNodeId,
    toNodeId
  }: Types.Connection) => {
    const fromNode = nodes.value.find(n => n.id === fromNodeId)
    const toNode = nodes.value.find(n => n.id === toNodeId)
    const fromNodeLayer = layers.value.find(l => l.id === fromNode?.layer)
    const toNodeLayer = layers.value.find(l => l.id === toNode?.layer)
    const fromNodeVisible = fromNodeLayer?.visible ?? true
    const toNodeVisible = toNodeLayer?.visible ?? true
    return fromNodeVisible && toNodeVisible
  }

  const getConnectedNodes = (connection: Types.Connection) => {
    const fromNode = nodes.value.find(n => n.id === connection.fromNodeId)
    const toNode = nodes.value.find(n => n.id === connection.toNodeId)
    return {
      fromNode,
      toNode
    }
  }

  return {
    connections,
    activeConnection,
    hoveredConnection,
    hoverConnection,
    resetHoverConnection,
    startConnection,
    deleteConnection,
    mousePosition,
    calcPathTemp,
    calcPath,
    calcConnectionPoints,
    isConnectionVisible,
    getConnectedNodes
  }
}
