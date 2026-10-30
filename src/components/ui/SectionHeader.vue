<script setup lang="ts">
  import { ref } from 'vue'
  import { useScrollReveal } from '../../composables/useScrollReveal'

  interface Props {
    sectionNumber?: string
    title: string
    statusBadge?: string
    description?: string
    reveal?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    sectionNumber: undefined,
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
  <div ref="headerRef" class="space-y-3" :class="reveal ? 'reveal-on-scroll' : ''">
    <div class="flex flex-wrap items-center justify-between gap-4 pb-2 sm:pb-3">
      <div class="flex items-baseline gap-3">
        <span
          v-if="sectionNumber"
          class="text-lime-400 font-sans text-sm tracking-wider font-bold"
        >
          {{ sectionNumber }}
        </span>
        <h2
          class="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-100 font-display tracking-tight"
        >
          {{ title }}
        </h2>
      </div>

      <div class="flex items-center gap-3">
        <span
          v-if="statusBadge"
          class="text-xs text-slate-300 bg-white/5 px-2.5 py-1 rounded-full font-sans tracking-wider hidden sm:inline"
        >
          {{ statusBadge }}
        </span>
        <slot name="action" />
      </div>
    </div>

    <p
      v-if="description || $slots.description"
      class="text-sm sm:text-base text-slate-400 font-sans max-w-2xl leading-relaxed"
    >
      <slot name="description">
        {{ description }}
      </slot>
    </p>
  </div>
</template>
