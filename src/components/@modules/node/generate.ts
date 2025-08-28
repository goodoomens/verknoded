import * as Types from '@/components/@resources/types'
import * as Enums from '@/components/@resources/enums'
import * as Utils from '@/components/@utils'

export default (
  nodes: Ref<Types.Node[]>
): Types.Node =>
  ({
    id: Utils.generateUniqueId(),
    label: 'Node',
    state: Enums.NodeState.IDLE,
    layer: null,
    position: {
      x: 20 + nodes.value.length * 20,
      y: 140 + nodes.value.length * 20
    },
    size: {
      width: 320,
      height: 80
    },
    io: {
      input: 1,
      output: 1
    }
  })
