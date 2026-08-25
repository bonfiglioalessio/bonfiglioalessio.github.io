<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue'
  import { portfolioData } from '../../data/portfolio'
  import { useAudioSynth } from '../../composables/useAudioSynth'
  import SectionHeader from '../ui/SectionHeader.vue'
  import ExperienceCard from './ExperienceCard.vue'

  const { careerMissionLog } = portfolioData
  const { playClick } = useAudioSynth()

  const missionThemes: ('lime' | 'white' | 'emerald')[] = ['lime', 'white', 'emerald']

  function getMissionTheme(index: number): 'lime' | 'white' | 'emerald' {
    return missionThemes[index % missionThemes.length]
  }

  function getMobileMissionBadgeClass(index: number) {
    const theme = getMissionTheme(index)
    switch (theme) {
      case 'white':
        return 'text-white bg-white/10 border-white/30'
      case 'emerald':
        return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30'
      case 'lime':
      default:
        return 'text-lime-400 bg-lime-400/10 border-lime-400/30'
    }
  }

  function getMobileBeaconBorderClass(idx: number, activeIdx: number) {
    if (activeIdx < idx) return 'bg-dark-900 border-slate-700'
    const theme = getMissionTheme(idx)
    switch (theme) {
      case 'white':
        return 'bg-dark-950 border-white shadow-[0_0_12px_#ffffff]'
      case 'emerald':
        return 'bg-dark-950 border-emerald-400 shadow-[0_0_12px_#34d399]'
      case 'lime':
      default:
        return 'bg-dark-950 border-lime-400 shadow-[0_0_12px_#e2f161]'
    }
  }

  function getMobileBeaconDotClass(idx: number, activeIdx: number) {
    if (activeIdx < idx) return 'bg-slate-700'
    const theme = getMissionTheme(idx)
    if (activeIdx === idx) {
      switch (theme) {
        case 'white':
          return 'bg-white shadow-[0_0_8px_#ffffff]'
        case 'emerald':
          return 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
        case 'lime':
        default:
          return 'bg-lime-400 shadow-[0_0_8px_#e2f161]'
      }
    }
    switch (theme) {
      case 'white':
        return 'bg-white/80'
      case 'emerald':
        return 'bg-emerald-400/80'
      case 'lime':
      default:
        return 'bg-lime-400/80'
    }
  }

  function getMobileBeaconTextClass(idx: number, activeIdx: number) {
    if (activeIdx !== idx) return 'text-slate-500'
    const theme = getMissionTheme(idx)
    switch (theme) {
      case 'white':
        return 'text-white font-bold'
      case 'emerald':
        return 'text-emerald-400 font-bold'
      case 'lime':
      default:
        return 'text-lime-400 font-bold'
    }
  }

  const floatPatterns = ['animate-float-slow', 'animate-float-delayed', 'animate-float-subtle']

  // Continuous Desktop Timeline Progress (Top-to-Bottom)
  const experienceSectionRef = ref<HTMLElement | null>(null)
  const scrollProgress = ref(0) // 0 to 100%
  let ticking = false

  function updateTimelineProgress() {
    if (!experienceSectionRef.value) return

    const rect = experienceSectionRef.value.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const triggerY = windowHeight * 0.75

    if (rect.top > triggerY) {
      scrollProgress.value = 0
    } else {
      const distance = triggerY - rect.top
      const totalHeight = rect.height
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

  // Mobile mission carousel
  const mobileExperienceRef = ref<HTMLDivElement | null>(null)
  const activeMissionIndex = ref(0)

  function scrollToMission(index: number) {
    playClick()
    activeMissionIndex.value = index
    if (!mobileExperienceRef.value) return
    const cardEl = mobileExperienceRef.value.children[index] as HTMLElement
    if (cardEl) {
      cardEl.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      })
    }
  }

  function handleMobileScroll() {
    if (!mobileExperienceRef.value) return
    const container = mobileExperienceRef.value
    const scrollLeft = container.scrollLeft
    const cardWidth = container.children[0]?.clientWidth || 300
    const gap = 24
    const newIdx = Math.round(scrollLeft / (cardWidth + gap))
    if (newIdx >= 0 && newIdx < careerMissionLog.length && newIdx !== activeMissionIndex.value) {
      activeMissionIndex.value = newIdx
    }
  }

  function prevMission() {
    if (activeMissionIndex.value > 0) {
      scrollToMission(activeMissionIndex.value - 1)
    } else {
      scrollToMission(careerMissionLog.length - 1)
    }
  }

  function nextMission() {
    if (activeMissionIndex.value < careerMissionLog.length - 1) {
      scrollToMission(activeMissionIndex.value + 1)
    } else {
      scrollToMission(0)
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
  <section
    id="experience"
    ref="experienceSectionRef"
    class="career-space-sector w-screen relative left-1/2 -translate-x-1/2 py-8 sm:py-10 lg:py-12 overflow-hidden select-none transition-colors duration-1000 ease-out scroll-mt-20"
  >
    <!-- Cosmic Smoke / Cloud Nebula Transition Drift at Top -->
    <div
      class="absolute -top-10 inset-x-0 h-36 bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent blur-3xl pointer-events-none"
    />
    <div
      class="absolute -top-14 left-1/3 -translate-x-1/2 w-[700px] h-[180px] rounded-full bg-lime-400/12 blur-[90px] pointer-events-none"
    />

    <!-- Deep Space Atmospheric Nebula Glows -->
    <div
      class="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-cyan-500/10 blur-[140px] pointer-events-none"
    />
    <div
      class="absolute bottom-1/3 right-1/4 translate-x-1/2 translate-y-1/2 w-[650px] h-[380px] rounded-full bg-emerald-500/10 blur-[150px] pointer-events-none"
    />

    <!-- Inner Content Stage (Aligned with Main Page Container Max-W-7xl) -->
    <div class="w-full max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
      <!-- ================= MOBILE VIEW: Horizontal Swipe Deck (< lg) ================= -->
      <div class="lg:hidden space-y-5">
        <SectionHeader
          section-number="03"
          title="Career Mission Log"
          status-badge="● 6+ YEARS IN PRODUCTION"
          description="Il percorso professionale tra grandi realtà enterprise, sistemi ad alto traffico e ingegneria frontend."
        />

        <div class="space-y-4 pt-1">
          <!-- Top Mobile Header Bar: Active Mission Counter & Stepper Navigation -->
          <div
            class="flex items-center justify-between gap-3 px-1 border-b border-lime-400/15 pb-2.5 font-mono"
          >
            <div class="flex items-center gap-2">
              <span
                class="text-xs font-bold px-2.5 py-1 rounded-lg border transition-colors"
                :class="getMobileMissionBadgeClass(activeMissionIndex)"
              >
                MISSION 0{{ activeMissionIndex + 1 }} / 0{{ careerMissionLog.length }}
              </span>
            </div>

            <!-- Touch-Friendly Stepper Buttons -->
            <div class="flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous Mission"
                class="w-8 h-8 rounded-xl bg-dark-900 border border-lime-400/30 text-lime-400 flex items-center justify-center text-sm font-bold hover:bg-lime-400 hover:text-black active:scale-95 transition-all cursor-pointer focus:outline-none"
                @click="prevMission"
              >
                &larr;
              </button>
              <button
                type="button"
                aria-label="Next Mission"
                class="w-8 h-8 rounded-xl bg-dark-900 border border-lime-400/30 text-lime-400 flex items-center justify-center text-sm font-bold hover:bg-lime-400 hover:text-black active:scale-95 transition-all cursor-pointer focus:outline-none"
                @click="nextMission"
              >
                &rarr;
              </button>
            </div>
          </div>

          <!-- Middle: Horizontal Swipeable Experience Cards with Scroll Snap (Edge-to-Edge bleed) -->
          <div
            ref="mobileExperienceRef"
            class="flex overflow-x-auto snap-x snap-mandatory gap-5 -mx-6 sm:-mx-8 px-6 sm:px-8 pt-3 pb-4 no-scrollbar"
            @scroll.passive="handleMobileScroll"
          >
            <div
              v-for="(experience, idx) in careerMissionLog"
              :key="experience.id"
              class="w-[85vw] max-w-[340px] shrink-0 snap-center flex flex-col"
            >
              <ExperienceCard
                :experience="experience"
                :theme="getMissionTheme(idx)"
                :index="idx"
                :total="careerMissionLog.length"
                :timeline-progress="100"
              />
            </div>
          </div>

          <!-- Bottom: Horizontal Cyber Laser Timeline Rail with Connected Nodes -->
          <div class="relative pt-2 pb-2 px-3 sm:px-4 select-none">
            <!-- Background Base Track Line -->
            <div
              class="absolute left-8 right-8 top-[19px] h-[2px] bg-lime-400/20 rounded-full pointer-events-none"
            />

            <!-- Dynamic Active Neon Laser Segment connecting nodes -->
            <div
              class="absolute left-8 top-[19px] h-[2px] bg-gradient-to-r from-lime-300 via-lime-400 to-emerald-400 shadow-[0_0_10px_#e2f161] rounded-full transition-all duration-300 pointer-events-none"
              :style="{
                width: `calc(${
                  (activeMissionIndex / (careerMissionLog.length - 1)) * 100
                }% * (1 - 64px / 100%))`,
              }"
            />

            <!-- Interactive Beacon Nodes along the Track with Themed Colors -->
            <div class="relative flex items-center justify-between">
              <button
                v-for="(exp, idx) in careerMissionLog"
                :key="exp.id"
                type="button"
                class="flex flex-col items-center gap-1.5 cursor-pointer group focus:outline-none transition-all duration-200"
                @click="scrollToMission(idx)"
              >
                <!-- Glowing Beacon Node Marker -->
                <div
                  class="w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all duration-200"
                  :class="getMobileBeaconBorderClass(idx, activeMissionIndex)"
                >
                  <span
                    class="w-2 h-2 rounded-full transition-all duration-200"
                    :class="getMobileBeaconDotClass(idx, activeMissionIndex)"
                  />
                </div>

                <!-- Mission Tag & Company Name -->
                <div class="text-center font-mono">
                  <span
                    class="text-[10px] block"
                    :class="getMobileBeaconTextClass(idx, activeMissionIndex)"
                  >
                    {{ exp.missionNumber.replace('MISSION // ', 'M') }}
                  </span>
                  <span
                    class="text-[9px] block max-w-[80px] truncate"
                    :class="
                      activeMissionIndex === idx ? 'text-slate-200 font-bold' : 'text-slate-600'
                    "
                  >
                    {{ exp.company.split('(')[0].trim() }}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ================= DESKTOP VIEW: Continuous Laser Rail from Top to Bottom (>= lg) ================= -->
      <div class="hidden lg:block relative pl-7 sm:pl-9 lg:pl-10">
        <!-- Continuous Full-Height Left Vertical Rail Assembly (Clean, seamless straight rail from top to bottom) -->
        <div
          class="absolute -top-8 sm:-top-10 lg:-top-12 -bottom-8 sm:-bottom-10 lg:-bottom-12 left-0 w-[2px] pointer-events-none"
        >
          <!-- Base Static Track Line spanning entire sector -->
          <div class="w-full h-full bg-lime-400/20 rounded-full" />

          <!-- Active Scroll-Driven Neon Laser Beam running smoothly from top to bottom -->
          <div
            class="absolute top-0 left-0 w-full bg-gradient-to-b from-lime-300 via-lime-400 to-emerald-400 shadow-[0_0_14px_#e2f161] rounded-full z-10 transition-[height] duration-75 ease-out"
            :style="{ height: `${Math.min(100, scrollProgress)}%` }"
          />
        </div>

        <!-- Section Header (Aligned cleanly to the right of the continuous rail) -->
        <div class="pb-8 sm:pb-10">
          <SectionHeader
            section-number="03"
            title="Career Mission Log"
            status-badge="● 6+ YEARS IN PRODUCTION"
            description="Il percorso professionale tra grandi realtà enterprise, sistemi ad alto traffico e ingegneria frontend."
          />
        </div>

        <!-- Experience Timeline Cards Attached Directly to Vertical Rail with Themed Colors -->
        <div class="space-y-8 sm:space-y-10">
          <ExperienceCard
            v-for="(experience, idx) in careerMissionLog"
            :key="experience.id"
            :experience="experience"
            :theme="getMissionTheme(idx)"
            :index="idx"
            :total="careerMissionLog.length"
            :timeline-progress="scrollProgress"
            :float-animation="floatPatterns[idx % floatPatterns.length]"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
  .career-space-sector {
    background: radial-gradient(
      ellipse at 50% 30%,
      rgba(14, 32, 54, 0.75) 0%,
      rgba(7, 15, 28, 0.94) 55%,
      rgba(3, 7, 18, 0.98) 100%
    );
    // Smooth compact feather mask
    mask-image: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(0, 0, 0, 0.3) 20px,
      rgba(0, 0, 0, 0.85) 50px,
      black 80px,
      black calc(100% - 80px),
      rgba(0, 0, 0, 0.85) calc(100% - 50px),
      rgba(0, 0, 0, 0.3) calc(100% - 20px),
      transparent 100%
    );
    -webkit-mask-image: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(0, 0, 0, 0.3) 20px,
      rgba(0, 0, 0, 0.85) 50px,
      black 80px,
      black calc(100% - 80px),
      rgba(0, 0, 0, 0.85) calc(100% - 50px),
      rgba(0, 0, 0, 0.3) calc(100% - 20px),
      transparent 100%
    );
  }
</style>
