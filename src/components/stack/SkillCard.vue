<script setup lang="ts">
  import type { SkillItem } from '../../types/portfolio'
  import AppBadge from '../ui/AppBadge.vue'

  defineProps<{
    skill: SkillItem
  }>()
</script>

<template>
  <div
    class="space-floating-card p-4 sm:p-5 rounded-2xl flex items-center justify-between gap-3 group transition-all duration-300 hover:scale-[1.02] select-none cursor-default"
  >
    <div class="flex items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
      <!-- Icon Container (DevIcon or Custom Styled Text Icon) -->
      <div
        v-if="skill.customIconText"
        class="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl font-sans shadow-md shrink-0 select-none"
        :style="{
          backgroundColor: skill.iconBgColor,
          color: skill.iconTextColor,
        }"
      >
        {{ skill.customIconText }}
      </div>

      <div
        v-else-if="skill.iconUrl"
        class="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/95 flex items-center justify-center p-2 shadow-[0_0_15px_rgba(255,255,255,0.35)] shrink-0"
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

      <!-- Skill Titles (Wrapping naturally to multiple lines without ellipsis) -->
      <div class="min-w-0 flex-1">
        <h4
          class="font-bold text-sm sm:text-base text-white group-hover:text-lime-400 transition-colors font-mono leading-tight"
        >
          {{ skill.name }}
        </h4>
        <p class="text-[11px] sm:text-xs text-slate-400 font-mono leading-snug pt-0.5 break-words">
          {{ skill.description }}
        </p>
      </div>
    </div>

    <!-- Classification Badge with Fixed Margin -->
    <AppBadge :variant="skill.badgeVariant" class="shrink-0 ml-2 self-center">{{
      skill.badge
    }}</AppBadge>
  </div>
</template>
