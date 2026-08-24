<script setup lang="ts">
  import { computed } from 'vue'
  import { portfolioData } from '../../data/portfolio'
  import SectionWrapper from '../layout/SectionWrapper.vue'
  import SectionHeader from '../ui/SectionHeader.vue'
  import SkillCard from './SkillCard.vue'

  const { skillsConstellation } = portfolioData

  const coreClusters = computed(() => skillsConstellation.filter((c) => c.clusterNumber !== '#04'))
  const aiCluster = computed(() => skillsConstellation.find((c) => c.clusterNumber === '#04'))
</script>

<template>
  <SectionWrapper id="stack" spacing="default">
    <div class="space-y-8">
      <!-- Section Header -->
      <SectionHeader
        section-number="01"
        title="The Tech Constellation"
        status-badge="● 12 CORE MODULES & AI ORCHESTRATION"
        description="I tool e le tecnologie fondamentali su cui fondo architetture solide, veloci e workflow agentici aumentati dall'AI."
      />

      <!-- Top: 3-Column Core Engineering Clusters Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        <div v-for="cluster in coreClusters" :key="cluster.clusterNumber" class="space-y-4">
          <!-- Cluster Category Title -->
          <div
            class="text-[11px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-2 pb-1 border-b border-lime-400/10"
          >
            <span class="text-lime-400 font-bold">{{ cluster.clusterNumber }}</span>
            <span>{{ cluster.title }}</span>
          </div>

          <!-- Cards inside Cluster -->
          <div class="space-y-3.5 sm:space-y-4">
            <SkillCard v-for="skill in cluster.skills" :key="skill.name" :skill="skill" />
          </div>
        </div>
      </div>

      <!-- Bottom: Dedicated AI & Agentic Engineering Showcase Row -->
      <div v-if="aiCluster" class="pt-4 space-y-4">
        <!-- AI Category Title -->
        <div
          class="text-[11px] font-mono text-slate-400 uppercase tracking-widest flex items-center justify-between gap-2 pb-1 border-b border-lime-400/10"
        >
          <div class="flex items-center gap-2">
            <span class="text-lime-400 font-bold">{{ aiCluster.clusterNumber }}</span>
            <span>{{ aiCluster.title }}</span>
          </div>
          <span class="text-[10px] text-lime-400/80 font-mono hidden sm:inline"
            >HUMAN-IN-THE-LOOP AI WORKFLOW</span
          >
        </div>

        <!-- 3 Cards Grid for AI -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkillCard v-for="skill in aiCluster.skills" :key="skill.name" :skill="skill" />
        </div>
      </div>
    </div>
  </SectionWrapper>
</template>
