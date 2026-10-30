<script setup lang="ts">
  import { computed, ref } from 'vue'
  import type { Project } from '../../types/portfolio'
  import { useAudioSynth } from '../../composables/useAudioSynth'
  import AppCard from '../ui/AppCard.vue'
  import AppBadge from '../ui/AppBadge.vue'

  interface Props {
    project: Project
    theme?: 'lime' | 'white' | 'emerald' | 'cyan'
    floatAnimation?: string
    isTwinkling?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    theme: 'lime',
    floatAnimation: '',
    isTwinkling: false,
  })

  const emit = defineEmits<{
    (e: 'preview', project: Project): void
  }>()

  const { playDiffToggle, playClick } = useAudioSynth()
  const isDiffOpen = ref(false)

  function toggleDiff() {
    isDiffOpen.value = !isDiffOpen.value
    playDiffToggle(isDiffOpen.value)
  }

  const themeConfig = computed(() => {
    switch (props.theme) {
      case 'white':
        return {
          badgeVariant: 'white' as const,
          numberClass: 'text-white',
          titleClass: 'text-white group-hover:text-white',
          stellarGlowClass: 'border-white/40 ring-1 ring-white/20',
          activeBorderStroke: '#ffffff',
          activeStrokeGlowClass: 'active-card-border-stroke-white',
          starColor: 'text-white',
          diffBtnDefault:
            'bg-dark-950/90 border-white/20 text-white hover:border-white',
          diffBorderClass: 'border-white/25 ring-white/20',
          diffDividerClass: 'bg-white/15',
          bulletClass: 'text-white/60',
          previewBtnClass:
            'border-white/20 text-white hover:bg-white hover:text-black',
          visitBtnClass:
            'bg-white text-black hover:bg-slate-200 font-bold',
          activeSessionText: 'text-white',
          activeSessionPing: 'bg-white',
        }
      case 'emerald':
        return {
          badgeVariant: 'emerald' as const,
          numberClass: 'text-emerald-400',
          titleClass: 'text-white group-hover:text-emerald-400',
          stellarGlowClass: 'border-emerald-400/40 ring-1 ring-emerald-400/20',
          activeBorderStroke: '#34d399',
          activeStrokeGlowClass: 'active-card-border-stroke-emerald',
          starColor: 'text-emerald-400',
          diffBtnDefault:
            'bg-dark-950/90 border-emerald-400/30 text-emerald-400 hover:border-emerald-400',
          diffBorderClass: 'border-emerald-400/25 ring-emerald-400/20',
          diffDividerClass: 'bg-emerald-400/15',
          bulletClass: 'text-emerald-400/60',
          previewBtnClass:
            'border-emerald-400/30 text-emerald-400 hover:bg-emerald-400 hover:text-black',
          visitBtnClass:
            'bg-emerald-400 text-black hover:bg-emerald-300 font-bold',
          activeSessionText: 'text-emerald-400',
          activeSessionPing: 'bg-emerald-400',
        }
      case 'cyan':
        return {
          badgeVariant: 'cyan' as const,
          numberClass: 'text-sky-400',
          titleClass: 'text-white group-hover:text-sky-400',
          stellarGlowClass: 'border-sky-400/40 ring-1 ring-sky-400/20',
          activeBorderStroke: '#38bdf8',
          activeStrokeGlowClass: 'active-card-border-stroke-cyan',
          starColor: 'text-sky-400',
          diffBtnDefault:
            'bg-dark-950/90 border-sky-400/30 text-sky-400 hover:border-sky-400',
          diffBorderClass: 'border-sky-400/25 ring-sky-400/20',
          diffDividerClass: 'bg-sky-400/15',
          bulletClass: 'text-sky-400/60',
          previewBtnClass:
            'border-sky-400/30 text-sky-400 hover:bg-sky-400 hover:text-black',
          visitBtnClass:
            'bg-sky-400 text-black hover:bg-sky-300 font-bold',
          activeSessionText: 'text-sky-400',
          activeSessionPing: 'bg-sky-400',
        }
      case 'lime':
      default:
        return {
          badgeVariant: 'lime' as const,
          numberClass: 'text-lime-400',
          titleClass: 'text-white group-hover:text-lime-400',
          stellarGlowClass: 'border-lime-400/40 ring-1 ring-lime-400/20',
          activeBorderStroke: '#e2f161',
          activeStrokeGlowClass: 'active-card-border-stroke-lime',
          starColor: 'text-lime-400',
          diffBtnDefault:
            'bg-dark-950/90 border-lime-400/30 text-lime-400 hover:border-lime-400',
          diffBorderClass: 'border-lime-400/25 ring-lime-400/20',
          diffDividerClass: 'bg-lime-400/15',
          bulletClass: 'text-lime-400/60',
          previewBtnClass:
            'border-lime-400/30 text-lime-400 hover:bg-lime-400 hover:text-black',
          visitBtnClass:
            'bg-lime-400 text-black hover:bg-lime-300 font-bold',
          activeSessionText: 'text-lime-400',
          activeSessionPing: 'bg-lime-400',
        }
    }
  })
