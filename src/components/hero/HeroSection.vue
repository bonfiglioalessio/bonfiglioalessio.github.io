<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { portfolioData } from '../../data/portfolio'
  import AppButton from '../ui/AppButton.vue'
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
    class="min-h-screen flex items-center pt-24 sm:pt-28 lg:pt-32 pb-6 sm:pb-10 lg:pb-14 relative z-10 w-full"
  >
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center w-full">
      <!-- Left Column: Bio, Headline, Stats & CTA with Staggered Entrance Reveal -->
      <div class="lg:col-span-7 space-y-4 sm:space-y-5 lg:space-y-6">
        <!-- Status & Company Badge Pill (Hidden on Mobile) -->
        <div
          class="hidden sm:inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full space-floating-card text-xs font-mono select-none transition-all duration-700 ease-out"
          :class="
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
          "
        >
          <span class="relative flex h-2.5 w-2.5">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"
            />
            <span
              class="relative inline-flex rounded-full h-2.5 w-2.5 bg-lime-400 shadow-[0_0_8px_#e2f161]"
            />
          </span>
          <span class="text-slate-200">
            Software Engineer
            <strong class="text-lime-400 font-bold drop-shadow-[0_0_8px_#e2f161]"> @ iliad </strong>
          </span>
          <span class="text-lime-400/40">|</span>
          <span class="text-slate-400">Milano &amp; Remote</span>
        </div>

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
          class="grid grid-cols-3 gap-2 sm:gap-4 py-2 transition-all duration-700 delay-450 ease-out"
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

        <!-- Call to Action Buttons (Stacked on Mobile, Row on Desktop) -->
        <div
          class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1 w-full sm:w-auto transition-all duration-700 delay-600 ease-out"
          :class="
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
          "
        >
          <AppButton
            variant="primary"
            size="lg"
            href="#projects"
            as="a"
            class="w-full sm:w-auto text-center"
          >
            <span>EXPLORE WORK</span>
            <span class="text-sm">&rarr;</span>
          </AppButton>
          <AppButton
            variant="outline"
            size="lg"
            href="#contact"
            as="a"
            class="w-full sm:w-auto text-center"
          >
            <span>$ contact_me</span>
          </AppButton>
        </div>
      </div>

      <!-- Right Column: Interactive Cockpit -->
      <div class="lg:col-span-5 flex justify-center lg:justify-end">
        <HeroCockpit />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
  .space-floating-card {
    background: rgba(10, 15, 30, 0.7);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(226, 241, 97, 0.15);
    box-shadow:
      0 0 20px rgba(0, 0, 0, 0.6),
      inset 0 0 12px rgba(226, 241, 97, 0.05);
  }
</style>
