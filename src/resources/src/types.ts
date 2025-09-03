import * as Enums from './enums'

export type NodeField = {
    id: string
    label: string
    type: 'string' | 'number' | 'boolean' | null
    content: string
}

export type Node = {
    id: string
    label: string
    state: Enums.NodeState
    layer: string | null
    position: { x: number, y: number }
    size: { width: number, height: number }
    io: { input: number, output: number }
}

export type Connection = {
    id: string
    label: string
    color: string
    fromNodeId: string
    toNodeId: string
}

export type ConnectionTemp = {
    fromNodeId: string
    toNodeId: string
}

export type ConnectedNodes = {
    fromNode: Node,
    toNode: Node
}

export type Layer = {
    id: string
    label: string
    color: string
    visible: boolean
}

export type OptionsMenuItem = {
    label: string,
    icon: string,
    color?: string,
    action?: (arg?: Node | any) => void,
    subMenuItems?: OptionsMenuItem[]
}

export type MousePosition = {
    x: number,
    y: number
}

export type GlobalConfig = {
    gridSize: number
}

export type SocketType = 'input' | 'output'

