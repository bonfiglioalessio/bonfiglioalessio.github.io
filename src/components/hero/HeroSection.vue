<script setup lang="ts">
  import { portfolioData } from '../../data/portfolio'
  import AppButton from '../ui/AppButton.vue'
  import HeroCockpit from './HeroCockpit.vue'
  import StatCounterCard from './StatCounterCard.vue'

  const { profile } = portfolioData

  const statAnimClasses = ['animate-float-slow', 'animate-float-delayed', 'animate-float-subtle']
</script>

<template>
  <section
    class="min-h-[calc(100vh-6.5rem)] flex items-center py-4 sm:py-8 lg:py-12 relative z-10 w-full"
  >
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center w-full">
      <!-- Left Column: Bio, Headline, Stats & CTA -->
      <div class="lg:col-span-7 space-y-4 sm:space-y-5 lg:space-y-6">
        <!-- Status & Company Badge Pill (Hidden on Mobile) -->
        <div
          class="hidden sm:inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full space-floating-card text-xs font-mono select-none"
        >
          <span class="relative flex h-2.5 w-2.5">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"
            />
            <span
              class="relative inline-flex rounded-full h-2.5 w-2.5 bg-lime-400 shadow-[0_0_8px_#e2f161]"
            />
          </span>
          <span class="text-slate-200">
            Software Engineer
            <strong class="text-lime-400 font-bold drop-shadow-[0_0_8px_#e2f161]"> @ iliad </strong>
          </span>
          <span class="text-lime-400/40">|</span>
          <span class="text-slate-400">Milano &amp; Remote</span>
        </div>

        <!-- Level Indicator & Main Display Headline (Zero-Gravity Floating) -->
        <div class="space-y-2">
          <p
            class="text-[11px] sm:text-xs text-lime-400 font-mono tracking-widest uppercase flex items-center gap-2 drop-shadow-[0_0_8px_rgba(226,241,97,0.5)] select-none"
          >
            <span>&gt;_ LEVEL 06 DEVELOPER</span>
            <span class="h-px w-10 sm:w-12 bg-lime-400/60 shadow-[0_0_8px_#e2f161]" />
          </p>

          <h1
            class="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display text-white tracking-tight leading-[1.08] sm:leading-[1.05]"
          >
            <span class="inline-block animate-float-slow"> Turning complex logic into </span>
            <br class="hidden sm:inline" />
            <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-lime-300 to-emerald-400 drop-shadow-[0_0_35px_rgba(204,255,0,0.45)] inline-block animate-float-delayed"
            >
              insane frontend UI.
            </span>
          </h1>
        </div>

        <!-- Narrative Bio -->
        <p
          class="text-xs sm:text-sm text-slate-300 font-mono leading-relaxed max-w-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
        >
          {{ profile.bio }}
        </p>

        <!-- Stats Counters Grid (Floating with staggered delays, roll-up counter & yellow loading border) -->
        <div class="grid grid-cols-3 gap-2.5 sm:gap-3 py-1 max-w-md">
          <StatCounterCard
            v-for="(stat, idx) in profile.stats"
            :key="stat.label"
            :target-value="stat.value"
            :prefix="stat.prefix"
            :suffix="stat.suffix"
            :label="stat.label"
            :delay="idx * 950 + 300"
            :duration="900"
            :float-animation="statAnimClasses[idx % statAnimClasses.length]"
          />
        </div>

        <!-- Call to Action Buttons (Stacked on Mobile, Row on Desktop) -->
        <div
          class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1 w-full sm:w-auto"
        >
          <AppButton
            variant="primary"
            size="lg"
            href="#projects"
            as="a"
            class="w-full sm:w-auto text-center"
          >
            <span>EXPLORE WORK</span>
            <span class="text-sm">&rarr;</span>
          </AppButton>
          <AppButton
            variant="outline"
            size="lg"
            href="#contact"
            as="a"
            class="w-full sm:w-auto text-center"
          >
            <span>$ contact_me</span>
          </AppButton>
        </div>
      </div>

      <!-- Right Column: Interactive Cockpit (Zero-Gravity Float) -->
      <div class="lg:col-span-5 flex justify-center lg:justify-end">
        <HeroCockpit />
      </div>
    </div>
  </section>
</template>
