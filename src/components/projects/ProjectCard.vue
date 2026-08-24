<script setup lang="ts">
  import type { Project } from '../../types/portfolio'
  import AppCard from '../ui/AppCard.vue'
  import AppBadge from '../ui/AppBadge.vue'
  import AppButton from '../ui/AppButton.vue'

  defineProps<{
    project: Project
    floatAnimation?: string
  }>()
</script>

<template>
  <AppCard
    padding="md"
    rounded="2xl"
    :hud-reticles="true"
    :tilt="true"
    :float-animation="floatAnimation"
    class="flex flex-col justify-between group transition-all duration-300 select-none h-full"
  >
    <div class="space-y-4">
      <!-- Card Header: Project Number & Badges -->
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <span
            class="text-lime-400 font-mono font-bold text-xs tracking-wider drop-shadow-[0_0_8px_#e2f161]"
          >
            PROJECT // {{ project.projectNumber }}
          </span>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <AppBadge v-if="project.typeBadge" variant="dark">
            {{ project.typeBadge }}
          </AppBadge>
          <AppBadge variant="lime">
            {{ project.badge }}
          </AppBadge>
        </div>
      </div>

      <!-- Project Title & Narrative -->
      <div>
        <h3
          class="text-xl sm:text-2xl font-bold font-syne text-white group-hover:text-lime-400 transition-colors"
        >
          {{ project.title }}
        </h3>
        <p class="text-xs sm:text-sm text-slate-300 font-mono leading-relaxed pt-2">
          {{ project.description }}
        </p>
      </div>

      <!-- Tech Stack Pills -->
      <div class="flex flex-wrap gap-2 pt-1">
        <span
          v-for="tech in project.stack"
          :key="tech"
          class="text-[10px] font-mono px-2.5 py-1 rounded-md bg-dark-950/80 border border-lime-400/20 text-slate-300 shadow-sm"
        >
          {{ tech }}
        </span>
      </div>

      <!-- Interactive Git Diff Terminal Preview -->
      <div
        v-if="project.diff"
        class="bg-dark-950/90 border border-lime-400/15 rounded-xl p-3 sm:p-3.5 font-mono text-[11px] space-y-2 mt-2"
      >
        <div
          class="flex items-center justify-between border-b border-lime-400/10 pb-1.5 text-[10px] text-slate-400"
        >
          <span class="text-slate-300 font-medium truncate flex items-center gap-1.5">
            <span class="text-lime-400">commit:</span>
            {{ project.diff.filename }}
          </span>
          <div class="flex items-center gap-2 shrink-0 font-bold">
            <span class="text-emerald-400">+{{ project.diff.additions }}</span>
            <span class="text-rose-400">-{{ project.diff.deletions }}</span>
          </div>
        </div>

        <div class="space-y-1 text-[10px] sm:text-[11px] leading-relaxed">
          <div
            v-for="(line, idx) in project.diff.highlights"
            :key="idx"
            class="text-emerald-400/95 font-mono flex items-start gap-1.5"
          >
            <span class="shrink-0 text-emerald-400 font-bold">&plus;</span>
            <span class="text-slate-300">{{ line.replace(/^\+\s*/, '') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Footer -->
    <div class="pt-5 mt-4 border-t border-lime-400/10 flex items-center justify-between gap-3">
      <div v-if="project.liveUrl">
        <AppButton
          variant="primary"
          size="sm"
          as="a"
          :href="project.liveUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>$ launch_app</span>
          <span class="text-xs">&rarr;</span>
        </AppButton>
      </div>

      <div v-else-if="project.isCurrentSite">
        <span class="text-[11px] font-mono text-lime-400 font-bold flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-lime-400 animate-ping inline-block" />
          <span>RUNNING // ACTIVE SESSION</span>
        </span>
      </div>

      <div v-else>
        <span class="text-[11px] font-mono text-slate-400"> PROD DEPLOYED </span>
      </div>

      <span class="text-[10px] font-mono text-slate-400"> REF #{{ project.projectNumber }} </span>
    </div>
  </AppCard>
</template>
