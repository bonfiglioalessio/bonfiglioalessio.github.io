<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue'

  const mouseX = ref(-100)
  const mouseY = ref(-100)
  const ringX = ref(-100)
  const ringY = ref(-100)

  const isVisible = ref(false)
  const isHovered = ref(false)
  const isMouseDown = ref(false)
  const isEnabled = ref(false)

  let animFrameId: number | null = null

  function onMouseMove(e: MouseEvent) {
    mouseX.value = e.clientX
    mouseY.value = e.clientY

    if (!isVisible.value) {
      isVisible.value = true
      ringX.value = e.clientX
      ringY.value = e.clientY
    }

    // Check if hovering over clickable element
    const target = e.target as HTMLElement | null
    if (target) {
      const interactiveEl = target.closest(
        'a, button, input, textarea, select, [role="button"], .cursor-pointer, .clickable-trigger',
      )
      isHovered.value = !!interactiveEl
    }
  }

  function onMouseDown() {
    isMouseDown.value = true
  }

  function onMouseUp() {
    isMouseDown.value = false
  }

  function onMouseLeave() {
    isVisible.value = false
  }

  function onMouseEnter() {
    isVisible.value = true
  }

  function renderLoop() {
    if (isVisible.value) {
      // Linear interpolation (LERP 0.16) for silky 60fps smooth outer ring follower
      ringX.value += (mouseX.value - ringX.value) * 0.16
      ringY.value += (mouseY.value - ringY.value) * 0.16
    }
    animFrameId = requestAnimationFrame(renderLoop)
  }

  onMounted(() => {
    // Only activate cursor if the device has a precision pointer and supports hover
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches
    ) {
      isEnabled.value = true
      window.addEventListener('mousemove', onMouseMove, { passive: true })
      window.addEventListener('mousedown', onMouseDown, { passive: true })
      window.addEventListener('mouseup', onMouseUp, { passive: true })
      document.addEventListener('mouseleave', onMouseLeave)
      document.addEventListener('mouseenter', onMouseEnter)
      animFrameId = requestAnimationFrame(renderLoop)
    }
  })

  onUnmounted(() => {
    if (animFrameId !== null) {
      cancelAnimationFrame(animFrameId)
    }
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mousedown', onMouseDown)
    window.removeEventListener('mouseup', onMouseUp)
    document.removeEventListener('mouseleave', onMouseLeave)
    document.removeEventListener('mouseenter', onMouseEnter)
  })
</script>

<template>
  <div
    v-if="isEnabled"
    class="cyber-cursor-root pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none"
    :class="{ 'opacity-0': !isVisible, 'opacity-100': isVisible }"
  >
    <!-- Instant Center Dot (Direct Mouse Position) -->
    <div
      class="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#e2f161] shadow-[0_0_8px_#e2f161] transition-transform duration-100 ease-out will-change-transform pointer-events-none"
      :style="{
        transform: `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0) scale(${isHovered ? 1.25 : 1})`,
      }"
    />

    <!-- Smooth Concentric Ring / Expanding Glowing Disc on Hover (LERP Follower) -->
    <div
      class="fixed top-0 left-0 rounded-full border border-[#e2f161] transition-all duration-300 ease-out will-change-transform pointer-events-none flex items-center justify-center"
      :class="[
        isHovered
          ? 'w-14 h-14 bg-[#e2f161]/20 shadow-[0_0_22px_rgba(226,241,97,0.55)] border-[1.5px]'
          : 'w-8 h-8 bg-transparent shadow-[0_0_12px_rgba(226,241,97,0.35)] border border-[#e2f161]',
        isMouseDown ? 'scale-90' : 'scale-100',
      ]"
      :style="{
        transform: `translate3d(${ringX - (isHovered ? 28 : 16)}px, ${ringY - (isHovered ? 28 : 16)}px, 0)`,
      }"
    />
  </div>
</template>

<style scoped>
  .cyber-cursor-root {
    transition: opacity 250ms ease-out;
  }
</style>
