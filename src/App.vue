<script setup lang="ts">
  import AppContainer from './components/layout/AppContainer.vue'
  import SectionWrapper from './components/layout/SectionWrapper.vue'
  import AppButton from './components/ui/AppButton.vue'
  import AppBadge from './components/ui/AppBadge.vue'
  import AppCard from './components/ui/AppCard.vue'
  import SectionHeader from './components/ui/SectionHeader.vue'
</script>

<template>
  <div class="min-h-screen bg-dark-950 text-slate-200 font-mono relative overflow-hidden">
    <!-- Ambient Atmospheric Glows -->
    <div
      class="ambient-glow-lime top-[-160px] left-1/2 -translate-x-1/2 w-[800px] h-[400px] animate-glow-pulse"
    />
    <div class="ambient-glow-cyan bottom-[-140px] left-1/4 w-[600px] h-[350px]" />

    <AppContainer>
      <!-- Base Foundation Header -->
      <header class="flex items-center justify-between border-b border-lime-400/15 py-6">
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-lime-400 shadow-[0_0_10px_#e2f161]" />
          <span class="text-lime-400 font-bold">&lt;</span>
          <span class="font-display font-extrabold text-xl text-white tracking-tight"
            >A.BONFIGLIO</span
          >
          <span class="text-lime-400 font-bold">/&gt;</span>
        </div>

        <div class="flex items-center gap-3">
          <AppBadge variant="lime" :dot="true">STEP 2: FOUNDATION &amp; SCSS</AppBadge>
        </div>
      </header>

      <!-- Foundation & Base Tokens Verification -->
      <SectionWrapper spacing="default">
        <SectionHeader
          section-number="00"
          title="Design System & Base Tokens"
          status-badge="● READY FOR SECTION-BY-SECTION BUILD"
          description="Infrastruttura base pronta: SCSS modulare, container semantici, data layer tipizzato e componenti atomici."
        />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
          <!-- AppCard & AppBadge Showcase -->
          <AppCard padding="lg" rounded="2xl" class="space-y-5">
            <div class="flex items-center justify-between border-b border-lime-400/15 pb-3">
              <h3 class="text-sm font-bold text-white font-mono">AppBadge Variants</h3>
              <span class="text-[10px] text-slate-400">Tokens</span>
            </div>

            <div class="flex flex-wrap gap-2">
              <AppBadge variant="lime" :dot="true">Lime Accent</AppBadge>
              <AppBadge variant="cyan">TypeScript</AppBadge>
              <AppBadge variant="amber">JavaScript</AppBadge>
              <AppBadge variant="pink">SCSS</AppBadge>
              <AppBadge variant="emerald" pill>Live Deploy</AppBadge>
              <AppBadge variant="orange">Git VCS</AppBadge>
              <AppBadge variant="dark">Dark Chip</AppBadge>
            </div>
          </AppCard>

          <!-- AppButton Showcase -->
          <AppCard padding="lg" rounded="2xl" class="space-y-5">
            <div class="flex items-center justify-between border-b border-lime-400/15 pb-3">
              <h3 class="text-sm font-bold text-white font-mono">AppButton Variants</h3>
              <span class="text-[10px] text-slate-400">Interactive</span>
            </div>

            <div class="flex flex-wrap gap-3">
              <AppButton variant="primary" size="sm">Primary Lime</AppButton>
              <AppButton variant="outline" size="sm">Outline Space</AppButton>
              <AppButton variant="chip" size="sm">⚡ zsh</AppButton>
              <AppButton variant="ghost" size="sm">Ghost Button</AppButton>
            </div>
          </AppCard>
        </div>
      </SectionWrapper>
    </AppContainer>
  </div>
</template>
