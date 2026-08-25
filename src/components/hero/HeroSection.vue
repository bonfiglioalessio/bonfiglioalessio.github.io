<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { portfolioData } from '../../data/portfolio'
  import HeroCockpit from './HeroCockpit.vue'
  import StatCounterCard from './StatCounterCard.vue'

  const { profile } = portfolioData

  const isLoaded = ref(false)

  // AI Agent Token Streaming Typewriter Engine
  const fullPart1 = 'Turning complex logic into'
  const fullPart2 = 'insane frontend UI.'

  const displayedPart1 = ref('')
  const displayedPart2 = ref('')
  const isTypingComplete = ref(false)

  async function startAiStreaming() {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      displayedPart1.value = fullPart1
      displayedPart2.value = fullPart2
      isTypingComplete.value = true
      return
    }

    // Brief initial delay before agent generation starts
    await new Promise((r) => setTimeout(r, 200))

    // Stream Part 1 (1 to 3 chars chunking)
    let idx1 = 0
    while (idx1 < fullPart1.length) {
      const chunkSize = Math.min(Math.floor(Math.random() * 3) + 1, fullPart1.length - idx1)
      displayedPart1.value = fullPart1.slice(0, idx1 + chunkSize)
      idx1 += chunkSize
      const delay = Math.floor(Math.random() * 25) + 25 // 25ms - 50ms
      await new Promise((r) => setTimeout(r, delay))
    }

    await new Promise((r) => setTimeout(r, 90))

    // Stream Part 2 (1 to 3 chars chunking)
    let idx2 = 0
    while (idx2 < fullPart2.length) {
      const chunkSize = Math.min(Math.floor(Math.random() * 3) + 1, fullPart2.length - idx2)
      displayedPart2.value = fullPart2.slice(0, idx2 + chunkSize)
      idx2 += chunkSize
      const delay = Math.floor(Math.random() * 30) + 30 // 30ms - 60ms
      await new Promise((r) => setTimeout(r, delay))
    }

    isTypingComplete.value = true
  }

  onMounted(() => {
    // Trigger cinematic entrance reveal on mount
    requestAnimationFrame(() => {
      isLoaded.value = true
      startAiStreaming()
    })
  })

  const statAnimClasses = ['animate-float-slow', 'animate-float-delayed', 'animate-float-subtle']
  const statThemes: ('lime' | 'white' | 'emerald')[] = ['lime', 'white', 'emerald']
</script>

<template>
  <section
    class="min-h-screen flex flex-col justify-between pt-24 sm:pt-28 lg:pt-32 pb-8 sm:pb-12 relative z-10 w-full"
  >
    <div
      class="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center w-full flex-1"
    >
      <!-- Left Column: Bio, Headline, Stats with Staggered Entrance Reveal -->
      <div class="lg:col-span-7 space-y-5 sm:space-y-6 lg:space-y-7">
        <!-- Level Indicator & Main Display Headline (Zero-Gravity Floating) -->
        <div
          class="space-y-2 transition-all duration-700 delay-150 ease-out"
          :class="
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
          "
        >
          <p
            class="text-[11px] sm:text-xs text-lime-400 font-mono tracking-widest uppercase flex items-center gap-2 drop-shadow-[0_0_8px_rgba(226,241,97,0.5)] select-none"
          >
            <span>&gt;_ LEVEL 06 DEVELOPER</span>
            <span class="h-px w-10 sm:w-12 bg-lime-400/60 shadow-[0_0_8px_#e2f161]" />
          </p>

          <!-- AI Agent Chunk-Streamed Headline (Zero CLS with Ghost Height Lock) -->
          <div class="relative">
            <!-- Invisible Ghost Placeholder: Locks exact layout dimensions & line wraps immediately -->
            <h1
              class="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display tracking-tight leading-[1.08] sm:leading-[1.05] opacity-0 select-none pointer-events-none"
              aria-hidden="true"
            >
              <span class="inline-block">Turning complex logic into</span>
              <br class="hidden sm:inline" />
              <span class="inline-block">insane frontend UI.</span>
            </h1>

            <!-- Active Streamed Overlay (Perfect match, zero displacement of bio/stats) -->
            <h1
              class="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display text-white tracking-tight leading-[1.08] sm:leading-[1.05] absolute inset-0"
            >
              <span class="inline-block animate-float-slow">
                {{ displayedPart1 }}
              </span>
              <br v-if="displayedPart1.length >= fullPart1.length" class="hidden sm:inline" />
              <span
                v-if="displayedPart2"
                class="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-lime-300 to-emerald-400 drop-shadow-[0_0_35px_rgba(204,255,0,0.45)] inline-block animate-float-delayed"
              >
                {{ displayedPart2 }}
              </span>
              <!-- AI Streaming Token Caret (Attached to current text stream) -->
              <span
                v-if="!isTypingComplete"
                class="inline-block w-[3px] sm:w-[4px] h-[0.7em] align-baseline ml-1 bg-lime-400 shadow-[0_0_10px_#e2f161] rounded-sm animate-pulse"
              />
            </h1>
          </div>
        </div>

        <!-- Narrative Bio -->
        <p
          class="text-xs sm:text-sm text-slate-300 font-mono leading-relaxed max-w-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-700 delay-300 ease-out"
          :class="
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
          "
        >
          {{ profile.bio }}
        </p>

        <!-- Metric Stat Counters (Grid 3 Columns with Counter Animation & Delayed Entrance) -->
        <div
          class="grid grid-cols-3 gap-2.5 sm:gap-4 pt-1 transition-all duration-700 delay-450 ease-out"
          :class="
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
          "
        >
          <StatCounterCard
            v-for="(stat, idx) in profile.stats"
            :key="stat.label"
            :target-value="stat.value"
            :prefix="stat.prefix"
            :suffix="stat.suffix"
            :label="stat.label"
            :theme="statThemes[idx] || 'lime'"
            :delay="idx * 220 + 80"
            :duration="800"
            :float-animation="statAnimClasses[idx % statAnimClasses.length]"
          />
        </div>
      </div>

      <!-- Right Column: Interactive Orbital Satellite Cockpit -->
      <div class="lg:col-span-5 flex justify-center lg:justify-end">
        <HeroCockpit />
      </div>
    </div>

    <!-- Bottom Center Orbital Scroll Flight Prompt -->
    <div
      class="pt-6 sm:pt-8 flex justify-center w-full select-none transition-all duration-700 delay-700 ease-out"
      :class="
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
      "
    >
      <a
        href="#stack"
        class="group inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-dark-950/80 border border-lime-400/20 hover:border-lime-400/50 text-[11px] font-mono text-slate-400 hover:text-lime-400 transition-all shadow-[0_0_20px_rgba(0,0,0,0.6)] backdrop-blur-md cursor-pointer hover:scale-105 active:scale-95"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-lime-400 animate-ping inline-block" />
        <span class="tracking-wider uppercase font-semibold">SCROLL TO ENTER CONSTELLATION</span>
        <span class="text-lime-400 font-bold group-hover:translate-y-0.5 transition-transform"
          >&darr;</span
        >
      </a>
    </div>
  </section>
</template>
