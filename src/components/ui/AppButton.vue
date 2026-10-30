<script setup lang="ts">
  import { computed } from 'vue'
  import { useAudioSynth } from '../../composables/useAudioSynth'

  interface Props {
    as?: 'button' | 'a'
    href?: string
    target?: string
    rel?: string
    variant?: 'primary' | 'outline' | 'ghost' | 'chip'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
    shine?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    as: 'button',
    href: undefined,
    target: undefined,
    rel: undefined,
    variant: 'primary',
    size: 'md',
    disabled: false,
    type: 'button',
    shine: true,
  })

  const { playClick } = useAudioSynth()

  const computedRel = computed(() => {
    if (props.rel) return props.rel
    if (props.target === '_blank') return 'noopener noreferrer'
    return undefined
  })

  const variantClasses = computed(() => {
    switch (props.variant) {
      case 'primary':
        return 'bg-lime-400 hover:bg-lime-300 text-black font-extrabold hover:scale-105 active:scale-95'
      case 'outline':
        return 'border border-white/15 hover:border-lime-400/50 bg-dark-900/80 text-slate-200 hover:text-lime-400 hover:scale-105 active:scale-95'
      case 'ghost':
        return 'bg-transparent text-slate-400 hover:text-lime-400 hover:bg-lime-400/10'
      case 'chip':
        return 'bg-dark-900/80 border border-white/10 text-slate-300 hover:text-lime-400 hover:border-lime-400/50'
      default:
        return ''
    }
  })

  const sizeClasses = computed(() => {
    switch (props.size) {
      case 'sm':
        return 'text-[11px] px-3.5 py-1.5 rounded-lg gap-1.5'
      case 'lg':
        return 'text-xs sm:text-sm px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl gap-2.5 font-extrabold tracking-wide'
      case 'md':
      default:
        return 'text-xs px-4 py-2.5 rounded-xl gap-2 font-semibold'
    }
  })
</script>

<template>
  <component
    :is="as"
    :href="href"
    :target="target"
    :rel="computedRel"
    :type="as === 'button' ? type : undefined"
    :disabled="disabled"
    class="relative overflow-hidden group/btn inline-flex items-center justify-center font-sans transition-transform transition-colors duration-200 cursor-pointer select-none disabled:opacity-50 disabled:pointer-events-none"
    :class="[variantClasses, sizeClasses]"
    @click="playClick"
  >
    <!-- Inner Content (Slot Icons & Text) -->
    <span class="relative z-10 inline-flex items-center justify-center gap-inherit">
      <slot name="icon-left" />
      <slot />
      <slot name="icon-right" />
    </span>
  </component>
</template>
