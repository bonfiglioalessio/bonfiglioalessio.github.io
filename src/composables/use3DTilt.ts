import { computed, onMounted, onUnmounted, ref, type CSSProperties, type Ref } from 'vue'

export interface TiltOptions {
  maxTilt?: number
  perspective?: number
  scale?: number
  speed?: number
  glare?: boolean
  maxGlare?: number
  disabled?: boolean
}

export function use3DTilt(targetRef: Ref<HTMLElement | null>, options: TiltOptions = {}) {
  const {
    maxTilt = 8,
    perspective = 900,
    scale = 1.025,
    speed = 500,
    glare = true,
    maxGlare = 0.28,
    disabled = false,
  } = options

  const isHovered = ref(false)
  const tiltX = ref(0)
  const tiltY = ref(0)
  const glareX = ref(50)
  const glareY = ref(50)
  const glareOpacity = ref(0)

  let isTouchDevice = false
  let tiltRafId: number | null = null

  function handleMouseEnter() {
    if (disabled || isTouchDevice) return
    isHovered.value = true
    glareOpacity.value = maxGlare
  }

  function handleMouseMove(e: MouseEvent) {
    if (disabled || isTouchDevice || !targetRef.value) return

    if (tiltRafId !== null) return

    const clientX = e.clientX
    const clientY = e.clientY

    tiltRafId = requestAnimationFrame(() => {
      tiltRafId = null
      if (!targetRef.value || !isHovered.value) return

      const rect = targetRef.value.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return

      const normX = (clientX - rect.left) / rect.width
      const normY = (clientY - rect.top) / rect.height

      // Calculate rotation angles
      tiltX.value = (normY - 0.5) * -2 * maxTilt
      tiltY.value = (normX - 0.5) * 2 * maxTilt

      // Calculate glare coordinate
      glareX.value = normX * 100
      glareY.value = normY * 100
      glareOpacity.value = maxGlare
    })
  }

  function handleMouseLeave() {
    if (disabled || isTouchDevice) return
    if (tiltRafId !== null) {
      cancelAnimationFrame(tiltRafId)
      tiltRafId = null
    }
    isHovered.value = false
    tiltX.value = 0
    tiltY.value = 0
    glareOpacity.value = 0
  }

  const transformStyle = computed<CSSProperties>(() => {
    if (disabled || isTouchDevice) return {}

    if (!isHovered.value) {
      return {
        transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
        transformStyle: 'preserve-3d' as const,
        transition: `transform ${speed}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        willChange: 'transform',
      }
    }

    return {
      transform: `perspective(${perspective}px) rotateX(${tiltX.value.toFixed(2)}deg) rotateY(${tiltY.value.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`,
      transformStyle: 'preserve-3d' as const,
      transition: 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)',
      willChange: 'transform',
    }
  })

  const glareStyle = computed<CSSProperties>(() => {
    if (!glare || disabled || isTouchDevice) return { display: 'none' }

    return {
      position: 'absolute' as const,
      inset: '0px',
      borderRadius: 'inherit',
      pointerEvents: 'none' as const,
      zIndex: 2,
      mixBlendMode: 'screen' as const,
      background: `radial-gradient(circle 330px at ${glareX.value}% ${glareY.value}%, rgba(226, 241, 97, ${glareOpacity.value}), rgba(56, 189, 248, ${(glareOpacity.value * 0.4).toFixed(2)}) 40%, transparent 75%)`,
      transition: isHovered.value ? 'opacity 120ms ease-out' : `opacity ${speed}ms ease-out`,
      opacity: glareOpacity.value > 0 ? '1' : '0',
    }
  })

  onMounted(() => {
    isTouchDevice =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      isTouchDevice = true
    }
  })

  onUnmounted(() => {
    if (tiltRafId !== null) {
      cancelAnimationFrame(tiltRafId)
      tiltRafId = null
    }
    isHovered.value = false
  })

  return {
    isHovered,
    transformStyle,
    glareStyle,
    handleMouseEnter,
    handleMouseMove,
    handleMouseLeave,
  }
}
