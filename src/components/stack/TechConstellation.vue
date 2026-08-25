<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { usePortfolioData } from '../../composables/usePortfolioData'
  import { useAudioSynth } from '../../composables/useAudioSynth'
  import SectionHeader from '../ui/SectionHeader.vue'
  import SkillCard from './SkillCard.vue'

  const { skillsConstellation } = usePortfolioData()
  const { playClick } = useAudioSynth()

  const coreClusters = computed(() =>
    skillsConstellation.value.filter((c) => c.clusterNumber !== '#04'),
  )
  const aiCluster = computed(() => skillsConstellation.value.find((c) => c.clusterNumber === '#04'))
  const allClusters = computed(() => skillsConstellation.value)

  // Mobile Active Cluster Selector & Touch Gestures
  const activeClusterIndex = ref(0)
  const activeCluster = computed(() => allClusters.value[activeClusterIndex.value])

  let touchStartX = 0
  function onTouchStart(e: TouchEvent) {
    touchStartX = e.touches[0].clientX
  }

  function onTouchEnd(e: TouchEvent) {
    const diff = touchStartX - e.changedTouches[0].clientX
    if (diff > 45 && activeClusterIndex.value < allClusters.value.length - 1) {
      activeClusterIndex.value++
      playClick()
    } else if (diff < -45 && activeClusterIndex.value > 0) {
      activeClusterIndex.value--
      playClick()
    }
  }

  function selectCluster(index: number) {
    playClick()
    activeClusterIndex.value = index
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
      return 'bg-dark-900/60 text-slate-400 hover:text-white border border-transparent'
    }
    switch (clusterNumber) {
      case '#01':
        return 'bg-lime-400 text-black shadow-[0_0_15px_rgba(226,241,97,0.4)] font-black'
      case '#02':
        return 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)] font-black'
      case '#03':
        return 'bg-emerald-400 text-black shadow-[0_0_15px_rgba(52,211,153,0.4)] font-black'
      case '#04':
        return 'bg-sky-400 text-black shadow-[0_0_15px_rgba(56,189,248,0.4)] font-black'
      default:
        return 'bg-lime-400 text-black shadow-[0_0_15px_rgba(226,241,97,0.4)] font-black'
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

  function getPaginationActiveClass(clusterNumber: string) {
    switch (clusterNumber) {
      case '#01':
        return 'w-6 bg-lime-400 shadow-[0_0_8px_#e2f161]'
      case '#02':
        return 'w-6 bg-white shadow-[0_0_8px_#ffffff]'
      case '#03':
        return 'w-6 bg-emerald-400 shadow-[0_0_8px_#34d399]'
      case '#04':
        return 'w-6 bg-sky-400 shadow-[0_0_8px_#38bdf8]'
      default:
        return 'w-6 bg-lime-400 shadow-[0_0_8px_#e2f161]'
    }
  }

  const floatPatterns = ['animate-float-slow', 'animate-float-delayed', 'animate-float-subtle']
</script>

