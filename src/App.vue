<script setup lang="ts">
  import TopBar from './components/layout/TopBar.vue'
  import MarqueeTicker from './components/layout/MarqueeTicker.vue'
  import AppContainer from './components/layout/AppContainer.vue'
  import AppFooter from './components/layout/AppFooter.vue'
  import SpaceCanvas from './components/canvas/SpaceCanvas.vue'
  import HeroSection from './components/hero/HeroSection.vue'
  import TechConstellation from './components/stack/TechConstellation.vue'
  import ProjectsSection from './components/projects/ProjectsSection.vue'
  import ExperienceSection from './components/experience/ExperienceSection.vue'
  import ContactSection from './components/contact/ContactSection.vue'
</script>

<template>
  <div
    class="min-h-screen bg-dark-950 text-slate-200 font-mono relative overflow-hidden flex flex-col justify-between"
  >
    <!-- Interactive Canvas 3D Starfield Layer -->
    <SpaceCanvas />

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
      <main class="space-y-16 lg:space-y-24 pb-20">
        <!-- 00 Hero Section -->
        <HeroSection />

        <!-- 01 Tech Constellation Section -->
        <TechConstellation />

        <!-- 02 Selected Work Section -->
        <ProjectsSection />

        <!-- 03 Career Mission Log Section -->
        <ExperienceSection />

        <!-- 04 Contact Open Channel Section -->
        <ContactSection />
      </main>
    </AppContainer>

    <!-- System Telemetry Footer -->
    <AppFooter />
  </div>
</template>
