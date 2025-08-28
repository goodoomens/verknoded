import * as Types from '@/components/@resources/types'
import * as Utils from '@/components/@utils'

export default (
  layers?: Ref<Types.Layer[]>
): Types.Layer =>
  ({
    id: Utils.generateUniqueId(),
    label: `Layer ${layers ? layers.value.length + 1 : 1}`,
    color: 'blue',
    visible: true
  })
