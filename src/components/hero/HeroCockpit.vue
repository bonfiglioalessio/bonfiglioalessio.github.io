<script setup lang="ts">
  import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
  import { useCliEngine } from '../../composables/useCliEngine'
  import { useAudioSynth } from '../../composables/useAudioSynth'
  import { use3DTilt } from '../../composables/use3DTilt'
  import { useCockpitState } from '../../composables/useCockpitState'

  type TabType = 'terminal' | 'config'
  const activeTab = ref<TabType>('terminal')

  // Window State Controls (Red: Crash, Yellow: Minimize, Green: Fullscreen)
  const {
    isCockpitMinimized: isMinimized,
    isCockpitFullscreen: isFullscreen,
    isCockpitCrashed: isCrashed,
  } = useCockpitState()
  const isCrashAnimating = ref(false)
  const isWarpInAnimating = ref(false)
  const isRebooting = ref(false)

  const { entries, currentInput, executeCommand, handleAutoComplete, navigateHistory } =
    useCliEngine()

  const {
    playClick,
    playHover,
    playCrashExplosion,
    playMinimizeGlide,
    playMaximizeWarp,
    playRebootSequence,
  } = useAudioSynth()

  const cockpitRef = ref<HTMLElement | null>(null)
  const terminalScrollRef = ref<HTMLDivElement | null>(null)
  const fullscreenTerminalScrollRef = ref<HTMLDivElement | null>(null)
  const inputRef = ref<HTMLInputElement | null>(null)
  const fullscreenInputRef = ref<HTMLInputElement | null>(null)
  let terminalObserver: MutationObserver | null = null

  // Gentle 3D Tilt for Satellite Cockpit
  const { transformStyle, handleMouseEnter, handleMouseMove, handleMouseLeave } = use3DTilt(
    cockpitRef,
    {
      maxTilt: 3,
      perspective: 1200,
      scale: 1.01,
      speed: 600,
      glare: false,
    },
  )

  function setTab(tab: TabType) {
    playClick()
    activeTab.value = tab
    if (tab === 'terminal') {
      focusInput()
      scrollToBottom()
    }
  }

  function focusInput() {
    nextTick(() => {
      if (isFullscreen.value) {
        fullscreenInputRef.value?.focus()
      } else {
        inputRef.value?.focus()
      }
    })
  }

  function scrollToBottom() {
    nextTick(() => {
      if (terminalScrollRef.value) {
        terminalScrollRef.value.scrollTop = terminalScrollRef.value.scrollHeight + 1000
      }
      if (fullscreenTerminalScrollRef.value) {
        fullscreenTerminalScrollRef.value.scrollTop =
          fullscreenTerminalScrollRef.value.scrollHeight + 1000
      }
    })
  }

  // Deep watcher to trigger auto-scroll whenever entries change
  watch(
    entries,
    () => {
      scrollToBottom()
    },
    { deep: true, flush: 'post' },
  )

  function handleFormSubmit() {
    if (!currentInput.value.trim()) return
    const cmd = currentInput.value
    currentInput.value = ''
    executeCommand(cmd)
    scrollToBottom()
  }

  function handleTabKey() {
    currentInput.value = handleAutoComplete(currentInput.value)
  }

  function handleArrowUp() {
    currentInput.value = navigateHistory('up')
  }

  function handleArrowDown() {
    currentInput.value = navigateHistory('down')
  }

  function runQuickAction(cmd: string) {
    playClick()
    activeTab.value = 'terminal'
    currentInput.value = ''
    executeCommand(cmd)
    scrollToBottom()
    focusInput()
  }

  function isMobile(): boolean {
    return typeof window !== 'undefined' && window.innerWidth < 640
  }

  // ================= WINDOW BUTTON HANDLERS =================

  // 🔴 Red Button: Crash & Destroy Satellite
  function handleCloseCrash() {
    if (isMobile()) return
    if (isFullscreen.value) {
      handleToggleFullscreen()
      return
    }
    if (isCrashed.value || isCrashAnimating.value) return

    playCrashExplosion()
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('space-supernova-event'))
    }
    isCrashAnimating.value = true

    setTimeout(() => {
      isCrashed.value = true
      isCrashAnimating.value = false
    }, 700)
  }

  // Reboot & Recover Satellite (with Warp In materialization animation)
  function handleRebootSatellite() {
    if (isRebooting.value) return
    playRebootSequence()
    isRebooting.value = true

    setTimeout(() => {
      isCrashed.value = false
      isRebooting.value = false
      isMinimized.value = false
      isWarpInAnimating.value = true
      activeTab.value = 'terminal'

      // Terminal recovery bootstream
      entries.value = [
        {
          id: `boot-${Date.now()}`,
          type: 'system',
          html: `<pre class="space-y-1 text-inherit font-mono text-slate-300 whitespace-pre-wrap">
            <div class="text-lime-400 font-bold tracking-wide">[REBOOT SUCCESSFUL]</div>
            <div class="text-slate-400">&gt; Orbital telemetry re-synchronized @ 420 KM</div>
            <div class="text-emerald-400 font-semibold">&gt; Systems online: 60fps Web Audio + 3D Starfield</div>
            <div class="text-slate-400">&gt; Type <span class="text-lime-400 font-bold">help</span> or choose a quick action below.</div>
          </pre>`,
        },
      ]

      focusInput()
      scrollToBottom()

      setTimeout(() => {
        isWarpInAnimating.value = false
      }, 950)
    }, 600)
  }

  // 🟡 Yellow Button: Minimize to HUD Pill in bottom right
  function handleMinimize() {
    if (isMobile()) return
    if (isFullscreen.value) {
      isFullscreen.value = false
    }
    playMinimizeGlide()
    isMinimized.value = true
  }

  // Restore from Minimized HUD (with smooth re-entry)
  function handleRestore() {
    playRebootSequence()
    isMinimized.value = false
    isWarpInAnimating.value = true
    focusInput()
    scrollToBottom()

    setTimeout(() => {
      isWarpInAnimating.value = false
    }, 950)
  }

  // 🟢 Green Button: Fullscreen Terminal Mode
  function handleToggleFullscreen() {
    if (isMobile()) return
    if (isFullscreen.value) {
      playMinimizeGlide()
      isFullscreen.value = false
      focusInput()
    } else {
      playMaximizeWarp()
      isFullscreen.value = true
      nextTick(() => {
        fullscreenInputRef.value?.focus()
        scrollToBottom()
      })
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && isFullscreen.value) {
      handleToggleFullscreen()
    }
  }

  onMounted(() => {
    scrollToBottom()

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeydown)
    }

    if (terminalScrollRef.value) {
      terminalObserver = new MutationObserver(() => {
        if (terminalScrollRef.value) {
          terminalScrollRef.value.scrollTop = terminalScrollRef.value.scrollHeight + 1000
        }
      })
      terminalObserver.observe(terminalScrollRef.value, {
        childList: true,
        subtree: true,
        characterData: true,
      })
    }
  })

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', handleKeydown)
    }
    if (terminalObserver) {
      terminalObserver.disconnect()
      terminalObserver = null
    }
  })
