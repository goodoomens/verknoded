import type { Ref } from 'vue'
import { ref } from 'vue'
import { Types } from '@/resources'
import * as Utils from '@/utils'

const mousePosition = ref<Types.MousePosition | null>(null)
const connections = ref<Types.Connection[]>([])
const activeConnection = ref<Types.ConnectionTemp>({fromNodeId: '', toNodeId: ''})
const hoveredConnection = ref<Types.Connection | null>(null)

const hoverConnection = (connection: Types.Connection) =>
    hoveredConnection.value = connection
const resetHoverConnection = () =>
    hoveredConnection.value = null
const resetConnection = () =>
    activeConnection.value = {fromNodeId: '', toNodeId: ''}
const deleteConnection = (id: string) =>
    connections.value = connections.value.filter((c: Types.Connection) => c.id !== id)
const onMouseMove = (e: MouseEvent) => {
    mousePosition.value = {
        x: e.clientX,
        y: e.clientY
    }
}
export default (nodes: Ref<Types.Node[]>, layers: Ref<Types.Layer[]>) => {
    const findNodeById = (id: string) => nodes.value.find(n => n.id === id) || null

    const onMouseUp = (e: MouseEvent) => {
        const target = e.target as HTMLElement
        const targetNodeId = target?.getAttribute('data-node-id')
        const socketType = target?.getAttribute('data-socket-type')
        if (!targetNodeId || socketType !== 'input') {
            resetConnection()
        } else {
            completeConnection(targetNodeId)
        }
        mousePosition.value = null
        document.removeEventListener('mousemove', onMouseMove)
    }

    const startConnection = (e: MouseEvent, nodeId: string, type: 'input' | 'output') => {
        e.stopPropagation()

        if (type === 'output') {
            activeConnection.value.fromNodeId = nodeId
            mousePosition.value = {
                x: e.clientX,
                y: e.clientY
            }
            document.addEventListener('mousemove', onMouseMove)
            document.addEventListener('mouseup', onMouseUp, {once: true})
        }
    }

    const completeConnection = (toNodeId: string) => {
        if (activeConnection.value && activeConnection.value.fromNodeId !== null) {
            connections.value.push({
                id: Utils.generateId(),
                label: '',
                color: 'blue-500',
                fromNodeId: activeConnection.value.fromNodeId,
                toNodeId
            })
            resetConnection()
        }
    }

    const calculateAnchorPosition = (nodeY: number, nodeHeight: number) => nodeY + (nodeHeight / 2)

    const calcPathTemp = () => {
        const fromNode = nodes.value.find(n => n.id === activeConnection.value?.fromNodeId)
        if (!fromNode || !mousePosition.value) return ''
        const fromX = fromNode.position.x + fromNode.size.width
        const fromY = calculateAnchorPosition(fromNode.position.y, fromNode.size.height)
        const toX = mousePosition.value.x
        const toY = mousePosition.value.y
        const midX = (fromX + toX) / 2
        return `M ${fromX},${fromY} C ${midX},${fromY} ${midX},${toY} ${toX},${toY}`
    }

    const calcPath = ({fromNodeId, toNodeId}: Types.Connection) => {
        const fromNode = findNodeById(fromNodeId)
        const toNode = findNodeById(toNodeId)
        if (!fromNode || !toNode) return ''
        const fromX = fromNode.position.x + fromNode.size.width
        const fromY = calculateAnchorPosition(fromNode.position.y, fromNode.size.height)
        const toX = toNode.position.x
        const toY = calculateAnchorPosition(toNode.position.y, toNode.size.height)
        const midX = (fromX + toX) / 2
        return `M ${fromX},${fromY} C ${midX},${fromY} ${midX},${toY} ${toX},${toY}`
    }

    const calcConnectionPoints = ({
                                      fromNodeId,
                                      toNodeId
                                  }: Types.Connection): {
        fromX: number,
        fromY: number,
        toX: number,
        toY: number
    } => {
        const fromNode = findNodeById(fromNodeId)
        const toNode = findNodeById(toNodeId)
        if (!fromNode || !toNode) return {fromX: 0, fromY: 0, toX: 0, toY: 0}
        const fromX = fromNode.position.x + fromNode.size.width
        const fromY = calculateAnchorPosition(fromNode.position.y, fromNode.size.height)
        const toX = toNode.position.x
        const toY = calculateAnchorPosition(toNode.position.y, toNode.size.height)
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
        const fromNode = findNodeById(fromNodeId)
        const toNode = findNodeById(toNodeId)
        const fromNodeLayer = layers.value.find(l => l.id === fromNode?.layer)
        const toNodeLayer = layers.value.find(l => l.id === toNode?.layer)
        const fromNodeVisible = fromNodeLayer?.visible ?? true
        const toNodeVisible = toNodeLayer?.visible ?? true
        return fromNodeVisible && toNodeVisible
    }

    const getConnectedNodes = (connection: Types.Connection) => {
        const fromNode = findNodeById(connection.fromNodeId)
        const toNode = findNodeById(connection.toNodeId)
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
