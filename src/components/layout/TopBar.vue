<script setup lang="ts">
  import { ref } from 'vue'
  import { portfolioData } from '../../data/portfolio'
  import AppContainer from './AppContainer.vue'

  const { profile } = portfolioData
  const isMobileMenuOpen = ref(false)

  const navLinks = [
    { href: '#stack', label: './stack' },
    { href: '#projects', label: './projects' },
    { href: '#experience', label: './experience' },
    { href: '#contact', label: './contact' },
  ]

  function toggleMobileMenu() {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
  }

  function closeMobileMenu() {
    isMobileMenuOpen.value = false
  }
</script>

<template>
  <header
    class="fixed top-0 inset-x-0 z-50 h-16 min-h-[4rem] bg-dark-950/80 backdrop-blur-xl border-b border-lime-400/15 transition-colors shrink-0"
  >
    <AppContainer size="default">
      <div class="h-16 flex items-center justify-between">
        <!-- Brand Logo (Fixed Dimensions to prevent CLS) -->
        <a
          href="#"
          class="h-10 inline-flex items-center gap-1 font-bold text-sm tracking-wider text-slate-100 group select-none shrink-0"
        >
          <span class="text-lime-400 font-mono">&lt;</span>
          <span
            class="tracking-tight text-base font-display font-extrabold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]"
          >
            {{ profile.displayLogo }}
          </span>
          <span class="text-lime-400 font-mono">/&gt;</span>
        </a>

        <!-- Desktop Navigation Links (44px min tap targets) -->
        <div class="flex items-center gap-6">
          <nav class="hidden md:flex items-center gap-2 text-xs text-slate-300 font-mono">
            <a
              v-for="link in navLinks"
              :key="link.href"
              :href="link.href"
              class="h-10 min-w-[44px] px-3 inline-flex items-center justify-center hover:text-lime-400 transition-colors drop-shadow-[0_0_8px_rgba(226,241,97,0.3)] rounded-lg hover:bg-dark-900/50"
            >
              {{ link.label }}
            </a>
          </nav>

          <!-- Mobile Hamburger Toggle (Fixed 44x44px CWV Target & Zero Width Shift) -->
          <button
            type="button"
            class="md:hidden w-11 h-11 min-w-[44px] min-h-[44px] rounded-lg text-slate-300 hover:text-lime-400 hover:bg-dark-900/80 border border-lime-400/20 flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer select-none shrink-0"
            :aria-expanded="isMobileMenuOpen"
            aria-label="Toggle navigation menu"
            @click="toggleMobileMenu"
          >
            <span
              class="w-5 h-0.5 bg-current transition-transform duration-200"
              :class="isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''"
            />
            <span
              class="w-5 h-0.5 bg-current transition-opacity duration-200"
              :class="isMobileMenuOpen ? 'opacity-0' : 'opacity-100'"
            />
            <span
              class="w-5 h-0.5 bg-current transition-transform duration-200"
              :class="isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''"
            />
          </button>
        </div>
      </div>
    </AppContainer>

    <!-- Mobile Dropdown Navigation (Absolute Overlay to prevent document CLS) -->
    <transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="isMobileMenuOpen"
        class="md:hidden absolute top-16 inset-x-0 bg-dark-950/95 border-b border-lime-400/15 backdrop-blur-2xl py-4 shadow-2xl font-mono text-xs z-50"
      >
        <AppContainer size="default">
          <div class="space-y-1">
            <a
              v-for="link in navLinks"
              :key="link.href"
              :href="link.href"
              class="flex items-center h-11 min-h-[44px] px-4 text-slate-300 hover:text-lime-400 transition-colors rounded-lg hover:bg-dark-900/80 active:bg-dark-900 font-semibold"
              @click="closeMobileMenu"
            >
              {{ link.label }}
            </a>
          </div>
        </AppContainer>
      </div>
    </transition>
  </header>
</template>
