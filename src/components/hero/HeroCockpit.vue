<script setup lang="ts">
  import { ref } from 'vue'
  import AppCard from '../ui/AppCard.vue'

  type TabType = 'terminal' | 'config' | 'skills'
  const activeTab = ref<TabType>('terminal')

  function setTab(tab: TabType) {
    activeTab.value = tab
  }
</script>

<template>
  <AppCard
    padding="none"
    rounded="2xl"
    :hud-reticles="false"
    :tilt="false"
    float-animation="animate-float-slow"
    class="w-full max-w-md lg:max-w-lg h-[400px] sm:h-[430px] p-4 sm:p-5 flex flex-col justify-between select-none overflow-hidden"
  >
    <!-- Window Header & Tab Navigation -->
    <div class="space-y-3 shrink-0">
      <!-- MacOS Controls & Window Title -->
      <div class="flex items-center justify-between border-b border-lime-400/15 pb-2.5 gap-2">
        <div class="flex items-center gap-1.5 shrink-0">
          <span
            class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500/90 shadow-[0_0_8px_#f43f5e] inline-block"
          />
          <span
            class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500/90 shadow-[0_0_8px_#f59e0b] inline-block"
          />
          <span
            class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500/90 shadow-[0_0_8px_#10b981] inline-block"
          />
        </div>
        <div
          class="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-300 font-mono truncate"
        >
          <span class="text-lime-400 font-bold drop-shadow-[0_0_6px_#e2f161]">⚡ zsh</span>
          <span class="truncate">bonfiglio@node-ide</span>
        </div>
      </div>

      <!-- Tab Buttons with horizontal scroll for mobile safety -->
      <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
        <button
          type="button"
          class="text-[10px] sm:text-[11px] font-mono px-2.5 sm:px-3 py-1 rounded transition-all cursor-pointer shrink-0 whitespace-nowrap"
          :class="
            activeTab === 'terminal'
              ? 'bg-lime-400/15 text-lime-400 border border-lime-400/40 shadow-[0_0_10px_rgba(226,241,97,0.2)]'
              : 'bg-transparent text-slate-400 hover:text-slate-200 border border-transparent hover:border-lime-400/20'
          "
          @click="setTab('terminal')"
        >
          interactive.sh ⚡
        </button>
        <button
          type="button"
          class="text-[10px] sm:text-[11px] font-mono px-2.5 sm:px-3 py-1 rounded transition-all cursor-pointer shrink-0 whitespace-nowrap"
          :class="
            activeTab === 'config'
              ? 'bg-lime-400/15 text-lime-400 border border-lime-400/40 shadow-[0_0_10px_rgba(226,241,97,0.2)]'
              : 'bg-transparent text-slate-400 hover:text-slate-200 border border-transparent hover:border-lime-400/20'
          "
          @click="setTab('config')"
        >
          alessio.config.ts
        </button>
        <button
          type="button"
          class="text-[10px] sm:text-[11px] font-mono px-2.5 sm:px-3 py-1 rounded transition-all cursor-pointer shrink-0 whitespace-nowrap"
          :class="
            activeTab === 'skills'
              ? 'bg-lime-400/15 text-lime-400 border border-lime-400/40 shadow-[0_0_10px_rgba(226,241,97,0.2)]'
              : 'bg-transparent text-slate-400 hover:text-slate-200 border border-transparent hover:border-lime-400/20'
          "
          @click="setTab('skills')"
        >
          skills.json
        </button>
      </div>
    </div>

    <!-- Tab 1: Terminal Screen -->
    <div
      v-show="activeTab === 'terminal'"
      class="flex flex-col justify-between flex-1 min-h-0 bg-dark-950/70 border border-lime-400/15 rounded-xl p-3 sm:p-4 my-2 font-mono text-[11px] sm:text-xs overflow-hidden"
    >
      <div class="flex-1 overflow-y-auto space-y-1.5 pr-1 no-scrollbar text-slate-200">
        <p class="text-slate-400">// Interactive CLI environment ready.</p>
        <p class="text-lime-400">
          &gt; Type
          <span class="text-white font-bold bg-dark-800 px-1 py-0.5 rounded">help</span>
          for commands or click quick actions below.
        </p>
      </div>

      <!-- Input Simulation Bar -->
      <div class="flex items-center gap-2 pt-2 mt-2 border-t border-lime-400/15 shrink-0">
        <span class="text-lime-400 font-bold">$</span>
        <input
          type="text"
          placeholder="type command..."
          class="w-full bg-transparent text-slate-100 font-mono text-[11px] sm:text-xs focus:outline-none placeholder-slate-600"
          readonly
        />
        <span
          class="text-[9px] sm:text-[10px] bg-lime-400 text-black px-2.5 py-1 rounded font-bold shrink-0"
          >EXEC</span
        >
      </div>
    </div>

    <!-- Tab 2: Config Tab -->
    <div
      v-show="activeTab === 'config'"
      class="flex-1 overflow-y-auto bg-dark-950/70 border border-lime-400/15 rounded-xl p-3 sm:p-4 my-2 font-mono text-[10px] sm:text-xs text-slate-300 leading-relaxed no-scrollbar"
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
  coreStack: [<span class="text-emerald-400">"React"</span>, <span class="text-emerald-400">"Vue"</span>, <span class="text-emerald-400">"Angular"</span>, <span class="text-emerald-400">"Next.js"</span>, <span class="text-emerald-400">"TypeScript"</span>],
  focus: <span class="text-lime-400">"60fps Pixel-Perfect Rendering"</span>
};</code></pre>
    </div>

    <!-- Tab 3: Skills Tab -->
    <div
      v-show="activeTab === 'skills'"
      class="flex-1 overflow-y-auto bg-dark-950/70 border border-lime-400/15 rounded-xl p-3 sm:p-4 my-2 font-mono text-[10px] sm:text-xs text-slate-300 leading-relaxed no-scrollbar"
    >
      <pre class="whitespace-pre overflow-x-auto"><code>{
  <span class="text-lime-400">"frontend"</span>: [
    <span class="text-lime-300">"React"</span>, <span class="text-lime-300">"Next.js"</span>, <span class="text-lime-300">"Vue"</span>, <span class="text-lime-300">"Nuxt"</span>, <span class="text-lime-300">"Angular"</span>
  ],
  <span class="text-lime-400">"styling"</span>: [
    <span class="text-lime-300">"TailwindCSS"</span>, <span class="text-lime-300">"SCSS"</span>, <span class="text-lime-300">"Design Tokens"</span>
  ],
  <span class="text-lime-400">"architecture"</span>: [
    <span class="text-lime-300">"TypeScript"</span>, <span class="text-lime-300">"GraphQL"</span>, <span class="text-lime-300">"REST"</span>
  ],
  <span class="text-lime-400">"performance"</span>: <span class="text-emerald-400">"High Concurrency & Low Latency UI"</span>
}</code></pre>
    </div>

    <!-- Footer Quick Actions -->
    <div
      class="flex items-center justify-between gap-1.5 pt-1 text-[9px] sm:text-[10px] text-slate-400 font-mono shrink-0 border-t border-lime-400/10 overflow-x-auto no-scrollbar"
    >
      <div class="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
        <span>Quick:</span>
        <span class="text-slate-400">help</span> &bull;
        <span class="text-slate-400">skills</span> &bull;
        <span class="text-slate-400">spark</span> &bull;
        <span class="text-slate-400">sudo hire</span>
      </div>
      <span class="text-slate-500 shrink-0">zsh</span>
    </div>
  </AppCard>
</template>
