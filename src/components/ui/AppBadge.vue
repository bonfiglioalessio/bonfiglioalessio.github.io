<script setup lang="ts">
  import { computed } from 'vue'

  type BadgeVariant =
    | 'lime'
    | 'cyan'
    | 'amber'
    | 'pink'
    | 'emerald'
    | 'orange'
    | 'dark'
    | 'core'
    | 'meta'
    | 'stack'
    | 'safe'
    | 'base'
    | 'css'
    | 'pre'
    | 'vcs'

  interface Props {
    variant?: BadgeVariant
    size?: 'sm' | 'md'
    pill?: boolean
    dot?: boolean
    dotColor?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    variant: 'lime',
    size: 'sm',
    pill: false,
    dot: false,
    dotColor: undefined,
  })

  const variantClasses = computed(() => {
    switch (props.variant) {
      case 'lime':
      case 'core':
      case 'stack':
        return 'bg-lime-400/10 text-lime-400 border-lime-400/30'
      case 'cyan':
      case 'safe':
      case 'css':
        return 'bg-cyan-400/10 text-cyan-400 border-cyan-400/30'
      case 'amber':
        return 'bg-amber-400/10 text-amber-400 border-amber-400/30'
      case 'pink':
      case 'pre':
        return 'bg-pink-400/10 text-pink-400 border-pink-400/30'
      case 'emerald':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
      case 'orange':
      case 'vcs':
        return 'bg-orange-400/10 text-orange-400 border-orange-400/30'
      case 'base':
        return 'bg-lime-400/10 text-slate-300 border-lime-400/30'
      case 'meta':
        return 'bg-lime-400/10 text-lime-400 border-lime-400/30'
      case 'dark':
      default:
        return 'bg-dark-850 text-slate-300 border-dark-700'
    }
  })

  const sizeClasses = computed(() => {
    switch (props.size) {
      case 'md':
        return 'text-xs px-3 py-1 gap-1.5'
      case 'sm':
      default:
        return 'text-[10px] px-2.5 py-0.5 gap-1'
    }
  })
</script>

<template>
  <span
    class="inline-flex items-center font-mono font-semibold tracking-wider uppercase border select-none transition-colors"
    :class="[variantClasses, sizeClasses, pill ? 'rounded-full' : 'rounded']"
  >
    <span
      v-if="dot"
      class="w-1.5 h-1.5 rounded-full"
      :class="dotColor || 'bg-current shadow-[0_0_6px_currentColor]'"
    />
    <slot />
  </span>
</template>
