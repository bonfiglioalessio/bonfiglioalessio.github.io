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
  }

  const props = withDefaults(defineProps<Props>(), {
    theme: 'lime',
    floatAnimation: '',
  })

  const emit = defineEmits<{
    (e: 'preview', project: Project): void
  }>()

  const { playDiffToggle } = useAudioSynth()
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
          numberClass: 'text-white drop-shadow-[0_0_12px_#ffffff]',
          titleClass: 'text-white group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]',
          diffBtnDefault:
            'bg-dark-950/90 border-white/40 text-white hover:border-white hover:shadow-[0_0_10px_rgba(255,255,255,0.4)]',
          diffBorderClass: 'border-white/25 ring-white/20',
          diffDividerClass: 'bg-white/15',
          bulletClass: 'text-white/60',
          previewBtnClass:
            'border-white/30 text-white hover:bg-white hover:text-black hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]',
          activeSessionText: 'text-white',
          activeSessionPing: 'bg-white',
        }
      case 'emerald':
        return {
          badgeVariant: 'emerald' as const,
          numberClass: 'text-emerald-400 drop-shadow-[0_0_12px_#34d399]',
          titleClass: 'text-emerald-400 group-hover:drop-shadow-[0_0_12px_rgba(52,211,153,0.7)]',
          diffBtnDefault:
            'bg-dark-950/90 border-emerald-400/40 text-emerald-400 hover:border-emerald-400 hover:shadow-[0_0_10px_rgba(52,211,153,0.4)]',
          diffBorderClass: 'border-emerald-400/25 ring-emerald-400/20',
          diffDividerClass: 'bg-emerald-400/15',
          bulletClass: 'text-emerald-400/60',
          previewBtnClass:
            'border-emerald-400/30 text-emerald-400 hover:bg-emerald-400 hover:text-black hover:shadow-[0_0_15px_rgba(52,211,153,0.4)]',
          activeSessionText: 'text-emerald-400',
          activeSessionPing: 'bg-emerald-400',
        }
      case 'cyan':
        return {
          badgeVariant: 'cyan' as const,
          numberClass: 'text-sky-400 drop-shadow-[0_0_12px_#38bdf8]',
          titleClass: 'text-sky-400 group-hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.7)]',
          diffBtnDefault:
            'bg-dark-950/90 border-sky-400/40 text-sky-400 hover:border-sky-400 hover:shadow-[0_0_10px_rgba(56,189,248,0.4)]',
          diffBorderClass: 'border-sky-400/25 ring-sky-400/20',
          diffDividerClass: 'bg-sky-400/15',
          bulletClass: 'text-sky-400/60',
          previewBtnClass:
            'border-sky-400/30 text-sky-400 hover:bg-sky-400 hover:text-black hover:shadow-[0_0_15px_rgba(56,189,248,0.4)]',
          activeSessionText: 'text-sky-400',
          activeSessionPing: 'bg-sky-400',
        }
      case 'lime':
      default:
        return {
          badgeVariant: 'lime' as const,
          numberClass: 'text-lime-400 drop-shadow-[0_0_12px_#e2f161]',
          titleClass: 'text-lime-400 group-hover:drop-shadow-[0_0_12px_rgba(226,241,97,0.7)]',
          diffBtnDefault:
            'bg-dark-950/90 border-lime-400/40 text-lime-400 hover:border-lime-400 hover:shadow-[0_0_10px_rgba(226,241,97,0.4)]',
          diffBorderClass: 'border-lime-400/25 ring-lime-400/20',
          diffDividerClass: 'bg-lime-400/15',
          bulletClass: 'text-lime-400/60',
          previewBtnClass:
            'border-lime-400/30 text-lime-400 hover:bg-lime-400 hover:text-black hover:shadow-[0_0_15px_rgba(226,241,97,0.4)]',
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
    class="flex flex-col justify-between group transition-all duration-300 select-none h-full"
  >
    <div class="space-y-4">
      <!-- Card Top: Badge (Left) & Big Themed Project Number (Right) -->
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <AppBadge :variant="themeConfig.badgeVariant" class="font-mono text-xs font-bold">
            {{ project.badge }}
          </AppBadge>
          <AppBadge v-if="project.typeBadge" variant="dark" class="font-mono text-xs">
            {{ project.typeBadge }}
          </AppBadge>
        </div>

        <span
          class="font-syne font-black text-2xl sm:text-3xl tracking-tight"
          :class="themeConfig.numberClass"
        >
          {{ project.projectNumber }}
        </span>
      </div>

      <!-- Title & [+] inspect diff Toggle Row -->
      <div class="flex items-center justify-between gap-3 pt-1 flex-wrap">
        <h3
          class="text-2xl sm:text-3xl font-extrabold font-syne transition-all"
          :class="themeConfig.titleClass"
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
              : themeConfig.diffBtnDefault
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
        class="bg-dark-950/95 border rounded-2xl p-4 font-mono text-[11px] sm:text-xs space-y-3 shadow-inner ring-1 transition-all duration-300 animate-in fade-in zoom-in-95"
        :class="themeConfig.diffBorderClass"
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
        <div class="h-px w-full" :class="themeConfig.diffDividerClass" />

        <!-- Diff Highlights -->
        <div class="space-y-2 text-emerald-400/95 leading-relaxed text-[11px] sm:text-xs">
          <div
            v-for="(line, idx) in project.diff.highlights"
            :key="idx"
            class="flex items-start gap-2"
          >
            <span class="text-emerald-400 font-bold shrink-0">&plus;</span>
            <span class="text-emerald-300/90">
              {{ line.replace(/^\+\s*/, '') }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Footer: Stack bullet list & Preview Action Trigger -->
    <div
      class="pt-5 mt-4 border-t border-lime-400/10 flex items-center justify-between gap-4 flex-wrap"
    >
      <!-- Tech Stack Items with Bullet Dots -->
      <div class="flex items-center gap-2 flex-wrap font-mono text-xs font-bold text-slate-300">
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
        <!-- Preview Lightbox Trigger -->
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-mono font-bold text-xs bg-dark-950/90 border transition-all cursor-pointer active:scale-95"
          :class="themeConfig.previewBtnClass"
          @click="emit('preview', project)"
        >
          <span class="text-[10px]">⬡</span>
          <span>PREVIEW</span>
        </button>

        <!-- Active Session Indicator Badge (for bonfiglio.dev) -->
        <div
          v-if="project.isCurrentSite"
          class="flex items-center gap-1.5 font-mono text-[11px] font-bold pl-1"
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
