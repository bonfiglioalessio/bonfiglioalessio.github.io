<script setup lang="ts">
  import { ref } from 'vue'
  import AppContainer from './AppContainer.vue'
  import { useScrollReveal } from '../../composables/useScrollReveal'

  const footerRef = ref<HTMLElement | null>(null)
  useScrollReveal(footerRef, {
    threshold: 0.1,
    rootMargin: '0px 0px -20px 0px',
  })

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
</script>

<template>
  <footer
    ref="footerRef"
    class="border-t border-lime-400/10 bg-dark-950/40 backdrop-blur-sm relative z-10 select-none reveal-on-scroll"
  >
    <AppContainer size="default">
      <div class="py-8 sm:py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <!-- System Telemetry Status & Attribution -->
        <div class="space-y-2 text-center sm:text-left">
          <div
            class="flex items-center justify-center sm:justify-start gap-2 font-mono text-xs text-slate-300 font-bold flex-wrap"
          >
            <span class="w-2 h-2 rounded-full bg-lime-400 shadow-[0_0_8px_#e2f161]" />
            <span class="text-lime-400">SYS_STATUS: OPTIMAL</span>
            <span class="text-lime-400/40">|</span>
            <span class="text-slate-400">LATENCY: &lt;1ms</span>
            <span class="text-lime-400/40">|</span>
            <span class="text-slate-400">60FPS ENGINE</span>
          </div>

          <p class="text-[11px] font-mono text-slate-400">
            &copy; {{ new Date().getFullYear() }} ALESSIO BONFIGLIO // HUMAN-DIRECTED AI ENGINEERING
          </p>
        </div>

        <!-- Back to Top Button -->
        <button
          type="button"
          class="px-4 py-2 rounded-xl border border-lime-400/20 bg-dark-900/60 hover:bg-lime-400/10 hover:border-lime-400/50 text-slate-300 hover:text-lime-400 font-mono text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm group shrink-0"
          @click="scrollToTop"
        >
          <span class="text-lime-400 group-hover:-translate-y-0.5 transition-transform"
            >&uarr;</span
          >
          <span>BACK_TO_TOP</span>
        </button>
      </div>
    </AppContainer>
  </footer>
</template>
