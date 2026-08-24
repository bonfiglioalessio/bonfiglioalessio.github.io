<script setup lang="ts">
  import TopBar from './components/layout/TopBar.vue'
  import MarqueeTicker from './components/layout/MarqueeTicker.vue'
  import AppContainer from './components/layout/AppContainer.vue'
  import SectionWrapper from './components/layout/SectionWrapper.vue'
  import AppBadge from './components/ui/AppBadge.vue'
  import AppCard from './components/ui/AppCard.vue'
  import SectionHeader from './components/ui/SectionHeader.vue'
</script>

<template>
  <div class="min-h-screen bg-dark-950 text-slate-200 font-mono relative overflow-hidden">
    <!-- Sticky TopBar -->
    <TopBar />

    <!-- Infinite Marquee Ticker -->
    <MarqueeTicker />

    <!-- Ambient Atmospheric Glows -->
    <div
      class="ambient-glow-lime top-[-160px] left-1/2 -translate-x-1/2 w-[800px] h-[400px] animate-glow-pulse"
    />
    <div class="ambient-glow-cyan bottom-[-140px] left-1/4 w-[600px] h-[350px]" />

    <!-- Main Content Container -->
    <AppContainer>
      <SectionWrapper spacing="default">
        <SectionHeader
          section-number="00"
          title="TopBar &amp; Marquee Ticker"
          status-badge="● STEP 3 IMPLEMENTED"
          description="Navigazione semantica sticky con effetto glassmorphism e ticker infinito di highlight professionali."
        />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
          <!-- TopBar Specs Card -->
          <AppCard padding="lg" rounded="2xl" class="space-y-4">
            <div class="flex items-center justify-between border-b border-lime-400/15 pb-3">
              <h3 class="text-sm font-bold text-white font-mono">TopBar Specifications</h3>
              <AppBadge variant="lime" :dot="true">Sticky</AppBadge>
            </div>

            <ul class="space-y-2.5 text-xs text-slate-300">
              <li class="flex items-center gap-2">
                <span class="text-lime-400">✔</span>
                <span>Glassmorphism con <code>backdrop-blur-xl</code></span>
              </li>
              <li class="flex items-center gap-2">
                <span class="text-lime-400">✔</span>
                <span>Brand logo animato <code>&lt;A.BONFIGLIO/&gt;</code></span>
              </li>
              <li class="flex items-center gap-2">
                <span class="text-lime-400">✔</span>
                <span
                  >Navigazione interna (<code>#stack</code>, <code>#projects</code>,
                  <code>#experience</code>, <code>#contact</code>)</span
                >
              </li>
              <li class="flex items-center gap-2">
                <span class="text-lime-400">✔</span>
                <span>Menu a scomparsa responsive per mobile</span>
              </li>
            </ul>
          </AppCard>

          <!-- Marquee Ticker Specs Card -->
          <AppCard padding="lg" rounded="2xl" class="space-y-4">
            <div class="flex items-center justify-between border-b border-lime-400/15 pb-3">
              <h3 class="text-sm font-bold text-white font-mono">Marquee Ticker Specifications</h3>
              <AppBadge variant="cyan">60 FPS</AppBadge>
            </div>

            <ul class="space-y-2.5 text-xs text-slate-300">
              <li class="flex items-center gap-2">
                <span class="text-cyan-400">✦</span>
                <span>Loop infinito senza scatti (CSS keyframes)</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="text-cyan-400">✦</span>
                <span>Pausa automatica su hover per agevolare la lettura</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="text-cyan-400">✦</span>
                <span>Dati collegati direttamente al Data Layer tipizzato</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="text-cyan-400">✦</span>
                <span>Accessibilità semantica (<code>aria-hidden</code> sul clone)</span>
              </li>
            </ul>
          </AppCard>
        </div>
      </SectionWrapper>
    </AppContainer>
  </div>
</template>
