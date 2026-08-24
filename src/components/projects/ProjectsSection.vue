<script setup lang="ts">
  import { computed } from 'vue'
  import { portfolioData } from '../../data/portfolio'
  import SectionWrapper from '../layout/SectionWrapper.vue'
  import SectionHeader from '../ui/SectionHeader.vue'
  import ProjectCard from './ProjectCard.vue'

  const { selectedWork } = portfolioData

  const floatPatterns = [
    'animate-float-slow',
    'animate-float-delayed',
    'animate-float-subtle',
    'animate-float-delayed',
  ]

  // Split projects into two columns for the staggered desktop layout
  const leftProjects = computed(() => selectedWork.filter((_, idx) => idx % 2 === 0))
  const rightProjects = computed(() => selectedWork.filter((_, idx) => idx % 2 === 1))
</script>

<template>
  <SectionWrapper id="projects" spacing="default">
    <div class="space-y-8 sm:space-y-10">
      <!-- Section Header with Accent-Highlighted [+] inspect diff -->
      <SectionHeader section-number="02" title="Selected Work" status-badge="● 4 SELECTED PROJECTS">
        <template #description>
          Una selezione di side project ed esperimenti passati. Clicca su
          <span
            class="text-lime-400 font-bold bg-dark-950 px-2 py-0.5 rounded-md border border-lime-400/40 shadow-[0_0_8px_rgba(226,241,97,0.25)] inline-flex items-center gap-1 font-mono text-xs select-all"
          >
            [+] inspect diff
          </span>
          in ogni card per esaminare i dettagli tecnici, i commit e le metriche di codice.
        </template>
      </SectionHeader>

      <!-- Staggered 2-Column Responsive Layout (Asymmetrical Vertical Offset on Desktop) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 pt-2 items-start">
        <!-- Column 1: Projects #01 & #03 (Top Aligned) -->
        <div class="space-y-6 lg:space-y-10 flex flex-col">
          <ProjectCard
            v-for="(project, idx) in leftProjects"
            :key="project.id"
            :project="project"
            :float-animation="floatPatterns[(idx * 2) % floatPatterns.length]"
          />
        </div>

        <!-- Column 2: Projects #02 & #04 (Staggered Offset on Desktop) -->
        <div class="space-y-6 lg:space-y-10 lg:mt-16 flex flex-col">
          <ProjectCard
            v-for="(project, idx) in rightProjects"
            :key="project.id"
            :project="project"
            :float-animation="floatPatterns[(idx * 2 + 1) % floatPatterns.length]"
          />
        </div>
      </div>
    </div>
  </SectionWrapper>
</template>
