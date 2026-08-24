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
  })

  const { playClick, playHover } = useAudioSynth()

  const computedRel = computed(() => {
    if (props.rel) return props.rel
    if (props.target === '_blank') return 'noopener noreferrer'
    return undefined
  })

  const variantClasses = computed(() => {
    switch (props.variant) {
      case 'primary':
        return 'bg-lime-400 hover:bg-lime-300 text-black font-extrabold shadow-[0_0_20px_rgba(204,255,0,0.35)] hover:scale-105 active:scale-95'
      case 'outline':
        return 'space-floating-card text-slate-200 hover:text-lime-400 hover:border-lime-400/50 hover:scale-105 active:scale-95'
      case 'ghost':
        return 'bg-transparent text-slate-400 hover:text-lime-400 hover:bg-lime-400/10'
      case 'chip':
        return 'bg-dark-900/80 border border-lime-400/30 text-lime-400 hover:bg-lime-400 hover:text-black font-mono'
      default:
        return ''
    }
  })

  const sizeClasses = computed(() => {
    switch (props.size) {
      case 'sm':
        return 'text-[11px] px-3 py-1.5 rounded-lg gap-1.5'
      case 'lg':
        return 'text-sm px-6 py-4 rounded-xl gap-2.5 font-bold'
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
    class="inline-flex items-center justify-center font-mono transition-all duration-200 cursor-pointer select-none disabled:opacity-50 disabled:pointer-events-none"
    :class="[variantClasses, sizeClasses]"
    @click="playClick"
    @mouseenter="playHover"
  >
    <slot name="icon-left" />
    <slot />
    <slot name="icon-right" />
  </component>
</template>
