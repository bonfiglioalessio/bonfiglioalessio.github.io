<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue'

  const emit = defineEmits<{
    (e: 'finish'): void
  }>()

  const progress = ref(0)
  const isExiting = ref(false)
  const isHidden = ref(false)

  const techStack = [
    {
      name: 'Vite',
      version: 'v6',
      iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg',
      threshold: 15,
    },
    {
      name: 'Vue 3',
      version: 'v3.5',
      iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
      threshold: 35,
    },
    {
      name: 'TypeScript',
      version: 'v5.7',
      iconUrl:
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
      threshold: 55,
    },
    {
      name: 'Tailwind',
      version: 'v3.4',
      iconUrl:
        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
      threshold: 75,
    },
    {
      name: 'SCSS',
      version: 'sass-emb',
      iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg',
      threshold: 90,
    },
  ]

  const bootLogs = [
    'BOOTING NEXT-GEN HMR RUNTIME [VITE 6]',
    'INITIALIZING COMPOSITION TREE [VUE 3.5]',
    'VALIDATING TYPE SAFETY & SCHEMAS [TYPESCRIPT]',
    'COMPILING CYBER DESIGN TOKENS [TAILWIND + SCSS]',
    'ALL SYSTEMS NOMINAL // LAUNCHING COCKPIT',
  ]
  const currentLogIndex = ref(0)

  let timer: number | null = null

  function skipLoading() {
    if (isExiting.value || isHidden.value) return
    progress.value = 100
    currentLogIndex.value = bootLogs.length - 1
    triggerExit()
  }

  function triggerExit() {
    if (isExiting.value) return
    isExiting.value = true
    emit('finish')
    setTimeout(() => {
      isHidden.value = true
    }, 500)
  }

  onMounted(() => {
    // Respect reduced motion
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      skipLoading()
      return
    }

    const duration = 1400 // ~1.4 seconds total boot duration
    const intervalTime = 30
    const stepIncrement = 100 / (duration / intervalTime)

    timer = window.setInterval(() => {
      progress.value = Math.min(100, Math.round(progress.value + stepIncrement))

      if (progress.value < 25) {
        currentLogIndex.value = 0
      } else if (progress.value < 50) {
        currentLogIndex.value = 1
      } else if (progress.value < 75) {
        currentLogIndex.value = 2
      } else if (progress.value < 95) {
        currentLogIndex.value = 3
      } else {
        currentLogIndex.value = 4
      }

      if (progress.value >= 100) {
        if (timer) clearInterval(timer)
        setTimeout(() => {
          triggerExit()
        }, 120)
      }
    }, intervalTime)

    window.addEventListener('keydown', skipLoading)
  })

  onUnmounted(() => {
    if (timer) clearInterval(timer)
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', skipLoading)
    }
  })
</script>

<template>
  <div
    v-if="!isHidden"
    class="fixed inset-0 z-[100] bg-dark-950 flex flex-col items-center justify-center select-none overflow-hidden transition-all duration-700 ease-out cursor-pointer"
    :class="isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'"
    @click="skipLoading"
  >
    <!-- Background Ambient Glow -->
    <div
      class="absolute w-[600px] h-[600px] rounded-full bg-lime-400/10 blur-[140px] pointer-events-none -translate-y-6"
    />

    <!-- HUD Container Card -->
    <div
      class="relative z-10 w-full max-w-lg px-6 flex flex-col items-center text-center space-y-6"
    >
      <!-- Station Identity Brand Logo (Clean typographic logo, no badge/icon) -->
      <div class="space-y-1 flex flex-col items-center">
        <div
          class="text-base sm:text-lg font-syne font-extrabold tracking-wider text-white flex items-center gap-1.5 select-none drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
        >
          <span class="text-lime-400 drop-shadow-[0_0_8px_#e2f161]">&lt;</span>
          <span>A.BONFIGLIO</span>
          <span class="text-lime-400 drop-shadow-[0_0_8px_#e2f161]">/&gt;</span>
        </div>

        <div
          class="text-[10px] sm:text-[11px] font-mono text-slate-400 tracking-wider uppercase flex items-center gap-2"
        >
          <span
            class="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse shadow-[0_0_8px_#e2f161]"
          />
          <span>INITIALIZING CORE APPLICATION STACK</span>
          <span
            class="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse shadow-[0_0_8px_#e2f161]"
          />
        </div>
      </div>

      <!-- Tech Stack Interactive HUD Grid (5 Core Technologies) -->
      <div class="grid grid-cols-5 gap-2 sm:gap-3 w-full py-1">
        <div
          v-for="tech in techStack"
          :key="tech.name"
          class="flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-xl border transition-all duration-300 backdrop-blur-md"
          :class="
            progress >= tech.threshold
              ? 'bg-dark-900/90 border-lime-400/50 shadow-[0_0_15px_rgba(226,241,97,0.25)] scale-105'
              : 'bg-dark-900/30 border-white/5 opacity-40 scale-95'
          "
        >
          <!-- Tech Icon with glow on active -->
          <div class="relative w-6 h-6 sm:w-7 sm:h-7 mb-1.5 flex items-center justify-center">
            <img
              :src="tech.iconUrl"
              :alt="tech.name"
              class="w-full h-full object-contain transition-transform duration-300"
              :class="
                progress >= tech.threshold
                  ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]'
                  : 'grayscale opacity-60'
              "
            />
          </div>

          <!-- Tech Name & Version Badge -->
          <span
            class="text-[10px] sm:text-[11px] font-mono font-bold truncate max-w-full"
            :class="progress >= tech.threshold ? 'text-white' : 'text-slate-500'"
          >
            {{ tech.name }}
          </span>
          <span
            class="text-[8px] sm:text-[9px] font-mono tracking-tight"
            :class="progress >= tech.threshold ? 'text-lime-400' : 'text-slate-600'"
          >
            {{ tech.version }}
          </span>
        </div>
      </div>

      <!-- Cyber Digital Progress Bar -->
      <div class="w-full space-y-2">
        <div class="flex items-center justify-between text-[11px] font-mono font-bold">
          <span class="text-lime-400 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-lime-400 animate-ping" />
            <span>SYNCHRONIZING MODULES</span>
          </span>
          <span class="text-white drop-shadow-[0_0_8px_#e2f161]"> {{ progress }}% </span>
        </div>

        <!-- Progress Track -->
        <div
          class="w-full h-1.5 bg-dark-900 rounded-full overflow-hidden border border-lime-400/30 p-[1px]"
        >
          <div
            class="h-full bg-gradient-to-r from-lime-400 via-emerald-400 to-cyan-400 rounded-full shadow-[0_0_12px_#e2f161] transition-all duration-75"
            :style="{ width: `${progress}%` }"
          />
        </div>
      </div>

      <!-- Streaming Boot Log Message -->
      <div class="h-6 flex items-center justify-center">
        <div class="text-[10px] sm:text-[11px] font-mono text-slate-400 truncate tracking-tight">
          <span class="text-lime-400 mr-1.5">&gt;</span>
          <span class="text-slate-200">{{ bootLogs[currentLogIndex] }}</span>
        </div>
      </div>

      <!-- Skip Prompt Helper -->
      <div class="pt-1 text-[9px] font-mono text-slate-600 tracking-widest uppercase">
        [ CLICK OR PRESS ANY KEY TO SKIP ]
      </div>
    </div>
  </div>
</template>
