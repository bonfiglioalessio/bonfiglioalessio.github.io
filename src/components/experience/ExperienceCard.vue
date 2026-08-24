<script setup lang="ts">
  import { computed } from 'vue'
  import type { Experience } from '../../types/portfolio'
  import AppCard from '../ui/AppCard.vue'
  import AppBadge from '../ui/AppBadge.vue'

  const props = withDefaults(
    defineProps<{
      experience: Experience
      floatAnimation?: string
      index?: number
      total?: number
      timelineProgress?: number
    }>(),
    {
      floatAnimation: '',
      index: 0,
      total: 3,
      timelineProgress: 0,
    },
  )

  // Compute if the laser beam has reached this node
  const isReached = computed(() => {
    if (props.timelineProgress === 0) return Boolean(props.experience.isCurrent)
    const activationThreshold = props.total > 1 ? (props.index / (props.total - 1)) * 65 + 25 : 30
    return props.timelineProgress >= activationThreshold
  })

  // Fixed badge text to prevent any text wrapping / layout shifts
  const badgeText = computed(() => {
    if (props.experience.isCurrent) return '● ACTIVE MISSION'
    return props.experience.statusBadge || 'MILESTONE'
  })
</script>

<template>
  <div class="relative w-full group">
    <!-- Horizontal Neon Connector Branch (Constant layout, GPU opacity/shadow transition) -->
    <div
      class="absolute top-7 -left-7 sm:-left-9 lg:-left-10 w-7 sm:w-9 lg:w-10 h-[2px] pointer-events-none transition-all duration-300 z-10"
      :class="[
        isReached
          ? 'bg-gradient-to-r from-lime-400 to-lime-400/50 shadow-[0_0_12px_#e2f161] opacity-100'
          : 'bg-lime-400/15 opacity-60 group-hover:opacity-100',
      ]"
    />

    <!-- Glowing Timeline Node Marker (Fixed dimensions, GPU transform & shadow only) -->
    <div
      class="absolute top-4 -left-[40px] sm:-left-[49px] lg:-left-[53px] w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-dark-950 flex items-center justify-center z-20 transition-all duration-300 border border-lime-400/30"
      :class="[
        isReached || experience.isCurrent
          ? 'border-lime-400 shadow-[0_0_20px_rgba(226,241,97,0.9)] scale-110'
          : 'opacity-70 scale-95',
      ]"
    >
      <span v-if="experience.isCurrent" class="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
        <span
          class="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"
        />
        <span
          class="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-lime-400 shadow-[0_0_14px_#e2f161]"
        />
      </span>
      <span
        v-else
        class="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300"
        :class="[
          isReached
            ? 'bg-lime-400 shadow-[0_0_12px_#e2f161]'
            : 'bg-slate-500 group-hover:bg-lime-400/70',
        ]"
      />
    </div>

    <!-- Experience Content Card (Zero-CLS Architecture: fixed geometry, GPU-only glow & opacity) -->
    <AppCard
      padding="md"
      rounded="2xl"
      :hud-reticles="true"
      :tilt="false"
      :float-animation="floatAnimation"
      class="select-none space-y-4 w-full relative overflow-hidden transition-[box-shadow,border-color,opacity] duration-300"
      :class="[isReached ? 'active-timeline-card opacity-100' : 'opacity-85 hover:opacity-100']"
    >
      <!-- Permanent SVG Neon Perimeter (Opacity toggled with GPU acceleration, 0 reflow) -->
      <svg
        class="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible rounded-2xl transition-opacity duration-300"
        :class="isReached ? 'opacity-100' : 'opacity-0'"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx="15"
          fill="none"
          stroke="#e2f161"
          stroke-width="1.5"
          class="active-card-border-stroke"
        />
      </svg>

      <!-- Header: Mission Number, Period & Stable Badge Slot -->
      <div
        class="flex items-center justify-between gap-2 border-b border-lime-400/10 pb-3 flex-wrap relative z-20"
      >
        <div class="flex items-center gap-2">
          <span
            class="text-lime-400 font-mono font-bold text-xs tracking-wider drop-shadow-[0_0_8px_#e2f161]"
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
            :variant="isReached || experience.isCurrent ? 'lime' : 'dark'"
            class="uppercase tracking-wider font-bold transition-all duration-300 shrink-0"
            :class="isReached || experience.isCurrent ? 'glow-pulse-badge' : ''"
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
              ? 'glow-pulse-title text-lime-400'
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
            class="text-lime-400 hover:underline inline-flex items-center gap-1 font-bold"
          >
            {{ experience.company }}
            <span class="text-xs">&rarr;</span>
          </a>
          <span v-else class="text-lime-400 font-bold">
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
          <span v-if="experience.department && experience.location" class="text-lime-400/40"
            >|</span
          >
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
          <span class="text-lime-400 font-bold shrink-0 mt-0.5">✦</span>
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
  .active-timeline-card {
    border-color: rgba(226, 241, 97, 0.85) !important;
    box-shadow:
      0 0 35px 3px rgba(226, 241, 97, 0.4),
      0 12px 35px 0 rgba(0, 0, 0, 0.7),
      inset 0 0 20px 0 rgba(226, 241, 97, 0.12) !important;
  }

  .active-card-border-stroke {
    filter: drop-shadow(0 0 8px #e2f161) drop-shadow(0 0 16px rgba(226, 241, 97, 0.8));
    animation: card-border-pulse 2.5s ease-in-out infinite alternate;
  }

  @keyframes card-border-pulse {
    0% {
      stroke-opacity: 0.85;
      filter: drop-shadow(0 0 6px #e2f161) drop-shadow(0 0 12px rgba(226, 241, 97, 0.5));
    }
    100% {
      stroke-opacity: 1;
      filter: drop-shadow(0 0 12px #e2f161) drop-shadow(0 0 24px rgba(226, 241, 97, 0.95));
    }
  }

  .glow-pulse-title {
    animation: title-glow-pulse 3s ease-in-out infinite alternate;
  }

  @keyframes title-glow-pulse {
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

  .glow-pulse-badge {
    box-shadow:
      0 0 14px rgba(226, 241, 97, 0.8),
      0 0 26px rgba(226, 241, 97, 0.45) !important;
    animation: badge-glow-pulse 2s ease-in-out infinite alternate;
  }

  @keyframes badge-glow-pulse {
    0% {
      box-shadow: 0 0 8px rgba(226, 241, 97, 0.45);
    }
    100% {
      box-shadow:
        0 0 18px rgba(226, 241, 97, 0.85),
        0 0 30px rgba(226, 241, 97, 0.55);
    }
  }
</style>
