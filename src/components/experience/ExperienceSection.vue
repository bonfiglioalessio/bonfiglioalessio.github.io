<script setup lang="ts">
  import { portfolioData } from '../../data/portfolio'
  import SectionWrapper from '../layout/SectionWrapper.vue'
  import SectionHeader from '../ui/SectionHeader.vue'
  import ExperienceCard from './ExperienceCard.vue'

  const { careerMissionLog } = portfolioData
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

      <!-- Vertical Timeline Track -->
      <div
        class="relative border-l border-lime-400/20 ml-2.5 sm:ml-3.5 space-y-8 sm:space-y-10 pt-2 pb-4"
      >
        <ExperienceCard
          v-for="experience in careerMissionLog"
          :key="experience.id"
          :experience="experience"
        />
      </div>
    </div>
  </SectionWrapper>
</template>
