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
        return 'bg-lime-400 hover:bg-lime-300 text-black font-extrabold shadow-[0_0_25px_rgba(226,241,97,0.4)] hover:shadow-[0_0_35px_rgba(226,241,97,0.65)] hover:scale-105 active:scale-95'
      case 'outline':
        return 'space-floating-card text-slate-200 hover:text-lime-400 hover:border-lime-400/50 hover:shadow-[0_0_20px_rgba(226,241,97,0.2)] hover:scale-105 active:scale-95'
      case 'ghost':
        return 'bg-transparent text-slate-400 hover:text-lime-400 hover:bg-lime-400/10'
      case 'chip':
        return 'bg-dark-900/80 border border-lime-400/30 text-lime-400 hover:bg-lime-400 hover:text-black font-mono hover:shadow-[0_0_15px_rgba(226,241,97,0.3)]'
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

  const shineGradientClass = computed(() => {
    if (props.variant === 'primary') {
      return 'from-transparent via-white/50 to-transparent'
    }
    return 'from-transparent via-lime-300/30 to-transparent'
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
    class="relative overflow-hidden group/btn inline-flex items-center justify-center font-mono transition-all duration-300 cursor-pointer select-none disabled:opacity-50 disabled:pointer-events-none"
    :class="[variantClasses, sizeClasses]"
    @click="playClick"
  >
    <!-- Ambient & Hover Light Shine Sweep Ribbon -->
    <span
      v-if="shine"
      class="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-out pointer-events-none bg-gradient-to-r skew-x-[-25deg] w-[180%]"
      :class="shineGradientClass"
    />

    <!-- Inner Content (Slot Icons & Text) -->
    <span class="relative z-10 inline-flex items-center justify-center gap-inherit">
      <slot name="icon-left" />
      <slot />
      <slot name="icon-right" />
    </span>
  </component>
</template>
