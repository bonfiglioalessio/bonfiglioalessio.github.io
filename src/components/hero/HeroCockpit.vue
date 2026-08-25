<script setup lang="ts">
  import { nextTick, onMounted, ref, watch } from 'vue'
  import { useCliEngine } from '../../composables/useCliEngine'
  import { useAudioSynth } from '../../composables/useAudioSynth'
  import { use3DTilt } from '../../composables/use3DTilt'

  type TabType = 'terminal' | 'config' | 'skills'
  const activeTab = ref<TabType>('terminal')

  const { entries, currentInput, executeCommand, handleAutoComplete, navigateHistory } =
    useCliEngine()

  const { playClick } = useAudioSynth()

  const cockpitRef = ref<HTMLElement | null>(null)
  const terminalScrollRef = ref<HTMLDivElement | null>(null)
  const inputRef = ref<HTMLInputElement | null>(null)

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
      inputRef.value?.focus()
    })
  }

  function scrollToBottom() {
    nextTick(() => {
      if (terminalScrollRef.value) {
        terminalScrollRef.value.scrollTop = terminalScrollRef.value.scrollHeight
      }
    })
  }

  watch(
    () => entries.value.length,
    () => {
      scrollToBottom()
    },
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

  onMounted(() => {
    scrollToBottom()
  })
</script>

<template>
  <div
    ref="cockpitRef"
    class="relative w-full max-w-md lg:max-w-xl orbital-satellite-assembly group"
    :style="transformStyle"
    style="transform-style: preserve-3d"
    @mouseenter="handleMouseEnter"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <!-- Atmospheric Cosmic Glow Nebula Aura behind Satellite (Intensifies on hover) -->
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

    <!-- ================= SATELLITE HARDWARE ATTACHMENTS ================= -->

    <!-- Top Communication Antenna Mast & Pulsing Transponder Beacon (Glows on hover) -->
    <div
      class="flex absolute -top-9 sm:-top-10 right-8 sm:right-14 flex-col items-center pointer-events-none z-0 select-none transition-transform duration-500 group-hover:-translate-y-1"
    >
      <!-- Glowing Transponder Beacon -->
      <span class="relative flex h-2.5 sm:h-3 w-2.5 sm:w-3">
        <span
          class="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-80"
        />
        <span
          class="relative inline-flex rounded-full h-2.5 sm:h-3 w-2.5 sm:w-3 bg-lime-400 shadow-[0_0_10px_#e2f161] group-hover:shadow-[0_0_20px_#e2f161,0_0_40px_#e2f161] transition-shadow duration-300"
        />
      </span>
      <!-- Antenna Rod Mast -->
      <div
        class="w-0.5 h-6 sm:h-7 bg-gradient-to-t from-slate-600 via-slate-400 to-lime-400 shadow-[0_0_6px_rgba(226,241,97,0.5)] group-hover:shadow-[0_0_12px_#e2f161] group-hover:via-lime-300 transition-all duration-300"
      />
      <!-- Antenna Dish Base Mount -->
      <div
        class="w-3 sm:w-3.5 h-1 sm:h-1.5 bg-slate-700 rounded-t-sm border-t border-lime-400/40 group-hover:border-lime-400 group-hover:shadow-[0_0_8px_#e2f161] transition-all duration-300"
      />
    </div>

    <!-- Left Solar Array Wing Assembly (Desktop - Positioned Higher with Radiant Cyan Glow on hover) -->
    <div
      class="hidden lg:flex flex-col items-center justify-center absolute -left-9 xl:-left-11 top-[24%] -translate-y-1/2 z-0 pointer-events-none select-none transition-all duration-500 group-hover:scale-105 group-hover:-translate-x-1"
    >
      <!-- Solar Array Body (Deep space photovoltaic cells with cyan lattice grid) -->
      <div
        class="w-8 xl:w-9 h-32 xl:h-36 rounded-xl solar-wing-surface border border-sky-400/40 group-hover:border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.25)] group-hover:shadow-[0_0_35px_rgba(56,189,248,0.65),0_0_70px_rgba(56,189,248,0.3)] flex flex-col justify-between p-1.5 relative overflow-hidden transition-all duration-300"
      >
        <!-- Solar Bus Bar & Cell Dividers -->
        <div class="flex justify-between items-center w-full px-0.5">
          <span
            class="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8] group-hover:shadow-[0_0_10px_#38bdf8]"
          />
          <span
            class="text-[7px] font-mono text-sky-400/80 group-hover:text-sky-300 tracking-tighter transition-colors"
            >PV-A1</span
          >
          <span
            class="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8] group-hover:shadow-[0_0_10px_#38bdf8]"
          />
        </div>

        <!-- Vertical Solar Telemetry Line -->
        <div
          class="h-full w-px bg-sky-400/30 group-hover:bg-sky-400/60 mx-auto my-1 transition-colors"
        />

        <!-- Vertical Text Label -->
        <div
          class="text-[7px] font-mono text-sky-300 font-bold -rotate-90 origin-center whitespace-nowrap tracking-widest uppercase select-none opacity-80 group-hover:opacity-100 group-hover:text-white group-hover:drop-shadow-[0_0_8px_#38bdf8] transition-all"
        >
          SOLAR ARRAY // α
        </div>

        <div
          class="h-full w-px bg-sky-400/30 group-hover:bg-sky-400/60 mx-auto my-1 transition-colors"
        />

        <div class="flex justify-between items-center w-full px-0.5">
          <span class="w-1 h-1 rounded-full bg-sky-400/60 group-hover:bg-sky-300" />
          <span class="text-[7px] font-mono text-sky-400/60 group-hover:text-sky-300">450W</span>
          <span class="w-1 h-1 rounded-full bg-sky-400/60 group-hover:bg-sky-300" />
        </div>
      </div>

      <!-- Metal Joint Arm to Satellite Body -->
      <div
        class="w-3.5 h-1.5 bg-gradient-to-r from-sky-500/80 to-slate-700 group-hover:from-sky-400 group-hover:to-slate-600 border-y border-sky-400/40 group-hover:border-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.3)] group-hover:shadow-[0_0_15px_#38bdf8] absolute right-[-13px] top-1/2 -translate-y-1/2 transition-all duration-300"
      />
    </div>

    <!-- Right Solar Array Wing Assembly (Desktop - Positioned Lower with Radiant Cyan Glow on hover) -->
    <div
      class="hidden lg:flex flex-col items-center justify-center absolute -right-9 xl:-right-11 top-[76%] -translate-y-1/2 z-0 pointer-events-none select-none transition-all duration-500 group-hover:scale-105 group-hover:translate-x-1"
    >
      <!-- Metal Joint Arm to Satellite Body -->
      <div
        class="w-3.5 h-1.5 bg-gradient-to-l from-sky-500/80 to-slate-700 group-hover:from-sky-400 group-hover:to-slate-600 border-y border-sky-400/40 group-hover:border-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.3)] group-hover:shadow-[0_0_15px_#38bdf8] absolute left-[-13px] top-1/2 -translate-y-1/2 transition-all duration-300"
      />

      <!-- Solar Array Body (Deep space photovoltaic cells with cyan lattice grid) -->
      <div
        class="w-8 xl:w-9 h-32 xl:h-36 rounded-xl solar-wing-surface border border-sky-400/40 group-hover:border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.25)] group-hover:shadow-[0_0_35px_rgba(56,189,248,0.65),0_0_70px_rgba(56,189,248,0.3)] flex flex-col justify-between p-1.5 relative overflow-hidden transition-all duration-300"
      >
        <!-- Solar Bus Bar & Cell Dividers -->
        <div class="flex justify-between items-center w-full px-0.5">
          <span
            class="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8] group-hover:shadow-[0_0_10px_#38bdf8]"
          />
          <span
            class="text-[7px] font-mono text-sky-400/80 group-hover:text-sky-300 tracking-tighter transition-colors"
            >PV-B2</span
          >
          <span
            class="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8] group-hover:shadow-[0_0_10px_#38bdf8]"
          />
        </div>

        <div
          class="h-full w-px bg-sky-400/30 group-hover:bg-sky-400/60 mx-auto my-1 transition-colors"
        />

        <!-- Vertical Text Label -->
        <div
          class="text-[7px] font-mono text-sky-300 font-bold rotate-90 origin-center whitespace-nowrap tracking-widest uppercase select-none opacity-80 group-hover:opacity-100 group-hover:text-white group-hover:drop-shadow-[0_0_8px_#38bdf8] transition-all"
        >
          SOLAR ARRAY // β
        </div>

        <div
          class="h-full w-px bg-sky-400/30 group-hover:bg-sky-400/60 mx-auto my-1 transition-colors"
        />

        <div class="flex justify-between items-center w-full px-0.5">
          <span class="w-1 h-1 rounded-full bg-sky-400/60 group-hover:bg-sky-300" />
          <span class="text-[7px] font-mono text-sky-400/60 group-hover:text-sky-300"
            >PWR 100%</span
          >
          <span class="w-1 h-1 rounded-full bg-sky-400/60 group-hover:bg-sky-300" />
        </div>
      </div>
    </div>

    <!-- Ion Plasma Thrusters (Bottom Corner Jets - Flare on hover) -->
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
      <!-- Satellite Corner Reticles -->
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
        <!-- MacOS Controls & Satellite Antenna Identifier with Vivid Glows -->
        <div class="flex items-center justify-between border-b border-lime-400/15 pb-2.5 gap-2">
          <!-- Left: macOS Traffic Lights -->
          <div class="flex items-center gap-2 shrink-0">
            <span
              class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500 shadow-[0_0_10px_#f43f5e] inline-block"
            />
            <span
              class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500 shadow-[0_0_10px_#f59e0b] inline-block"
            />
            <span
              class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] inline-block"
            />
          </div>

          <!-- Center: Satellite Identity -->
          <div
            class="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-300 font-mono truncate"
          >
            <span
              class="text-lime-400 font-bold drop-shadow-[0_0_8px_#e2f161] flex items-center gap-1"
            >
              🛰️ satellite.sh
            </span>
            <span class="truncate text-slate-400">bonfiglio@orbital-node</span>
          </div>

          <!-- Right: Live Telemetry Status -->
          <div class="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 shrink-0">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span class="hidden sm:inline">SYNCHRONIZED</span>
            <span class="text-lime-400/40">|</span>
            <span class="text-slate-400">60FPS</span>
          </div>
        </div>

        <!-- Tab Buttons with Neon Glow Border on Active Tab -->
        <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
          <button
            type="button"
            class="text-[10px] sm:text-[11px] font-mono px-3 py-1 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap"
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
            class="text-[10px] sm:text-[11px] font-mono px-3 py-1 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap"
            :class="
              activeTab === 'config'
                ? 'bg-lime-400/10 text-lime-400 border border-lime-400 shadow-[0_0_12px_rgba(226,241,97,0.45)] font-bold'
                : 'bg-transparent text-slate-400 hover:text-slate-200 border border-transparent hover:border-lime-400/20'
            "
            @click="setTab('config')"
          >
            alessio.config.ts
          </button>
          <button
            type="button"
            class="text-[10px] sm:text-[11px] font-mono px-3 py-1 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap"
            :class="
              activeTab === 'skills'
                ? 'bg-lime-400/10 text-lime-400 border border-lime-400 shadow-[0_0_12px_rgba(226,241,97,0.45)] font-bold'
                : 'bg-transparent text-slate-400 hover:text-slate-200 border border-transparent hover:border-lime-400/20'
            "
            @click="setTab('skills')"
          >
            skills.json
          </button>
        </div>
      </div>

      <!-- Tab 1: Real Interactive Terminal Shell -->
      <div
        v-show="activeTab === 'terminal'"
        class="flex flex-col justify-between flex-1 min-h-0 bg-dark-950/90 border border-lime-400/20 rounded-2xl p-3 sm:p-4 my-2 font-mono text-[11px] sm:text-xs overflow-hidden shadow-inner cursor-text relative z-10"
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

            <!-- HTML Output -->
            <div v-else-if="entry.html" class="leading-snug font-mono" v-html="entry.html" />

            <!-- Plain Output -->
            <div v-else class="text-slate-300 leading-snug font-mono">
              {{ entry.text }}
            </div>
          </div>
        </div>

        <!-- Active Interactive Command Input Line -->
        <form
          class="flex items-center gap-2 pt-2 mt-2 border-t border-lime-400/15 shrink-0"
          @submit.prevent="handleFormSubmit"
        >
          <span class="text-lime-400 font-bold select-none">$</span>
          <input
            ref="inputRef"
            v-model="currentInput"
            type="text"
            placeholder="type command (e.g. skills, cv, projects)..."
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            class="w-full bg-transparent text-lime-300 font-mono text-[11px] sm:text-xs focus:outline-none placeholder-slate-600 caret-lime-400"
            @keydown.tab.prevent="handleTabKey"
            @keydown.up.prevent="handleArrowUp"
            @keydown.down.prevent="handleArrowDown"
          />
          <button
            type="submit"
            class="text-[9px] sm:text-[10px] bg-lime-400 text-black px-2.5 py-1 rounded font-bold shrink-0 hover:bg-lime-300 hover:shadow-[0_0_10px_#e2f161] active:scale-95 transition-all cursor-pointer select-none"
          >
            EXEC
          </button>
        </form>
      </div>

      <!-- Tab 2: Config Tab -->
      <div
        v-show="activeTab === 'config'"
        class="flex-1 overflow-y-auto bg-dark-950/70 border border-lime-400/15 rounded-2xl p-3 sm:p-4 my-2 font-mono text-[10px] sm:text-xs text-slate-300 leading-relaxed no-scrollbar relative z-10"
      >
        <pre
          class="whitespace-pre overflow-x-auto"
        ><code><span class="text-lime-400 font-bold">export const</span> engineer = {
  name: <span class="text-lime-300">"Alessio Bonfiglio"</span>,
  role: <span class="text-lime-300">"Frontend Engineer"</span>,
  currentCompany: <span class="text-white font-bold">"iliad"</span>,
  exCompany: <span class="text-white font-bold">"AdKaora Mondadori Media"</span>,
  origin: <span class="text-lime-300">"Sanremo, IT ('98)"</span>,
  experience: <span class="text-emerald-400">"6+ Years in Production"</span>,
  coreStack: [<span class="text-emerald-400">"Vue 3"</span>, <span class="text-emerald-400">"TypeScript"</span>, <span class="text-emerald-400">"React"</span>, <span class="text-emerald-400">"Next.js"</span>, <span class="text-emerald-400">"Tailwind"</span>],
  focus: <span class="text-lime-400">"60fps Pixel-Perfect &amp; AI-Augmented Workflows"</span>
};</code></pre>
      </div>

      <!-- Tab 3: Skills Tab -->
      <div
        v-show="activeTab === 'skills'"
        class="flex-1 overflow-y-auto bg-dark-950/70 border border-lime-400/15 rounded-2xl p-3 sm:p-4 my-2 font-mono text-[10px] sm:text-xs text-slate-300 leading-relaxed no-scrollbar relative z-10"
      >
        <pre class="whitespace-pre overflow-x-auto"><code>{
  <span class="text-lime-400">"core"</span>: [
    <span class="text-lime-300">"Vue 3"</span>, <span class="text-lime-300">"TypeScript"</span>, <span class="text-lime-300">"React"</span>, <span class="text-lime-300">"Next.js"</span>, <span class="text-lime-300">"Angular"</span>
  ],
  <span class="text-lime-400">"styling"</span>: [
    <span class="text-lime-300">"TailwindCSS"</span>, <span class="text-lime-300">"SCSS"</span>, <span class="text-lime-300">"Design Systems"</span>
  ],
  <span class="text-lime-400">"aiEngineering"</span>: [
    <span class="text-lime-300">"Agentic Workflows"</span>, <span class="text-lime-300">"Multi-Agent Prompting"</span>, <span class="text-lime-300">"LLM Tooling"</span>
  ],
  <span class="text-lime-400">"performance"</span>: <span class="text-emerald-400">"High Concurrency &amp; Low Latency UI"</span>
}</code></pre>
      </div>

      <!-- Footer Quick Action Chips: Interactive Orbital Telemetry Actions -->
      <div
        class="flex items-center justify-between gap-1.5 pt-1.5 text-[9px] sm:text-[10px] text-slate-400 font-mono shrink-0 border-t border-lime-400/15 overflow-x-auto no-scrollbar relative z-10"
      >
        <div class="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
          <span class="text-slate-500 font-bold">Quick:</span>
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
            class="text-slate-300 hover:text-lime-400 cursor-pointer bg-dark-950 px-2 py-0.5 rounded-md border border-slate-700 transition-all active:scale-95"
            @click="runQuickAction('contact')"
          >
            contact
          </button>
          <button
            type="button"
            class="text-slate-300 hover:text-lime-400 cursor-pointer bg-dark-950 px-2 py-0.5 rounded-md border border-slate-700 transition-all active:scale-95"
            @click="runQuickAction('cv')"
          >
            cv.md
          </button>
          <button
            type="button"
            class="text-slate-300 hover:text-lime-400 cursor-pointer bg-dark-950 px-2 py-0.5 rounded-md border border-slate-700 transition-all active:scale-95"
            @click="runQuickAction('supernova')"
          >
            spark
          </button>
          <button
            type="button"
            class="text-slate-500 hover:text-slate-300 cursor-pointer bg-dark-950 px-1.5 py-0.5 rounded-md border border-slate-800 transition-all active:scale-95"
            @click="runQuickAction('clear')"
          >
            clear
          </button>
        </div>
        <span class="text-slate-500 shrink-0 hidden sm:inline">orbital.zsh</span>
      </div>
    </div>
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
</style>
