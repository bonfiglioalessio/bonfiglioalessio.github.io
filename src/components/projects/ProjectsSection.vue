<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { portfolioData } from '../../data/portfolio'
  import { useAudioSynth } from '../../composables/useAudioSynth'
  import SectionHeader from '../ui/SectionHeader.vue'
  import ProjectCard from './ProjectCard.vue'

  const { selectedWork } = portfolioData
  const { playClick } = useAudioSynth()

  const projectThemes: ('lime' | 'white' | 'emerald' | 'cyan')[] = [
    'lime',
    'white',
    'emerald',
    'cyan',
  ]

  function getProjectTheme(index: number): 'lime' | 'white' | 'emerald' | 'cyan' {
    return projectThemes[index % projectThemes.length]
  }

  function getMobileProjectBadgeClass(index: number) {
    const theme = getProjectTheme(index)
    switch (theme) {
      case 'white':
        return 'text-white bg-white/10 border-white/30'
      case 'emerald':
        return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30'
      case 'cyan':
        return 'text-sky-400 bg-sky-400/10 border-sky-400/30'
      case 'lime':
      default:
        return 'text-lime-400 bg-lime-400/10 border-lime-400/30'
    }
  }

  function getMobilePaginationDotClass(index: number, isActive: boolean) {
    if (!isActive) return 'w-1.5 bg-slate-700 hover:bg-slate-500'
    const theme = getProjectTheme(index)
    switch (theme) {
      case 'white':
        return 'w-5 bg-white shadow-[0_0_8px_#ffffff]'
      case 'emerald':
        return 'w-5 bg-emerald-400 shadow-[0_0_8px_#34d399]'
      case 'cyan':
        return 'w-5 bg-sky-400 shadow-[0_0_8px_#38bdf8]'
      case 'lime':
      default:
        return 'w-5 bg-lime-400 shadow-[0_0_8px_#e2f161]'
    }
  }

  const floatPatterns = [
    'animate-float-slow',
    'animate-float-delayed',
    'animate-float-subtle',
    'animate-float-delayed',
  ]

  // Split projects into two columns for the staggered desktop layout with original global indices
  const leftProjects = computed(() =>
    selectedWork
      .map((p, originalIndex) => ({ project: p, originalIndex }))
      .filter((_, idx) => idx % 2 === 0),
  )
  const rightProjects = computed(() =>
    selectedWork
      .map((p, originalIndex) => ({ project: p, originalIndex }))
      .filter((_, idx) => idx % 2 === 1),
  )

  // Mobile carousel tracking
  const mobileCarouselRef = ref<HTMLDivElement | null>(null)
  const activeProjectIndex = ref(0)

  function scrollToProject(index: number) {
    playClick()
    activeProjectIndex.value = index
    if (!mobileCarouselRef.value) return
    const cardEl = mobileCarouselRef.value.children[index] as HTMLElement
    if (cardEl) {
      cardEl.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      })
    }
  }

  function handleCarouselScroll() {
    if (!mobileCarouselRef.value) return
    const container = mobileCarouselRef.value
    const scrollLeft = container.scrollLeft
    const cardWidth = container.children[0]?.clientWidth || 300
    const gap = 24
    const newIdx = Math.round(scrollLeft / (cardWidth + gap))
    if (newIdx >= 0 && newIdx < selectedWork.length && newIdx !== activeProjectIndex.value) {
      activeProjectIndex.value = newIdx
    }
  }

  function prevProject() {
    if (activeProjectIndex.value > 0) {
      scrollToProject(activeProjectIndex.value - 1)
    } else {
      scrollToProject(selectedWork.length - 1)
    }
  }

  function nextProject() {
    if (activeProjectIndex.value < selectedWork.length - 1) {
      scrollToProject(activeProjectIndex.value + 1)
    } else {
      scrollToProject(0)
    }
  }
</script>

