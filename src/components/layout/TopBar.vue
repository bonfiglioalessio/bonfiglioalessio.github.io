<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue'
  import { portfolioData } from '../../data/portfolio'
  import { useAudioSynth } from '../../composables/useAudioSynth'
  import AppContainer from './AppContainer.vue'

  const { profile } = portfolioData
  const { playClick } = useAudioSynth()
  const isMobileMenuOpen = ref(false)
  const isScrolled = ref(false)
  const isHeroVisible = ref(true)
  const isContactVisible = ref(false)
  const activeSectionId = ref('')

  let heroObserver: IntersectionObserver | null = null
  let contactObserver: IntersectionObserver | null = null
  const sectionObservers: IntersectionObserver[] = []

  const navLinks = [
    { href: '#stack', label: './stack' },
    { href: '#projects', label: './projects' },
    { href: '#experience', label: './experience' },
    { href: '#contact', label: './contact' },
  ]

  function toggleMobileMenu() {
    playClick()
    isMobileMenuOpen.value = !isMobileMenuOpen.value
  }

  function closeMobileMenu() {
    playClick()
    isMobileMenuOpen.value = false
  }

  function handleScroll() {
    if (typeof window !== 'undefined') {
      isScrolled.value = window.scrollY > 25
      if (window.scrollY < 200) {
        activeSectionId.value = ''
      }

      // Exact check for contact section visibility to auto-hide navbar
      const contactEl = document.getElementById('contact')
      if (contactEl) {
        const rect = contactEl.getBoundingClientRect()
        isContactVisible.value = rect.top <= window.innerHeight * 0.7 && rect.bottom >= 50
      }
    }
  }

  onMounted(() => {
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Observe Hero section to show Contact CTA in navbar ONLY when Hero disappears
    const heroEl = document.querySelector('section')
    if (heroEl && 'IntersectionObserver' in window) {
      heroObserver = new IntersectionObserver(
        ([entry]) => {
          isHeroVisible.value = entry.isIntersecting
        },
        {
          threshold: 0.15,
          rootMargin: '-60px 0px 0px 0px',
        },
      )
      heroObserver.observe(heroEl)
    }

    // Observe Contact section to auto-hide navbar when contact section is in view
    const contactEl = document.getElementById('contact')
    if (contactEl && 'IntersectionObserver' in window) {
      contactObserver = new IntersectionObserver(
        ([entry]) => {
          isContactVisible.value = entry.isIntersecting
        },
        {
          threshold: 0.05,
          rootMargin: '0px 0px -50px 0px',
        },
      )
      contactObserver.observe(contactEl)
    }

    // Scrollspy: Observe individual sections to highlight active nav link
    const sectionIds = ['stack', 'projects', 'experience', 'contact']
    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el && 'IntersectionObserver' in window) {
        const obs = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              activeSectionId.value = '#' + id
            }
          },
          {
            threshold: 0.15,
            rootMargin: '-80px 0px -45% 0px',
          },
        )
        obs.observe(el)
        sectionObservers.push(obs)
      }
    })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    if (heroObserver) {
      heroObserver.disconnect()
      heroObserver = null
    }
    if (contactObserver) {
      contactObserver.disconnect()
      contactObserver = null
    }
    sectionObservers.forEach((obs) => obs.disconnect())
    sectionObservers.length = 0
  })
</script>

<template>
  <header
    class="fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-out shrink-0"
    :class="[
      isContactVisible
        ? '-translate-y-full opacity-0 pointer-events-none'
        : 'translate-y-0 opacity-100',
      isScrolled
        ? 'h-12 min-h-[3rem] bg-dark-950/35 backdrop-blur-md border-b border-lime-400/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)]'
        : 'h-16 min-h-[4rem] bg-dark-950/85 backdrop-blur-xl border-b border-lime-400/15',
    ]"
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
          @click="playClick"
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

        <!-- Right Side: Desktop Navigation Links (with Scrollspy) + Distinctive CTA Button -->
        <div class="flex items-center gap-2.5 sm:gap-3.5">
          <!-- Desktop Navigation Links (Scrollspy Active Highlighting) -->
          <nav
            class="hidden md:flex items-center gap-1 text-slate-300 font-mono transition-all duration-300"
            :class="isScrolled ? 'text-[11px]' : 'text-xs'"
          >
            <a
              v-for="link in navLinks"
              :key="link.href"
              :href="link.href"
              class="inline-flex items-center justify-center transition-all duration-200 rounded-lg select-none"
              :class="[
                isScrolled ? 'h-8 px-2.5' : 'h-10 px-3',
                activeSectionId === link.href
                  ? 'bg-lime-400/15 text-lime-400 border border-lime-400/35 shadow-[0_0_12px_rgba(226,241,97,0.25)] font-bold'
                  : 'text-slate-300 hover:text-lime-400 hover:bg-dark-900/50',
              ]"
              @click="playClick"
            >
              <span
                v-if="activeSectionId === link.href"
                class="w-1.5 h-1.5 rounded-full bg-lime-400 mr-1.5 animate-pulse"
              />
              {{ link.label }}
            </a>
          </nav>

          <!-- Distinctive Solid CTA Button: Electric Cyan / High Contrast Action (Distinct from Scrollspy) -->
          <transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 translate-x-3 scale-95"
            enter-to-class="opacity-100 translate-x-0 scale-100"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 translate-x-0 scale-100"
            leave-to-class="opacity-0 translate-x-3 scale-95"
          >
            <a
              v-if="!isHeroVisible"
              href="#contact"
              class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-400 text-black font-mono text-[11px] font-black shadow-[0_0_15px_rgba(56,189,248,0.4)] hover:bg-white hover:text-black hover:shadow-[0_0_22px_rgba(255,255,255,0.7)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer select-none shrink-0 group ml-1"
              @click="playClick"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-black inline-block animate-pulse" />
              <span>contact_me</span>
              <span class="text-xs group-hover:translate-x-0.5 transition-transform"> &rarr; </span>
            </a>
          </transition>

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

    <!-- Mobile Dropdown Navigation (Absolute Overlay with Scrollspy) -->
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
              class="flex items-center justify-between h-10 px-4 transition-colors rounded-lg font-semibold"
              :class="[
                activeSectionId === link.href
                  ? 'bg-lime-400/20 text-lime-400 border border-lime-400/30 shadow-[0_0_12px_rgba(226,241,97,0.2)] font-bold'
                  : 'text-slate-300 hover:text-lime-400 hover:bg-dark-900/80 active:bg-dark-900',
              ]"
              @click="closeMobileMenu"
            >
              <span>{{ link.label }}</span>
              <span
                v-if="activeSectionId === link.href"
                class="text-[10px] text-lime-400 font-mono"
              >
                ● ACTIVE
              </span>
            </a>
          </div>
        </AppContainer>
      </div>
    </transition>
  </header>
</template>
