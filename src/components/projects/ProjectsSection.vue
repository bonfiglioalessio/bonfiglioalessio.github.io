<script setup lang="ts">
  import { portfolioData } from '../../data/portfolio'
  import SectionWrapper from '../layout/SectionWrapper.vue'
  import SectionHeader from '../ui/SectionHeader.vue'
  import ProjectCard from './ProjectCard.vue'

  const { selectedWork } = portfolioData
</script>

<template>
  <SectionWrapper id="projects" spacing="default">
    <div class="space-y-8">
      <!-- Section Header -->
      <SectionHeader
        section-number="02"
        title="Selected Work"
        status-badge="● 4 SELECTED PROJECTS"
        description="Una selezione di side project, demo ed esperimenti passati creati per esplorare framework, state management e UI."
      />

      <!-- 2-Column Responsive Projects Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 pt-2">
        <ProjectCard v-for="project in selectedWork" :key="project.id" :project="project" />
      </div>
    </div>
  </SectionWrapper>
</template>