</script>

<template>
  <div class="w-full flex justify-center" data-ui="cockpit-terminal">
    <!-- ================= CASE 1: SATELLITE CRASHED & DESTROYED ================= -->
    <div
      v-if="isCrashed"
      class="relative w-full max-w-md lg:max-w-xl h-[380px] sm:h-[430px] rounded-3xl border border-rose-500/50 bg-dark-950/95 p-5 sm:p-7 flex flex-col justify-between items-center text-center overflow-hidden font-sans z-10 animate-fade-in"
    >
      <!-- Top Header Row -->
      <div
        class="w-full flex items-center justify-between pb-2.5 text-xs text-rose-400"
      >
        <span class="flex items-center gap-2 font-bold tracking-wider">
          <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
          ORBITAL COLLISION DETECTED
        </span>
        <span class="text-slate-400 font-sans">STATUS: DOWN (0 KM)</span>
      </div>

      <!-- Center Crash Narrative -->
      <div class="space-y-3 my-auto z-10 px-2">
        <svg class="w-12 h-12 text-rose-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <h3
          class="text-base sm:text-lg font-bold text-rose-400 tracking-widest uppercase"
        >
          SATELLITE DESTROYED // LOSS OF ORBIT
        </h3>
        <p class="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
          Il modulo satellite si è schiantato nello spazio profondo. Il sistema di backup è integro
          e pronto al ripristino istantaneo.
        </p>
      </div>

      <!-- Bottom Emergency Reboot Button -->
      <button
        type="button"
        :disabled="isRebooting"
        class="z-10 group flex items-center gap-2 px-5 sm:px-6 py-3 rounded-2xl border font-bold text-xs tracking-wider transition-all duration-300 active:scale-95 cursor-pointer"
        :class="[
          isRebooting
            ? 'bg-lime-400/30 text-lime-300 border-lime-400 animate-pulse pointer-events-none'
            : 'bg-rose-500/20 hover:bg-lime-400 text-rose-300 hover:text-black border-rose-500/60 hover:border-lime-400',
        ]"
        @click="handleRebootSatellite"
      >
        <span
          class="text-sm transition-transform duration-500"
          :class="isRebooting ? 'animate-spin' : 'group-hover:rotate-180'"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
        </span>
        <span>{{ isRebooting ? 'RECONSTRUCTING ORBITAL LINK...' : 'EMERGENCY REBOOT SATELLITE' }}</span>
      </button>
    </div>

    <!-- ================= CASE 2: SATELLITE MINIMIZED TO HUD DOCK ================= -->
    <div
      v-else-if="isMinimized"
      class="relative w-full max-w-md lg:max-w-xl h-[260px] sm:h-[300px] rounded-3xl border border-dashed border-lime-400/40 bg-dark-950/80 p-6 flex flex-col justify-center items-center text-center gap-3.5 font-sans z-10 animate-fade-in"
    >
      <div
        class="w-14 h-14 rounded-2xl bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-lime-400 animate-pulse"
      >
        <svg class="w-8 h-8 text-lime-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
      </div>
      <div class="space-y-1">
        <div class="text-xs sm:text-sm font-bold text-lime-400 tracking-wider">
          SATELLITE MINIMIZED TO HUD DOCK
        </div>
        <p class="text-[11px] text-slate-400 max-w-xs">
          La console orbitale è ora attiva e fluttuante nella HUD fissa in basso a destra.
        </p>
      </div>
      <button
        type="button"
        class="text-xs px-4 py-2 rounded-xl bg-lime-400/20 hover:bg-lime-400 text-lime-300 hover:text-black border border-lime-400/50 font-bold transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
        @click="handleRestore"
      >
        <span>▲</span>
        <span>RESTORE TO ORBIT</span>
      </button>
    </div>

    <!-- ================= CASE 3: STANDARD SATELLITE COCKPIT ================= -->
    <div
      v-else
      ref="cockpitRef"
      class="relative w-full max-w-md lg:max-w-xl orbital-satellite-assembly group"
      :class="[
        isCrashAnimating ? 'animate-crash-shake pointer-events-none' : '',
        isWarpInAnimating ? 'animate-satellite-warp-in pointer-events-none' : '',
      ]"
      :style="transformStyle"
      style="transform-style: preserve-3d"
      @mouseenter="handleMouseEnter"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
    >
      <!-- Atmospheric Cosmic Glow Nebula Aura behind Satellite -->
      <div
        class="absolute -top-16 -right-16 w-80 h-80 bg-lime-400/20 group-hover:bg-lime-400/35 rounded-full blur-3xl pointer-events-none z-0 animate-glow-pulse transition-all duration-500"
      />
      <div
        class="absolute -bottom-10 -left-10 w-64 h-64 bg-cyan-500/15 group-hover:bg-cyan-500/30 rounded-full blur-2xl pointer-events-none z-0 transition-all duration-500"
      />

      <!-- Orbital Trajectory Ring Background -->
      <div
        class="absolute -inset-10 border border-dashed border-sky-400/15 group-hover:border-sky-400/40 rounded-full pointer-events-none opacity-40 group-hover:opacity-80 animate-spin-slow transition-all duration-500"
      />

      <!-- Top Antenna Mast & Transponder Beacon -->
      <div
        class="flex absolute -top-9 sm:-top-10 right-8 sm:right-14 flex-col items-center pointer-events-none z-0 select-none transition-transform duration-500 group-hover:-translate-y-1"
      >
        <span class="relative flex h-2.5 sm:h-3 w-2.5 sm:w-3">
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-80"
          />
          <span
            class="relative inline-flex rounded-full h-2.5 sm:h-3 w-2.5 sm:w-3 bg-lime-400"
          />
        </span>
        <div
          class="w-0.5 h-6 sm:h-7 bg-slate-400 transition-colors duration-300"
        />
        <div
          class="w-3 sm:w-3.5 h-1 sm:h-1.5 bg-slate-700 rounded-t-sm border border-lime-400/40 transition-colors duration-300"
        />
      </div>

      <!-- Left Solar Array Wing Assembly -->
      <div
        class="hidden lg:flex flex-col items-center justify-center absolute -left-9 xl:-left-11 top-[24%] -translate-y-1/2 z-0 pointer-events-none select-none transition-all duration-500 group-hover:scale-105 group-hover:-translate-x-1"
      >
        <div
          class="w-8 xl:w-9 h-36 xl:h-40 rounded-xl solar-wing-surface border border-sky-400/40 group-hover:border-sky-400 flex flex-col items-center justify-between py-2 px-1 relative overflow-hidden transition-all duration-300"
        >
          <div class="flex items-center justify-center gap-1 w-full">
            <span class="w-1 h-1 rounded-full bg-sky-400" />
            <code class="text-[7px] font-mono text-sky-300 font-bold tracking-tighter">PV-A1</code>
            <span class="w-1 h-1 rounded-full bg-sky-400" />
          </div>
          <div class="w-px h-3 bg-sky-400/30 group-hover:bg-sky-400/60" /> <!-- taste-skill-ignore -->
          <div
            class="text-[8px] font-sans text-sky-200 font-bold uppercase tracking-[0.2em] select-none [writing-mode:vertical-rl] rotate-180 group-hover:text-white transition-colors my-auto"
          >
            SOLAR // α
          </div>
          <div class="w-px h-3 bg-sky-400/30 group-hover:bg-sky-400/60" /> <!-- taste-skill-ignore -->
          <div class="flex items-center justify-center gap-1 w-full">
            <span class="w-1 h-1 rounded-full bg-sky-400/70" />
            <code class="text-[7px] font-mono text-sky-300/90 font-bold">450W</code>
            <span class="w-1 h-1 rounded-full bg-sky-400/70" />
          </div>
        </div>
        <div
          class="w-3.5 h-1.5 bg-sky-500/60 rounded-sm absolute right-[-13px] top-1/2 -translate-y-1/2 transition-all duration-300"
        />
      </div>

      <!-- Right Solar Array Wing Assembly -->
      <div
        class="hidden lg:flex flex-col items-center justify-center absolute -right-9 xl:-right-11 top-[76%] -translate-y-1/2 z-0 pointer-events-none select-none transition-all duration-500 group-hover:scale-105 group-hover:translate-x-1"
      >
        <div
          class="w-3.5 h-1.5 bg-sky-500/60 rounded-sm absolute left-[-13px] top-1/2 -translate-y-1/2 transition-all duration-300"
        />
        <div
          class="w-8 xl:w-9 h-36 xl:h-40 rounded-xl solar-wing-surface border border-sky-400/40 group-hover:border-sky-400 flex flex-col items-center justify-between py-2 px-1 relative overflow-hidden transition-all duration-300"
        >
          <div class="flex items-center justify-center gap-1 w-full">
            <span class="w-1 h-1 rounded-full bg-sky-400" />
            <code class="text-[7px] font-mono text-sky-300 font-bold tracking-tighter">PV-B2</code>
            <span class="w-1 h-1 rounded-full bg-sky-400" />
          </div>
          <div class="w-px h-3 bg-sky-400/30 group-hover:bg-sky-400/60" /> <!-- taste-skill-ignore -->
          <div
            class="text-[8px] font-sans text-sky-200 font-bold uppercase tracking-[0.2em] select-none [writing-mode:vertical-rl] rotate-180 group-hover:text-white transition-colors my-auto"
          >
            SOLAR // β
          </div>
          <div class="w-px h-3 bg-sky-400/30 group-hover:bg-sky-400/60" /> <!-- taste-skill-ignore -->
          <div class="flex items-center justify-center gap-1 w-full">
            <span class="w-1 h-1 rounded-full bg-sky-400/70" />
            <code class="text-[7px] font-mono text-sky-300/90 font-bold">100%</code>
            <span class="w-1 h-1 rounded-full bg-sky-400/70" />
          </div>
        </div>
      </div>

      <!-- Ion Plasma Thrusters -->
      <div class="absolute -bottom-3 left-12 w-4 h-6 bg-gradient-to-b from-cyan-400 via-sky-400/60 to-transparent blur-[2px] opacity-80 group-hover:opacity-100 group-hover:scale-125 pointer-events-none ion-thruster-jet transition-all duration-300" /> <!-- taste-skill-ignore -->
      <div class="absolute -bottom-3 right-12 w-4 h-6 bg-gradient-to-b from-cyan-400 via-sky-400/60 to-transparent blur-[2px] opacity-80 group-hover:opacity-100 group-hover:scale-125 pointer-events-none ion-thruster-jet transition-all duration-300" /> <!-- taste-skill-ignore -->

      <!-- ================= MAIN SATELLITE COCKPIT CONTAINER ================= -->
      <div
        class="w-full h-[370px] sm:h-[420px] lg:h-[440px] p-3.5 sm:p-5 rounded-3xl bg-dark-900/95 border border-lime-400/35 group-hover:border-lime-400/70 flex flex-col justify-between select-none overflow-hidden relative z-10 transition-colors duration-300"
      >
        <!-- Precision Vector Corner Reticles -->
        <span
          class="absolute top-3 left-3 w-2.5 h-2.5 border-t-[1.5px] border-l-[1.5px] border-lime-400/40 rounded-tl-sm pointer-events-none group-hover:border-lime-400/80 transition-colors duration-300"
          aria-hidden="true"
        />
        <span
          class="absolute top-3 right-3 w-2.5 h-2.5 border-t-[1.5px] border-r-[1.5px] border-lime-400/40 rounded-tr-sm pointer-events-none group-hover:border-lime-400/80 transition-colors duration-300"
          aria-hidden="true"
        />
        <span
          class="absolute bottom-3 left-3 w-2.5 h-2.5 border-b-[1.5px] border-l-[1.5px] border-lime-400/40 rounded-bl-sm pointer-events-none group-hover:border-lime-400/80 transition-colors duration-300"
          aria-hidden="true"
        />
        <span
          class="absolute bottom-3 right-3 w-2.5 h-2.5 border-b-[1.5px] border-r-[1.5px] border-lime-400/40 rounded-br-sm pointer-events-none group-hover:border-lime-400/80 transition-colors duration-300"
          aria-hidden="true"
        />

        <!-- Satellite Header & Tab Navigation -->
        <div class="space-y-3 shrink-0 relative z-10">
          <!-- MacOS Controls & Satellite Title (Left) + Live Telemetry Status (Right) -->
          <div class="flex items-center justify-between pb-2 font-sans">
            <!-- Left: macOS Traffic Lights (Interactive on desktop >= sm, static decorative on mobile < sm) -->
            <div class="flex items-center gap-2.5 sm:gap-3 shrink-0">
              <!-- Mobile Static Dots (< sm) -->
              <div class="flex sm:hidden items-center gap-1.5 pointer-events-none select-none">
                <span
                  class="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block"
                />
                <span
                  class="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block"
                />
                <span
                  class="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block"
                />
              </div>

              <!-- Desktop / Tablet Interactive Traffic Buttons (>= sm) -->
              <div class="hidden sm:flex group/traffic items-center gap-2">
                <!-- 🔴 Red Button: Crash / Destroy Satellite -->
                <button
                  type="button"
                  title="Self-Destruct / Crash Satellite"
                  class="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff3b30] border border-[#e0443e] flex items-center justify-center cursor-pointer active:scale-75 transition-all duration-150 relative"
                  @click.stop="handleCloseCrash"
                  @mouseenter="playHover"
                >
                  <svg
                    class="w-1.5 h-1.5 text-[#4c0002] opacity-0 group-hover/traffic:opacity-100 transition-opacity duration-150 stroke-[3.5]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                <!-- 🟡 Yellow Button: Minimize to HUD -->
                <button
                  type="button"
                  title="Minimize to HUD Dock"
                  class="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#ff9500] border border-[#dea123] flex items-center justify-center cursor-pointer active:scale-75 transition-all duration-150 relative"
                  @click.stop="handleMinimize"
                  @mouseenter="playHover"
                >
                  <svg
                    class="w-1.5 h-1.5 text-[#5c3e00] opacity-0 group-hover/traffic:opacity-100 transition-opacity duration-150 stroke-[3.5]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>

                <!-- 🟢 Green Button: Fullscreen Expanded Terminal -->
                <button
                  type="button"
                  title="Toggle Fullscreen Cockpit"
                  class="w-3 h-3 rounded-full bg-[#27c93f] hover:bg-[#34c759] border border-[#1aab29] flex items-center justify-center cursor-pointer active:scale-75 transition-all duration-150 relative"
                  @click.stop="handleToggleFullscreen"
                  @mouseenter="playHover"
                >
                  <svg
                    class="w-1.5 h-1.5 text-[#004d11] opacity-0 group-hover/traffic:opacity-100 transition-opacity duration-150"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M5 19h5v-2H7.41L17 7.41V10h2V5h-5v2h2.59L7 16.59V14H5v5z" />
                  </svg>
                </button>
              </div>

              <div class="flex items-center gap-1.5 select-none">
                <svg class="w-3.5 h-3.5 text-lime-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <span
                  class="text-xs font-bold text-lime-400 tracking-wide"
                >
                  satellite.sh
                </span>
              </div>
            </div>

            <!-- Right: Live Telemetry Status -->
            <div
              class="flex items-center gap-1.5 text-xs font-sans text-emerald-400 shrink-0 select-none"
            >
              <span
                class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"
              />
              <span class="font-bold tracking-tight">SYNCHRONIZED</span>
              <span class="text-lime-400/30">|</span>
              <span class="text-slate-400 font-sans">120HZ</span>
            </div>
          </div>

          <!-- Tab Buttons with Clean Border on Active Tab -->
          <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5 font-sans">
            <button
              type="button"
              class="text-xs px-3.5 py-1 rounded-lg transition-colors cursor-pointer shrink-0 whitespace-nowrap"
              :class="
                activeTab === 'terminal'
                  ? 'bg-lime-400/15 text-lime-400 border border-lime-400 font-bold'
                  : 'bg-transparent text-slate-400 hover:text-slate-200 border border-transparent hover:border-lime-400/20'
              "
              @click="setTab('terminal')"
            >
              interactive.sh
            </button>
            <button
              type="button"
              class="text-xs px-3.5 py-1 rounded-lg transition-colors cursor-pointer shrink-0 whitespace-nowrap"
              :class="
                activeTab === 'config'
                  ? 'bg-lime-400/15 text-lime-400 border border-lime-400 font-bold'
                  : 'bg-transparent text-slate-400 hover:text-slate-200 border border-transparent hover:border-lime-400/20'
              "
              @click="setTab('config')"
            >
              alessio.config.ts
            </button>
          </div>
        </div>

        <!-- Tab 1: Real Interactive Terminal Shell -->
        <pre
          v-show="activeTab === 'terminal'"
          class="flex flex-col justify-between flex-1 min-h-0 bg-dark-950/90 border border-lime-400/20 rounded-2xl p-3.5 sm:p-4 my-2 font-mono text-xs sm:text-[13px] leading-relaxed overflow-hidden cursor-text relative z-10 whitespace-pre-wrap"
          @click="focusInput"
        >
          <!-- Scrolling Output Log -->
          <div
            ref="terminalScrollRef"
            class="flex-1 overflow-y-auto space-y-2 pr-1 no-scrollbar text-slate-200"
          >
            <div v-for="entry in entries" :key="entry.id">
              <!-- Command Prompt Input Echo -->
              <div
                v-if="entry.type === 'input'"
                class="flex items-center gap-2 text-lime-400 font-bold"
              >
                <span>$</span>
                <span class="text-white">{{ entry.text }}</span>
              </div>

              <!-- System Message -->
              <div v-else-if="entry.type === 'system'" class="text-slate-400 leading-snug">
                <div v-if="entry.html" v-html="entry.html" />
                <span v-else>{{ entry.text }}</span>
              </div>

              <!-- Error Message -->
              <div v-else-if="entry.type === 'error'" class="text-rose-400 leading-snug font-mono">
                {{ entry.text }}
              </div>

              <!-- HTML Output with progressive typewriter cursor -->
              <div v-else-if="entry.html" class="leading-snug font-mono flex items-baseline gap-1">
                <div v-html="entry.html" />
                <span
                  v-if="entry.isStreaming"
                  class="inline-block w-1.5 h-3.5 bg-lime-400 animate-pulse shrink-0 ml-0.5"
                />
              </div>

              <!-- Plain Output -->
              <div v-else class="text-slate-300 leading-snug font-mono">
                {{ entry.text }}
              </div>
            </div>
          </div>

          <!-- Active Interactive Command Input Line -->
          <form
            class="flex items-center gap-2 pt-2 mt-1 shrink-0"
            @submit.prevent="handleFormSubmit"
          >
            <span class="text-lime-400 font-bold select-none text-sm">$</span>
            <input
              ref="inputRef"
              v-model="currentInput"
              type="text"
              placeholder="type command (e.g. skills, projects, experience, status)..."
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
              class="w-full bg-transparent text-lime-300 font-mono text-xs sm:text-[13px] focus:outline-none placeholder-slate-600 caret-lime-400"
              @keydown.tab.prevent="handleTabKey"
              @keydown.up.prevent="handleArrowUp"
              @keydown.down.prevent="handleArrowDown"
            />
            <button
              type="submit"
              class="text-[10px] sm:text-[11px] bg-lime-400 text-black px-3 py-1 rounded-md font-bold shrink-0 hover:bg-lime-300 active:scale-95 transition-all cursor-pointer select-none"
            >
              EXEC
            </button>
          </form>
        </pre>

        <!-- Tab 2: Config Tab (Top-Left Aligned Code Block) -->
        <div
          v-show="activeTab === 'config'"
          class="flex-1 overflow-y-auto bg-dark-950/70 border border-lime-400/15 rounded-2xl p-3.5 sm:p-4 my-2 text-xs sm:text-[13px] text-slate-300 leading-relaxed no-scrollbar relative z-10 flex flex-col justify-start items-start text-left"
        >
          <pre
            class="whitespace-pre-wrap break-words w-full text-left font-mono"
          ><code><span class="text-lime-400 font-bold">export const</span> engineer = {
  name: <span class="text-lime-300">"Alessio Bonfiglio"</span>,
  role: <span class="text-lime-300">"Frontend Engineer &amp; UI Architect"</span>,
  currentCompany: <span class="text-white font-bold">"iliad"</span>,
  exCompany: <span class="text-white font-bold">"AdKaora (Mondadori Media)"</span>,
  base: <span class="text-lime-300">"Milano, IT (from Sanremo '98)"</span>,
  experience: <span class="text-emerald-400">"6+ Years in Production"</span>,
  stack: [<span class="text-emerald-400">"Vue 3"</span>, <span class="text-emerald-400">"TypeScript"</span>, <span class="text-emerald-400">"Angular"</span>, <span class="text-emerald-400">"React"</span>, <span class="text-emerald-400">"SCSS"</span>, <span class="text-emerald-400">"PHP"</span>],
  focus: <span class="text-lime-400">"Enterprise Refactoring &amp; Clean Architecture"</span>
};</code></pre>
        </div>

        <!-- Footer Quick Action Chips: Interactive Orbital Telemetry Actions -->
        <div
          class="flex items-center justify-between gap-1.5 pt-1.5 text-xs text-slate-400 font-sans shrink-0 overflow-x-auto no-scrollbar relative z-10"
        >
          <div class="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
            <span class="text-slate-300 font-semibold text-xs">Quick:</span>
            <button
              type="button"
              class="text-lime-400 hover:text-white hover:bg-lime-400/20 cursor-pointer bg-dark-950 px-2 py-0.5 rounded-md border border-lime-400/30 transition-colors font-semibold active:scale-95 text-xs"
              @click="runQuickAction('skills')"
            >
              skills
            </button>
            <button
              type="button"
              class="text-lime-400 hover:text-white hover:bg-lime-400/20 cursor-pointer bg-dark-950 px-2 py-0.5 rounded-md border border-lime-400/30 transition-colors font-semibold active:scale-95 text-xs"
              @click="runQuickAction('projects')"
            >
              projects
            </button>
            <button
              type="button"
              class="text-lime-400 hover:text-white hover:bg-lime-400/20 cursor-pointer bg-dark-950 px-2 py-0.5 rounded-md border border-lime-400/30 transition-colors font-semibold active:scale-95 text-xs"
              @click="runQuickAction('experience')"
            >
              experience
            </button>
            <button
              type="button"
              class="text-lime-400 hover:text-white hover:bg-lime-400/20 cursor-pointer bg-dark-950 px-2 py-0.5 rounded-md border border-lime-400/30 transition-colors font-semibold active:scale-95 text-xs"
              @click="runQuickAction('status')"
            >
              status
            </button>
            <button
              type="button"
              class="text-slate-300 hover:text-lime-400 cursor-pointer bg-dark-950 px-2 py-0.5 rounded-md border border-slate-700 transition-colors font-semibold active:scale-95 text-xs"
              @click="runQuickAction('contact')"
            >
              contact
            </button>
            <button
              type="button"
              class="text-slate-300 hover:text-white cursor-pointer bg-dark-950 px-1.5 py-0.5 rounded-md border border-slate-700 transition-colors active:scale-95 text-xs"
              @click="runQuickAction('clear')"
            >
              clear
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= TELEPORT: MINIMIZED FLOATING HUD WIDGET (Docked at Bottom-Right Corner) ================= -->
    <Teleport to="body">
      <div
        v-if="isMinimized && !isCrashed"
        class="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 animate-bounce-subtle select-none"
      >
        <div
          class="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-dark-950/95 border border-lime-400/50 text-slate-200 font-sans text-xs cursor-pointer hover:border-lime-400 hover:scale-105 transition-all duration-300 group"
          @click="handleRestore"
        >
          <span class="relative flex h-2.5 w-2.5">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-80"
            />
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-lime-400" />
          </span>
          <svg class="w-4 h-4 text-lime-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          <div class="flex flex-col text-left">
            <span
              class="font-bold text-lime-400 text-xs group-hover:text-white transition-colors tracking-wide"
            >
              satellite.sh
            </span>
            <span class="text-[9px] text-slate-400 font-sans">DOCK: MINIMIZED IN HUD</span>
          </div>
          <button
            type="button"
            class="ml-2 px-2.5 py-1 rounded-lg bg-lime-400/20 group-hover:bg-lime-400 text-lime-300 group-hover:text-black text-[10px] font-bold border border-lime-400/50 transition-colors cursor-pointer"
          >
            ▲ RESTORE
          </button>
        </div>
      </div>
    </Teleport>

    <!-- ================= TELEPORT: FULLSCREEN TERMINAL MODAL ================= -->
    <Teleport to="body">
      <div
        v-if="isFullscreen && !isCrashed"
        class="fixed inset-0 z-50 bg-dark-950/85 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 lg:p-8 animate-fade-in font-sans select-none"
        @click.self="handleToggleFullscreen"
      >
        <div
          class="w-full max-w-5xl h-[88vh] max-h-[850px] bg-dark-900/95 border-2 border-lime-400/50 rounded-3xl p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden"
        >
          <!-- Precision Vector Corner Reticles -->
          <span
            class="absolute top-4 left-4 w-3 h-3 border-t-[1.5px] border-l-[1.5px] border-lime-400/50 rounded-tl-sm pointer-events-none"
            aria-hidden="true"
          />
          <span
            class="absolute top-4 right-4 w-3 h-3 border-t-[1.5px] border-r-[1.5px] border-lime-400/50 rounded-tr-sm pointer-events-none"
            aria-hidden="true"
          />
          <span
            class="absolute bottom-4 left-4 w-3 h-3 border-b-[1.5px] border-l-[1.5px] border-lime-400/50 rounded-bl-sm pointer-events-none"
            aria-hidden="true"
          />
          <span
            class="absolute bottom-4 right-4 w-3 h-3 border-b-[1.5px] border-r-[1.5px] border-lime-400/50 rounded-br-sm pointer-events-none"
            aria-hidden="true"
          />

          <!-- Header Row with Controls -->
          <div class="space-y-3 shrink-0 relative z-10">
            <div class="flex items-center justify-between pb-3 font-sans">
              <!-- Left: Controls + Title -->
              <div class="flex items-center gap-3">
                <div class="group/traffic flex items-center gap-2">
                  <button
                    type="button"
                    title="Self Destruct / Crash"
                    class="w-3.5 h-3.5 rounded-full bg-[#ff5f56] hover:bg-[#ff3b30] border border-[#e0443e] flex items-center justify-center cursor-pointer active:scale-75 transition-all"
                    @click="handleCloseCrash"
                  >
                    <svg
                      class="w-2 h-2 text-[#4c0002] opacity-0 group-hover/traffic:opacity-100 transition-opacity stroke-[3.5]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    title="Minimize to HUD"
                    class="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] hover:bg-[#ff9500] border border-[#dea123] flex items-center justify-center cursor-pointer active:scale-75 transition-all"
                    @click="handleMinimize"
                  >
                    <svg
                      class="w-2 h-2 text-[#5c3e00] opacity-0 group-hover/traffic:opacity-100 transition-opacity stroke-[3.5]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    title="Exit Fullscreen (ESC)"
                    class="w-3.5 h-3.5 rounded-full bg-[#27c93f] hover:bg-[#34c759] border border-[#1aab29] flex items-center justify-center cursor-pointer active:scale-75 transition-all"
                    @click="handleToggleFullscreen"
                  >
                    <svg
                      class="w-2 h-2 text-[#004d11] opacity-0 group-hover/traffic:opacity-100 transition-opacity"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M5 19h5v-2H7.41L17 7.41V10h2V5h-5v2h2.59L7 16.59V14H5v5z" />
                    </svg>
                  </button>
                </div>

                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-lime-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <span
                    class="text-xs sm:text-sm md:text-base font-bold text-lime-400 tracking-wide"
                  >
                    satellite.sh [EXPANDED COCKPIT MATRIX]
                  </span>
                </div>
              </div>

              <!-- Right: Clean Single "Press ESC to exit" Button -->
              <button
                type="button"
                class="flex items-center gap-1.5 text-slate-400 hover:text-white bg-dark-950 px-3 py-1.5 rounded-xl border border-lime-400/20 hover:border-lime-400/50 text-xs font-sans transition-colors cursor-pointer group select-none active:scale-95"
                title="Close fullscreen (or press ESC)"
                @click="handleToggleFullscreen"
              >
                <span>Press</span>
                <kbd
                  class="text-lime-300 font-bold bg-dark-900 px-1.5 py-0.5 rounded border border-lime-400/30 group-hover:bg-lime-400 group-hover:text-black transition-colors"
                  >ESC</kbd
                >
                <span>to exit</span>
              </button>
            </div>

            <!-- Fullscreen Tabs -->
            <div class="flex items-center gap-2.5 font-sans">
              <button
                type="button"
                class="text-xs sm:text-sm px-4 py-2 rounded-xl font-bold cursor-pointer transition-colors"
                :class="
                  activeTab === 'terminal'
                    ? 'bg-lime-400/20 text-lime-400 border border-lime-400'
                    : 'text-slate-400 hover:text-white border border-transparent hover:border-lime-400/20'
                "
                @click="setTab('terminal')"
              >
                interactive.sh
              </button>
              <button
                type="button"
                class="text-xs sm:text-sm px-4 py-2 rounded-xl font-bold cursor-pointer transition-colors"
                :class="
                  activeTab === 'config'
                    ? 'bg-lime-400/20 text-lime-400 border border-lime-400'
                    : 'text-slate-400 hover:text-white border border-transparent hover:border-lime-400/20'
                "
                @click="setTab('config')"
              >
                alessio.config.ts
              </button>
            </div>
          </div>

          <!-- Fullscreen Terminal Tab (Comfortable Proportional Fonts) -->
          <pre
            v-show="activeTab === 'terminal'"
            class="flex flex-col justify-between flex-1 min-h-0 bg-dark-950/90 border border-lime-400/25 rounded-2xl p-4 sm:p-6 my-3 font-mono text-sm sm:text-base lg:text-[15px] leading-relaxed overflow-hidden cursor-text relative z-10 whitespace-pre-wrap"
            @click="focusInput"
          >
            <div
              ref="fullscreenTerminalScrollRef"
              class="flex-1 overflow-y-auto space-y-2.5 pr-2 no-scrollbar text-slate-200"
            >
              <div v-for="entry in entries" :key="entry.id">
                <div
                  v-if="entry.type === 'input'"
                  class="flex items-center gap-2 text-lime-400 font-bold"
                >
                  <span class="text-lime-400">$</span>
                  <span class="text-white">{{ entry.text }}</span>
                </div>
                <div v-else-if="entry.type === 'system'" class="text-slate-400 leading-relaxed">
                  <div v-if="entry.html" v-html="entry.html" />
                  <span v-else>{{ entry.text }}</span>
                </div>
                <div
                  v-else-if="entry.type === 'error'"
                  class="text-rose-400 leading-relaxed font-mono"
                >
                  {{ entry.text }}
                </div>
                <div
                  v-else-if="entry.html"
                  class="leading-relaxed font-mono flex items-baseline gap-1"
                >
                  <div v-html="entry.html" />
                  <span
                    v-if="entry.isStreaming"
                    class="inline-block w-2 h-4 bg-lime-400 animate-pulse shrink-0 ml-0.5"
                  />
                </div>
                <div v-else class="text-slate-300 leading-relaxed font-mono">
                  {{ entry.text }}
                </div>
              </div>
            </div>

            <!-- Command input line in Fullscreen -->
            <form
              class="flex items-center gap-2.5 pt-3 mt-3 shrink-0"
              @submit.prevent="handleFormSubmit"
            >
              <span class="text-lime-400 font-bold select-none text-base sm:text-lg">$</span>
              <input
                ref="fullscreenInputRef"
                v-model="currentInput"
                type="text"
                placeholder="type command (e.g. skills, projects, experience, status)..."
                autocomplete="off"
                autocorrect="off"
                autocapitalize="off"
                spellcheck="false"
                class="w-full bg-transparent text-lime-300 font-mono text-sm sm:text-base focus:outline-none placeholder-slate-600 caret-lime-400"
                @keydown.tab.prevent="handleTabKey"
                @keydown.up.prevent="handleArrowUp"
                @keydown.down.prevent="handleArrowDown"
              />
              <button
                type="submit"
                class="text-xs sm:text-sm bg-lime-400 text-black px-4 py-1.5 rounded-lg font-bold shrink-0 hover:bg-lime-300 active:scale-95 transition-all cursor-pointer"
              >
                EXEC
              </button>
            </form>
          </pre>

          <!-- Fullscreen Config Tab (Top-Left Aligned Code Block) -->
          <div
            v-show="activeTab === 'config'"
            class="flex-1 overflow-y-auto bg-dark-950/80 border border-lime-400/25 rounded-2xl p-5 sm:p-7 my-3 text-sm sm:text-base lg:text-[15px] text-slate-300 leading-relaxed no-scrollbar relative z-10 flex flex-col justify-start items-start text-left"
          >
            <!-- File Header Info -->
            <div
              class="w-full flex items-center justify-between pb-2.5 mb-4 text-xs text-slate-400 select-none font-sans"
            >
              <div class="flex items-center gap-2">
                <span class="text-sky-400 font-bold">TS</span>
                <span>src/config/alessio.config.ts</span>
              </div>
              <span class="text-slate-500 font-sans">TypeScript • UTF-8</span>
            </div>

            <pre
              class="whitespace-pre-wrap break-words w-full text-left font-mono"
            ><code><span class="text-lime-400 font-bold">export const</span> engineer = {
  name: <span class="text-lime-300">"Alessio Bonfiglio"</span>,
  role: <span class="text-lime-300">"Frontend Engineer &amp; UI Architect"</span>,
  currentCompany: <span class="text-white font-bold">"iliad"</span>,
  exCompany: <span class="text-white font-bold">"AdKaora (Mondadori Media)"</span>,
  base: <span class="text-lime-300">"Milano, IT (from Sanremo '98)"</span>,
  experience: <span class="text-emerald-400">"6+ Years in Production"</span>,
  stack: [
    <span class="text-emerald-400">"Vue 3"</span>,
    <span class="text-emerald-400">"TypeScript"</span>,
    <span class="text-emerald-400">"Angular"</span>,
    <span class="text-emerald-400">"React"</span>,
    <span class="text-emerald-400">"SCSS"</span>,
    <span class="text-emerald-400">"PHP"</span>
  ],
  focus: <span class="text-lime-400">"Enterprise Refactoring &amp; Clean Architecture"</span>
};</code></pre>
          </div>

          <!-- Fullscreen Quick Actions -->
          <div
            class="flex items-center justify-between gap-2 pt-2.5 text-xs sm:text-sm text-slate-400 font-sans shrink-0 overflow-x-auto no-scrollbar relative z-10"
          >
            <div class="flex items-center gap-2 shrink-0 whitespace-nowrap">
              <span class="text-slate-300 font-bold">Quick Actions:</span>
              <button
                type="button"
                class="text-lime-400 hover:text-white hover:bg-lime-400/20 cursor-pointer bg-dark-950 px-3 py-1 rounded-lg border border-lime-400/40 font-semibold active:scale-95 transition-colors text-xs"
                @click="runQuickAction('skills')"
              >
                skills
              </button>
              <button
                type="button"
                class="text-lime-400 hover:text-white hover:bg-lime-400/20 cursor-pointer bg-dark-950 px-3 py-1 rounded-lg border border-lime-400/40 font-semibold active:scale-95 transition-colors text-xs"
                @click="runQuickAction('projects')"
              >
                projects
              </button>
              <button
                type="button"
                class="text-lime-400 hover:text-white hover:bg-lime-400/20 cursor-pointer bg-dark-950 px-3 py-1 rounded-lg border border-lime-400/40 font-semibold active:scale-95 transition-colors text-xs"
                @click="runQuickAction('experience')"
              >
                experience
              </button>
              <button
                type="button"
                class="text-lime-400 hover:text-white hover:bg-lime-400/20 cursor-pointer bg-dark-950 px-3 py-1 rounded-lg border border-lime-400/40 font-semibold active:scale-95 transition-colors text-xs"
                @click="runQuickAction('status')"
              >
                status
              </button>
              <button
                type="button"
                class="text-slate-300 hover:text-lime-400 cursor-pointer bg-dark-950 px-3 py-1 rounded-lg border border-slate-700 font-semibold active:scale-95 transition-colors text-xs"
                @click="runQuickAction('contact')"
              >
                contact
              </button>
              <button
                type="button"
                class="text-slate-300 hover:text-white cursor-pointer bg-dark-950 px-2.5 py-1 rounded-lg border border-slate-700 active:scale-95 transition-colors text-xs"
                @click="runQuickAction('clear')"
              >
                clear
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
  /* Smooth Zero-Gravity Orbital Satellite Floating */
  .orbital-satellite-assembly {
    animation: satellite-orbital-drift 7.5s ease-in-out infinite alternate;
    will-change: transform;
  }

  @keyframes satellite-orbital-drift {
    0% {
      transform: translate3d(0, 0, 0) rotate(0deg);
    }
    50% {
      transform: translate3d(0, -14px, 0) rotate(0.8deg);
    }
    100% {
      transform: translate3d(0, 4px, 0) rotate(-0.5deg);
    }
  }

  /* Photovoltaic Solar Array Wing Pattern */
  .solar-wing-surface {
    background: #091a30;
    background-image: // taste-skill-ignore
      linear-gradient(to right, rgba(56, 189, 248, 0.12) 1px, transparent 1px), // taste-skill-ignore
      linear-gradient(to bottom, rgba(56, 189, 248, 0.12) 1px, transparent 1px); // taste-skill-ignore
    background-size: 10px 14px;
  }

  /* Ion Plasma Thruster Pulse */
  .ion-thruster-jet {
    animation: thruster-flare 2.5s ease-in-out infinite alternate;
  }

  @keyframes thruster-flare {
    0% {
      opacity: 0.4;
      transform: scaleY(0.8);
    }
    100% {
      opacity: 0.95;
      transform: scaleY(1.3);
    }
  }

  /* Satellite Crash & Re-entry Destruction Animation */
  .animate-crash-shake {
    animation: satellite-crash-tumble 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards !important;
  }

  @keyframes satellite-crash-tumble {
    0% {
      transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
      filter: hue-rotate(0deg);
    }
    15% {
      transform: translate3d(-10px, 8px, 0) rotate(-6deg) scale(0.98);
      filter: hue-rotate(90deg) contrast(150%);
    }
    30% {
      transform: translate3d(14px, -10px, 0) rotate(8deg) scale(0.95);
      filter: hue-rotate(180deg) brightness(140%);
    }
    45% {
      transform: translate3d(-18px, 14px, 0) rotate(-12deg) scale(0.9);
      filter: hue-rotate(270deg) contrast(200%);
    }
    60% {
      transform: translate3d(20px, 25px, 0) rotate(18deg) scale(0.8);
      opacity: 0.8;
    }
    80% {
      transform: translate3d(-24px, 55px, 0) rotate(-28deg) scale(0.65);
      opacity: 0.4;
      filter: blur(4px);
    }
    100% {
      transform: translate3d(35px, 120px, 0) rotate(48deg) scale(0.3);
      opacity: 0;
      filter: blur(10px);
    }
  }

  /* Subtle HUD Dock Bounce */
  @keyframes bounce-subtle {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-4px);
    }
  }

  .animate-bounce-subtle {
    animation: bounce-subtle 3s ease-in-out infinite;
  }

  /* Satellite Warp Re-entry / Materialization Animation */
  .animate-satellite-warp-in {
    animation: satellite-warp-materialize 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
    will-change: transform, opacity, filter;
  }

  @keyframes satellite-warp-materialize {
    0% {
      opacity: 0;
      transform: translate3d(0, 45px, 0) scale(0.65) rotate(-6deg);
      filter: blur(14px) brightness(240%) hue-rotate(180deg);
    }
    45% {
      opacity: 0.85;
      filter: blur(4px) brightness(170%) hue-rotate(90deg);
    }
    75% {
      opacity: 1;
      transform: translate3d(0, -8px, 0) scale(1.04) rotate(1deg);
      filter: blur(0px) brightness(125%) hue-rotate(0deg);
    }
    100% {
      opacity: 1;
      transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
      filter: blur(0px) brightness(100%) hue-rotate(0deg);
    }
  }

  /* Fade in */
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: scale(0.97);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .animate-fade-in {
    animation: fade-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
</style>
