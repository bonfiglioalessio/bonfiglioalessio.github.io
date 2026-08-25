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
        return 'max-w-[96rem]'
      case 'full':
        return 'max-w-full'
      case 'default':
      default:
        return 'max-w-7xl'
    }
  })
</script>

<template>
  <component
    :is="as"
    class="w-full mx-auto px-2 sm:px-4 lg:px-4 xl:px-5 transition-all"
    :class="sizeClasses"
  >
    <slot />
  </component>
</template>
