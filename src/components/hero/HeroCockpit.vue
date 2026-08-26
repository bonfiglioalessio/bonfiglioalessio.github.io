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

  // Reboot & Recover Satellite
  function handleRebootSatellite() {
    playRebootSequence()
    isRebooting.value = true

    setTimeout(() => {
      isCrashed.value = false
      isRebooting.value = false
      isMinimized.value = false
      activeTab.value = 'terminal'
      executeCommand('clear')
      focusInput()
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

  // Restore from Minimized HUD
  function handleRestore() {
    playRebootSequence()
    isMinimized.value = false
    focusInput()
    scrollToBottom()
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
  <div class="w-full flex justify-center">
    <!-- ================= CASE 1: SATELLITE CRASHED & DESTROYED ================= -->
    <div
      v-if="isCrashed"
      class="relative w-full max-w-md lg:max-w-xl h-[380px] sm:h-[430px] rounded-3xl border border-rose-500/50 bg-dark-950/95 backdrop-blur-2xl p-5 sm:p-7 flex flex-col justify-between items-center text-center shadow-[0_0_50px_rgba(244,63,94,0.3)] overflow-hidden font-mono z-10 animate-fade-in"
    >
      <!-- Background Red Alert Pulse -->
      <div
        class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(244,63,94,0.2),_transparent_70%)] pointer-events-none"
      />

      <!-- Top Header Row -->
      <div
        class="w-full flex items-center justify-between border-b border-rose-500/30 pb-2.5 text-[10px] sm:text-xs text-rose-400"
      >
        <span class="flex items-center gap-2 font-bold tracking-wider">
          <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
          ORBITAL COLLISION DETECTED
        </span>
        <span class="text-slate-400 font-mono">STATUS: DOWN (0 KM)</span>
      </div>

      <!-- Center Crash Narrative -->
      <div class="space-y-3 my-auto z-10 px-2">
        <div class="text-4xl sm:text-5xl animate-bounce">💥</div>
        <h3
          class="text-base sm:text-lg font-bold text-rose-400 tracking-widest uppercase drop-shadow-[0_0_12px_#f43f5e]"
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
        class="z-10 group flex items-center gap-2 px-5 sm:px-6 py-3 rounded-2xl bg-rose-500/20 hover:bg-lime-400 text-rose-300 hover:text-black border border-rose-500/60 hover:border-lime-400 font-bold text-xs tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:shadow-[0_0_25px_#e2f161] active:scale-95 cursor-pointer"
        @click="handleRebootSatellite"
      >
        <span class="text-sm group-hover:rotate-180 transition-transform duration-500">🔄</span>
        <span>EMERGENCY REBOOT SATELLITE</span>
      </button>
    </div>

    <!-- ================= CASE 2: SATELLITE MINIMIZED TO HUD DOCK ================= -->
    <div
      v-else-if="isMinimized"
      class="relative w-full max-w-md lg:max-w-xl h-[260px] sm:h-[300px] rounded-3xl border border-dashed border-lime-400/40 bg-dark-950/50 backdrop-blur-xl p-6 flex flex-col justify-center items-center text-center gap-3.5 font-mono z-10 animate-fade-in"
    >
      <div
        class="w-14 h-14 rounded-2xl bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-2xl text-lime-400 shadow-[0_0_20px_rgba(226,241,97,0.2)] animate-pulse"
      >
        🛰️
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
        class="text-xs px-4 py-2 rounded-xl bg-lime-400/20 hover:bg-lime-400 text-lime-300 hover:text-black border border-lime-400/50 font-bold transition-all cursor-pointer active:scale-95 shadow-[0_0_15px_rgba(226,241,97,0.3)] flex items-center gap-1.5"
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
      :class="[isCrashAnimating ? 'animate-crash-shake pointer-events-none' : '']"
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
            class="relative inline-flex rounded-full h-2.5 sm:h-3 w-2.5 sm:w-3 bg-lime-400 shadow-[0_0_10px_#e2f161] group-hover:shadow-[0_0_20px_#e2f161,0_0_40px_#e2f161] transition-shadow duration-300"
          />
        </span>
        <div
          class="w-0.5 h-6 sm:h-7 bg-gradient-to-t from-slate-600 via-slate-400 to-lime-400 shadow-[0_0_6px_rgba(226,241,97,0.5)] group-hover:shadow-[0_0_12px_#e2f161] group-hover:via-lime-300 transition-all duration-300"
        />
        <div
          class="w-3 sm:w-3.5 h-1 sm:h-1.5 bg-slate-700 rounded-t-sm border-t border-lime-400/40 group-hover:border-lime-400 group-hover:shadow-[0_0_8px_#e2f161] transition-all duration-300"
        />
      </div>

      <!-- Left Solar Array Wing Assembly -->
      <div
        class="hidden lg:flex flex-col items-center justify-center absolute -left-9 xl:-left-11 top-[24%] -translate-y-1/2 z-0 pointer-events-none select-none transition-all duration-500 group-hover:scale-105 group-hover:-translate-x-1"
      >
        <div
          class="w-8 xl:w-9 h-36 xl:h-40 rounded-xl solar-wing-surface border border-sky-400/40 group-hover:border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.25)] group-hover:shadow-[0_0_35px_rgba(56,189,248,0.65)] flex flex-col items-center justify-between py-2 px-1 relative overflow-hidden transition-all duration-300"
        >
          <div class="flex items-center justify-center gap-1 w-full">
            <span class="w-1 h-1 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8]" />
            <span class="text-[7px] font-mono text-sky-300 font-bold tracking-tighter">PV-A1</span>
            <span class="w-1 h-1 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8]" />
          </div>
          <div class="w-px h-3 bg-sky-400/30 group-hover:bg-sky-400/60" />
          <div
            class="text-[7.5px] font-mono text-sky-200 font-bold uppercase tracking-[0.2em] select-none [writing-mode:vertical-rl] rotate-180 group-hover:text-white group-hover:drop-shadow-[0_0_8px_#38bdf8] transition-all my-auto"
          >
            SOLAR // α
          </div>
          <div class="w-px h-3 bg-sky-400/30 group-hover:bg-sky-400/60" />
          <div class="flex items-center justify-center gap-1 w-full">
            <span class="w-1 h-1 rounded-full bg-sky-400/70" />
            <span class="text-[7px] font-mono text-sky-300/90 font-bold">450W</span>
            <span class="w-1 h-1 rounded-full bg-sky-400/70" />
          </div>
        </div>
        <div
          class="w-3.5 h-1.5 bg-gradient-to-r from-sky-500/80 to-slate-700 group-hover:from-sky-400 group-hover:to-slate-600 border-y border-sky-400/40 group-hover:border-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.3)] group-hover:shadow-[0_0_15px_#38bdf8] absolute right-[-13px] top-1/2 -translate-y-1/2 transition-all duration-300"
        />
      </div>

      <!-- Right Solar Array Wing Assembly -->
      <div
        class="hidden lg:flex flex-col items-center justify-center absolute -right-9 xl:-right-11 top-[76%] -translate-y-1/2 z-0 pointer-events-none select-none transition-all duration-500 group-hover:scale-105 group-hover:translate-x-1"
      >
        <div
          class="w-3.5 h-1.5 bg-gradient-to-l from-sky-500/80 to-slate-700 group-hover:from-sky-400 group-hover:to-slate-600 border-y border-sky-400/40 group-hover:border-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.3)] group-hover:shadow-[0_0_15px_#38bdf8] absolute left-[-13px] top-1/2 -translate-y-1/2 transition-all duration-300"
        />
        <div
          class="w-8 xl:w-9 h-36 xl:h-40 rounded-xl solar-wing-surface border border-sky-400/40 group-hover:border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.25)] group-hover:shadow-[0_0_35px_rgba(56,189,248,0.65)] flex flex-col items-center justify-between py-2 px-1 relative overflow-hidden transition-all duration-300"
        >
          <div class="flex items-center justify-center gap-1 w-full">
            <span class="w-1 h-1 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8]" />
            <span class="text-[7px] font-mono text-sky-300 font-bold tracking-tighter">PV-B2</span>
            <span class="w-1 h-1 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8]" />
          </div>
          <div class="w-px h-3 bg-sky-400/30 group-hover:bg-sky-400/60" />
          <div
            class="text-[7.5px] font-mono text-sky-200 font-bold uppercase tracking-[0.2em] select-none [writing-mode:vertical-rl] rotate-180 group-hover:text-white group-hover:drop-shadow-[0_0_8px_#38bdf8] transition-all my-auto"
          >
            SOLAR // β
          </div>
          <div class="w-px h-3 bg-sky-400/30 group-hover:bg-sky-400/60" />
          <div class="flex items-center justify-center gap-1 w-full">
            <span class="w-1 h-1 rounded-full bg-sky-400/70" />
            <span class="text-[7px] font-mono text-sky-300/90 font-bold">100%</span>
            <span class="w-1 h-1 rounded-full bg-sky-400/70" />
          </div>
        </div>
      </div>

      <!-- Ion Plasma Thrusters -->
      <div
        class="absolute -bottom-3 left-12 w-4 h-6 bg-gradient-to-b from-cyan-400 via-sky-400/60 to-transparent blur-[2px] opacity-80 group-hover:opacity-100 group-hover:scale-125 pointer-events-none ion-thruster-jet transition-all duration-300"
      />
      <div
        class="absolute -bottom-3 right-12 w-4 h-6 bg-gradient-to-b from-cyan-400 via-sky-400/60 to-transparent blur-[2px] opacity-80 group-hover:opacity-100 group-hover:scale-125 pointer-events-none ion-thruster-jet transition-all duration-300"
      />

      <!-- ================= MAIN SATELLITE COCKPIT CONTAINER ================= -->
      <div
        class="w-full h-[370px] sm:h-[420px] lg:h-[440px] p-3.5 sm:p-5 rounded-3xl bg-dark-900/90 backdrop-blur-2xl border border-lime-400/35 group-hover:border-lime-400/70 flex flex-col justify-between select-none overflow-hidden relative z-10 shadow-[0_0_35px_rgba(226,241,97,0.18),0_0_80px_rgba(0,0,0,0.85)] group-hover:shadow-[0_0_55px_rgba(226,241,97,0.35),0_0_100px_rgba(226,241,97,0.15)] transition-all duration-300"
      >
        <!-- Corner Reticles -->
        <div
          class="absolute top-2.5 left-2.5 text-[8px] font-mono text-lime-400/40 pointer-events-none select-none"
        >
          ┌
        </div>
        <div
          class="absolute top-2.5 right-2.5 text-[8px] font-mono text-lime-400/40 pointer-events-none select-none"
        >
          ┐
        </div>
        <div
          class="absolute bottom-2.5 left-2.5 text-[8px] font-mono text-lime-400/40 pointer-events-none select-none"
        >
          └
        </div>
        <div
          class="absolute bottom-2.5 right-2.5 text-[8px] font-mono text-lime-400/40 pointer-events-none select-none"
        >
          ┘
        </div>

        <!-- Satellite Header & Tab Navigation -->
        <div class="space-y-3 shrink-0 relative z-10">
          <!-- MacOS Controls & Satellite Title (Left) + Live Telemetry Status (Right) -->
          <div class="flex items-center justify-between border-b border-lime-400/15 pb-2.5 font-mono">
            <!-- Left: macOS Traffic Lights (Interactive on desktop >= sm, static decorative on mobile < sm) -->
            <div class="flex items-center gap-2.5 sm:gap-3 shrink-0">
              <!-- Mobile Static Dots (< sm) -->
              <div class="flex sm:hidden items-center gap-1.5 pointer-events-none select-none">
                <span
                  class="w-2.5 h-2.5 rounded-full bg-[#ff5f56] shadow-[0_0_6px_#f43f5e] inline-block"
                />
                <span
                  class="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] shadow-[0_0_6px_#f59e0b] inline-block"
                />
                <span
                  class="w-2.5 h-2.5 rounded-full bg-[#27c93f] shadow-[0_0_6px_#10b981] inline-block"
                />
              </div>

              <!-- Desktop / Tablet Interactive Traffic Buttons (>= sm) -->
              <div class="hidden sm:flex group/traffic items-center gap-2">
                <!-- 🔴 Red Button: Crash / Destroy Satellite -->
                <button
                  type="button"
                  title="Self-Destruct / Crash Satellite (💥)"
                  class="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff3b30] border border-[#e0443e] flex items-center justify-center cursor-pointer shadow-[0_0_8px_#f43f5e] active:scale-75 transition-all duration-150 relative"
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
                  title="Minimize to HUD Dock (↘)"
                  class="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#ff9500] border border-[#dea123] flex items-center justify-center cursor-pointer shadow-[0_0_8px_#f59e0b] active:scale-75 transition-all duration-150 relative"
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
                  title="Toggle Fullscreen Cockpit (⤢)"
                  class="w-3 h-3 rounded-full bg-[#27c93f] hover:bg-[#34c759] border border-[#1aab29] flex items-center justify-center cursor-pointer shadow-[0_0_8px_#10b981] active:scale-75 transition-all duration-150 relative"
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
                <span class="text-xs">🛰️</span>
                <span
                  class="text-[11px] sm:text-xs font-bold text-lime-400 tracking-wide drop-shadow-[0_0_8px_#e2f161]"
                >
                  satellite.sh
                </span>
              </div>
            </div>

            <!-- Right: Live Telemetry Status -->
            <div
              class="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono text-emerald-400 shrink-0 select-none"
            >
              <span
                class="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"
              />
              <span class="font-bold tracking-tight">SYNCHRONIZED</span>
              <span class="text-lime-400/30">|</span>
              <span class="text-slate-400 font-mono">120HZ</span>
            </div>
          </div>

          <!-- Tab Buttons with Neon Glow Border on Active Tab -->
          <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
            <button
              type="button"
              class="text-xs sm:text-[13px] font-mono px-3.5 py-1 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap"
              :class="
                activeTab === 'terminal'
                  ? 'bg-lime-400/10 text-lime-400 border border-lime-400 shadow-[0_0_12px_rgba(226,241,97,0.45)] font-bold'
                  : 'bg-transparent text-slate-400 hover:text-slate-200 border border-transparent hover:border-lime-400/20'
              "
              @click="setTab('terminal')"
            >
              interactive.sh ⚡
            </button>
            <button
              type="button"
              class="text-xs sm:text-[13px] font-mono px-3.5 py-1 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap"
              :class="
                activeTab === 'config'
                  ? 'bg-lime-400/10 text-lime-400 border border-lime-400 shadow-[0_0_12px_rgba(226,241,97,0.45)] font-bold'
                  : 'bg-transparent text-slate-400 hover:text-slate-200 border border-transparent hover:border-lime-400/20'
              "
              @click="setTab('config')"
            >
              alessio.config.ts
            </button>
          </div>
        </div>

        <!-- Tab 1: Real Interactive Terminal Shell -->
        <div
          v-show="activeTab === 'terminal'"
          class="flex flex-col justify-between flex-1 min-h-0 bg-dark-950/90 border border-lime-400/20 rounded-2xl p-3.5 sm:p-4 my-2 font-mono text-xs sm:text-[13px] leading-relaxed overflow-hidden shadow-inner cursor-text relative z-10"
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
            class="flex items-center gap-2 pt-2.5 mt-2 border-t border-lime-400/15 shrink-0"
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
              class="text-[10px] sm:text-[11px] bg-lime-400 text-black px-3 py-1 rounded-md font-bold shrink-0 hover:bg-lime-300 hover:shadow-[0_0_10px_#e2f161] active:scale-95 transition-all cursor-pointer select-none"
            >
              EXEC
            </button>
          </form>
        </div>

        <!-- Tab 2: Config Tab (Top-Left Aligned Code Block) -->
        <div
          v-show="activeTab === 'config'"
          class="flex-1 overflow-y-auto bg-dark-950/70 border border-lime-400/15 rounded-2xl p-3.5 sm:p-4 my-2 font-mono text-xs sm:text-[13px] text-slate-300 leading-relaxed no-scrollbar relative z-10 flex flex-col justify-start items-start text-left"
        >
          <pre
            class="whitespace-pre-wrap break-words w-full text-left"
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
          class="flex items-center justify-between gap-1.5 pt-1.5 text-[10px] sm:text-[11px] text-slate-400 font-mono shrink-0 border-t border-lime-400/15 overflow-x-auto no-scrollbar relative z-10"
        >
          <div class="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
            <span class="text-slate-300 font-bold">Quick:</span>
            <button
              type="button"
              class="text-lime-400 hover:text-white hover:bg-lime-400/20 cursor-pointer bg-dark-950 px-2 py-0.5 rounded-md border border-lime-400/30 transition-all font-bold active:scale-95"
              @click="runQuickAction('skills')"
            >
              skills
            </button>
            <button
              type="button"
              class="text-lime-400 hover:text-white hover:bg-lime-400/20 cursor-pointer bg-dark-950 px-2 py-0.5 rounded-md border border-lime-400/30 transition-all font-bold active:scale-95"
              @click="runQuickAction('projects')"
            >
              projects
            </button>
            <button
              type="button"
              class="text-lime-400 hover:text-white hover:bg-lime-400/20 cursor-pointer bg-dark-950 px-2 py-0.5 rounded-md border border-lime-400/30 transition-all font-bold active:scale-95"
              @click="runQuickAction('experience')"
            >
              experience
            </button>
            <button
              type="button"
              class="text-lime-400 hover:text-white hover:bg-lime-400/20 cursor-pointer bg-dark-950 px-2 py-0.5 rounded-md border border-lime-400/30 transition-all font-bold active:scale-95"
              @click="runQuickAction('status')"
            >
              status
            </button>
            <button
              type="button"
              class="text-slate-300 hover:text-lime-400 cursor-pointer bg-dark-950 px-2 py-0.5 rounded-md border border-slate-700 transition-all font-bold active:scale-95"
              @click="runQuickAction('contact')"
            >
              contact
            </button>
            <button
              type="button"
              class="text-slate-300 hover:text-white cursor-pointer bg-dark-950 px-1.5 py-0.5 rounded-md border border-slate-700 transition-all active:scale-95"
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
          class="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-dark-950/95 backdrop-blur-2xl border border-lime-400/50 shadow-[0_0_30px_rgba(226,241,97,0.35)] text-slate-200 font-mono text-xs cursor-pointer hover:border-lime-400 hover:scale-105 transition-all duration-300 group"
          @click="handleRestore"
        >
          <span class="relative flex h-2.5 w-2.5">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-80"
            />
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-lime-400" />
          </span>
          <span class="text-base">🛰️</span>
          <div class="flex flex-col text-left">
            <span
              class="font-bold text-lime-400 text-xs group-hover:text-white transition-colors tracking-wide"
            >
              satellite.sh
            </span>
            <span class="text-[9px] text-slate-400 font-mono">DOCK: MINIMIZED IN HUD</span>
          </div>
          <button
            type="button"
            class="ml-2 px-2.5 py-1 rounded-lg bg-lime-400/20 group-hover:bg-lime-400 text-lime-300 group-hover:text-black text-[10px] font-bold border border-lime-400/50 transition-all cursor-pointer shadow-[0_0_8px_rgba(226,241,97,0.3)]"
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
        class="fixed inset-0 z-50 bg-dark-950/85 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 lg:p-8 animate-fade-in font-mono select-none"
        @click.self="handleToggleFullscreen"
      >
        <div
          class="w-full max-w-5xl h-[88vh] max-h-[850px] bg-dark-900/95 backdrop-blur-3xl border-2 border-lime-400/50 rounded-3xl p-4 sm:p-6 flex flex-col justify-between shadow-[0_0_60px_rgba(226,241,97,0.35),0_0_120px_rgba(0,0,0,0.9)] relative overflow-hidden"
        >
          <!-- Corner Reticles -->
          <div class="absolute top-3 left-3 text-[10px] font-mono text-lime-400/50 pointer-events-none">
            ┌
          </div>
          <div class="absolute top-3 right-3 text-[10px] font-mono text-lime-400/50 pointer-events-none">
            ┐
          </div>
          <div class="absolute bottom-3 left-3 text-[10px] font-mono text-lime-400/50 pointer-events-none">
            └
          </div>
          <div
            class="absolute bottom-3 right-3 text-[10px] font-mono text-lime-400/50 pointer-events-none"
          >
            ┘
          </div>

          <!-- Header Row with Controls -->
          <div class="space-y-3 shrink-0 relative z-10">
            <div class="flex items-center justify-between border-b border-lime-400/20 pb-3 font-mono">
              <!-- Left: Controls + Title -->
              <div class="flex items-center gap-3">
                <div class="group/traffic flex items-center gap-2">
                  <button
                    type="button"
                    title="Self Destruct / Crash"
                    class="w-3.5 h-3.5 rounded-full bg-[#ff5f56] hover:bg-[#ff3b30] border border-[#e0443e] flex items-center justify-center cursor-pointer shadow-[0_0_8px_#f43f5e] active:scale-75 transition-all"
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
                    class="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] hover:bg-[#ff9500] border border-[#dea123] flex items-center justify-center cursor-pointer shadow-[0_0_8px_#f59e0b] active:scale-75 transition-all"
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
                    class="w-3.5 h-3.5 rounded-full bg-[#27c93f] hover:bg-[#34c759] border border-[#1aab29] flex items-center justify-center cursor-pointer shadow-[0_0_8px_#10b981] active:scale-75 transition-all"
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
                  <span class="text-base">🛰️</span>
                  <span
                    class="text-xs sm:text-sm md:text-base font-bold text-lime-400 tracking-wide drop-shadow-[0_0_8px_#e2f161]"
                  >
                    satellite.sh [EXPANDED COCKPIT MATRIX]
                  </span>
                </div>
              </div>

              <!-- Right: Clean Single "Press ESC to exit" Button -->
              <button
                type="button"
                class="flex items-center gap-1.5 text-slate-400 hover:text-white bg-dark-950 px-3 py-1.5 rounded-xl border border-lime-400/20 hover:border-lime-400/50 text-xs font-mono transition-all cursor-pointer group select-none active:scale-95 shadow-[0_0_8px_rgba(226,241,97,0.1)]"
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
            <div class="flex items-center gap-2.5">
              <button
                type="button"
                class="text-xs sm:text-sm px-4 py-2 rounded-xl font-bold cursor-pointer transition-all"
                :class="
                  activeTab === 'terminal'
                    ? 'bg-lime-400/20 text-lime-400 border border-lime-400 shadow-[0_0_12px_rgba(226,241,97,0.35)]'
                    : 'text-slate-400 hover:text-white border border-transparent hover:border-lime-400/20'
                "
                @click="setTab('terminal')"
              >
                interactive.sh ⚡
              </button>
              <button
                type="button"
                class="text-xs sm:text-sm px-4 py-2 rounded-xl font-bold cursor-pointer transition-all"
                :class="
                  activeTab === 'config'
                    ? 'bg-lime-400/20 text-lime-400 border border-lime-400 shadow-[0_0_12px_rgba(226,241,97,0.35)]'
                    : 'text-slate-400 hover:text-white border border-transparent hover:border-lime-400/20'
                "
                @click="setTab('config')"
              >
                alessio.config.ts
              </button>
            </div>
          </div>

          <!-- Fullscreen Terminal Tab (Comfortable Proportional Fonts) -->
          <div
            v-show="activeTab === 'terminal'"
            class="flex flex-col justify-between flex-1 min-h-0 bg-dark-950/90 border border-lime-400/25 rounded-2xl p-4 sm:p-6 my-3 font-mono text-sm sm:text-base lg:text-[15px] leading-relaxed overflow-hidden shadow-inner cursor-text relative z-10"
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
              class="flex items-center gap-2.5 pt-3 mt-3 border-t border-lime-400/20 shrink-0"
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
                class="text-xs sm:text-sm bg-lime-400 text-black px-4 py-1.5 rounded-lg font-bold shrink-0 hover:bg-lime-300 hover:shadow-[0_0_15px_#e2f161] active:scale-95 transition-all cursor-pointer"
              >
                EXEC
              </button>
            </form>
          </div>

          <!-- Fullscreen Config Tab (Top-Left Aligned Code Block) -->
          <div
            v-show="activeTab === 'config'"
            class="flex-1 overflow-y-auto bg-dark-950/80 border border-lime-400/25 rounded-2xl p-5 sm:p-7 my-3 font-mono text-sm sm:text-base lg:text-[15px] text-slate-300 leading-relaxed no-scrollbar relative z-10 flex flex-col justify-start items-start text-left"
          >
            <!-- File Header Info -->
            <div
              class="w-full flex items-center justify-between border-b border-lime-400/15 pb-2.5 mb-4 text-xs text-slate-400 select-none"
            >
              <div class="flex items-center gap-2">
                <span class="text-sky-400 font-bold">TS</span>
                <span>src/config/alessio.config.ts</span>
              </div>
              <span class="text-slate-500 font-mono">TypeScript • UTF-8</span>
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
            class="flex items-center justify-between gap-2 pt-2.5 text-xs sm:text-sm text-slate-400 font-mono shrink-0 border-t border-lime-400/20 overflow-x-auto no-scrollbar relative z-10"
          >
            <div class="flex items-center gap-2 shrink-0 whitespace-nowrap">
              <span class="text-slate-300 font-bold">Quick Actions:</span>
              <button
                type="button"
                class="text-lime-400 hover:text-white hover:bg-lime-400/20 cursor-pointer bg-dark-950 px-3 py-1 rounded-lg border border-lime-400/40 font-bold active:scale-95 transition-all"
                @click="runQuickAction('skills')"
              >
                skills
              </button>
              <button
                type="button"
                class="text-lime-400 hover:text-white hover:bg-lime-400/20 cursor-pointer bg-dark-950 px-3 py-1 rounded-lg border border-lime-400/40 font-bold active:scale-95 transition-all"
                @click="runQuickAction('projects')"
              >
                projects
              </button>
              <button
                type="button"
                class="text-lime-400 hover:text-white hover:bg-lime-400/20 cursor-pointer bg-dark-950 px-3 py-1 rounded-lg border border-lime-400/40 font-bold active:scale-95 transition-all"
                @click="runQuickAction('experience')"
              >
                experience
              </button>
              <button
                type="button"
                class="text-lime-400 hover:text-white hover:bg-lime-400/20 cursor-pointer bg-dark-950 px-3 py-1 rounded-lg border border-lime-400/40 font-bold active:scale-95 transition-all"
                @click="runQuickAction('status')"
              >
                status
              </button>
              <button
                type="button"
                class="text-slate-300 hover:text-lime-400 cursor-pointer bg-dark-950 px-3 py-1 rounded-lg border border-slate-700 font-bold active:scale-95 transition-all"
                @click="runQuickAction('contact')"
              >
                contact
              </button>
              <button
                type="button"
                class="text-slate-300 hover:text-white cursor-pointer bg-dark-950 px-2.5 py-1 rounded-lg border border-slate-700 active:scale-95 transition-all"
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
    background: linear-gradient(135deg, #091a30 0%, #030b18 100%);
    background-image:
      linear-gradient(to right, rgba(56, 189, 248, 0.12) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(56, 189, 248, 0.12) 1px, transparent 1px);
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