</script>

<template>
  <AppCard
    padding="md"
    rounded="2xl"
    :hud-reticles="true"
    :tilt="true"
    :float-animation="floatAnimation"
    class="flex flex-col justify-between group select-none h-full relative transition-all duration-300 ease-out backdrop-blur-xl opacity-100"
    :class="[
      isTwinkling ? `scale-[1.015] ${themeConfig.stellarGlowClass}` : 'group-hover:scale-[1.015]',
    ]"
  >
    <!-- SVG Stellar Perimeter Border on Twinkle / Hover -->
    <svg
      class="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible rounded-2xl transition-opacity duration-300"
      :class="isTwinkling ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1"
        y="1"
        width="calc(100% - 2px)"
        height="calc(100% - 2px)"
        rx="15"
        fill="none"
        :stroke="themeConfig.activeBorderStroke"
        stroke-width="1.5"
        class="active-card-border-stroke"
        :class="themeConfig.activeStrokeGlowClass"
      />
    </svg>

    <div class="space-y-4 relative z-20">
      <!-- Card Top: Badge (Left) & Big Themed Project Number with Twinkle Star Marker (Right) -->
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <AppBadge :variant="themeConfig.badgeVariant" class="font-sans text-xs font-semibold">
            {{ project.badge }}
          </AppBadge>
          <AppBadge v-if="project.typeBadge" variant="dark" class="font-sans text-xs">
            {{ project.typeBadge }}
          </AppBadge>
        </div>

        <div class="flex items-center gap-1.5">
          <!-- Twinkle Marker -->
          <span
            class="transition-transform duration-500 select-none inline-flex items-center justify-center"
            :class="[
              themeConfig.starColor,
              isTwinkling
                ? 'opacity-100 scale-125'
                : 'opacity-0 group-hover:opacity-100 group-hover:scale-110',
            ]"
          >
            <span class="inline-block w-1.5 h-1.5 rounded-full bg-current" />
          </span>
          <span
            class="font-syne font-black text-2xl sm:text-3xl tracking-tight transition-transform duration-500"
            :class="[themeConfig.numberClass, isTwinkling ? 'scale-105' : '']"
          >
            {{ project.projectNumber }}
          </span>
        </div>
      </div>

      <!-- Title & [+] inspect diff Toggle Row -->
      <div class="flex items-center justify-between gap-3 pt-1 flex-wrap">
        <h3
          class="text-2xl sm:text-3xl font-extrabold font-syne transition-colors duration-200"
          :class="themeConfig.titleClass"
        >
          {{ project.title }}
        </h3>

        <!-- Interactive Inspect Diff Toggle Button -->
        <button
          v-if="project.diff"
          type="button"
          class="px-2.5 py-1 text-xs font-sans rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 select-none active:scale-95"
          :class="
            isDiffOpen
              ? 'bg-dark-950 border-rose-500/60 text-rose-400'
              : themeConfig.diffBtnDefault
          "
          @click="toggleDiff"
        >
          <span class="relative z-10 flex items-center gap-1.5">
            <span class="font-bold">{{ isDiffOpen ? '[-]' : '[+]' }}</span>
            <span>{{ isDiffOpen ? 'close diff' : 'inspect diff' }}</span>
          </span>
        </button>
      </div>

      <!-- Narrative Description -->
      <p class="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed pt-1">
        {{ project.description }}
      </p>

      <!-- Terminal Git Diff Box (Only visible when Inspect Diff is open) -->
      <code
        v-if="project.diff && isDiffOpen"
        data-ui="git-diff"
        class="block bg-dark-950/95 border rounded-2xl p-4 font-mono text-[11px] sm:text-xs space-y-3 ring-1 transition-all duration-300 animate-in fade-in zoom-in-95"
        :class="themeConfig.diffBorderClass"
      >
        <!-- Git Diff Command & Add/Del Counts Header -->
        <div class="flex items-start justify-between gap-4 text-slate-400 leading-snug">
          <div class="space-y-0.5 truncate min-w-0">
            <div class="text-slate-300 truncate">diff --git a/{{ project.diff.filename }}</div>
            <div class="text-slate-400 truncate">b/{{ project.diff.filename }}</div>
          </div>

          <div class="text-right shrink-0 font-bold flex items-center gap-1.5 self-start pt-0.5">
            <span class="text-emerald-400">+{{ project.diff.additions }}</span>
            <span class="text-slate-500">/</span>
            <span class="text-rose-400">-{{ project.diff.deletions }}</span>
          </div>
        </div>

        <!-- Divider Line -->
        <div class="h-px w-full" :class="themeConfig.diffDividerClass" /> <!-- taste-skill-ignore -->

        <!-- Diff Highlights -->
        <div class="space-y-2 text-emerald-400/95 leading-relaxed text-[11px] sm:text-xs">
          <div
            v-for="(line, idx) in project.diff.highlights"
            :key="idx"
            class="flex items-start gap-2"
          >
            <span class="text-emerald-400 font-bold shrink-0 select-none">&plus;</span>
            <span class="text-emerald-300/90 leading-normal">{{ line.replace(/^\+\s*/, '') }}</span>
          </div>
        </div>
      </code>
    </div>

    <!-- Action Footer: Stack bullet list, Desktop Preview & Mobile Direct Visit -->
    <div
      class="pt-4 mt-3 flex items-center justify-between gap-4 flex-wrap"
    >
      <!-- Tech Stack Items with Bullet Dots -->
      <div class="flex items-center gap-2 flex-wrap font-sans text-xs font-semibold text-slate-300">
        <template v-for="(tech, tIdx) in project.stack" :key="tech">
          <span>{{ tech }}</span>
          <span
            v-if="tIdx < project.stack.length - 1"
            class="font-bold"
            :class="themeConfig.bulletClass"
          >
            •
          </span>
        </template>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2 shrink-0">
        <!-- Desktop: Preview Lightbox Trigger (Hidden on Mobile) -->
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-sans font-semibold text-xs bg-dark-950/90 border transition-colors cursor-pointer active:scale-95"
          :class="themeConfig.previewBtnClass"
          @click="emit('preview', project)"
        >
          <span class="relative z-10 flex items-center gap-1.5">
            <span class="text-[10px]">⬡</span>
            <span>PREVIEW</span>
          </span>
        </button>

        <!-- GitHub Repository Link Button (if repoUrl exists) -->
        <a
          v-if="project.repoUrl"
          :href="project.repoUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl font-sans font-semibold text-xs bg-dark-950/80 border border-slate-700/60 text-slate-400 hover:text-white hover:border-slate-500 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="View Repository on GitHub"
          @click.stop="playClick"
        >
          <span class="text-[10px]">⌥</span>
          <span>REPO</span>
          <span class="text-[10px]">&nearr;</span>
        </a>

        <!-- Mobile: Direct Visit Link Button (Hidden on Desktop) -->
        <a
          v-if="project.liveUrl"
          :href="project.liveUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="md:hidden inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-sans font-semibold text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
          :class="themeConfig.visitBtnClass"
          @click="playClick"
        >
          <span>VISIT</span>
          <span class="text-sm">&rarr;</span>
        </a>

        <!-- Active Session Indicator Badge (for bonfiglio.dev) -->
        <div
          v-if="project.isCurrentSite"
          class="flex items-center gap-1.5 font-sans text-xs font-semibold pl-1"
          :class="themeConfig.activeSessionText"
        >
          <span
            class="w-2 h-2 rounded-full animate-ping inline-block"
            :class="themeConfig.activeSessionPing"
          />
          <span>ACTIVE SESSION</span>
        </div>
      </div>
    </div>
  </AppCard>
</template>