<template>
  <section
    id="stack"
    class="w-screen relative left-1/2 -translate-x-1/2 py-6 sm:py-10 lg:py-16 overflow-hidden select-none transition-colors duration-1000 ease-out scroll-mt-20"
  >
    <!-- Dedicated Ethereal Radial Space Backdrop Layer with Subtle Celestial Planetarium Grid -->
    <div class="absolute inset-0 tech-constellation-backdrop pointer-events-none">
      <!-- Subtle Cybernetic Constellation Background Lattice Grid -->
      <div class="absolute inset-0 constellation-grid opacity-45" />

      <!-- Faint Astronomical Polar Celestial Arcs in Open Space -->
      <svg
        class="absolute inset-0 w-full h-full pointer-events-none opacity-20 overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="88%"
          cy="12%"
          r="180"
          fill="none"
          stroke="#38bdf8"
          stroke-width="0.8"
          stroke-dasharray="3 6"
        />
        <circle
          cx="88%"
          cy="12%"
          r="360"
          fill="none"
          stroke="#38bdf8"
          stroke-width="0.8"
          stroke-dasharray="4 8"
        />
        <circle
          cx="88%"
          cy="12%"
          r="540"
          fill="none"
          stroke="#38bdf8"
          stroke-width="0.8"
          stroke-dasharray="5 10"
        />
        <circle
          cx="88%"
          cy="12%"
          r="720"
          fill="none"
          stroke="#38bdf8"
          stroke-width="0.8"
          stroke-dasharray="6 12"
        />
      </svg>
    </div>

    <!-- Ultra-Smooth Cloud Smoke Fog Overlays at Top & Bottom (Zero hard lines) -->
    <div
      class="absolute top-0 inset-x-0 h-20 sm:h-28 bg-gradient-to-b from-dark-950 via-dark-950/70 to-transparent pointer-events-none z-1"
    />
    <div
      class="absolute bottom-0 inset-x-0 h-20 sm:h-28 bg-gradient-to-t from-dark-950 via-dark-950/70 to-transparent pointer-events-none z-1"
    />

    <!-- Volumetric Cosmic Nebulas (Electric Sky & Indigo) -->
    <div
      class="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-sky-500/10 blur-[160px] pointer-events-none"
    />
    <div
      class="absolute bottom-1/3 right-1/4 translate-x-1/2 translate-y-1/2 w-[750px] h-[450px] rounded-full bg-indigo-500/10 blur-[170px] pointer-events-none"
    />

    <!-- Inner Content Stage (Aligned with Main Page Container Max-W-7xl) in Pure Open Space -->
    <div
      class="w-full max-w-7xl mx-auto px-6 sm:px-8 relative z-10 space-y-4 sm:space-y-6 lg:space-y-8"
    >
      <!-- Section Header -->
      <SectionHeader
        section-number="01"
        title="The Tech Constellation"
        status-badge="● 12 CORE MODULES & AI ORCHESTRATION"
        description="I tool e le tecnologie fondamentali su cui fondo architetture solide, veloci e workflow agentici aumentati dall'AI."
      />

      <!-- ================= MOBILE VIEW: Compact Constellation Sector Dock + Touch Swipe (< lg) ================= -->
      <div class="lg:hidden space-y-3 pt-0" @touchstart="onTouchStart" @touchend="onTouchEnd">
        <!-- Sector Selector Dock (4 Equal Width Cyber Pills) -->
        <div
          class="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-dark-900/90 border border-lime-400/20 backdrop-blur-md"
        >
          <button
            v-for="(cluster, idx) in allClusters"
            :key="cluster.clusterNumber"
            type="button"
            class="py-2 rounded-xl font-mono text-[11px] font-bold transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-0.5 select-none active:scale-95"
            :class="getClusterPillClass(cluster.clusterNumber, activeClusterIndex === idx)"
            @click="selectCluster(idx)"
          >
            <span class="tracking-wider">{{ cluster.clusterNumber }}</span>
            <span class="text-[9px] uppercase opacity-80 leading-none">
              {{ cluster.title.split('&')[0].trim().slice(0, 4) }}
            </span>
          </button>
        </div>

        <!-- Active Constellation Category Header with Coordinates & Swipe Hints -->
        <div class="flex items-center justify-between px-1 border-b border-lime-400/15 pb-2">
          <span
            class="font-mono text-xs font-bold tracking-wider"
            :class="getClusterTitleColor(activeCluster.clusterNumber)"
          >
            ✦ {{ activeCluster.clusterNumber }} // {{ activeCluster.title }}
          </span>
          <span class="text-[9px] font-mono text-slate-400">
            {{ activeClusterIndex + 1 }}/4 ⇄
          </span>
        </div>

        <!-- Vertically Columned Skill Cards of the Active Constellation -->
        <div class="space-y-3.5 pt-0.5 transition-all duration-300">
          <SkillCard
            v-for="skill in activeCluster.skills"
            :key="skill.name"
            :skill="skill"
            :theme="getClusterTheme(activeCluster.clusterNumber)"
          />
        </div>

        <!-- Constellation Pagination Indicator Track & Capsule Pills -->
        <div class="flex flex-col items-center justify-center gap-2 pt-2 select-none">
          <div class="flex items-center gap-2">
            <button
              v-for="(cluster, idx) in allClusters"
              :key="cluster.clusterNumber"
              type="button"
              class="h-1.5 rounded-full transition-all duration-300 cursor-pointer"
              :class="
                activeClusterIndex === idx
                  ? getPaginationActiveClass(cluster.clusterNumber)
                  : 'w-2 bg-slate-700 hover:bg-slate-500'
              "
              :aria-label="`Go to constellation ${cluster.clusterNumber}`"
              @click="selectCluster(idx)"
            />
          </div>
          <span class="text-[9px] font-mono text-slate-500 uppercase tracking-wider">
            SECTOR {{ activeClusterIndex + 1 }} OF 4 // SWIPE TO EXPLORE
          </span>
        </div>
      </div>

      <!-- ================= DESKTOP VIEW: Open-Space Constellations with Inter-Category Vector Lines (>= lg) ================= -->
      <div class="hidden lg:block space-y-10 relative">
        <!-- SVG Constellation Geometric Connection Lines Between Categories -->
        <svg
          class="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0"
          xmlns="http://www.w3.org/2000/svg"
        >
          <!-- Horizontal Constellation Trace: Cluster #01 to #02 -->
          <line
            x1="31%"
            y1="12px"
            x2="35%"
            y2="12px"
            stroke="rgba(226, 241, 97, 0.4)"
            stroke-width="1.5"
            stroke-dasharray="3 4"
            class="constellation-pulse-line"
          />

          <!-- Horizontal Constellation Trace: Cluster #02 to #03 -->
          <line
            x1="64%"
            y1="12px"
            x2="68%"
            y2="12px"
            stroke="rgba(52, 211, 153, 0.4)"
            stroke-width="1.5"
            stroke-dasharray="3 4"
            class="constellation-pulse-line"
          />

          <!-- Diagonal Constellation Link: Cluster #01 to AI Cluster #04 -->
          <path
            d="M 16% 360 L 16% 410 L 33% 450"
            fill="none"
            stroke="rgba(56, 189, 248, 0.25)"
            stroke-width="1.2"
            stroke-dasharray="3 5"
          />

          <!-- Diagonal Constellation Link: Cluster #03 to AI Cluster #04 -->
          <path
            d="M 84% 360 L 84% 410 L 67% 450"
            fill="none"
            stroke="rgba(56, 189, 248, 0.25)"
            stroke-width="1.2"
            stroke-dasharray="3 5"
          />
        </svg>

        <!-- Top: 3-Column Core Categories Floating in Open Space -->
        <div class="grid grid-cols-3 gap-8 relative z-10">
          <div
            v-for="(cluster, cIdx) in coreClusters"
            :key="cluster.clusterNumber"
            class="space-y-4"
          >
            <!-- Category Title with Constellation Accent -->
            <div
              class="flex items-center gap-2 pb-2 border-b border-lime-400/15 font-mono text-[11px]"
            >
              <span
                class="font-bold tracking-widest"
                :class="getClusterTitleColor(cluster.clusterNumber)"
              >
                {{ cluster.clusterNumber }}
              </span>
              <span class="text-white font-bold tracking-wider uppercase">
                {{ cluster.title }}
              </span>
            </div>

            <!-- Cards inside Cluster with Themed Colors & Staggered Floating Motion -->
            <div class="space-y-4">
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

        <!-- Bottom: Dedicated Constellation #04: AI & Agentic Engineering (Cyan Accent) -->
        <div v-if="aiCluster" class="pt-4 space-y-4 relative z-10">
          <!-- AI Constellation Header -->
          <div
            class="flex items-center justify-between pb-2 border-b border-sky-400/20 font-mono text-[11px]"
          >
            <div class="flex items-center gap-2">
              <span class="text-sky-400 font-bold tracking-widest">
                {{ aiCluster.clusterNumber }}
              </span>
              <span class="text-white font-bold tracking-wider uppercase">
                {{ aiCluster.title }}
              </span>
            </div>
            <span class="text-[10px] text-sky-400/90 font-mono tracking-wider">
              ✦ HUMAN-IN-THE-LOOP AI WORKFLOW // 99.8% SYNC
            </span>
          </div>

          <!-- 3 Cards Grid for AI Constellation in Open Space -->
          <div class="grid grid-cols-3 gap-8">
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
  .tech-constellation-backdrop {
    background: radial-gradient(
      ellipse 90% 70% at 50% 50%,
      rgba(8, 26, 48, 0.88) 0%,
      rgba(4, 13, 26, 0.95) 55%,
      transparent 100%
    );
  }

  .constellation-grid {
    background-image:
      linear-gradient(to right, rgba(56, 189, 248, 0.08) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(56, 189, 248, 0.08) 1px, transparent 1px);
    background-size: 40px 40px;
    mask-image: radial-gradient(ellipse at 50% 50%, black 60%, transparent 95%);
    -webkit-mask-image: radial-gradient(ellipse at 50% 50%, black 60%, transparent 95%);
  }

  .constellation-pulse-line {
    animation: constellation-line-pulse 4s ease-in-out infinite alternate;
  }

  @keyframes constellation-line-pulse {
    0% {
      opacity: 0.35;
      stroke-dashoffset: 0;
    }
    100% {
      opacity: 0.9;
      stroke-dashoffset: 14;
    }
  }
</style>
