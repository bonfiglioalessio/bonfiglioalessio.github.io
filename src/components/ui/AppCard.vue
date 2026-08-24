<script setup lang="ts">
  import { computed } from 'vue'

  interface Props {
    hudReticles?: boolean
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
    rounded?: 'md' | 'xl' | '2xl' | '3xl'
    interactive?: boolean
    as?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    hudReticles: true,
    padding: 'md',
    rounded: '2xl',
    interactive: false,
    as: 'div',
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
  <component
    :is="as"
    class="space-floating-card"
    :class="[
      paddingClasses,
      roundedClasses,
      hudReticles ? 'has-hud-reticles' : '',
      interactive ? 'transition-all duration-300 hover:scale-[1.02] cursor-pointer' : '',
    ]"
  >
    <slot name="header" />
    <slot />
    <slot name="footer" />
  </component>
</template>
