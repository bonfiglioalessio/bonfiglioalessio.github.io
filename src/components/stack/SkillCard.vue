<script setup lang="ts">
  import { computed, ref } from 'vue'
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

  const cardRef = ref<HTMLElement | null>(null)
  const isHovered = ref(false)
  const mousePos = ref({ x: 50, y: 50 })

  function onMouseEnter(e: MouseEvent) {
    isHovered.value = true
    updateMouse(e)
  }

  function onMouseMove(e: MouseEvent) {
    updateMouse(e)
  }

  function onMouseLeave() {
    isHovered.value = false
  }

  function updateMouse(e: MouseEvent) {
    if (!cardRef.value) return
    const rect = cardRef.value.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    mousePos.value = { x, y }
  }

  const themeConfig = computed(() => {
    switch (props.theme) {
      case 'white':
        return {
          strokeColor: '#ffffff',
          spotlightColor: 'rgba(255, 255, 255, 0.12)',
          titleHoverClass: 'group-hover:text-white',
          glowClass: 'skill-glow-white',
          nodeDotClass: 'bg-white',
        }
      case 'emerald':
        return {
          strokeColor: '#34d399',
          spotlightColor: 'rgba(52, 211, 153, 0.14)',
          titleHoverClass: 'group-hover:text-emerald-400',
          glowClass: 'skill-glow-emerald',
          nodeDotClass: 'bg-emerald-400',
        }
      case 'cyan':
        return {
          strokeColor: '#38bdf8',
          spotlightColor: 'rgba(56, 189, 248, 0.14)',
          titleHoverClass: 'group-hover:text-sky-400',
          glowClass: 'skill-glow-cyan',
          nodeDotClass: 'bg-sky-400',
        }
      case 'lime':
      default:
        return {
          strokeColor: '#e2f161',
          spotlightColor: 'rgba(226, 241, 97, 0.14)',
          titleHoverClass: 'group-hover:text-lime-400',
          glowClass: 'skill-glow-lime',
          nodeDotClass: 'bg-lime-400',
        }
    }
  })
</script>

<template>
  <div :class="floatAnimation" class="w-full">
    <div
      ref="cardRef"
      class="skill-card space-floating-card p-4 sm:p-5 rounded-2xl flex items-center justify-between gap-3 group transition-all duration-300 hover:scale-[1.02] select-none cursor-default relative overflow-hidden h-full"
      @mouseenter="onMouseEnter"
      @mousemove="onMouseMove"
      @mouseleave="onMouseLeave"
    >
      <!-- Cursor-Following Spotlight Glare -->
      <div
        class="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0"
        :style="{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(280px circle at ${mousePos.x}% ${mousePos.y}%, ${themeConfig.spotlightColor}, transparent 70%)`, /* taste-skill-ignore */
        }"
        aria-hidden="true"
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
          class="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl font-sans shrink-0 select-none transition-transform duration-300 group-hover:scale-105"
          :style="{
            backgroundColor: skill.iconBgColor,
            color: skill.iconTextColor,
          }"
        >
          {{ skill.customIconText }}
        </div>

        <div
          v-else-if="skill.iconUrl"
          class="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/95 flex items-center justify-center p-2 shrink-0 transition-transform duration-300 group-hover:scale-105"
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

        <!-- Skill Titles with Constellation Node Socket -->
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <!-- Constellation Node Socket (Pings only on hover) -->
            <span class="relative flex h-1.5 w-1.5 shrink-0">
              <span
                class="hidden group-hover:inline-flex animate-ping absolute h-full w-full rounded-full opacity-75"
                :class="themeConfig.nodeDotClass"
              />
              <span
                class="relative inline-flex rounded-full h-1.5 w-1.5 opacity-35 group-hover:opacity-100 group-hover:scale-125 transition-transform duration-300"
                :class="themeConfig.nodeDotClass"
              />
            </span>
            <h3
              class="font-bold text-sm sm:text-base text-white transition-colors font-sans leading-tight truncate"
              :class="themeConfig.titleHoverClass"
            >
              {{ skill.name }}
            </h3>
          </div>
          <p
            class="text-[11px] sm:text-xs text-slate-400 font-sans leading-snug pt-0.5 break-words"
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
    }
  }
</style>
