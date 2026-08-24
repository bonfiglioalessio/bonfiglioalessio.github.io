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
    if (props.timelineProgress === 0) return props.index === 0 && false
    // Calculate fractional position of each node along the vertical rail (including header offset)
    const activationThreshold = props.total > 1 ? (props.index / (props.total - 1)) * 65 + 25 : 30
    return props.timelineProgress >= activationThreshold
  })
</script>

<template>
  <div class="relative w-full group">
    <!-- Horizontal Neon Connector Branch (From Rail to Card) -->
    <div
      class="absolute top-7 -left-7 sm:-left-9 lg:-left-10 w-7 sm:w-9 lg:w-10 h-[2px] pointer-events-none transition-all duration-500 z-10"
      :class="[
        isReached
          ? 'bg-gradient-to-r from-lime-400 to-lime-400/40 shadow-[0_0_8px_#e2f161]'
          : 'bg-lime-400/15 group-hover:bg-lime-400/30',
      ]"
    />

    <!-- Glowing Timeline Node Marker (Centered Directly on the Left Rail) -->
    <div
      class="absolute top-4 -left-[40px] sm:-left-[49px] lg:-left-[53px] w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-dark-950 flex items-center justify-center z-20 transition-all duration-500"
      :class="
        isReached || experience.isCurrent
          ? 'border-2 border-lime-400 shadow-[0_0_15px_rgba(226,241,97,0.7)] scale-110'
          : 'border border-lime-400/25 bg-dark-950/80 scale-95 opacity-70'
      "
    >
      <span v-if="experience.isCurrent" class="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
        <span
          class="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"
        />
        <span
          class="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-lime-400 shadow-[0_0_10px_#e2f161]"
        />
      </span>
      <span
        v-else
        class="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300"
        :class="
          isReached
            ? 'bg-lime-400 shadow-[0_0_8px_#e2f161]'
            : 'bg-slate-500 group-hover:bg-lime-400/70'
        "
      />
    </div>

    <!-- Experience Content Card with Scroll Activation -->
    <AppCard
      padding="md"
      rounded="2xl"
      :hud-reticles="true"
      :tilt="false"
      :float-animation="floatAnimation"
      class="transition-all duration-500 select-none space-y-4 w-full"
      :class="[
        isReached
          ? 'border-lime-400/35 shadow-[0_0_20px_rgba(226,241,97,0.15)] opacity-100'
          : 'opacity-85 hover:opacity-100',
      ]"
    >
      <!-- Header: Mission Number, Period & Status Badge -->
      <div
        class="flex items-center justify-between gap-2 border-b border-lime-400/10 pb-3 flex-wrap"
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
          <AppBadge v-if="experience.statusBadge" :variant="experience.isCurrent ? 'lime' : 'dark'">
            {{ experience.statusBadge }}
          </AppBadge>
        </div>
      </div>

      <!-- Role, Company & Department Details -->
      <div>
        <h3
          class="text-xl sm:text-2xl font-bold font-syne text-white group-hover:text-lime-400 transition-colors flex items-center gap-2 flex-wrap"
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
      <p class="text-xs sm:text-sm text-slate-300 font-mono leading-relaxed">
        {{ experience.description }}
      </p>

      <!-- Key Engineering Achievements (Highlights) -->
      <ul
        v-if="experience.diff?.highlights?.length"
        class="space-y-2 pt-1 text-[11px] sm:text-xs font-mono text-slate-300 bg-dark-950/50 p-3 sm:p-3.5 rounded-xl border border-lime-400/10"
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
        class="flex flex-wrap gap-2 pt-3 border-t border-lime-400/10"
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
