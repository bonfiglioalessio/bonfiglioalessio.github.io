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
    floatAnimation: undefined,
  })

  const cardRef = ref<HTMLElement | null>(null)

  const { transformStyle, glareStyle, handleMouseEnter, handleMouseMove, handleMouseLeave } =
    use3DTilt(cardRef, {
      maxTilt: props.maxTilt,
      glare: props.glare,
      disabled: !props.tilt,
    })

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
      class="space-floating-card relative overflow-hidden h-full"
      :class="[
        paddingClasses,
        roundedClasses,
        hudReticles ? 'has-hud-reticles' : '',
        interactive ? 'cursor-pointer' : '',
      ]"
      :style="transformStyle"
      @mouseenter="handleMouseEnter"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
    >
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
    class="space-floating-card relative overflow-hidden"
    :class="[
      paddingClasses,
      roundedClasses,
      hudReticles ? 'has-hud-reticles' : '',
      interactive ? 'cursor-pointer' : '',
    ]"
    :style="transformStyle"
    @mouseenter="handleMouseEnter"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <!-- Dynamic Holographic Glare Layer -->
    <div v-if="glare && tilt" :style="glareStyle" aria-hidden="true" />

    <slot name="header" />
    <slot />
    <slot name="footer" />
  </component>
</template>
