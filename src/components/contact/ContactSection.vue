<script setup lang="ts">
  import { ref } from 'vue'
  import { portfolioData } from '../../data/portfolio'
  import SectionWrapper from '../layout/SectionWrapper.vue'
  import AppCard from '../ui/AppCard.vue'

  const { socialLinks } = portfolioData
  const emailAddress = 'bonfi.alessio98@gmail.com'
  const isCopied = ref(false)

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(emailAddress)
      isCopied.value = true
      setTimeout(() => {
        isCopied.value = false
      }, 2000)
    } catch {
      // Fallback
    }
  }
</script>

<template>
  <SectionWrapper id="contact" spacing="default">
    <!-- Main Contact Showcase Card -->
    <AppCard
      padding="none"
      rounded="3xl"
      :hud-reticles="true"
      class="p-6 sm:p-10 lg:p-14 space-y-6 sm:space-y-8 select-none relative overflow-hidden"
    >
      <!-- Top Tag -->
      <div class="flex items-center gap-2">
        <span
          class="text-lime-400 font-mono font-bold text-xs sm:text-sm tracking-wider drop-shadow-[0_0_8px_#e2f161]"
        >
          // WANNA WORK WITH ME?
        </span>
      </div>

      <!-- Main Glowing Display Headline -->
      <div class="space-y-1">
        <h2
          class="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-syne text-white tracking-tight leading-[1.08]"
        >
          Let's build<br />
          something<br />
          <span
            class="text-lime-400 underline decoration-lime-400 decoration-2 sm:decoration-4 underline-offset-4 sm:underline-offset-8 drop-shadow-[0_0_24px_rgba(226,241,97,0.55)]"
          >
            extraordinary.
          </span>
        </h2>
      </div>

      <!-- Subtitle Description -->
      <p class="text-xs sm:text-sm text-slate-300 font-mono leading-relaxed max-w-xl pt-2">
        Se cerchi un Frontend Engineer con solida esperienza in React/Vue che mette la passione per
        il codice e i dettagli visivi al primo posto, connettiamoci.
      </p>

      <!-- Action Interaction Row -->
      <div class="flex flex-col sm:flex-row sm:items-center gap-4 pt-2 sm:pt-4 flex-wrap">
        <!-- Copy Email Pill Box with Reticles -->
        <div
          class="relative bg-dark-950/90 border border-lime-400/25 rounded-2xl px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3 shadow-inner min-w-0"
        >
          <div class="flex items-center gap-2 min-w-0 font-mono text-xs sm:text-sm">
            <span class="text-lime-400 font-bold">$ copy:</span>
            <span class="text-slate-200 truncate select-all">{{ emailAddress }}</span>
          </div>

          <button
            type="button"
            class="px-2.5 py-1 text-[11px] font-mono rounded-lg border transition-all cursor-pointer shrink-0"
            :class="
              isCopied
                ? 'bg-lime-400 text-black border-lime-400 font-bold shadow-[0_0_10px_rgba(226,241,97,0.4)]'
                : 'bg-lime-400/15 text-lime-400 hover:bg-lime-400/25 border-lime-400/30'
            "
            @click="copyEmail"
          >
            {{ isCopied ? 'COPIED!' : 'COPY' }}
          </button>
        </div>

        <!-- Direct Email Button CTA -->
        <a
          :href="`mailto:${emailAddress}`"
          class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-lime-400 text-black font-mono font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(226,241,97,0.35)] hover:shadow-[0_0_30px_rgba(226,241,97,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <span>Send Email</span>
          <span class="text-sm">&rarr;</span>
        </a>
      </div>

      <!-- Social Links Row -->
      <div class="flex items-center gap-6 sm:gap-8 pt-4 flex-wrap">
        <a
          v-for="link in socialLinks.filter((l) => !l.isMailto)"
          :key="link.platform"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 font-mono text-xs sm:text-sm text-slate-400 hover:text-lime-400 transition-colors group cursor-pointer"
        >
          <span
            class="text-lime-400/80 group-hover:text-lime-400 group-hover:-translate-y-0.5 transition-transform"
            >&#x2197;</span
          >
          <span class="font-bold">{{ link.platform }}</span>
        </a>
      </div>
    </AppCard>
  </SectionWrapper>
</template>
