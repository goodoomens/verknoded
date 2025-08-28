import * as Types from '@/components/@resources/types'
import { ref } from 'vue'
import generate from './generate'

const layers = ref<Types.Layer[]>([])

export default () => {
  const createLayer = () => layers.value.push(generate(layers))
  const deleteLayer = (layer: Types.Layer) => layers.value = layers.value.filter((l: Types.Layer) => l !== layer)
  const renameLayer = (layer: Types.Layer) => layer.label = prompt('Enter a new label', layer.label) || layer.label
  const changeLayerColor = (layer: Types.Layer) => layer.color = prompt('Enter a new color', layer.color) || layer.color
  const getNodeLayer = (node: Types.Node) => layers.value.find((layer: Types.Layer) => layer.id === node.layer)
  const isNodeVisible = (node: Types.Node) => getNodeLayer(node)?.visible ?? true
  return {
    layers,
    createLayer,
    deleteLayer,
    renameLayer,
    changeLayerColor,
    getNodeLayer,
    isNodeVisible
  }
}
