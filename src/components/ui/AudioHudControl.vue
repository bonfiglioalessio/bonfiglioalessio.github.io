<script setup lang="ts">
  import { useAudioSynth } from '../../composables/useAudioSynth'

  const { isAudioEnabled, toggleAudio } = useAudioSynth()
</script>

<template>
  <!-- Fixed HUD Audio & Space Ambient Music Control in Bottom Right -->
  <button
    type="button"
    class="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-dark-950/90 backdrop-blur-md border transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.8)] cursor-pointer group select-none font-mono text-xs"
    :class="[
      isAudioEnabled
        ? 'border-lime-400/40 shadow-[0_0_18px_rgba(226,241,97,0.2)] hover:border-lime-400 hover:shadow-[0_0_25px_rgba(226,241,97,0.4)]'
        : 'border-slate-800 bg-dark-950/80 opacity-75 hover:opacity-100 hover:border-slate-700',
    ]"
    :aria-label="isAudioEnabled ? 'Disattiva musica e SFX' : 'Attiva musica spaziale e SFX'"
    :title="
      isAudioEnabled
        ? 'AUDIO: Attivo (Musica Spaziale & SFX - Click per mutare)'
        : 'AUDIO: Muto (Click per attivare)'
    "
    @click="toggleAudio"
  >
    <!-- Animated Cyber Equalizer Waveform Indicator -->
    <div class="flex items-end gap-[3px] h-3.5 w-3.5 shrink-0 justify-center">
      <span
        class="w-[2.5px] rounded-full transition-all duration-300"
        :class="[
          isAudioEnabled ? 'bg-lime-400 animate-eq-1 shadow-[0_0_6px_#e2f161]' : 'bg-slate-600 h-1',
        ]"
      />
      <span
        class="w-[2.5px] rounded-full transition-all duration-300"
        :class="[
          isAudioEnabled
            ? 'bg-lime-400 animate-eq-2 shadow-[0_0_6px_#e2f161]'
            : 'bg-slate-600 h-1.5',
        ]"
      />
      <span
        class="w-[2.5px] rounded-full transition-all duration-300"
        :class="[
          isAudioEnabled ? 'bg-lime-400 animate-eq-3 shadow-[0_0_6px_#e2f161]' : 'bg-slate-600 h-1',
        ]"
      />
    </div>

    <!-- HUD Label & State -->
    <div class="flex items-center gap-1.5 text-[11px]">
      <span class="text-slate-400 font-medium">AUDIO:</span>
      <span
        class="font-bold tracking-wider transition-colors"
        :class="
          isAudioEnabled
            ? 'text-lime-400 drop-shadow-[0_0_6px_rgba(226,241,97,0.6)]'
            : 'text-rose-400/80'
        "
      >
        [{{ isAudioEnabled ? 'ON' : 'MUTED' }}]
      </span>
    </div>
  </button>
</template>

<style scoped lang="scss">
  @keyframes eq-pulse-1 {
    0%,
    100% {
      height: 3px;
    }
    50% {
      height: 12px;
    }
  }

  @keyframes eq-pulse-2 {
    0%,
    100% {
      height: 14px;
    }
    50% {
      height: 4px;
    }
  }

  @keyframes eq-pulse-3 {
    0%,
    100% {
      height: 5px;
    }
    50% {
      height: 13px;
    }
  }

  .animate-eq-1 {
    animation: eq-pulse-1 0.9s ease-in-out infinite;
  }

  .animate-eq-2 {
    animation: eq-pulse-2 0.75s ease-in-out infinite 0.15s;
  }

  .animate-eq-3 {
    animation: eq-pulse-3 1.1s ease-in-out infinite 0.3s;
  }
</style>
