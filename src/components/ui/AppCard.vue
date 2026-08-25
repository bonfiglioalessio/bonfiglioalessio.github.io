<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { use3DTilt } from '../../composables/use3DTilt'

  defineOptions({
    inheritAttrs: false,
  })

  interface Props {
    hudReticles?: boolean
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
    rounded?: 'md' | 'xl' | '2xl' | '3xl'
    interactive?: boolean
    as?: string
    tilt?: boolean
    maxTilt?: number
    glare?: boolean
    spotlight?: boolean
    spotlightColor?: string
    shine?: boolean
    floatAnimation?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    hudReticles: true,
    padding: 'md',
    rounded: '2xl',
    interactive: false,
    as: 'div',
    tilt: false,
    maxTilt: 8,
    glare: true,
    spotlight: true,
    spotlightColor: 'rgba(226, 241, 97, 0.12)',
    shine: true,
    floatAnimation: undefined,
  })

  const cardRef = ref<HTMLElement | null>(null)
  const isHovered = ref(false)
  const mousePos = ref({ x: 50, y: 50 })

  const {
    transformStyle,
    glareStyle,
    handleMouseEnter: tiltEnter,
    handleMouseMove: tiltMove,
    handleMouseLeave: tiltLeave,
  } = use3DTilt(cardRef, {
    maxTilt: props.maxTilt,
    glare: props.glare,
    disabled: !props.tilt,
  })

  function onMouseEnter(e: MouseEvent) {
    isHovered.value = true
    updateMouse(e)
    tiltEnter()
  }

  function onMouseMove(e: MouseEvent) {
    updateMouse(e)
    tiltMove(e)
  }

  function onMouseLeave() {
    isHovered.value = false
    tiltLeave()
  }

  function updateMouse(e: MouseEvent) {
    if (!cardRef.value) return
    const rect = cardRef.value.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    mousePos.value = { x, y }
  }

  const paddingClasses = computed(() => {
    switch (props.padding) {
      case 'none':
        return 'p-0'
      case 'sm':
        return 'p-3.5'
      case 'lg':
        return 'p-7'
      case 'xl':
        return 'p-8 sm:p-10'
      case 'md':
      default:
        return 'p-5 sm:p-6'
    }
  })

  const roundedClasses = computed(() => {
    switch (props.rounded) {
      case 'md':
        return 'rounded-md'
      case 'xl':
        return 'rounded-xl'
      case '3xl':
        return 'rounded-3xl'
      case '2xl':
      default:
        return 'rounded-2xl'
    }
  })
</script>

<template>
  <div v-if="floatAnimation" :class="floatAnimation" class="w-full h-full">
    <component
      :is="as"
      ref="cardRef"
      v-bind="$attrs"
      class="space-floating-card relative overflow-hidden h-full group"
      :class="[
        paddingClasses,
        roundedClasses,
        hudReticles ? 'has-hud-reticles' : '',
        interactive ? 'cursor-pointer' : '',
      ]"
      :style="transformStyle"
      @mouseenter="onMouseEnter"
      @mousemove="onMouseMove"
      @mouseleave="onMouseLeave"
    >
      <!-- Cursor-Following Spotlight Glare -->
      <div
        v-if="spotlight"
        class="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0"
        :style="{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(350px circle at ${mousePos.x}% ${mousePos.y}%, ${spotlightColor}, transparent 70%)`,
        }"
        aria-hidden="true"
      />

      <!-- Diagonal Shine Sweep Ribbon on Hover -->
      <span
        v-if="shine"
        class="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] w-[180%] z-0"
        aria-hidden="true"
      />

      <!-- Dynamic Holographic Glare Layer -->
      <div v-if="glare && tilt" :style="glareStyle" aria-hidden="true" />

      <slot name="header" />
      <slot />
      <slot name="footer" />
    </component>
  </div>

  <component
    :is="as"
    v-else
    ref="cardRef"
    v-bind="$attrs"
    class="space-floating-card relative overflow-hidden group"
    :class="[
      paddingClasses,
      roundedClasses,
      hudReticles ? 'has-hud-reticles' : '',
      interactive ? 'cursor-pointer' : '',
    ]"
    :style="transformStyle"
    @mouseenter="onMouseEnter"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
  >
    <!-- Cursor-Following Spotlight Glare -->
    <div
      v-if="spotlight"
      class="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0"
      :style="{
        opacity: isHovered ? 1 : 0,
        background: `radial-gradient(350px circle at ${mousePos.x}% ${mousePos.y}%, ${spotlightColor}, transparent 70%)`,
      }"
      aria-hidden="true"
    />

    <!-- Diagonal Shine Sweep Ribbon on Hover -->
    <span
      v-if="shine"
      class="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] w-[180%] z-0"
      aria-hidden="true"
    />

    <!-- Dynamic Holographic Glare Layer -->
    <div v-if="glare && tilt" :style="glareStyle" aria-hidden="true" />

    <slot name="header" />
    <slot />
    <slot name="footer" />
  </component>
</template>
