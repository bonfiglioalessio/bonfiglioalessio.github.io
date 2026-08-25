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
    if (props.experience.isCurrent) return '● ACTIVE MISSION'
    return props.experience.statusBadge || 'MILESTONE'
  })

  const themeConfig = computed(() => {
    switch (props.theme) {
      case 'white':
        return {
          activeCardClass: 'active-timeline-card-white',
          spotlightColor: 'rgba(255, 255, 255, 0.12)',
          connectorActive:
            'bg-gradient-to-r from-white to-white/50 shadow-[0_0_12px_#ffffff] opacity-100',
          connectorInactive: 'bg-white/15 opacity-60 group-hover:opacity-100',
          nodeBorderActive: 'border-white shadow-[0_0_20px_rgba(255,255,255,0.9)] scale-110',
          nodePing: 'bg-white shadow-[0_0_14px_#ffffff]',
          nodeInnerDotActive: 'bg-white shadow-[0_0_12px_#ffffff]',
          missionNumberClass: 'text-white drop-shadow-[0_0_8px_#ffffff]',
          titleActive: 'glow-pulse-title-white text-white',
          companyLinkClass: 'text-white',
          badgeVariant: 'white' as const,
          badgeGlowClass: 'glow-pulse-badge-white',
          highlightStar: 'text-white',
        }
      case 'emerald':
        return {
          activeCardClass: 'active-timeline-card-emerald',
          spotlightColor: 'rgba(52, 211, 153, 0.14)',
          connectorActive:
            'bg-gradient-to-r from-emerald-400 to-emerald-400/50 shadow-[0_0_12px_#34d399] opacity-100',
          connectorInactive: 'bg-emerald-400/15 opacity-60 group-hover:opacity-100',
          nodeBorderActive: 'border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.9)] scale-110',
          nodePing: 'bg-emerald-400 shadow-[0_0_14px_#34d399]',
          nodeInnerDotActive: 'bg-emerald-400 shadow-[0_0_12px_#34d399]',
          missionNumberClass: 'text-emerald-400 drop-shadow-[0_0_8px_#34d399]',
          titleActive: 'glow-pulse-title-emerald text-emerald-400',
          companyLinkClass: 'text-emerald-400',
          badgeVariant: 'emerald' as const,
          badgeGlowClass: 'glow-pulse-badge-emerald',
          highlightStar: 'text-emerald-400',
        }
      case 'lime':
      default:
        return {
          activeCardClass: 'active-timeline-card-lime',
          spotlightColor: 'rgba(226, 241, 97, 0.14)',
          connectorActive:
            'bg-gradient-to-r from-lime-400 to-lime-400/50 shadow-[0_0_12px_#e2f161] opacity-100',
          connectorInactive: 'bg-lime-400/15 opacity-60 group-hover:opacity-100',
          nodeBorderActive: 'border-lime-400 shadow-[0_0_20px_rgba(226,241,97,0.9)] scale-110',
          nodePing: 'bg-lime-400 shadow-[0_0_14px_#e2f161]',
          nodeInnerDotActive: 'bg-lime-400 shadow-[0_0_12px_#e2f161]',
          missionNumberClass: 'text-lime-400 drop-shadow-[0_0_8px_#e2f161]',
          titleActive: 'glow-pulse-title-lime text-lime-400',
          companyLinkClass: 'text-lime-400',
          badgeVariant: 'lime' as const,
          badgeGlowClass: 'glow-pulse-badge-lime',
          highlightStar: 'text-lime-400',
        }
    }
  })
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
      :hud-reticles="true"
      :tilt="false"
      :spotlight="true"
      :spotlight-color="themeConfig.spotlightColor"
      :shine="true"
      :float-animation="floatAnimation"
      class="select-none space-y-4 w-full h-full flex flex-col justify-between relative overflow-hidden transition-all duration-500 backdrop-blur-xl"
      :class="[
        isFocused
          ? `${themeConfig.activeCardClass} opacity-100 scale-100`
          : 'opacity-35 scale-[0.985] blur-[0.2px] hover:opacity-100 hover:scale-100 hover:blur-none',
      ]"
    >
      <!-- Header: Mission Number, Period & Stable Badge Slot -->
      <div
        class="flex items-center justify-between gap-2 border-b border-lime-400/10 pb-3 flex-wrap relative z-20"
      >
        <div class="flex items-center gap-2">
          <span
            class="font-mono font-bold text-xs tracking-wider"
            :class="themeConfig.missionNumberClass"
          >
            {{ experience.missionNumber }}
          </span>
          <span
            v-if="experience.commitHash"
            class="text-[10px] font-mono text-slate-400 bg-dark-950/80 px-2 py-0.5 rounded border border-lime-400/10"
          >
            commit: {{ experience.commitHash }}
          </span>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <span class="text-xs font-mono text-slate-300">
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
          class="text-xs text-slate-400 font-mono pt-1.5 flex items-center gap-2 flex-wrap"
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
      <p class="text-xs sm:text-sm text-slate-300 font-mono leading-relaxed relative z-20">
        {{ experience.description }}
      </p>

      <!-- Key Engineering Achievements (Highlights) -->
      <ul
        v-if="experience.diff?.highlights?.length"
        class="space-y-2 pt-1 text-[11px] sm:text-xs font-mono text-slate-300 bg-dark-950/50 p-3 sm:p-3.5 rounded-xl border border-lime-400/10 relative z-20"
      >
        <li
          v-for="(highlight, idx) in experience.diff.highlights"
          :key="idx"
          class="flex items-start gap-2 leading-relaxed"
        >
          <span class="font-bold shrink-0 mt-0.5" :class="themeConfig.highlightStar"> ✦ </span>
          <span>{{ highlight.replace(/^\+\s*/, '') }}</span>
        </li>
      </ul>

      <!-- Tech Stack Tags -->
      <div
        v-if="experience.tags?.length"
        class="flex flex-wrap gap-2 pt-3 border-t border-lime-400/10 relative z-20"
      >
        <span
          v-for="tag in experience.tags"
          :key="tag"
          class="text-[10px] font-mono px-2.5 py-1 rounded-md bg-dark-950/80 border border-lime-400/20 text-slate-300 shadow-sm"
        >
          {{ tag }}
        </span>
      </div>
    </AppCard>
  </div>