<template>
  <section
    id="projects"
    class="projects-space-sector w-screen relative left-1/2 -translate-x-1/2 py-20 sm:py-24 lg:py-28 overflow-hidden select-none transition-colors duration-1000 ease-out scroll-mt-20"
  >
    <!-- Cosmic Smoke / Cloud Nebula Transition Drift at Top -->
    <div
      class="absolute -top-14 inset-x-0 h-48 bg-gradient-to-b from-transparent via-lime-500/10 to-transparent blur-3xl pointer-events-none"
    />
    <div
      class="absolute -top-20 left-1/4 -translate-x-1/2 w-[700px] h-[220px] rounded-full bg-lime-400/10 blur-[110px] pointer-events-none"
    />
    <div
      class="absolute -top-24 right-1/4 translate-x-1/2 w-[650px] h-[220px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none"
    />

    <!-- Deep Space Atmospheric Nebula Glows -->
    <div
      class="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-lime-500/10 blur-[150px] pointer-events-none"
    />
    <div
      class="absolute bottom-1/3 right-1/4 translate-x-1/2 translate-y-1/2 w-[700px] h-[450px] rounded-full bg-emerald-500/10 blur-[160px] pointer-events-none"
    />

    <!-- Inner Content Stage (Aligned with Main Page Container Max-W-7xl) -->
    <div class="w-full max-w-7xl mx-auto px-6 sm:px-8 relative z-10 space-y-8 sm:space-y-10">
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

      <!-- ================= MOBILE VIEW: Horizontal Swipe Carousel (< lg) ================= -->
      <div class="lg:hidden space-y-5 pt-1">
        <!-- Mobile Carousel Navigation & Stepper Header -->
        <div
          class="flex items-center justify-between gap-3 px-1 border-b border-lime-400/15 pb-2.5 font-mono"
        >
          <div class="flex items-center gap-2">
            <span
              class="text-xs font-bold px-2.5 py-1 rounded-lg border transition-colors"
              :class="getMobileProjectBadgeClass(activeProjectIndex)"
            >
              PROJECT 0{{ activeProjectIndex + 1 }} / 0{{ selectedWork.length }}
            </span>
          </div>

          <!-- Touch-Friendly Stepper Buttons -->
          <div class="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous Project"
              class="w-8 h-8 rounded-xl bg-dark-900 border border-lime-400/30 text-lime-400 flex items-center justify-center text-sm font-bold hover:bg-lime-400 hover:text-black active:scale-95 transition-all cursor-pointer focus:outline-none"
              @click="prevProject"
            >
              &larr;
            </button>
            <button
              type="button"
              aria-label="Next Project"
              class="w-8 h-8 rounded-xl bg-dark-900 border border-lime-400/30 text-lime-400 flex items-center justify-center text-sm font-bold hover:bg-lime-400 hover:text-black active:scale-95 transition-all cursor-pointer focus:outline-none"
              @click="nextProject"
            >
              &rarr;
            </button>
          </div>
        </div>

        <!-- Horizontal Swipeable Project Cards Carousel with Themed Colors -->
        <div
          ref="mobileCarouselRef"
          class="flex overflow-x-auto snap-x snap-mandatory gap-6 -mx-4 px-4 sm:mx-0 sm:px-0 pt-4 pb-6 no-scrollbar"
          @scroll.passive="handleCarouselScroll"
        >
          <div
            v-for="(project, idx) in selectedWork"
            :key="project.id"
            class="w-[84vw] max-w-[350px] shrink-0 snap-center flex flex-col"
          >
            <ProjectCard :project="project" :theme="getProjectTheme(idx)" />
          </div>
        </div>

        <!-- Mobile Pagination Dots & Swipe Hint with Spectrum Colors -->
        <div
          class="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1 pt-1"
        >
          <span class="text-slate-500 font-bold">&larr; SWIPE PROJECTS &rarr;</span>
          <div class="flex items-center gap-1.5">
            <button
              v-for="(_, dotIdx) in selectedWork"
              :key="dotIdx"
              type="button"
              :aria-label="`Jump to project ${dotIdx + 1}`"
              class="h-1.5 rounded-full transition-all duration-200 cursor-pointer focus:outline-none"
              :class="getMobilePaginationDotClass(dotIdx, dotIdx === activeProjectIndex)"
              @click="scrollToProject(dotIdx)"
            />
          </div>
        </div>
      </div>

      <!-- ================= DESKTOP VIEW: Staggered 2-Column Responsive Layout (>= lg) ================= -->
      <div class="hidden lg:grid grid-cols-2 gap-6 lg:gap-10 pt-2 items-start">
        <!-- Column 1: Projects #01 & #03 (Top Aligned with Respective Themes) -->
        <div class="space-y-6 lg:space-y-10 flex flex-col">
          <ProjectCard
            v-for="({ project, originalIndex }, idx) in leftProjects"
            :key="project.id"
            :project="project"
            :theme="getProjectTheme(originalIndex)"
            :float-animation="floatPatterns[(idx * 2) % floatPatterns.length]"
          />
        </div>

        <!-- Column 2: Projects #02 & #04 (Staggered Offset on Desktop with Respective Themes) -->
        <div class="space-y-6 lg:space-y-10 lg:mt-16 flex flex-col">
          <ProjectCard
            v-for="({ project, originalIndex }, idx) in rightProjects"
            :key="project.id"
            :project="project"
            :theme="getProjectTheme(originalIndex)"
            :float-animation="floatPatterns[(idx * 2 + 1) % floatPatterns.length]"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
  .projects-space-sector {
    background: radial-gradient(
      ellipse at 50% 30%,
      rgba(10, 26, 42, 0.72) 0%,
      rgba(5, 13, 24, 0.92) 55%,
      rgba(2, 6, 16, 0.98) 100%
    );
    // Smooth ethereal smoke/cloud feather mask at top and bottom edges
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
</style>
