<script setup lang="ts">
  import { computed } from 'vue'
  import type { SkillItem } from '../../types/portfolio'
  import AppBadge from '../ui/AppBadge.vue'

  interface Props {
    skill: SkillItem
    theme?: 'lime' | 'white' | 'emerald' | 'cyan'
    floatAnimation?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    theme: 'lime',
    floatAnimation: '',
  })

  const themeConfig = computed(() => {
    switch (props.theme) {
      case 'white':
        return {
          strokeColor: '#ffffff',
          reticleClass:
            'border-white/40 group-hover:border-white group-hover:shadow-[0_0_6px_#ffffff]',
          titleHoverClass: 'group-hover:text-white',
          glowClass: 'skill-glow-white',
        }
      case 'emerald':
        return {
          strokeColor: '#34d399',
          reticleClass:
            'border-emerald-400/40 group-hover:border-emerald-400 group-hover:shadow-[0_0_6px_#34d399]',
          titleHoverClass: 'group-hover:text-emerald-400',
          glowClass: 'skill-glow-emerald',
        }
      case 'cyan':
        return {
          strokeColor: '#38bdf8',
          reticleClass:
            'border-sky-400/40 group-hover:border-sky-400 group-hover:shadow-[0_0_6px_#38bdf8]',
          titleHoverClass: 'group-hover:text-sky-400',
          glowClass: 'skill-glow-cyan',
        }
      case 'lime':
      default:
        return {
          strokeColor: '#e2f161',
          reticleClass:
            'border-lime-400/40 group-hover:border-lime-400 group-hover:shadow-[0_0_6px_#e2f161]',
          titleHoverClass: 'group-hover:text-lime-400',
          glowClass: 'skill-glow-lime',
        }
    }
  })
</script>

<template>
  <div :class="floatAnimation" class="w-full">
    <div
      class="skill-card space-floating-card has-hud-reticles p-4 sm:p-5 rounded-2xl flex items-center justify-between gap-3 group transition-all duration-300 hover:scale-[1.02] select-none cursor-default relative overflow-hidden h-full"
    >
      <!-- HUD Corner Reticles (Precision Themed Cyber Brackets) -->
      <span
        class="absolute top-2 left-2 w-2 h-2 border-t border-l transition-all pointer-events-none"
        :class="themeConfig.reticleClass"
      />
      <span
        class="absolute top-2 right-2 w-2 h-2 border-t border-r transition-all pointer-events-none"
        :class="themeConfig.reticleClass"
      />
      <span
        class="absolute bottom-2 left-2 w-2 h-2 border-b border-l transition-all pointer-events-none"
        :class="themeConfig.reticleClass"
      />
      <span
        class="absolute bottom-2 right-2 w-2 h-2 border-b border-r transition-all pointer-events-none"
        :class="themeConfig.reticleClass"
      />

      <!-- Animated Themed Border Loader on Hover -->
      <svg
        class="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx="15"
          fill="none"
          :stroke="themeConfig.strokeColor"
          stroke-width="1.8"
          pathLength="100"
          stroke-linecap="round"
          class="skill-border-path"
          :class="themeConfig.glowClass"
        />
      </svg>

      <div class="flex items-center gap-3.5 sm:gap-4 min-w-0 flex-1 relative z-10">
        <!-- Icon Container (DevIcon or Custom Styled Text Icon) -->
        <div
          v-if="skill.customIconText"
          class="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl font-sans shadow-md shrink-0 select-none transition-transform duration-300 group-hover:scale-105"
          :style="{
            backgroundColor: skill.iconBgColor,
            color: skill.iconTextColor,
          }"
        >
          {{ skill.customIconText }}
        </div>

        <div
          v-else-if="skill.iconUrl"
          class="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/95 flex items-center justify-center p-2 shadow-[0_0_15px_rgba(255,255,255,0.35)] shrink-0 transition-transform duration-300 group-hover:scale-105"
        >
          <img
            :src="skill.iconUrl"
            :alt="skill.name"
            class="w-full h-full object-contain"
            width="48"
            height="48"
            loading="lazy"
          />
        </div>

        <!-- Skill Titles -->
        <div class="min-w-0 flex-1">
          <h4
            class="font-bold text-sm sm:text-base text-white transition-colors font-mono leading-tight"
            :class="themeConfig.titleHoverClass"
          >
            {{ skill.name }}
          </h4>
          <p
            class="text-[11px] sm:text-xs text-slate-400 font-mono leading-snug pt-0.5 break-words"
          >
            {{ skill.description }}
          </p>
        </div>
      </div>

      <!-- Classification Badge with Fixed Margin -->
      <AppBadge
        :variant="skill.badgeVariant"
        class="shrink-0 ml-2 self-center relative z-10 transition-transform duration-300 group-hover:scale-105"
      >
        {{ skill.badge }}
      </AppBadge>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .skill-border-path {
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
    opacity: 0;
    transition:
      stroke-dashoffset 500ms cubic-bezier(0.16, 1, 0.3, 1),
      opacity 200ms ease-out;
  }

  .skill-card:hover {
    .skill-border-path {
      stroke-dashoffset: 0;
      opacity: 1;

      &.skill-glow-lime {
        filter: drop-shadow(0 0 6px #e2f161) drop-shadow(0 0 12px rgba(226, 241, 97, 0.6));
      }

      &.skill-glow-white {
        filter: drop-shadow(0 0 6px #ffffff) drop-shadow(0 0 12px rgba(255, 255, 255, 0.6));
      }

      &.skill-glow-emerald {
        filter: drop-shadow(0 0 6px #34d399) drop-shadow(0 0 12px rgba(52, 211, 153, 0.6));
      }

      &.skill-glow-cyan {
        filter: drop-shadow(0 0 6px #38bdf8) drop-shadow(0 0 12px rgba(56, 189, 248, 0.6));
      }
    }
  }
</style>
