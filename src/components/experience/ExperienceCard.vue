<script setup lang="ts">
  import { computed } from 'vue'
  import type { Experience } from '../../types/portfolio'
  import AppCard from '../ui/AppCard.vue'
  import AppBadge from '../ui/AppBadge.vue'

  interface Props {
    experience: Experience
    theme?: 'lime' | 'white' | 'emerald'
    floatAnimation?: string
    index?: number
    total?: number
    timelineProgress?: number
    isFocused?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    theme: 'lime',
    floatAnimation: '',
    index: 0,
    total: 3,
    timelineProgress: 0,
    isFocused: true,
  })

  // Compute if the laser beam has reached this node
  const isReached = computed(() => {
    if (props.isFocused) return true
    if (props.timelineProgress === 0) return Boolean(props.experience.isCurrent)
    const activationThreshold = props.total > 1 ? (props.index / (props.total - 1)) * 65 + 25 : 30
    return props.timelineProgress >= activationThreshold
  })

  // Fixed badge text to prevent any text wrapping / layout shifts
  const badgeText = computed(() => {
    if (props.experience.isCurrent) return 'ACTIVE'
    return props.experience.statusBadge || 'MILESTONE'
  })

  const themeConfig = computed(() => {
    switch (props.theme) {
      case 'white':
        return {
          activeCardClass: 'active-timeline-card-white',
          spotlightColor: 'rgba(255, 255, 255, 0.12)',
          connectorActive: 'bg-white opacity-100',
          connectorInactive: 'bg-white/15 opacity-60 group-hover:opacity-100',
          nodeBorderActive: 'border-white scale-110',
          nodePing: 'bg-white',
          nodeInnerDotActive: 'bg-white',
          missionNumberClass: 'text-white',
          titleActive: 'text-white',
          companyLinkClass: 'text-white',
          badgeVariant: 'white' as const,
          badgeGlowClass: '',
          highlightDot: 'bg-white',
        }
      case 'emerald':
        return {
          activeCardClass: 'active-timeline-card-emerald',
          spotlightColor: 'rgba(52, 211, 153, 0.14)',
          connectorActive: 'bg-emerald-400 opacity-100',
          connectorInactive: 'bg-emerald-400/15 opacity-60 group-hover:opacity-100',
          nodeBorderActive: 'border-emerald-400 scale-110',
          nodePing: 'bg-emerald-400',
          nodeInnerDotActive: 'bg-emerald-400',
          missionNumberClass: 'text-emerald-400',
          titleActive: 'text-emerald-400',
          companyLinkClass: 'text-emerald-400',
          badgeVariant: 'emerald' as const,
          badgeGlowClass: '',
          highlightDot: 'bg-emerald-400',
        }
      case 'lime':
      default:
        return {
          activeCardClass: 'active-timeline-card-lime',
          spotlightColor: 'rgba(226, 241, 97, 0.14)',
          connectorActive: 'bg-lime-400 opacity-100',
          connectorInactive: 'bg-lime-400/15 opacity-60 group-hover:opacity-100',
          nodeBorderActive: 'border-lime-400 scale-110',
          nodePing: 'bg-lime-400',
          nodeInnerDotActive: 'bg-lime-400',
          missionNumberClass: 'text-lime-400',
          titleActive: 'text-lime-400',
          companyLinkClass: 'text-lime-400',
          badgeVariant: 'lime' as const,
          badgeGlowClass: '',
          highlightDot: 'bg-lime-400',
        }
    }
  })

  function formatHighlight(text: string): string {
    const clean = text.replace(/^\+\s*/, '')
    return clean.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="underline text-lime-300 hover:text-white transition-colors inline-flex items-center gap-0.5 font-semibold">$1 ↗</a>',
    )
  }
</script>

