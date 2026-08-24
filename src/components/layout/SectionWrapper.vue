<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useScrollReveal } from '../../composables/useScrollReveal'

  interface Props {
    id?: string
    spacing?: 'default' | 'tight' | 'loose'
    reveal?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    id: undefined,
    spacing: 'default',
    reveal: true,
  })

  const sectionRef = ref<HTMLElement | null>(null)
  useScrollReveal(sectionRef, {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px',
  })

  const spacingClasses = computed(() => {
    switch (props.spacing) {
      case 'tight':
        return 'py-2 sm:py-4'
      case 'loose':
        return 'py-8 sm:py-12'
      case 'default':
      default:
        return 'py-3 sm:py-6'
    }
  })
</script>

<template>
  <section
    :id="id"
    ref="sectionRef"
    class="relative z-10 scroll-mt-24 w-full"
    :class="[spacingClasses, reveal ? 'reveal-on-scroll' : '']"
  >
    <slot />
  </section>
</template>
