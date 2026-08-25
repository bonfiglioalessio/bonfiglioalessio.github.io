<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue'
  import { usePortfolioData } from '../../composables/usePortfolioData'
  import HeroCockpit from './HeroCockpit.vue'
  import StatCounterCard from './StatCounterCard.vue'

  interface Props {
    isReady?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    isReady: false,
  })

  const { profile } = usePortfolioData()

  const isLoaded = ref(false)

  // Dynamically parse headline parts from profile.headline
  const headlineParts = computed(() => {
    const raw = profile.value.headline || 'Turning complex logic into insane frontend UI.'
    if (raw.includes('\n')) {
      const [p1, ...p2] = raw.split('\n')
      return { part1: p1 || '', part2: p2.join(' ') }
    }
    if (raw.includes('into ')) {
      const idx = raw.indexOf('into ') + 5
      return { part1: raw.slice(0, idx).trim(), part2: raw.slice(idx).trim() }
    }
    const words = raw.split(' ')
    const mid = Math.ceil(words.length / 2)
    return {
      part1: words.slice(0, mid).join(' '),
      part2: words.slice(mid).join(' '),
    }
  })

  const displayedPart1 = ref('')
  const displayedPart2 = ref('')
  const isTypingComplete = ref(false)
  const isStatsVisible = ref(false)

  let isStreamingActive = false

  async function startAiStreaming() {
    if (isStreamingActive) return
    isStreamingActive = true

    const part1 = headlineParts.value.part1
    const part2 = headlineParts.value.part2

    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      displayedPart1.value = part1
      displayedPart2.value = part2
      isTypingComplete.value = true
      isStatsVisible.value = true
      return
    }

    displayedPart1.value = ''
    displayedPart2.value = ''
    isTypingComplete.value = false

    // Brief smooth overlap with preloader fade-out (80ms)
    await new Promise((r) => setTimeout(r, 80))

    // Stream Part 1 character by character for ultimate smoothness
    for (let i = 1; i <= part1.length; i++) {
      displayedPart1.value = part1.slice(0, i)
      const delay = Math.floor(Math.random() * 12) + 16 // 16ms - 28ms
      await new Promise((r) => setTimeout(r, delay))
    }

    await new Promise((r) => setTimeout(r, 80))

    // Stream Part 2 character by character
    for (let i = 1; i <= part2.length; i++) {
      displayedPart2.value = part2.slice(0, i)
      const delay = Math.floor(Math.random() * 14) + 18 // 18ms - 32ms
      await new Promise((r) => setTimeout(r, delay))
    }

    isTypingComplete.value = true

    // Trigger stat counters and badges right as headline completes
    setTimeout(() => {
      isStatsVisible.value = true
    }, 60)
  }

  function triggerEntrance() {
    if (isLoaded.value) return
    isLoaded.value = true
    startAiStreaming()
  }

  watch(
    () => props.isReady,
    (ready) => {
      if (ready) {
        triggerEntrance()
      }
    },
    { immediate: true },
  )

  onMounted(() => {
    if (props.isReady) {
      triggerEntrance()
    }
  })

  const statAnimClasses = ['animate-float-slow', 'animate-float-delayed', 'animate-float-subtle']
  const statThemes: ('lime' | 'white' | 'emerald')[] = ['lime', 'white', 'emerald']
</script>

