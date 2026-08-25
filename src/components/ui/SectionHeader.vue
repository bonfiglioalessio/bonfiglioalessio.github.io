<script setup lang="ts">
  import { ref } from 'vue'
  import { useScrollReveal } from '../../composables/useScrollReveal'

  interface Props {
    sectionNumber: string
    title: string
    statusBadge?: string
    description?: string
    reveal?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    statusBadge: undefined,
    description: undefined,
    reveal: true,
  })

  const headerRef = ref<HTMLElement | null>(null)

  if (props.reveal) {
    useScrollReveal(headerRef, {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px',
    })
  }
</script>

<template>
  <div ref="headerRef" class="space-y-4" :class="reveal ? 'reveal-on-scroll' : ''">
    <div class="flex flex-wrap items-center justify-between gap-4 border-b border-lime-400/15 pb-4">
      <div class="flex items-baseline gap-3">
        <span class="text-lime-400 font-mono text-sm drop-shadow-[0_0_8px_#e2f161]">{{
          sectionNumber
        }}</span>
        <h2
          class="text-2xl sm:text-3xl font-bold text-slate-100 font-display tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
        >
          {{ title }}
        </h2>
      </div>

      <div class="flex items-center gap-3">
        <span
          v-if="statusBadge"
          class="text-xs text-lime-400 font-mono tracking-wider hidden sm:inline drop-shadow-[0_0_6px_#e2f161]"
        >
          {{ statusBadge }}
        </span>
        <slot name="action" />
      </div>
    </div>

    <p
      v-if="description || $slots.description"
      class="text-xs sm:text-sm text-slate-400 font-mono max-w-xl leading-relaxed"
    >
      <slot name="description">
        {{ description }}
      </slot>
    </p>
  </div>
</template>
