<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue'
  import { portfolioData } from '../../data/portfolio'
  import SectionWrapper from '../layout/SectionWrapper.vue'
  import SectionHeader from '../ui/SectionHeader.vue'
  import ExperienceCard from './ExperienceCard.vue'

  const { careerMissionLog } = portfolioData

  const floatPatterns = ['animate-float-slow', 'animate-float-delayed', 'animate-float-subtle']

  const timelineRef = ref<HTMLElement | null>(null)
  const scrollProgress = ref(0) // 0 to 100%
  let ticking = false

  function updateTimelineProgress() {
    if (!timelineRef.value) return

    const rect = timelineRef.value.getBoundingClientRect()
    const windowHeight = window.innerHeight
    // Activate laser when the section enters the mid-lower viewport (65% from top)
    const triggerY = windowHeight * 0.65

    if (rect.top > triggerY) {
      scrollProgress.value = 0
    } else {
      const distance = triggerY - rect.top
      const totalHeight = rect.height - 40
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
    <div class="space-y-8">
      <!-- Section Header -->
      <SectionHeader
        section-number="03"
        title="Career Mission Log"
        status-badge="● 6+ YEARS IN PRODUCTION"
        description="Il percorso professionale tra grandi realtà enterprise, sistemi ad alto traffico e ingegneria frontend."
      />

      <!-- Vertical Timeline Track with Scroll-Driven Laser Beam -->
      <div ref="timelineRef" class="relative ml-2.5 sm:ml-3.5 space-y-8 sm:space-y-10 pt-2 pb-4">
        <!-- Static Background Timeline Rail -->
        <div
          class="absolute top-0 bottom-0 left-0 w-[2px] bg-lime-400/15 rounded-full pointer-events-none"
        />

        <!-- Active Scroll-Driven Neon Laser Beam -->
        <div
          class="absolute top-0 left-0 w-[2px] bg-gradient-to-b from-lime-300 via-lime-400 to-emerald-400 shadow-[0_0_12px_#e2f161] rounded-full pointer-events-none z-10 transition-[height] duration-100 ease-out"
          :style="{ height: `${Math.min(100, scrollProgress)}%` }"
        />

        <!-- Traveling Laser Head Orb -->
        <div
          v-if="scrollProgress > 2 && scrollProgress < 98"
          class="absolute -left-[4px] w-2.5 h-2.5 rounded-full bg-lime-300 shadow-[0_0_10px_#e2f161,0_0_20px_#e2f161] pointer-events-none z-20 transition-[top] duration-100 ease-out animate-pulse"
          :style="{ top: `calc(${scrollProgress}% - 5px)` }"
        />

        <!-- Timeline Cards with Progressive Node Activation -->
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