</template>

<style scoped lang="scss">
  .active-timeline-card-lime {
    border-color: rgba(226, 241, 97, 0.85) !important;
    box-shadow:
      0 0 35px 3px rgba(226, 241, 97, 0.4),
      0 12px 35px 0 rgba(0, 0, 0, 0.7),
      inset 0 0 20px 0 rgba(226, 241, 97, 0.12) !important;
  }

  .active-timeline-card-white {
    border-color: rgba(255, 255, 255, 0.85) !important;
    box-shadow:
      0 0 35px 3px rgba(255, 255, 255, 0.4),
      0 12px 35px 0 rgba(0, 0, 0, 0.7),
      inset 0 0 20px 0 rgba(255, 255, 255, 0.12) !important;
  }

  .active-timeline-card-emerald {
    border-color: rgba(52, 211, 153, 0.85) !important;
    box-shadow:
      0 0 35px 3px rgba(52, 211, 153, 0.4),
      0 12px 35px 0 rgba(0, 0, 0, 0.7),
      inset 0 0 20px 0 rgba(52, 211, 153, 0.12) !important;
  }

  .active-card-border-stroke-lime {
    filter: drop-shadow(0 0 8px #e2f161) drop-shadow(0 0 16px rgba(226, 241, 97, 0.8));
    animation: card-border-pulse-lime 2.5s ease-in-out infinite alternate;
  }

  .active-card-border-stroke-white {
    filter: drop-shadow(0 0 8px #ffffff) drop-shadow(0 0 16px rgba(255, 255, 255, 0.8));
    animation: card-border-pulse-white 2.5s ease-in-out infinite alternate;
  }

  .active-card-border-stroke-emerald {
    filter: drop-shadow(0 0 8px #34d399) drop-shadow(0 0 16px rgba(52, 211, 153, 0.8));
    animation: card-border-pulse-emerald 2.5s ease-in-out infinite alternate;
  }

  @keyframes card-border-pulse-lime {
    0% {
      stroke-opacity: 0.85;
      filter: drop-shadow(0 0 6px #e2f161) drop-shadow(0 0 12px rgba(226, 241, 97, 0.5));
    }
    100% {
      stroke-opacity: 1;
      filter: drop-shadow(0 0 12px #e2f161) drop-shadow(0 0 24px rgba(226, 241, 97, 0.95));
    }
  }

  @keyframes card-border-pulse-white {
    0% {
      stroke-opacity: 0.85;
      filter: drop-shadow(0 0 6px #ffffff) drop-shadow(0 0 12px rgba(255, 255, 255, 0.5));
    }
    100% {
      stroke-opacity: 1;
      filter: drop-shadow(0 0 12px #ffffff) drop-shadow(0 0 24px rgba(255, 255, 255, 0.95));
    }
  }

  @keyframes card-border-pulse-emerald {
    0% {
      stroke-opacity: 0.85;
      filter: drop-shadow(0 0 6px #34d399) drop-shadow(0 0 12px rgba(52, 211, 153, 0.5));
    }
    100% {
      stroke-opacity: 1;
      filter: drop-shadow(0 0 12px #34d399) drop-shadow(0 0 24px rgba(52, 211, 153, 0.95));
    }
  }

  .glow-pulse-title-lime {
    animation: title-glow-pulse-lime 3s ease-in-out infinite alternate;
  }

  .glow-pulse-title-white {
    animation: title-glow-pulse-white 3s ease-in-out infinite alternate;
  }

  .glow-pulse-title-emerald {
    animation: title-glow-pulse-emerald 3s ease-in-out infinite alternate;
  }

  @keyframes title-glow-pulse-lime {
    0% {
      text-shadow: 0 0 10px rgba(226, 241, 97, 0.5);
      color: #e2f161;
    }
    100% {
      text-shadow:
        0 0 20px rgba(226, 241, 97, 0.9),
        0 0 35px rgba(226, 241, 97, 0.5);
      color: #f5ff82;
    }
  }

  @keyframes title-glow-pulse-white {
    0% {
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
      color: #ffffff;
    }
    100% {
      text-shadow:
        0 0 20px rgba(255, 255, 255, 0.9),
        0 0 35px rgba(255, 255, 255, 0.5);
      color: #f8fafc;
    }
  }

  @keyframes title-glow-pulse-emerald {
    0% {
      text-shadow: 0 0 10px rgba(52, 211, 153, 0.5);
      color: #34d399;
    }
    100% {
      text-shadow:
        0 0 20px rgba(52, 211, 153, 0.9),
        0 0 35px rgba(52, 211, 153, 0.5);
      color: #6ee7b7;
    }
  }

  .glow-pulse-badge-lime {
    box-shadow:
      0 0 14px rgba(226, 241, 97, 0.8),
      0 0 26px rgba(226, 241, 97, 0.45) !important;
  }

  .glow-pulse-badge-white {
    box-shadow:
      0 0 14px rgba(255, 255, 255, 0.8),
      0 0 26px rgba(255, 255, 255, 0.45) !important;
  }

  .glow-pulse-badge-emerald {
    box-shadow:
      0 0 14px rgba(52, 211, 153, 0.8),
      0 0 26px rgba(52, 211, 153, 0.45) !important;
  }
</style>
