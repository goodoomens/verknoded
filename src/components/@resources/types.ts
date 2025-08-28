import * as Enums from './enums'

export interface NodeField {
  id: string
  label: string
  type: 'string' | 'number' | 'boolean' | null
  content: string
}

export interface Node {
  id: string
  label: string
  state: Enums.NodeState
  layer: string | null
  position: { x: number, y: number }
  size: { width: number, height: number }
  io: { input: number, output: number }
}

export interface Connection {
  id: string
  label: string
  color: string
  fromNodeId: string
  fromOutputIndex: number
  toNodeId: string
  toInputIndex: number
}

export interface ConnectedNodes {
  fromNode: Node,
  toNode: Node
}

export interface Layer {
  id: string
  label: string
  color: string
  visible: boolean
}

export interface OptionsMenuItem {
  label: string
  icon: string
  color?: string
  action?: (arg?: Node | any) => void
  subMenuItems?: OptionsMenuItem[]
}

export interface MousePosition {
  x: number
  y: number
}

export interface GlobalConfig {
  gridSize: number
}

export type SocketType = 'input' | 'output'

