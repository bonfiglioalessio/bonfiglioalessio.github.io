<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue'
  import { usePortfolioData } from '../../composables/usePortfolioData'
  import { useAudioSynth } from '../../composables/useAudioSynth'

  const { socialLinks } = usePortfolioData()
  const { playClick, playDiffToggle } = useAudioSynth()
  const emailAddress = 'bonfi.alessio98@gmail.com'
  const isCopied = ref(false)
  const isEmerged = ref(false)
  const contactSectionRef = ref<HTMLElement | null>(null)

  // AI Agent Token Streaming Typewriter Engine
  const fullPart1 = "Let's build"
  const fullPart2 = 'something'
  const fullPart3 = 'extraordinary.'

  const displayedPart1 = ref('')
  const displayedPart2 = ref('')
  const displayedPart3 = ref('')
  const isTypingComplete = ref(false)
  let isStreamingStarted = false

  async function startAiStreaming() {
    if (isStreamingStarted) return
    isStreamingStarted = true

    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      displayedPart1.value = fullPart1
      displayedPart2.value = fullPart2
      displayedPart3.value = fullPart3
      isTypingComplete.value = true
      return
    }

    // Stream Part 1 ("Let's build")
    let i = 0
    while (i < fullPart1.length) {
      const chunkSize = Math.min(Math.floor(Math.random() * 3) + 1, fullPart1.length - i)
      displayedPart1.value = fullPart1.slice(0, i + chunkSize)
      i += chunkSize
      const delay = Math.random() * 25 + 25 // 25-50ms
      await new Promise((resolve) => setTimeout(resolve, delay))
    }

    await new Promise((resolve) => setTimeout(resolve, 80))

    // Stream Part 2 ("something")
    let j = 0
    while (j < fullPart2.length) {
      const chunkSize = Math.min(Math.floor(Math.random() * 3) + 1, fullPart2.length - j)
      displayedPart2.value = fullPart2.slice(0, j + chunkSize)
      j += chunkSize
      const delay = Math.random() * 25 + 25
      await new Promise((resolve) => setTimeout(resolve, delay))
    }

    await new Promise((resolve) => setTimeout(resolve, 100))

    // Stream Part 3 ("extraordinary.")
    let k = 0
    while (k < fullPart3.length) {
      const chunkSize = Math.min(Math.floor(Math.random() * 3) + 1, fullPart3.length - k)
      displayedPart3.value = fullPart3.slice(0, k + chunkSize)
      k += chunkSize
      const delay = Math.random() * 30 + 30
      await new Promise((resolve) => setTimeout(resolve, delay))
    }

    isTypingComplete.value = true
  }

  let observer: IntersectionObserver | null = null

  // Dedicated Magnetic Glide Engine to Perfectly Center Contact Section
  let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0
  let isGliding = false
  let hasGlided = false
  let snapFrameId: number | null = null
  let isNavClickActive = false
  let navClickTimeoutId: ReturnType<typeof setTimeout> | null = null

  function cancelGlide() {
    if (snapFrameId !== null) {
      cancelAnimationFrame(snapFrameId)
      snapFrameId = null
    }
    isGliding = false
  }

  function handleNavDirectScroll() {
    isNavClickActive = true
    hasGlided = true
    cancelGlide()
    if (navClickTimeoutId) clearTimeout(navClickTimeoutId)
    navClickTimeoutId = setTimeout(() => {
      isNavClickActive = false
    }, 1600)
  }

  function glideToCenter() {
    if (typeof window === 'undefined' || !contactSectionRef.value) return
    isGliding = true
    hasGlided = true

    const startY = window.scrollY
    const rect = contactSectionRef.value.getBoundingClientRect()
    const sectionHeight = contactSectionRef.value.offsetHeight
    // Exact vertical centering so all elements from top header to bottom social links fit inside viewport
    const targetY = Math.round(
      rect.top + window.scrollY - Math.max(0, (window.innerHeight - sectionHeight) / 2),
    )
    const distance = targetY - startY

    if (Math.abs(distance) < 8) {
      isGliding = false
      return
    }

    const startTime = performance.now()
    const duration = 900 // 900ms smooth gentle glide

    function step(currentTime: number) {
      const elapsed = currentTime - startTime
      const p = Math.min(1, elapsed / duration)
      // Smooth ease-out cubic curve
      const eased = 1 - Math.pow(1 - p, 3)

      window.scrollTo(0, startY + distance * eased)

      if (p < 1 && isGliding) {
        snapFrameId = requestAnimationFrame(step)
      } else {
        isGliding = false
        snapFrameId = null
      }
    }

    snapFrameId = requestAnimationFrame(step)
  }

  function handleScroll() {
    if (typeof window === 'undefined' || !contactSectionRef.value || isNavClickActive) return
    const currentScrollY = window.scrollY
    const isScrollingDown = currentScrollY > lastScrollY
    const isScrollingUp = currentScrollY < lastScrollY
    lastScrollY = currentScrollY

    // If user is actively scrolling up, cancel any in-progress glide immediately
    if (isScrollingUp && isGliding) {
      cancelGlide()
    }

    const rect = contactSectionRef.value.getBoundingClientRect()

    // Reset glide state when scrolling back up above Contact section
    if (rect.top > window.innerHeight * 0.75) {
      hasGlided = false
      cancelGlide()
    }

    // Trigger magnetic glide only during manual downward scroll when contact is approached
    if (
      isScrollingDown &&
      !isGliding &&
      !hasGlided &&
      rect.top <= window.innerHeight * 0.4 &&
      rect.top >= 50
    ) {
      glideToCenter()
    }
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(emailAddress)
      playDiffToggle(true)
      isCopied.value = true
      setTimeout(() => {
        isCopied.value = false
      }, 2000)
    } catch {
      // Fallback
    }
  }

  onMounted(() => {
    if (contactSectionRef.value) {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0]
          if (entry.isIntersecting) {
            isEmerged.value = true
            startAiStreaming()
          }
        },
        {
          threshold: 0.2,
          rootMargin: '0px 0px -40px 0px',
        },
      )
      observer.observe(contactSectionRef.value)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('nav-direct-scroll-contact', handleNavDirectScroll)
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('nav-direct-scroll-contact', handleNavDirectScroll)
    cancelGlide()
    if (navClickTimeoutId) clearTimeout(navClickTimeoutId)
  })
