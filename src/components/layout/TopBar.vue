<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue'
  import { usePortfolioData } from '../../composables/usePortfolioData'
  import { useAudioSynth } from '../../composables/useAudioSynth'
  import AppButton from '../ui/AppButton.vue'
  import MarqueeTicker from './MarqueeTicker.vue'

  interface Props {
    isReady?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    isReady: true,
  })

  const { profile } = usePortfolioData()
  const { playClick } = useAudioSynth()
  const isMobileMenuOpen = ref(false)
  const isScrolled = ref(false)
  const isCtaVisible = ref(false)
  const isContactVisible = ref(false)
  const activeSectionId = ref('')

  let contactObserver: IntersectionObserver | null = null

  const emailUrl = 'mailto:bonfi.alessio98@gmail.com'

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

  function scrollToContactCenter() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('nav-direct-scroll-contact'))
    }
    const contactEl = document.getElementById('contact')
    if (contactEl) {
      const targetY = Math.round(
        contactEl.getBoundingClientRect().top +
          window.scrollY -
          Math.max(0, (window.innerHeight - contactEl.offsetHeight) / 2),
      )
      window.scrollTo({
        top: Math.max(0, targetY),
        behavior: 'smooth',
      })
    }
  }

  function handleNavClick(e: MouseEvent, href: string) {
    playClick()
    if (href === '#contact') {
      e.preventDefault()
      scrollToContactCenter()
    }
  }

  function handleMobileNavClick(e: MouseEvent, href: string) {
    closeMobileMenu()
    if (href === '#contact') {
      e.preventDefault()
      scrollToContactCenter()
    }
  }

  function handleScroll() {
    if (typeof window !== 'undefined') {
      isScrolled.value = window.scrollY > 25

      // Show LET'S TALK CTA button ONLY starting from Selected Work (#projects) section
      const projectsEl = document.getElementById('projects')
      if (projectsEl) {
        const rect = projectsEl.getBoundingClientRect()
        isCtaVisible.value = rect.top <= window.innerHeight * 0.75
      }

      // Exact check for contact section visibility to auto-hide navbar
      const contactEl = document.getElementById('contact')
      if (contactEl) {
        const rect = contactEl.getBoundingClientRect()
        isContactVisible.value = rect.top <= window.innerHeight * 0.7 && rect.bottom >= 50
      }

      // Precise Real-Time Scrollspy: Active section detection
      if (window.scrollY < 180) {
        activeSectionId.value = ''
      } else {
        const sectionIds = ['stack', 'projects', 'experience', 'contact']
        const focalY = window.innerHeight * 0.38
        let currentActive = ''
        for (const id of sectionIds) {
          const el = document.getElementById(id)
          if (el) {
            const rect = el.getBoundingClientRect()
            if (rect.top <= focalY && rect.bottom > focalY) {
              currentActive = '#' + id
              break
            }
          }
        }
        if (currentActive) {
          activeSectionId.value = currentActive
        }
      }
    }
  }

  onMounted(() => {
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

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
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    if (contactObserver) {
      contactObserver.disconnect()
      contactObserver = null
    }
  })
</script>

