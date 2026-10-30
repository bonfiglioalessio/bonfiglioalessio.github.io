<script setup lang="ts">
  import { useAudioSynth } from '../../composables/useAudioSynth'
  import { useCockpitState } from '../../composables/useCockpitState'

  const { isAudioEnabled, toggleAudio } = useAudioSynth()
  const { isCockpitMinimized } = useCockpitState()
</script>

<template>
  <!-- Fixed HUD Audio & Space Ambient Music Control in Bottom Right -->
  <button
    type="button"
    data-ui="audio-hud"
    class="fixed right-5 sm:right-6 z-50 flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-dark-900 border border-white/10 hover:border-lime-400/50 transition-colors duration-200 cursor-pointer group select-none font-sans text-xs active:scale-95"
    :class="[
      isCockpitMinimized ? 'bottom-[88px] sm:bottom-[96px]' : 'bottom-5 sm:bottom-6',
    ]"
    :aria-label="
      isAudioEnabled
        ? 'AUDIO: [PLAYING] - Disattiva musica e SFX'
        : 'AUDIO: [MUTED] - Attiva musica spaziale e SFX'
    "
    :title="
      isAudioEnabled
        ? 'AUDIO: Attivo (Musica Spaziale & SFX - Click per mutare)'
        : 'AUDIO: Muto (Click per attivare)'
    "
    @click="toggleAudio"
  >
    <!-- 4-Band Multi-Spectrum Dynamic Equalizer -->
    <div class="flex items-end gap-[2.5px] h-3.5 w-4 shrink-0 justify-center pb-0.5">
      <!-- Band 1: Lime -->
      <span
        class="w-[2.5px] rounded-full transition-transform duration-300"
        :class="[
          isAudioEnabled
            ? 'bg-lime-400 animate-eq-1'
            : 'bg-rose-400/60 h-1.5',
        ]"
      />
      <!-- Band 2: Pure White -->
      <span
        class="w-[2.5px] rounded-full transition-transform duration-300"
        :class="[
          isAudioEnabled
            ? 'bg-white animate-eq-2'
            : 'bg-rose-400/60 h-2',
        ]"
      />
      <!-- Band 3: Emerald -->
      <span
        class="w-[2.5px] rounded-full transition-transform duration-300"
        :class="[
          isAudioEnabled
            ? 'bg-emerald-400 animate-eq-3'
            : 'bg-rose-400/60 h-1.5',
        ]"
      />
      <!-- Band 4: Cyan Electric -->
      <span
        class="w-[2.5px] rounded-full transition-transform duration-300"
        :class="[
          isAudioEnabled
            ? 'bg-sky-400 animate-eq-4'
            : 'bg-rose-400/60 h-2',
        ]"
      />
    </div>

    <!-- HUD Label & State -->
    <div class="flex items-center gap-1.5 text-[11px]">
      <span class="text-slate-400 font-semibold">AUDIO:</span>
      <span
        class="font-bold tracking-wider transition-colors"
        :class="
          isAudioEnabled
            ? 'text-lime-400'
            : 'text-rose-400'
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
      height: 13px;
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
      height: 12px;
    }
  }

  @keyframes eq-pulse-4 {
    0%,
    100% {
      height: 12px;
    }
    50% {
      height: 3px;
    }
  }

  .animate-eq-1 {
    animation: eq-pulse-1 0.85s ease-in-out infinite;
  }

  .animate-eq-2 {
    animation: eq-pulse-2 0.7s ease-in-out infinite 0.15s;
  }

  .animate-eq-3 {
    animation: eq-pulse-3 1.05s ease-in-out infinite 0.3s;
  }

  .animate-eq-4 {
    animation: eq-pulse-4 0.9s ease-in-out infinite 0.2s;
  }
</style>
