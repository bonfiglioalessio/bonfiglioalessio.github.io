import { ref } from 'vue'

const isCockpitMinimized = ref(false)
const isCockpitFullscreen = ref(false)
const isCockpitCrashed = ref(false)

export function useCockpitState() {
  return {
    isCockpitMinimized,
    isCockpitFullscreen,
    isCockpitCrashed,
  }
}
