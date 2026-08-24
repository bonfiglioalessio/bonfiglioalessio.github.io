<script setup lang="ts">
  import TopBar from './components/layout/TopBar.vue'
  import MarqueeTicker from './components/layout/MarqueeTicker.vue'
  import AppContainer from './components/layout/AppContainer.vue'
  import HeroSection from './components/hero/HeroSection.vue'
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
    <AppContainer size="default">
      <main>
        <!-- Hero Section -->
        <HeroSection />
      </main>
    </AppContainer>
  </div>
</template>
