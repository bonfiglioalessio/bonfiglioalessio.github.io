<script setup lang="ts">
  interface Glyph {
    text: string
    top: string
    left?: string
    right?: string
    colorClass: string
    animClass: string
    sizeClass: string
    delay: string
  }

  const glyphs: Glyph[] = [
    // 00 Hero Section Floating Accents
    {
      text: '<Vue3 :reactive="true" />',
      top: '6%',
      left: '2%',
      colorClass: 'text-lime-400/40 drop-shadow-[0_0_12px_rgba(226,241,97,0.35)]',
      animClass: 'animate-glyph-float',
      sizeClass: 'text-xs sm:text-sm font-bold',
      delay: '0s',
    },
    {
      text: 'fn(props) => 60fps',
      top: '10%',
      right: '3%',
      colorClass: 'text-cyan-400/45 drop-shadow-[0_0_12px_rgba(56,189,248,0.35)]',
      animClass: 'animate-glyph-float-rev',
      sizeClass: 'text-xs sm:text-sm font-mono font-bold',
      delay: '0.8s',
    },
    {
      text: '0x8A4F // SYS_CORE',
      top: '16%',
      left: '4%',
      colorClass: 'text-emerald-400/35',
      animClass: 'animate-glyph-float',
      sizeClass: 'text-[11px] sm:text-xs font-mono',
      delay: '1.6s',
    },

    // 01 Tech Constellation Floating Accents
    {
      text: '{ type: "strict_ts" }',
      top: '24%',
      right: '5%',
      colorClass: 'text-lime-400/40 drop-shadow-[0_0_10px_rgba(226,241,97,0.3)]',
      animClass: 'animate-glyph-float-rev',
      sizeClass: 'text-xs sm:text-sm font-mono',
      delay: '2.2s',
    },
    {
      text: 'import { ref, computed }',
      top: '30%',
      left: '3%',
      colorClass: 'text-cyan-400/40',
      animClass: 'animate-glyph-float',
      sizeClass: 'text-xs sm:text-sm font-mono font-medium',
      delay: '0.4s',
    },
    {
      text: '// AI_AGENTIC_ORCHESTRATION',
      top: '36%',
      right: '2%',
      colorClass: 'text-amber-400/40 drop-shadow-[0_0_12px_rgba(245,158,11,0.35)]',
      animClass: 'animate-glyph-float-rev',
      sizeClass: 'text-[11px] sm:text-xs font-mono font-bold',
      delay: '1.2s',
    },

    // 02 Selected Work Floating Accents
    {
      text: 'git commit -m "feat: 60fps"',
      top: '46%',
      left: '2%',
      colorClass: 'text-lime-400/45 drop-shadow-[0_0_12px_rgba(226,241,97,0.35)]',
      animClass: 'animate-glyph-float',
      sizeClass: 'text-xs sm:text-sm font-mono font-bold',
      delay: '2.8s',
    },
    {
      text: '<AppRouter :ssr="true" />',
      top: '52%',
      right: '4%',
      colorClass: 'text-emerald-400/40',
      animClass: 'animate-glyph-float-rev',
      sizeClass: 'text-xs sm:text-sm font-mono',
      delay: '0.6s',
    },
    {
      text: 'const bundle = "8KB_gzip"',
      top: '59%',
      left: '4%',
      colorClass: 'text-cyan-400/40',
      animClass: 'animate-glyph-float',
      sizeClass: 'text-[11px] sm:text-xs font-mono',
      delay: '1.8s',
    },

    // 03 Career Mission Log Floating Accents
    {
      text: '// ILIAD_CORE_ENGINEERING',
      top: '67%',
      right: '3%',
      colorClass: 'text-lime-400/45 drop-shadow-[0_0_12px_rgba(226,241,97,0.4)]',
      animClass: 'animate-glyph-float-rev',
      sizeClass: 'text-xs sm:text-sm font-mono font-bold',
      delay: '1.4s',
    },
    {
      text: '✦ MISSION_DEPLOYED',
      top: '74%',
      left: '3%',
      colorClass: 'text-emerald-400/40',
      animClass: 'animate-glyph-float',
      sizeClass: 'text-xs font-mono font-bold',
      delay: '2.4s',
    },
    {
      text: '0x3C9E // ADKAORA',
      top: '80%',
      right: '5%',
      colorClass: 'text-slate-300/35',
      animClass: 'animate-glyph-float-rev',
      sizeClass: 'text-[11px] sm:text-xs font-mono',
      delay: '0.9s',
    },

    // 04 Contact & Open Channel Accents
    {
      text: 'λ => transmit.signal()',
      top: '88%',
      left: '2%',
      colorClass: 'text-lime-400/45 drop-shadow-[0_0_12px_rgba(226,241,97,0.4)]',
      animClass: 'animate-glyph-float',
      sizeClass: 'text-xs sm:text-sm font-mono font-bold',
      delay: '0.2s',
    },
    {
      text: '// READY_TO_COLLABORATE',
      top: '95%',
      right: '4%',
      colorClass: 'text-cyan-400/45 drop-shadow-[0_0_12px_rgba(56,189,248,0.35)]',
      animClass: 'animate-glyph-float-rev',
      sizeClass: 'text-xs sm:text-sm font-mono font-bold',
      delay: '1.7s',
    },
  ]
</script>

<template>
  <div
    aria-hidden="true"
    class="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none"
  >
    <div
      v-for="(glyph, idx) in glyphs"
      :key="idx"
      class="absolute font-mono transition-transform"
      :class="[glyph.colorClass, glyph.animClass, glyph.sizeClass]"
      :style="{
        top: glyph.top,
        left: glyph.left,
        right: glyph.right,
        animationDelay: glyph.delay,
      }"
    >
      {{ glyph.text }}
    </div>
  </div>
</template>
