<script setup lang="ts">
  import { ref } from 'vue'
  import AppContainer from './AppContainer.vue'
  import { useScrollReveal } from '../../composables/useScrollReveal'
  import { usePortfolioData } from '../../composables/usePortfolioData'

  const footerRef = ref<HTMLElement | null>(null)
  useScrollReveal(footerRef, {
    threshold: 0.1,
    rootMargin: '0px 0px -20px 0px',
  })

  const { footer } = usePortfolioData()

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
    class="bg-dark-950 pt-8 pb-12 relative z-10 select-none reveal-on-scroll"
  >
    <AppContainer size="default">
      <div class="py-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <!-- Telemetry Status & Attribution -->
        <div class="space-y-2 text-center sm:text-left">
          <code
            class="flex items-center justify-center sm:justify-start gap-2 font-mono text-xs text-slate-300 font-bold flex-wrap"
          >
            <span class="w-2 h-2 rounded-full bg-lime-400" />
            <span class="text-lime-400">{{ footer?.statusText || 'STATUS: NOMINAL' }}</span>
            <span class="text-slate-600">|</span>
            <span class="text-slate-400">{{ footer?.latencyText || 'LATENCY: <1ms' }}</span>
            <span class="text-slate-600">|</span>
            <span class="text-slate-400">{{ footer?.engineText || '60FPS ENGINE' }}</span>
          </code>

          <p class="text-xs font-sans text-slate-400">
            &copy; {{ new Date().getFullYear() }} {{ footer?.attribution || 'Alessio Bonfiglio · Frontend Engineer & UI Architect' }}
          </p>
        </div>

        <!-- Back to Top Button -->
        <button
          type="button"
          class="px-4 py-2 rounded-xl border border-white/10 bg-dark-900/60 hover:bg-white/5 hover:border-lime-400/50 text-slate-300 hover:text-lime-400 font-sans text-xs flex items-center gap-2 transition-colors cursor-pointer shrink-0"
          @click="scrollToTop"
        >
          <span class="text-lime-400 group-hover:-translate-y-0.5 transition-transform"
            >&uarr;</span
          >
          <span>{{ footer?.backToTopText || 'Back to top' }}</span>
        </button>
      </div>
    </AppContainer>
  </footer>
</template>
