<script setup lang="ts">
  import { portfolioData } from '../../data/portfolio'

  const { marqueeItems } = portfolioData
</script>

<template>
  <div
    class="pt-16 border-b border-lime-400/10 bg-transparent overflow-hidden select-none z-10 relative backdrop-blur-sm h-[6.5rem] min-h-[6.5rem] flex items-end"
  >
    <div
      class="animate-marquee-wrapper h-10 min-h-[2.5rem] py-2.5 text-[11px] font-mono tracking-widest text-slate-400 uppercase flex items-center"
    >
      <!-- Track 1 -->
      <div class="flex items-center gap-8 whitespace-nowrap px-4 shrink-0">
        <span
          v-for="(item, index) in marqueeItems"
          :key="`t1-${index}`"
          class="inline-flex items-center"
        >
          <span class="text-lime-400 font-bold mr-2 drop-shadow-[0_0_8px_#e2f161]">✦</span>
          <span>{{ item }}</span>
        </span>
      </div>

      <!-- Track 2 (Infinite clone for seamless loop) -->
      <div class="flex items-center gap-8 whitespace-nowrap px-4 shrink-0" aria-hidden="true">
        <span
          v-for="(item, index) in marqueeItems"
          :key="`t2-${index}`"
          class="inline-flex items-center"
        >
          <span class="text-lime-400 font-bold mr-2 drop-shadow-[0_0_8px_#e2f161]">✦</span>
          <span>{{ item }}</span>
        </span>
      </div>
    </div>
  </div>
</template>