<template>
  <section
    class="min-h-screen lg:h-screen lg:max-h-screen flex flex-col justify-between pt-28 sm:pt-32 lg:pt-24 xl:pt-26 pb-6 sm:pb-8 lg:pb-3 relative z-10 w-full"
  >
    <div
      class="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-10 xl:gap-12 items-center w-full my-auto flex-1"
    >
      <!-- Left Column: Bio, Headline, Stats with Balanced Spacing -->
      <div class="lg:col-span-7 space-y-5 sm:space-y-7 lg:space-y-4 xl:space-y-5">
        <!-- Level Indicator & Main Display Headline (Zero-Gravity Floating) -->
        <div
          class="space-y-2 sm:space-y-2.5 lg:space-y-2 transition-all duration-700 ease-out"
          :class="
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
          "
        >
          <p
            class="text-xs sm:text-xs lg:text-[11px] xl:text-xs text-lime-400 font-mono tracking-widest uppercase flex items-center gap-2 drop-shadow-[0_0_8px_rgba(226,241,97,0.5)] select-none"
          >
            <span>{{ profile.level || '&gt;_ LEVEL 06 DEVELOPER' }}</span>
            <span class="h-px w-10 sm:w-12 bg-lime-400/60 shadow-[0_0_8px_#e2f161]" />
          </p>

          <!-- AI Streamed Headline with Invisible Ghost Layout Lock (0.00 CLS) -->
          <div class="relative">
            <!-- Invisible Ghost Anchor: Locks exact width & height immediately in DOM flow -->
            <h1
              class="text-4xl sm:text-6xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold font-display tracking-tight leading-[1.10] sm:leading-[1.05] invisible pointer-events-none select-none"
              aria-hidden="true"
            >
              <span class="inline">{{ headlineParts.part1 }}</span>
              <br class="hidden sm:inline" />
              <span class="inline">{{ headlineParts.part2 }}</span>
            </h1>

            <!-- Active Typed Overlay: Absolute inset-0, fills pre-allocated space with zero shift -->
            <h1
              class="text-4xl sm:text-6xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold font-display tracking-tight leading-[1.10] sm:leading-[1.05] absolute inset-0"
              :class="isTypingComplete ? 'animate-float-slow' : ''"
            >
              <span class="text-white inline">
                {{ displayedPart1 }}
              </span>
              <br class="hidden sm:inline" />
              <span
                v-if="displayedPart2"
                class="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-lime-300 to-emerald-400 drop-shadow-[0_0_35px_rgba(204,255,0,0.45)] inline"
              >
                {{ displayedPart2 }}
              </span>
              <!-- AI Streaming Token Caret -->
              <span
                v-if="!isTypingComplete"
                class="inline-block w-[3px] sm:w-[4px] h-[0.75em] align-baseline ml-1 bg-lime-400 shadow-[0_0_10px_#e2f161] rounded-sm animate-pulse"
              />
            </h1>
          </div>
        </div>

        <!-- Narrative Bio (Smoothly reveals as part of the hero composition) -->
        <p
          class="text-sm sm:text-base lg:text-xs xl:text-sm text-slate-300 font-mono leading-relaxed max-w-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-700 delay-150 ease-out"
          :class="
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
          "
        >
          {{ profile.bio }}
        </p>

        <!-- Metric Stat Counters (Grid 3 Columns with Counter Animation & Delayed Entrance) -->
        <div
          class="grid grid-cols-3 gap-2.5 sm:gap-4 lg:gap-3 xl:gap-4 pt-1 transition-all duration-700 ease-out"
          :class="
            isStatsVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-6 pointer-events-none'
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
            :active="isStatsVisible"
            :delay="idx * 120"
            :duration="750"
            :float-animation="statAnimClasses[idx % statAnimClasses.length]"
          />
        </div>
      </div>

      <!-- Right Column: Interactive Orbital Satellite Cockpit -->
      <div
        class="lg:col-span-5 flex justify-center lg:justify-end -mt-2 sm:mt-1 lg:mt-0 relative z-0 transition-all duration-700 delay-150 ease-out"
        :class="isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'"
      >
        <HeroCockpit />
      </div>
    </div>

    <!-- Bottom Center Orbital Scroll Flight Prompt -->
    <div
      class="hidden lg:flex pt-1 pb-1 justify-center w-full select-none transition-all duration-700 ease-out shrink-0"
      :class="
        isStatsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
      "
    >
      <a
        href="#stack"
        class="group inline-flex items-center gap-2 text-[11px] font-mono text-slate-400 hover:text-lime-400 transition-all cursor-pointer hover:scale-105 active:scale-95"
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
