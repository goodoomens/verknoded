import type { Ref } from 'vue'
import { Types } from '@/resources'
import * as Utils from '@/utils'

export default (
    layers?: Ref<Types.Layer[]>
): Types.Layer =>
    ({
        id: Utils.generateId(),
        label: `Layer ${layers ? layers.value.length + 1 : 1}`,
        color: 'blue',
        visible: true
    })
