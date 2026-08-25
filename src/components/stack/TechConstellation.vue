<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { portfolioData } from '../../data/portfolio'
  import { useAudioSynth } from '../../composables/useAudioSynth'
  import SectionHeader from '../ui/SectionHeader.vue'
  import SkillCard from './SkillCard.vue'

  const { skillsConstellation } = portfolioData
  const { playClick } = useAudioSynth()

  const coreClusters = computed(() => skillsConstellation.filter((c) => c.clusterNumber !== '#04'))
  const aiCluster = computed(() => skillsConstellation.find((c) => c.clusterNumber === '#04'))

  const allClusters = computed(() => skillsConstellation)
  const activeMobileClusterIndex = ref(0)
  const activeMobileCluster = computed(() => allClusters.value[activeMobileClusterIndex.value])

  function selectCluster(index: number) {
    playClick()
    activeMobileClusterIndex.value = index
  }

  function getClusterTheme(clusterNumber: string): 'lime' | 'white' | 'emerald' | 'cyan' {
    switch (clusterNumber) {
      case '#01':
        return 'lime'
      case '#02':
        return 'white'
      case '#03':
        return 'emerald'
      case '#04':
        return 'cyan'
      default:
        return 'lime'
    }
  }

  function getClusterPillClass(clusterNumber: string, isActive: boolean) {
    if (!isActive) {
      return 'bg-dark-900/90 text-slate-300 border border-lime-400/20 hover:text-white'
    }
    switch (clusterNumber) {
      case '#01':
        return 'bg-lime-400 text-black shadow-[0_0_18px_rgba(226,241,97,0.45)]'
      case '#02':
        return 'bg-white text-black shadow-[0_0_18px_rgba(255,255,255,0.45)]'
      case '#03':
        return 'bg-emerald-400 text-black shadow-[0_0_18px_rgba(52,211,153,0.45)]'
      case '#04':
        return 'bg-sky-400 text-black shadow-[0_0_18px_rgba(56,189,248,0.45)]'
      default:
        return 'bg-lime-400 text-black shadow-[0_0_18px_rgba(226,241,97,0.45)]'
    }
  }

  function getClusterTitleColor(clusterNumber: string) {
    switch (clusterNumber) {
      case '#01':
        return 'text-lime-400'
      case '#02':
        return 'text-white'
      case '#03':
        return 'text-emerald-400'
      case '#04':
        return 'text-sky-400'
      default:
        return 'text-lime-400'
    }
  }

  const floatPatterns = ['animate-float-slow', 'animate-float-delayed', 'animate-float-subtle']
</script>

