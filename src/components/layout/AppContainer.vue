<script setup lang="ts">
  import { computed } from 'vue'

  interface Props {
    as?: string
    size?: 'default' | 'narrow' | 'wide' | 'full'
  }

  const props = withDefaults(defineProps<Props>(), {
    as: 'div',
    size: 'default',
  })

  const sizeClasses = computed(() => {
    switch (props.size) {
      case 'narrow':
        return 'max-w-5xl'
      case 'wide':
        return 'max-w-[90rem]'
      case 'full':
        return 'max-w-full'
      case 'default':
      default:
        return 'max-w-7xl'
    }
  })
</script>

<template>
  <component :is="as" class="w-full mx-auto px-6 sm:px-8 transition-all" :class="sizeClasses">
    <slot />
  </component>
</template>
