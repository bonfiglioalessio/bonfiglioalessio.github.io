<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue'
  import { portfolioData } from '../../data/portfolio'
  import AppContainer from './AppContainer.vue'

  const { profile } = portfolioData
  const isMobileMenuOpen = ref(false)
  const isScrolled = ref(false)

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

  function handleScroll() {
    if (typeof window !== 'undefined') {
      isScrolled.value = window.scrollY > 25
    }
  }

  onMounted(() => {
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
</script>

<template>
  <header
    class="fixed top-0 inset-x-0 z-50 transition-all duration-300 ease-out shrink-0"
    :class="
      isScrolled
        ? 'h-12 min-h-[3rem] bg-dark-950/35 backdrop-blur-md border-b border-lime-400/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)]'
        : 'h-16 min-h-[4rem] bg-dark-950/85 backdrop-blur-xl border-b border-lime-400/15'
    "
  >
    <AppContainer size="default">
      <div
        class="flex items-center justify-between transition-all duration-300 ease-out"
        :class="isScrolled ? 'h-12' : 'h-16'"
      >
        <!-- Brand Logo (Shrinks smoothly on scroll) -->
        <a
          href="#"
          class="inline-flex items-center gap-1 font-bold tracking-wider text-slate-100 group select-none shrink-0 transition-all duration-300"
          :class="isScrolled ? 'h-8 text-xs' : 'h-10 text-sm'"
        >
          <span class="text-lime-400 font-mono">&lt;</span>
          <span
            class="tracking-tight font-display font-extrabold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)] transition-all duration-300"
            :class="isScrolled ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'"
          >
            {{ profile.displayLogo }}
          </span>
          <span class="text-lime-400 font-mono">/&gt;</span>
        </a>

        <!-- Desktop Navigation Links (Shrinks smoothly on scroll) -->
        <div class="flex items-center gap-4 sm:gap-6">
          <nav
            class="hidden md:flex items-center gap-1.5 text-slate-300 font-mono transition-all duration-300"
            :class="isScrolled ? 'text-[11px]' : 'text-xs'"
          >
            <a
              v-for="link in navLinks"
              :key="link.href"
              :href="link.href"
              class="inline-flex items-center justify-center hover:text-lime-400 transition-all duration-200 drop-shadow-[0_0_8px_rgba(226,241,97,0.3)] rounded-lg hover:bg-dark-900/50"
              :class="isScrolled ? 'h-8 px-2.5' : 'h-10 px-3'"
            >
              {{ link.label }}
            </a>
          </nav>

          <!-- Mobile Hamburger Toggle (Shrinks smoothly on scroll) -->
          <button
            type="button"
            class="md:hidden rounded-lg text-slate-300 hover:text-lime-400 hover:bg-dark-900/80 border border-lime-400/20 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer select-none shrink-0"
            :class="isScrolled ? 'w-8 h-8 min-w-[32px] gap-1' : 'w-10 h-10 min-w-[40px] gap-1.5'"
            :aria-expanded="isMobileMenuOpen"
            aria-label="Toggle navigation menu"
            @click="toggleMobileMenu"
          >
            <span
              class="h-0.5 bg-current transition-all duration-200"
              :class="[
                isScrolled ? 'w-4' : 'w-5',
                isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : '',
              ]"
            />
            <span
              class="h-0.5 bg-current transition-all duration-200"
              :class="[isScrolled ? 'w-4' : 'w-5', isMobileMenuOpen ? 'opacity-0' : 'opacity-100']"
            />
            <span
              class="h-0.5 bg-current transition-all duration-200"
              :class="[
                isScrolled ? 'w-4' : 'w-5',
                isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : '',
              ]"
            />
          </button>
        </div>
      </div>
    </AppContainer>

    <!-- Mobile Dropdown Navigation (Absolute Overlay) -->
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
        class="md:hidden absolute inset-x-0 bg-dark-950/95 border-b border-lime-400/15 backdrop-blur-2xl py-3 shadow-2xl font-mono text-xs z-50 transition-all duration-300"
        :class="isScrolled ? 'top-12' : 'top-16'"
      >
        <AppContainer size="default">
          <div class="space-y-1">
            <a
              v-for="link in navLinks"
              :key="link.href"
              :href="link.href"
              class="flex items-center h-10 px-4 text-slate-300 hover:text-lime-400 transition-colors rounded-lg hover:bg-dark-900/80 active:bg-dark-900 font-semibold"
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
