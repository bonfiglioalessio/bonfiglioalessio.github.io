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

  // Gentle 3D Tilt for CLI Cockpit (Subtler than Selected Work cards: maxTilt 3.5 vs 8)
  const { transformStyle, glareStyle, handleMouseEnter, handleMouseMove, handleMouseLeave } =
    use3DTilt(cockpitRef, {
      maxTilt: 3.5,
      perspective: 1200,
      scale: 1.01,
      speed: 550,
      glare: true,
      maxGlare: 0.16,
    })

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
  <div class="relative w-full max-w-md lg:max-w-lg">
    <!-- Atmospheric Cosmic Glow Nebula Aura behind CLI -->
    <div
      class="absolute -top-16 -right-16 w-80 h-80 bg-lime-400/25 rounded-full blur-3xl pointer-events-none z-0 animate-glow-pulse"
    />
    <div
      class="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none z-0"
    />

    <!-- Main Cockpit Card Container with Gentle 3D Tilt & Subtle Dynamic Border -->
    <div
      ref="cockpitRef"
      class="w-full h-[360px] sm:h-[410px] lg:h-[430px] p-3.5 sm:p-5 rounded-2xl bg-dark-900/80 backdrop-blur-xl border border-lime-400/30 hover:border-lime-400/60 flex flex-col justify-between select-none overflow-hidden relative z-10 shadow-[0_0_30px_rgba(226,241,97,0.18),0_0_70px_rgba(226,241,97,0.08)] hover:shadow-[0_0_45px_rgba(226,241,97,0.3),0_0_90px_rgba(226,241,97,0.15)] transition-all duration-300 group"
      :style="transformStyle"
      @mouseenter="handleMouseEnter"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
    >
      <!-- Dynamic Holographic Glare Sheen -->
      <div :style="glareStyle" aria-hidden="true" />

      <!-- Window Header & Tab Navigation -->
      <div class="space-y-3 shrink-0 relative z-10">
        <!-- MacOS Controls & Window Title with Vivid Glows -->
        <div class="flex items-center justify-between border-b border-lime-400/15 pb-2.5 gap-2">
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
          <div
            class="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-300 font-mono truncate"
          >
            <span
              class="text-lime-400 font-bold drop-shadow-[0_0_8px_#e2f161] flex items-center gap-1"
            >
              ⚡ zsh
            </span>
            <span class="truncate text-slate-300">bonfiglio@node-ide</span>
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
        class="flex flex-col justify-between flex-1 min-h-0 bg-dark-950/85 border border-lime-400/20 rounded-xl p-3 sm:p-4 my-2 font-mono text-[11px] sm:text-xs overflow-hidden shadow-inner cursor-text relative z-10"
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

            <!-- Error Message (Rose matching reference screenshot) -->
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
            placeholder="type command..."
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
        class="flex-1 overflow-y-auto bg-dark-950/70 border border-lime-400/15 rounded-xl p-3 sm:p-4 my-2 font-mono text-[10px] sm:text-xs text-slate-300 leading-relaxed no-scrollbar relative z-10"
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
        class="flex-1 overflow-y-auto bg-dark-950/70 border border-lime-400/15 rounded-xl p-3 sm:p-4 my-2 font-mono text-[10px] sm:text-xs text-slate-300 leading-relaxed no-scrollbar relative z-10"
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

      <!-- Footer Quick Action Chips: Exactly help, spark, sudo hire, clear -->
      <div
        class="flex items-center justify-between gap-1.5 pt-1 text-[9px] sm:text-[10px] text-slate-400 font-mono shrink-0 border-t border-lime-400/10 overflow-x-auto no-scrollbar relative z-10"
      >
        <div class="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
          <span class="text-slate-500">Quick:</span>
          <button
            type="button"
            class="text-lime-400/80 hover:text-lime-300 hover:underline cursor-pointer bg-dark-950 px-2 py-0.5 rounded border border-lime-400/20"
            @click="runQuickAction('help')"
          >
            help
          </button>
          <button
            type="button"
            class="text-lime-400/80 hover:text-lime-300 hover:underline cursor-pointer bg-dark-950 px-2 py-0.5 rounded border border-lime-400/20"
            @click="runQuickAction('spark')"
          >
            spark
          </button>
          <button
            type="button"
            class="text-lime-400/80 hover:text-lime-300 hover:underline cursor-pointer bg-dark-950 px-2 py-0.5 rounded border border-lime-400/20"
            @click="runQuickAction('sudo hire')"
          >
            sudo hire
          </button>
          <button
            type="button"
            class="text-slate-400 hover:text-slate-200 hover:underline cursor-pointer bg-dark-950 px-2 py-0.5 rounded border border-slate-800"
            @click="runQuickAction('clear')"
          >
            clear
          </button>
        </div>
        <span class="text-slate-500 shrink-0">zsh</span>
      </div>
    </div>
  </div>
</template>
