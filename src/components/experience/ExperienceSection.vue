<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue'
  import { portfolioData } from '../../data/portfolio'
  import SectionWrapper from '../layout/SectionWrapper.vue'
  import SectionHeader from '../ui/SectionHeader.vue'
  import ExperienceCard from './ExperienceCard.vue'

  const { careerMissionLog } = portfolioData

  const floatPatterns = ['animate-float-slow', 'animate-float-delayed', 'animate-float-subtle']

  const sectionContainerRef = ref<HTMLElement | null>(null)
  const scrollProgress = ref(0) // 0 to 100%
  let ticking = false

  function updateTimelineProgress() {
    if (!sectionContainerRef.value) return

    const rect = sectionContainerRef.value.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const triggerY = windowHeight * 0.7

    if (rect.top > triggerY) {
      scrollProgress.value = 0
    } else {
      const distance = triggerY - rect.top
      const totalHeight = rect.height - 60
      const rawProgress = Math.max(0, Math.min(1, distance / totalHeight))
      scrollProgress.value = rawProgress * 100
    }

    ticking = false
  }

  function handleScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateTimelineProgress)
      ticking = true
    }
  }

  onMounted(() => {
    updateTimelineProgress()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('resize', handleScroll)
  })
</script>

<template>
  <SectionWrapper id="experience" spacing="default">
    <!-- Whole Timeline Section with Continuous Rail Starting Above Header on the Left -->
    <div ref="sectionContainerRef" class="relative pl-7 sm:pl-9 lg:pl-10">
      <!-- Continuous Left Vertical Rail (Originates Above Section Header) -->
      <div
        class="absolute top-0 bottom-2 left-0 w-[2px] bg-lime-400/20 rounded-full pointer-events-none"
      />

      <!-- Active Scroll-Driven Neon Laser Beam -->
      <div
        class="absolute top-0 left-0 w-[2px] bg-gradient-to-b from-lime-300 via-lime-400 to-emerald-400 shadow-[0_0_12px_#e2f161] rounded-full pointer-events-none z-10 transition-[height] duration-100 ease-out"
        :style="{ height: `${Math.min(100, scrollProgress)}%` }"
      />

      <!-- Top Origin Beacon Marker (Above Title on the Rail) -->
      <div
        class="absolute -top-3 -left-[5px] w-3 h-3 rounded-full bg-dark-950 border-2 border-lime-400 shadow-[0_0_10px_#e2f161] z-20 flex items-center justify-center pointer-events-none"
      >
        <span class="w-1 h-1 rounded-full bg-lime-300 animate-ping" />
      </div>

      <!-- Traveling Laser Head Orb -->
      <div
        v-if="scrollProgress > 2 && scrollProgress < 98"
        class="absolute -left-[5px] w-3 h-3 rounded-full bg-lime-300 shadow-[0_0_10px_#e2f161,0_0_20px_#e2f161] pointer-events-none z-20 transition-[top] duration-100 ease-out animate-pulse"
        :style="{ top: `calc(${scrollProgress}% - 6px)` }"
      />

      <!-- Section Header (Aligned cleanly to the right of the vertical rail) -->
      <div class="pb-8 sm:pb-10">
        <SectionHeader
          section-number="03"
          title="Career Mission Log"
          status-badge="● 6+ YEARS IN PRODUCTION"
          description="Il percorso professionale tra grandi realtà enterprise, sistemi ad alto traffico e ingegneria frontend."
        />
      </div>

      <!-- Experience Timeline Cards Attached Directly to Vertical Rail -->
      <div class="space-y-8 sm:space-y-10">
        <ExperienceCard
          v-for="(experience, idx) in careerMissionLog"
          :key="experience.id"
          :experience="experience"
          :index="idx"
          :total="careerMissionLog.length"
          :timeline-progress="scrollProgress"
          :float-animation="floatPatterns[idx % floatPatterns.length]"
        />
      </div>
    </div>
  </SectionWrapper>
</template>