</script>

<template>
  <section
    id="contact"
    ref="contactSectionRef"
    class="fullscreen-contact-section w-screen relative left-1/2 -translate-x-1/2 min-h-screen py-10 sm:py-14 lg:py-16 px-6 sm:px-12 lg:px-20 flex flex-col justify-center items-center select-none overflow-hidden transition-colors duration-1000 ease-out"
    :class="[isEmerged ? 'bg-emerged' : 'bg-submerged']"
  >
    <!-- Top Glowing Cyber Horizon Divider -->
    <div
      class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lime-400/40 to-transparent transition-opacity duration-1000"
      :class="isEmerged ? 'opacity-100' : 'opacity-20'"
    />

    <!-- Deep Space Atmospheric Nebula Glows -->
    <div
      class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[1000px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none transition-all duration-1000"
      :class="isEmerged ? 'scale-110 opacity-100' : 'scale-75 opacity-0'"
    />
    <div
      class="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-[600px] sm:w-[900px] h-[450px] rounded-full bg-lime-400/10 blur-[130px] pointer-events-none transition-all duration-1000"
      :class="isEmerged ? 'scale-110 opacity-100' : 'scale-75 opacity-0'"
    />

    <!-- Central Content Stage -->
    <div
      class="max-w-4xl w-full mx-auto space-y-6 sm:space-y-8 relative z-10 transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) origin-center text-left"
      :class="[
        isEmerged ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-40 translate-y-8',
      ]"
    >
      <!-- Top Tag -->
      <div class="flex items-center gap-2">
        <span
          class="text-lime-400 font-mono font-bold text-xs sm:text-sm tracking-widest uppercase drop-shadow-[0_0_8px_#e2f161]"
        >
          // WANNA WORK WITH ME?
        </span>
      </div>

      <!-- Main Display Headline (Monumental Fullscreen Typography with AI Agent Streaming & Zero CLS) -->
      <div class="relative">
        <!-- Invisible Ghost Placeholder: Locks exact layout dimensions & line wraps immediately -->
        <div
          class="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold font-syne tracking-tight leading-[1.05] opacity-0 select-none pointer-events-none"
          aria-hidden="true"
        >
          Let's build<br />
          something<br />
          <span
            class="underline decoration-lime-400 decoration-4 sm:decoration-6 underline-offset-6 sm:underline-offset-10"
          >
            extraordinary.
          </span>
        </div>

        <!-- Active Streamed Overlay (Zero CLS, AI Token Stream) -->
        <h2
          class="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold font-syne text-white tracking-tight leading-[1.05] absolute inset-0"
        >
          <span>{{ displayedPart1 }}</span>
          <br v-if="displayedPart1.length >= fullPart1.length" />
          <span>{{ displayedPart2 }}</span>
          <br v-if="displayedPart2.length >= fullPart2.length" />
          <span
            v-if="displayedPart3"
            class="text-lime-400 underline decoration-lime-400 decoration-4 sm:decoration-6 underline-offset-6 sm:underline-offset-10 drop-shadow-[0_0_35px_rgba(226,241,97,0.7)]"
          >
            {{ displayedPart3 }}
          </span>
          <!-- AI Streaming Token Caret -->
          <span
            v-if="!isTypingComplete"
            class="inline-block w-[4px] sm:w-[6px] h-[0.7em] align-baseline ml-1 bg-lime-400 shadow-[0_0_10px_#e2f161] rounded-sm animate-pulse"
          />
        </h2>
      </div>

      <!-- Subtitle Description -->
      <p class="text-sm sm:text-base text-slate-200 font-mono leading-relaxed max-w-2xl pt-1">
        Se cerchi un Frontend Engineer con solida esperienza in React/Vue che mette la passione per
        il codice e i dettagli visivi al primo posto, connettiamoci.
      </p>

      <!-- Action Interaction Row -->
      <div class="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 pt-2 flex-wrap">
        <!-- Copy Email Pill Box -->
        <div
          class="relative bg-dark-900/90 border border-lime-400/30 rounded-2xl px-5 py-3 sm:py-3.5 flex items-center justify-between gap-4 shadow-[0_0_20px_rgba(0,0,0,0.6)] min-w-0"
        >
          <div class="flex items-center gap-2.5 min-w-0 font-mono text-xs sm:text-sm">
            <span class="text-lime-400 font-bold">$ copy:</span>
            <span class="text-slate-100 truncate select-all font-mono">
              {{ emailAddress }}
            </span>
          </div>

          <button
            type="button"
            class="relative overflow-hidden group/btn px-3 py-1.5 text-xs font-mono rounded-lg border transition-all cursor-pointer shrink-0"
            :class="
              isCopied
                ? 'bg-lime-400 text-black border-lime-400 font-bold shadow-[0_0_12px_rgba(226,241,97,0.5)]'
                : 'bg-lime-400/15 text-lime-300 hover:bg-lime-400/25 border-lime-400/30'
            "
            @click="copyEmail"
          >
            <span
              class="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-out pointer-events-none bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] w-[180%]"
            />
            <span class="relative z-10 font-bold">
              {{ isCopied ? 'COPIED!' : 'COPY' }}
            </span>
          </button>
        </div>

        <!-- Direct Email Button CTA with Starlight Shine -->
        <a
          :href="`mailto:${emailAddress}`"
          class="relative overflow-hidden group/btn inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-lime-400 text-black font-mono font-bold text-xs sm:text-sm shadow-[0_0_25px_rgba(226,241,97,0.4)] hover:shadow-[0_0_40px_rgba(226,241,97,0.8)] hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
          @click="playClick"
        >
          <span
            class="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-out pointer-events-none bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-25deg] w-[180%]"
          />
          <span class="relative z-10 inline-flex items-center gap-2">
            <span>Send Email</span>
            <span class="text-base">&rarr;</span>
          </span>
        </a>
      </div>

      <!-- Social Links Row -->
      <div class="flex items-center gap-8 sm:gap-12 pt-4 flex-wrap">
        <a
          v-for="link in socialLinks.filter((l) => !l.isMailto)"
          :key="link.platform"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 font-mono text-xs sm:text-sm text-slate-300 hover:text-lime-400 transition-all duration-300 group cursor-pointer"
          @click="playClick"
        >
          <span
            class="text-lime-400 group-hover:text-lime-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform font-bold"
          >
            &#x2197;
          </span>
          <span class="font-bold">{{ link.platform }}</span>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
  .fullscreen-contact-section {
    will-change: background;
  }

  .bg-submerged {
    background: transparent;
  }

  .bg-emerged {
    // Deep cosmic cyber-nebula smoothly fading into the footer
    background: radial-gradient(
      circle at 50% 40%,
      rgba(16, 36, 68, 0.75) 0%,
      rgba(8, 16, 30, 0.92) 60%,
      rgba(3, 7, 18, 0.98) 100%
    );
  }
</style>