<template>
  <div class="relative w-full h-full group flex flex-col">
    <!-- Horizontal Neon Connector Branch (Desktop only >= lg) -->
    <div
      class="hidden lg:block absolute top-7 -left-7 sm:-left-9 lg:-left-10 w-7 sm:w-9 lg:w-10 h-[2px] pointer-events-none transition-all duration-300 z-10"
      :class="[
        isFocused || isReached ? themeConfig.connectorActive : themeConfig.connectorInactive,
      ]"
    />

    <!-- Glowing Timeline Node Marker (Desktop only >= lg) -->
    <div
      class="hidden lg:flex absolute top-4 -left-[40px] sm:-left-[49px] lg:-left-[53px] w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-dark-950 items-center justify-center z-20 transition-all duration-300 border border-lime-400/30"
      :class="[
        isFocused
          ? themeConfig.nodeBorderActive
          : isReached || experience.isCurrent
            ? 'opacity-85 scale-100'
            : 'opacity-40 scale-90',
      ]"
    >
      <span v-if="experience.isCurrent" class="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
        <span
          class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
          :class="themeConfig.nodePing"
        />
        <span
          class="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3"
          :class="themeConfig.nodePing"
        />
      </span>
      <span
        v-else
        class="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300"
        :class="[
          isFocused ? themeConfig.nodeInnerDotActive : isReached ? 'bg-slate-400' : 'bg-slate-600',
        ]"
      />
    </div>

    <!-- Experience Content Card (Themed & Focus-Aware Dimming) -->
    <AppCard
      padding="md"
      rounded="2xl"
      :hud-reticles="false"
      :tilt="false"
      :spotlight="true"
      :spotlight-color="themeConfig.spotlightColor"
      :shine="false"
      :float-animation="floatAnimation"
      class="select-none space-y-4 w-full h-full flex flex-col justify-between relative overflow-hidden transition-opacity duration-300 bg-dark-900/95 lg:bg-dark-900/90 transform-gpu"
      :class="[
        isFocused
          ? `${themeConfig.activeCardClass} opacity-100 scale-100`
          : 'lg:opacity-35 lg:scale-[0.985] lg:blur-[0.2px] lg:hover:opacity-100 lg:hover:scale-100 lg:hover:blur-none',
      ]"
    >
      <!-- Header: Mission Number, Period & Stable Badge Slot -->
      <div
        class="flex items-center justify-between gap-2 pb-2 flex-wrap relative z-20"
      >
        <div class="flex items-center gap-2.5">
          <span
            class="font-sans font-bold text-xs tracking-wider"
            :class="themeConfig.missionNumberClass"
          >
            {{ experience.missionNumber }}
          </span>
          <code
            v-if="experience.commitHash"
            class="text-[11px] font-mono text-slate-400"
          >
            commit: {{ experience.commitHash }}
          </code>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <span class="text-xs font-sans text-slate-300">
            {{ experience.period }}
          </span>

          <!-- Stable Illuminated Active Mission Badge -->
          <AppBadge
            :variant="isReached || experience.isCurrent ? themeConfig.badgeVariant : 'dark'"
            class="uppercase tracking-wider font-bold transition-all duration-300 shrink-0"
            :class="isReached || experience.isCurrent ? themeConfig.badgeGlowClass : ''"
          >
            {{ badgeText }}
          </AppBadge>
        </div>
      </div>

      <!-- Role, Company & Department Details (Illuminated Title with Glow Pulse) -->
      <div class="relative z-20">
        <h3
          class="text-xl sm:text-2xl font-bold font-syne flex items-center gap-2 flex-wrap transition-colors duration-300"
          :class="
            isReached || experience.isCurrent
              ? themeConfig.titleActive
              : 'text-white group-hover:text-lime-400'
          "
        >
          <span>{{ experience.role }}</span>
          <span class="text-slate-400 font-normal">@</span>
          <a
            v-if="experience.companyUrl"
            :href="experience.companyUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:underline inline-flex items-center gap-1 font-bold"
            :class="themeConfig.companyLinkClass"
          >
            {{ experience.company }}
            <span class="text-xs">&rarr;</span>
          </a>
          <span v-else class="font-bold" :class="themeConfig.companyLinkClass">
            {{ experience.company }}
          </span>
        </h3>

        <div
          v-if="experience.department || experience.location"
          class="text-xs text-slate-400 font-sans pt-1.5 flex items-center gap-2 flex-wrap"
        >
          <span v-if="experience.department" class="text-slate-300 font-medium">
            {{ experience.department }}
          </span>
          <span v-if="experience.department && experience.location" class="text-lime-400/40">
            |
          </span>
          <span v-if="experience.location">{{ experience.location }}</span>
        </div>
      </div>

      <!-- Narrative Description -->
      <p class="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed relative z-20">
        {{ experience.description }}
      </p>

      <!-- Key Engineering Achievements (Highlights): Direct on card surface without nested sub-card border -->
      <ul
        v-if="experience.diff?.highlights?.length"
        class="space-y-2 pt-1 text-[11px] sm:text-xs font-sans text-slate-300 relative z-20"
      >
        <li
          v-for="(highlight, idx) in experience.diff.highlights"
          :key="idx"
          class="flex items-start gap-2.5 leading-relaxed"
        >
          <span
            class="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
            :class="themeConfig.highlightDot"
          />
          <span v-html="formatHighlight(highlight)" />
        </li>
      </ul>

      <!-- Tech Stack: Inline Bullet List like ProjectCard (no box-in-box borders) -->
      <div
        v-if="experience.tags?.length"
        class="flex items-center gap-2 flex-wrap font-sans text-xs font-semibold text-slate-300 pt-3 relative z-20"
      >
        <template v-for="(tag, tIdx) in experience.tags" :key="tag">
          <span>{{ tag }}</span>
          <span
            v-if="tIdx < experience.tags.length - 1"
            class="text-slate-600 font-bold select-none"
          >
            •
          </span>
        </template>
      </div>
    </AppCard>
  </div>
</template>

<style scoped lang="scss">
  .active-timeline-card-lime {
    border-color: rgba(226, 241, 97, 0.7) !important;
  }

  .active-timeline-card-white {
    border-color: rgba(255, 255, 255, 0.7) !important;
  }

  .active-timeline-card-emerald {
    border-color: rgba(52, 211, 153, 0.7) !important;
  }
</style>
