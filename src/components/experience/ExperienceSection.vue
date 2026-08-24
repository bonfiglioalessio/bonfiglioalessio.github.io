<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue'
  import { portfolioData } from '../../data/portfolio'
  import { useAudioSynth } from '../../composables/useAudioSynth'
  import SectionWrapper from '../layout/SectionWrapper.vue'
  import SectionHeader from '../ui/SectionHeader.vue'
  import ExperienceCard from './ExperienceCard.vue'

  const { careerMissionLog } = portfolioData
  const { playClick } = useAudioSynth()

  const floatPatterns = ['animate-float-slow', 'animate-float-delayed', 'animate-float-subtle']

  // Desktop vertical timeline scroll progress
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
  <SectionWrapper id="experience" spacing="default">
    <!-- ================= MOBILE VIEW: Horizontal Swipe Deck with Cyber Laser Timeline Below (< lg) ================= -->
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
              class="text-xs font-bold text-lime-400 px-2.5 py-1 rounded-lg bg-lime-400/10 border border-lime-400/30"
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

        <!-- Middle: Horizontal Swipeable Experience Cards with Scroll Snap -->
        <div
          ref="mobileExperienceRef"
          class="flex overflow-x-auto snap-x snap-mandatory gap-6 -mx-4 px-4 sm:mx-0 sm:px-0 pt-4 pb-4 no-scrollbar"
          @scroll.passive="handleMobileScroll"
        >
          <div
            v-for="(experience, idx) in careerMissionLog"
            :key="experience.id"
            class="w-[84vw] max-w-[360px] shrink-0 snap-center flex flex-col"
          >
            <ExperienceCard
              :experience="experience"
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

          <!-- Interactive Beacon Nodes along the Track -->
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
                :class="
                  activeMissionIndex >= idx
                    ? 'bg-dark-950 border-lime-400 shadow-[0_0_12px_#e2f161]'
                    : 'bg-dark-900 border-slate-700'
                "
              >
                <span
                  class="w-2 h-2 rounded-full transition-all duration-200"
                  :class="
                    activeMissionIndex === idx
                      ? 'bg-lime-400 shadow-[0_0_8px_#e2f161]'
                      : activeMissionIndex > idx
                        ? 'bg-lime-400'
                        : 'bg-slate-700'
                  "
                />
              </div>

              <!-- Mission Tag & Company Name -->
              <div class="text-center font-mono">
                <span
                  class="text-[10px] font-bold block"
                  :class="activeMissionIndex === idx ? 'text-lime-400' : 'text-slate-500'"
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

    <!-- ================= DESKTOP VIEW: Continuous Laser Rail & Vertical Timeline (>= lg) ================= -->
    <div ref="sectionContainerRef" class="hidden lg:block relative pl-7 sm:pl-9 lg:pl-10">
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
