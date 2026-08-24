<script setup lang="ts">
  import { ref } from 'vue'
  import type { Project } from '../../types/portfolio'
  import AppCard from '../ui/AppCard.vue'
  import AppBadge from '../ui/AppBadge.vue'

  defineProps<{
    project: Project
    floatAnimation?: string
  }>()

  const isDiffOpen = ref(false)

  function toggleDiff() {
    isDiffOpen.value = !isDiffOpen.value
  }
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
      <!-- Card Top: Badge (Left) & Big Project Number (Right) -->
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <AppBadge variant="lime" class="font-mono text-xs font-bold">
            {{ project.badge }}
          </AppBadge>
          <AppBadge v-if="project.typeBadge" variant="dark" class="font-mono text-xs">
            {{ project.typeBadge }}
          </AppBadge>
        </div>

        <span
          class="text-lime-400 font-syne font-black text-2xl sm:text-3xl tracking-tight drop-shadow-[0_0_12px_#e2f161]"
        >
          {{ project.projectNumber }}
        </span>
      </div>

      <!-- Title & [+] inspect diff Toggle Row -->
      <div class="flex items-center justify-between gap-3 pt-1 flex-wrap">
        <h3
          class="text-2xl sm:text-3xl font-extrabold font-syne text-lime-400 group-hover:drop-shadow-[0_0_12px_rgba(226,241,97,0.7)] transition-all"
        >
          {{ project.title }}
        </h3>

        <!-- Interactive Inspect Diff Toggle Button -->
        <button
          v-if="project.diff"
          type="button"
          class="px-2.5 py-1 text-xs font-mono rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
          :class="
            isDiffOpen
              ? 'bg-dark-950 border-rose-500/60 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
              : 'bg-dark-950/90 border-lime-400/40 text-lime-400 hover:border-lime-400 hover:shadow-[0_0_10px_rgba(226,241,97,0.4)]'
          "
          @click="toggleDiff"
        >
          <span class="font-bold">{{ isDiffOpen ? '[-]' : '[+]' }}</span>
          <span>{{ isDiffOpen ? 'close diff' : 'inspect diff' }}</span>
        </button>
      </div>

      <!-- Narrative Description -->
      <p class="text-xs sm:text-sm text-slate-300 font-mono leading-relaxed pt-1">
        {{ project.description }}
      </p>

      <!-- Terminal Git Diff Box (Only visible when Inspect Diff is open) -->
      <div
        v-if="project.diff && isDiffOpen"
        class="bg-dark-950/95 border border-lime-400/25 rounded-2xl p-4 font-mono text-[11px] sm:text-xs space-y-3 shadow-inner ring-1 ring-lime-400/20 transition-all duration-300 animate-in fade-in zoom-in-95"
      >
        <!-- Git Diff Command & Add/Del Counts Header -->
        <div class="flex items-start justify-between gap-4 text-slate-400 leading-snug">
          <div class="space-y-0.5 truncate min-w-0">
            <div class="text-slate-300 truncate">diff --git a/{{ project.diff.filename }}</div>
            <div class="text-slate-400 truncate">b/{{ project.diff.filename }}</div>
          </div>

          <div class="text-right shrink-0 font-bold space-y-0.5">
            <div class="text-emerald-400">+{{ project.diff.additions }} /</div>
            <div class="text-rose-400">-{{ project.diff.deletions }}</div>
          </div>
        </div>

        <!-- Divider Line -->
        <div class="h-px bg-lime-400/15 w-full" />

        <!-- Diff Highlights -->
        <div class="space-y-2 text-emerald-400/95 leading-relaxed text-[11px] sm:text-xs">
          <div
            v-for="(line, idx) in project.diff.highlights"
            :key="idx"
            class="flex items-start gap-2"
          >
            <span class="text-emerald-400 font-bold shrink-0">&plus;</span>
            <span class="text-emerald-300/90">{{ line.replace(/^\+\s*/, '') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Footer: Stack bullet list & Launch Button -->
    <div
      class="pt-5 mt-4 border-t border-lime-400/10 flex items-center justify-between gap-4 flex-wrap"
    >
      <!-- Tech Stack Items with Bullet Dots -->
      <div class="flex items-center gap-2 flex-wrap font-mono text-xs font-bold text-slate-300">
        <template v-for="(tech, tIdx) in project.stack" :key="tech">
          <span>{{ tech }}</span>
          <span v-if="tIdx < project.stack.length - 1" class="text-lime-400/60 font-bold">•</span>
        </template>
      </div>

      <!-- Action Button -->
      <div class="shrink-0">
        <a
          v-if="project.liveUrl"
          :href="project.liveUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-lime-400 text-black font-mono font-bold text-xs shadow-[0_0_15px_rgba(226,241,97,0.35)] hover:shadow-[0_0_25px_rgba(226,241,97,0.65)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <span>VISIT</span>
          <span class="text-sm">&rarr;</span>
        </a>

        <div
          v-else-if="project.isCurrentSite"
          class="flex items-center gap-1.5 font-mono text-[11px] text-lime-400 font-bold"
        >
          <span class="w-2 h-2 rounded-full bg-lime-400 animate-ping inline-block" />
          <span>ACTIVE SESSION</span>
        </div>

        <div v-else class="text-[11px] font-mono text-slate-400">PROD DEPLOYED</div>
      </div>
    </div>
  </AppCard>
</template>