<template>
  <header
    class="fixed top-0 inset-x-0 z-50 transition-all duration-700 ease-out shrink-0"
    :class="[
      !props.isReady
        ? '-translate-y-full opacity-0 pointer-events-none'
        : isContactVisible
          ? '-translate-y-full opacity-0 pointer-events-none'
          : 'translate-y-0 opacity-100',
      isScrolled
        ? 'bg-dark-950/40 backdrop-blur-md border-b border-lime-400/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)]'
        : 'bg-transparent border-b border-transparent shadow-none',
    ]"
  >
    <!-- Topmost Marquee Ticker: Disappears on scroll with smooth transition -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="-translate-y-full opacity-0 max-h-0"
      enter-to-class="translate-y-0 opacity-100 max-h-10"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="translate-y-0 opacity-100 max-h-10"
      leave-to-class="-translate-y-full opacity-0 max-h-0"
    >
      <div v-show="!isScrolled" class="overflow-hidden transition-all duration-300">
        <MarqueeTicker />
      </div>
    </transition>

    <!-- Navbar Container: Same padding as page container on mobile/tablet (px-6 sm:px-8), expanded spread on desktop on scroll (lg:px-4 max-w-[88rem]) -->
    <div
      class="w-full mx-auto transition-all duration-300 ease-out"
      :class="isScrolled ? 'px-6 sm:px-8 lg:px-4 max-w-[88rem]' : 'px-6 sm:px-8 max-w-7xl'"
    >
      <div
        class="flex items-center justify-between transition-all duration-300 ease-out"
        :class="isScrolled ? 'h-11 sm:h-12 min-h-[2.75rem]' : 'h-14 sm:h-16'"
      >
        <!-- Brand Logo -->
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

        <!-- Right Side: Desktop Navigation Links + Dedicated Stationary CTA Slot -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Desktop Navigation Links (Stationary & 100% Zero-Shift) -->
          <nav
            class="hidden md:flex items-center gap-1 text-slate-300 font-mono transition-all duration-300"
            :class="isScrolled ? 'text-[11px]' : 'text-xs'"
          >
            <a
              v-for="link in navLinks"
              :key="link.href"
              :href="link.href"
              class="inline-flex items-center justify-center transition-all duration-200 select-none px-2 sm:px-2.5 rounded-lg"
              :class="[
                isScrolled ? 'h-8' : 'h-10',
                activeSectionId === link.href
                  ? 'text-lime-400 font-bold drop-shadow-[0_0_10px_rgba(226,241,97,0.75)]'
                  : 'text-slate-400 hover:text-slate-100 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]',
              ]"
              @click="(e) => handleNavClick(e, link.href)"
            >
              <span
                v-if="activeSectionId === link.href"
                class="w-1.5 h-1.5 rounded-full bg-lime-400 mr-1.5 animate-pulse shadow-[0_0_8px_#e2f161]"
              />
              {{ link.label }}
            </a>
          </nav>

          <!-- Dedicated Slot for LET'S TALK CTA Button: 0px at top, smoothly expands when Selected Work is reached -->
          <div
            class="hidden md:flex items-center justify-end shrink-0 transition-all duration-300 ease-out py-1"
            :class="
              isCtaVisible
                ? 'w-[136px] opacity-100 ml-2 overflow-visible'
                : 'w-0 opacity-0 ml-0 pointer-events-none overflow-hidden'
            "
          >
            <AppButton
              variant="primary"
              size="sm"
              :href="emailUrl"
              as="a"
              class="whitespace-nowrap font-extrabold uppercase tracking-wider shadow-[0_0_18px_rgba(226,241,97,0.45)] shrink-0 transition-all duration-300"
              :class="
                isCtaVisible
                  ? 'opacity-100 scale-100 pointer-events-auto'
                  : 'opacity-0 scale-95 pointer-events-none'
              "
              @click="playClick"
            >
              <span>LET'S TALK</span>
              <span class="text-xs">&rarr;</span>
            </AppButton>
          </div>

          <!-- Mobile Hamburger Toggle -->
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
    </div>

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
        class="md:hidden absolute inset-x-0 top-full bg-dark-950/95 border-b border-lime-400/15 backdrop-blur-2xl py-3 shadow-2xl font-mono text-xs z-50 transition-all duration-300"
      >
        <div class="w-full mx-auto px-4 sm:px-6">
          <div class="space-y-1">
            <a
              v-for="link in navLinks"
              :key="link.href"
              :href="link.href"
              class="flex items-center justify-between h-10 px-4 transition-colors rounded-lg font-semibold"
              :class="[
                activeSectionId === link.href
                  ? 'text-lime-400 font-bold drop-shadow-[0_0_10px_rgba(226,241,97,0.75)]'
                  : 'text-slate-300 hover:text-lime-400 hover:bg-dark-900/80 active:bg-dark-900',
              ]"
              @click="(e) => handleMobileNavClick(e, link.href)"
            >
              <span>{{ link.label }}</span>
              <span
                v-if="activeSectionId === link.href"
                class="text-[10px] text-lime-400 font-mono"
              >
                ● ACTIVE
              </span>
            </a>

            <!-- Mobile Dedicated Direct Email Action CTA -->
            <div class="pt-2 mt-2 border-t border-lime-400/15">
              <a
                :href="emailUrl"
                class="w-full py-2.5 px-4 rounded-xl bg-lime-400 text-black font-bold font-mono text-xs shadow-[0_0_15px_rgba(226,241,97,0.35)] flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
                @click="playClick"
              >
                <span>LET'S TALK</span>
                <span>&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>
