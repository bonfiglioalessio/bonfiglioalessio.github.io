<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue'
  import { useAudioSynth } from '../../composables/useAudioSynth'

  interface Props {
    targetValue: number
    prefix?: string
    suffix?: string
    label: string
    floatAnimation?: string
    duration?: number
    delay?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    prefix: '',
    suffix: '',
    floatAnimation: '',
    duration: 850,
    delay: 0,
  })

  const { playBorderLoad, playHover } = useAudioSynth()

  const displayValue = ref(0)
  const progress = ref(0) // 0 to 100
  const isLoaded = ref(false)
  let animFrameId: number | null = null
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  function runCounterAnimation() {
    if (animFrameId !== null) {
      cancelAnimationFrame(animFrameId)
    }

    displayValue.value = 0
    progress.value = 0
    isLoaded.value = false

    // Play cyber border loading synth sound
    playBorderLoad(props.duration / 1000)

    const startTime = performance.now()

    function step(currentTime: number) {
      const elapsed = currentTime - startTime
      const linearProgress = Math.min(1, elapsed / props.duration)

      // Smooth ease-out cubic curve
      const eased = 1 - Math.pow(1 - linearProgress, 3)

      displayValue.value = Math.round(eased * props.targetValue)
      progress.value = Math.min(100, eased * 100)

      if (linearProgress < 1) {
        animFrameId = requestAnimationFrame(step)
      } else {
        displayValue.value = props.targetValue
        progress.value = 100
        isLoaded.value = true
        animFrameId = null
      }
    }

    animFrameId = requestAnimationFrame(step)
  }

  onMounted(() => {
    timeoutId = setTimeout(() => {
      runCounterAnimation()
    }, props.delay)
  })

  onUnmounted(() => {
    if (animFrameId !== null) {
      cancelAnimationFrame(animFrameId)
    }
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }
  })
</script>

<template>
  <div :class="floatAnimation" class="w-full">
    <div
      class="stat-counter-card relative p-3 sm:p-3.5 rounded-2xl bg-dark-900/60 backdrop-blur-md border border-lime-400/20 flex flex-col justify-center text-center sm:text-left select-none cursor-pointer group transition-all duration-300 hover:scale-[1.04] overflow-hidden"
      @click="runCounterAnimation"
      @mouseenter="playHover"
    >
      <!-- Animated Yellow/Lime SVG Loading Border Perimeter -->
      <svg
        class="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- Background faint track -->
        <rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx="15"
          fill="none"
          stroke="rgba(226, 241, 97, 0.12)"
          stroke-width="1.5"
        />

        <!-- Active Yellow Loading Stroke -->
        <rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx="15"
          fill="none"
          stroke="#e2f161"
          stroke-width="2"
          pathLength="100"
          :stroke-dasharray="100"
          :stroke-dashoffset="100 - progress"
          stroke-linecap="round"
          class="transition-[stroke-dashoffset] duration-75 ease-linear"
          :class="isLoaded ? 'stat-border-glow' : ''"
        />
      </svg>

      <!-- Corner HUD Accents -->
      <div
        class="absolute top-1.5 right-2 text-[9px] font-mono text-lime-400/40 group-hover:text-lime-400 transition-colors"
      >
        <span v-if="!isLoaded" class="animate-pulse text-[8px]">● WAIT</span>
        <span v-else class="text-[8px] text-lime-400">✓ SYNC</span>
      </div>

      <!-- Animated Stat Value -->
      <div
        class="text-xl sm:text-2xl font-bold font-display text-lime-400 flex items-center justify-center sm:justify-start drop-shadow-[0_0_12px_rgba(226,241,97,0.65)] relative z-20 pt-1"
      >
        <span>{{ prefix }}{{ displayValue }}{{ suffix }}</span>
      </div>

      <!-- Stat Label -->
      <div
        class="text-[9px] sm:text-[10px] text-slate-400 font-mono uppercase tracking-wider group-hover:text-slate-200 transition-colors relative z-20 pt-0.5 truncate"
      >
        {{ label }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .stat-counter-card {
    box-shadow:
      0 4px 20px 0 rgba(0, 0, 0, 0.5),
      0 0 15px -2px rgba(226, 241, 97, 0.1);

    &:hover {
      box-shadow:
        0 8px 25px 0 rgba(0, 0, 0, 0.6),
        0 0 25px 2px rgba(226, 241, 97, 0.35);
    }
  }

  .stat-border-glow {
    filter: drop-shadow(0 0 6px #e2f161) drop-shadow(0 0 12px rgba(226, 241, 97, 0.6));
    animation: border-pulse 3s ease-in-out infinite alternate;
  }

  @keyframes border-pulse {
    0% {
      opacity: 0.85;
      stroke: #e2f161;
    }
    50% {
      opacity: 1;
      stroke: #f5ff82;
    }
    100% {
      opacity: 0.85;
      stroke: #c2e83b;
    }
  }
</style>
