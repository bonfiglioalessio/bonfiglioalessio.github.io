<script setup lang="ts">
  import { ref } from 'vue'
  import AppPreloader from './components/ui/AppPreloader.vue'
  import TopBar from './components/layout/TopBar.vue'
  import AppContainer from './components/layout/AppContainer.vue'
  import AppFooter from './components/layout/AppFooter.vue'
  import SpaceCanvas from './components/canvas/SpaceCanvas.vue'
  import HeroSection from './components/hero/HeroSection.vue'
  import TechConstellation from './components/stack/TechConstellation.vue'
  import ProjectsSection from './components/projects/ProjectsSection.vue'
  import ExperienceSection from './components/experience/ExperienceSection.vue'
  import ContactSection from './components/contact/ContactSection.vue'
  import AudioHudControl from './components/ui/AudioHudControl.vue'
  import CyberCursor from './components/ui/CyberCursor.vue'

  const isAppReady = ref(false)

  function onPreloaderFinish() {
    isAppReady.value = true
  }
</script>

<template>
  <div
    class="min-h-screen bg-dark-950 text-slate-200 font-mono relative overflow-hidden flex flex-col justify-between"
  >
    <!-- Initial Orbital Boot Preloader -->
    <AppPreloader @finish="onPreloaderFinish" />

    <!-- Custom Cyber 60fps Precision Cursor -->
    <CyberCursor />

    <!-- Interactive Canvas 3D Starfield Layer -->
    <SpaceCanvas />

    <!-- Sticky/Fixed TopBar Header (Includes Top Marquee + Transparent Borderless Navbar) -->
    <TopBar :is-ready="isAppReady" />

    <!-- Ambient Atmospheric Glows -->
    <div
      class="ambient-glow-lime top-[-160px] left-1/2 -translate-x-1/2 w-[800px] h-[400px] animate-glow-pulse"
    />
    <div class="ambient-glow-cyan bottom-[-140px] left-1/4 w-[600px] h-[350px]" />

    <!-- Main Content Container -->
    <AppContainer size="default">
      <main class="pb-0">
        <!-- 00 Hero Section -->
        <HeroSection :is-ready="isAppReady" />

        <!-- 01 Tech Constellation Section (Compact Seamless Flow) -->
        <TechConstellation />

        <!-- 02 Selected Work Section (Compact Seamless Flow) -->
        <ProjectsSection />

        <!-- 03 Career Mission Log Section (Compact Seamless Flow) -->
        <ExperienceSection />

        <!-- 04 Contact Open Channel Section -->
        <ContactSection />
      </main>
    </AppContainer>

    <!-- Seamless System Telemetry Footer -->
    <AppFooter />

    <!-- Fixed Bottom-Right HUD Audio Synthesizer Control -->
    <AudioHudControl />
  </div>
</template>
