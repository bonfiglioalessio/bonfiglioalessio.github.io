<script setup lang="ts">
  import { computed } from 'vue'

  interface Props {
    id?: string
    spacing?: 'default' | 'tight' | 'loose'
  }

  const props = withDefaults(defineProps<Props>(), {
    id: undefined,
    spacing: 'default',
  })

  const spacingClasses = computed(() => {
    switch (props.spacing) {
      case 'tight':
        return 'py-8 sm:py-12'
      case 'loose':
        return 'py-16 sm:py-28'
      case 'default':
      default:
        return 'py-12 sm:py-20'
    }
  })
</script>

<template>
  <section :id="id" class="relative z-10 scroll-mt-24 w-full" :class="spacingClasses">
    <slot />
  </section>
</template>
