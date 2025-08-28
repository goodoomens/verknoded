import { computed, ref } from 'vue'
import * as Enums from '@/components/@resources/enums'

const mode = ref<Enums.Mode>(Enums.Mode.EDIT)
const toggleMode = (newMode: Enums.Mode) => {
  mode.value = mode.value === newMode ? Enums.Mode.LIVE : newMode
}
const editMode = computed<boolean>(() => mode.value === Enums.Mode.EDIT)
const devMode = computed<boolean>(() => mode.value === Enums.Mode.DEV)

export default () => {
  return {
    mode,
    toggleMode,
    editMode,
    devMode
  }
}
