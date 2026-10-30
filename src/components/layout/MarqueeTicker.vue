<script setup lang="ts">
  import { usePortfolioData } from '../../composables/usePortfolioData'

  const { marqueeItems } = usePortfolioData()

  const colorPalettes = [
    {
      symbolClass: 'text-lime-400',
      textHoverClass: 'hover:text-lime-300',
    },
    {
      symbolClass: 'text-white',
      textHoverClass: 'hover:text-white',
    },
    {
      symbolClass: 'text-emerald-400',
      textHoverClass: 'hover:text-emerald-300',
    },
    {
      symbolClass: 'text-sky-400',
      textHoverClass: 'hover:text-sky-300',
    },
  ]

  function getPalette(index: number) {
    return colorPalettes[index % colorPalettes.length]
  }
</script>

<template>
  <div
    class="w-full bg-transparent border-none overflow-hidden select-none z-10 relative h-7 min-h-[1.75rem] flex items-center"
  >
    <div
      class="animate-marquee-wrapper h-7 min-h-[1.75rem] text-[10px] sm:text-[11px] font-sans font-semibold tracking-wider text-slate-300 uppercase flex items-center"
    >
      <!-- Track 1 -->
      <div class="flex items-center gap-8 whitespace-nowrap px-4 shrink-0">
        <span
          v-for="(item, index) in marqueeItems"
          :key="`t1-${index}`"
          class="inline-flex items-center transition-colors duration-200 cursor-default"
          :class="getPalette(index).textHoverClass"
        >
          <span
            class="font-bold mr-2.5 inline-block w-1 h-1 rounded-full bg-current"
            :class="getPalette(index).symbolClass"
          />
          <span>{{ item }}</span>
        </span>
      </div>

      <!-- Track 2 (Infinite clone for seamless loop) -->
      <div class="flex items-center gap-8 whitespace-nowrap px-4 shrink-0" aria-hidden="true">
        <span
          v-for="(item, index) in marqueeItems"
          :key="`t2-${index}`"
          class="inline-flex items-center transition-colors duration-200 cursor-default"
          :class="getPalette(index).textHoverClass"
        >
          <span
            class="font-bold mr-2.5 inline-block w-1 h-1 rounded-full bg-current"
            :class="getPalette(index).symbolClass"
          />
          <span>{{ item }}</span>
        </span>
      </div>
    </div>
  </div>
</template>