<template>
  <section
    id="stack"
    class="tech-constellation-sector w-screen relative left-1/2 -translate-x-1/2 py-20 sm:py-24 lg:py-28 overflow-hidden select-none transition-colors duration-1000 ease-out scroll-mt-20"
  >
    <!-- Cosmic Smoke / Cloud Nebula Transition Drift at Top (Hero to Stack) -->
    <div
      class="absolute -top-14 inset-x-0 h-48 bg-gradient-to-b from-transparent via-sky-500/12 to-transparent blur-3xl pointer-events-none"
    />
    <div
      class="absolute -top-20 left-1/4 -translate-x-1/2 w-[750px] h-[240px] rounded-full bg-cyan-400/15 blur-[110px] pointer-events-none"
    />
    <div
      class="absolute -top-24 right-1/4 translate-x-1/2 w-[650px] h-[220px] rounded-full bg-indigo-500/18 blur-[120px] pointer-events-none"
    />

    <!-- Distinct Constellation Atmospheric Nebulas (Electric Sky & Deep Indigo Aura) -->
    <div
      class="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-sky-500/12 blur-[150px] pointer-events-none"
    />
    <div
      class="absolute bottom-1/3 right-1/4 translate-x-1/2 translate-y-1/2 w-[700px] h-[450px] rounded-full bg-indigo-500/12 blur-[160px] pointer-events-none"
    />

    <!-- Subtle Cybernetic Constellation Background Lattice Grid -->
    <div class="absolute inset-0 constellation-grid opacity-30 pointer-events-none" />

    <!-- Inner Content Stage (Aligned with Main Page Container Max-W-7xl) -->
    <div class="w-full max-w-7xl mx-auto px-6 sm:px-8 relative z-10 space-y-8">
      <!-- Section Header -->
      <SectionHeader
        section-number="01"
        title="The Tech Constellation"
        status-badge="● 12 CORE MODULES & AI ORCHESTRATION"
        description="I tool e le tecnologie fondamentali su cui fondo architetture solide, veloci e workflow agentici aumentati dall'AI."
      />

      <!-- ================= MOBILE VIEW: Category Filter + Vertical Columned Cards (< lg) ================= -->
      <div class="lg:hidden space-y-5 pt-2">
        <!-- Category Filter Pills with Spectrum Colors -->
        <div
          class="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          <button
            v-for="(cluster, idx) in allClusters"
            :key="cluster.clusterNumber"
            type="button"
            class="px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all duration-200 shrink-0 cursor-pointer flex items-center gap-2 active:scale-95"
            :class="getClusterPillClass(cluster.clusterNumber, activeMobileClusterIndex === idx)"
            @click="selectCluster(idx)"
          >
            <span
              :class="
                activeMobileClusterIndex === idx
                  ? 'text-black font-black'
                  : getClusterTitleColor(cluster.clusterNumber)
              "
            >
              {{ cluster.clusterNumber }}
            </span>
            <span>{{ cluster.title.split('&')[0].trim() }}</span>
          </button>
        </div>

        <!-- Active Category Header Badge -->
        <div
          class="flex items-center justify-between gap-2 px-1 border-b border-lime-400/15 pb-2.5"
        >
          <span
            class="text-[11px] font-mono font-bold uppercase tracking-wider"
            :class="getClusterTitleColor(activeMobileCluster.clusterNumber)"
          >
            {{ activeMobileCluster.clusterNumber }} //
            {{ activeMobileCluster.title }}
          </span>
          <span class="text-[10px] font-mono text-slate-400">
            {{ activeMobileCluster.skills.length }} MODULES
          </span>
        </div>

        <!-- Vertically Columned Skill Cards with Cluster Theme -->
        <div class="space-y-3.5 pt-1">
          <SkillCard
            v-for="skill in activeMobileCluster.skills"
            :key="skill.name"
            :skill="skill"
            :theme="getClusterTheme(activeMobileCluster.clusterNumber)"
          />
        </div>
      </div>

      <!-- ================= DESKTOP VIEW: Pristine 3-Column Engineering Grid (>= lg) ================= -->
      <div class="hidden lg:block space-y-8">
        <!-- Top: 3-Column Core Engineering Clusters Grid with Spectrum Accents -->
        <div class="grid grid-cols-3 gap-6 pt-2">
          <div
            v-for="(cluster, cIdx) in coreClusters"
            :key="cluster.clusterNumber"
            class="space-y-4"
          >
            <!-- Cluster Category Title -->
            <div
              class="text-[11px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-2 pb-1 border-b border-lime-400/10"
            >
              <span class="font-bold" :class="getClusterTitleColor(cluster.clusterNumber)">
                {{ cluster.clusterNumber }}
              </span>
              <span>{{ cluster.title }}</span>
            </div>

            <!-- Cards inside Cluster with Themed Colors & Staggered Floating Motion -->
            <div class="space-y-3.5 sm:space-y-4">
              <SkillCard
                v-for="(skill, sIdx) in cluster.skills"
                :key="skill.name"
                :skill="skill"
                :theme="getClusterTheme(cluster.clusterNumber)"
                :float-animation="floatPatterns[(cIdx + sIdx) % floatPatterns.length]"
              />
            </div>
          </div>
        </div>

        <!-- Bottom: Dedicated AI & Agentic Engineering Showcase Row (Cyan Accent) -->
        <div v-if="aiCluster" class="pt-4 space-y-4">
          <!-- AI Category Title -->
          <div
            class="text-[11px] font-mono text-slate-400 uppercase tracking-widest flex items-center justify-between gap-2 pb-1 border-b border-lime-400/10"
          >
            <div class="flex items-center gap-2">
              <span class="text-sky-400 font-bold">
                {{ aiCluster.clusterNumber }}
              </span>
              <span>{{ aiCluster.title }}</span>
            </div>
            <span class="text-[10px] text-sky-400/80 font-mono">
              HUMAN-IN-THE-LOOP AI WORKFLOW
            </span>
          </div>

          <!-- 3 Cards Grid for AI with Cyan Theme & Staggered Float -->
          <div class="grid grid-cols-3 gap-6">
            <SkillCard
              v-for="(skill, idx) in aiCluster.skills"
              :key="skill.name"
              :skill="skill"
              theme="cyan"
              :float-animation="floatPatterns[idx % floatPatterns.length]"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
  .tech-constellation-sector {
    // Unique Electric Sky & Deep Indigo Cyber-Lattice background
    background: radial-gradient(
      ellipse at 50% 35%,
      rgba(8, 26, 48, 0.78) 0%,
      rgba(4, 13, 26, 0.94) 55%,
      rgba(2, 6, 16, 0.98) 100%
    );
    // Smooth ethereal smoke/cloud feather mask at top and bottom edges (Zero hard line cuts!)
    mask-image: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(0, 0, 0, 0.3) 30px,
      rgba(0, 0, 0, 0.8) 80px,
      black 130px,
      black calc(100% - 130px),
      rgba(0, 0, 0, 0.8) calc(100% - 80px),
      rgba(0, 0, 0, 0.3) calc(100% - 30px),
      transparent 100%
    );
    -webkit-mask-image: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(0, 0, 0, 0.3) 30px,
      rgba(0, 0, 0, 0.8) 80px,
      black 130px,
      black calc(100% - 130px),
      rgba(0, 0, 0, 0.8) calc(100% - 80px),
      rgba(0, 0, 0, 0.3) calc(100% - 30px),
      transparent 100%
    );
  }

  .constellation-grid {
    background-image:
      linear-gradient(to right, rgba(56, 189, 248, 0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(56, 189, 248, 0.05) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse at 50% 50%, black 40%, transparent 80%);
    -webkit-mask-image: radial-gradient(ellipse at 50% 50%, black 40%, transparent 80%);
  }
</style>
