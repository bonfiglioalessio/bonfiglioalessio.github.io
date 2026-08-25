import { onMounted, onUnmounted, ref, type Ref } from 'vue'

export interface ScrollRevealOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

export function useScrollReveal(
  targetRef: Ref<HTMLElement | null>,
  options: ScrollRevealOptions = {},
) {
  const isRevealed = ref(false)
  let observer: IntersectionObserver | null = null

  const { threshold = 0.12, rootMargin = '0px 0px -40px 0px', once = true } = options

  onMounted(() => {
    if (typeof window === 'undefined' || !targetRef.value) return

    // If user prefers reduced motion, reveal immediately
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      isRevealed.value = true
      targetRef.value.classList.add('is-revealed')
      return
    }

    // Fallback if IntersectionObserver is not supported
    if (!('IntersectionObserver' in window)) {
      isRevealed.value = true
      targetRef.value.classList.add('is-revealed')
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isRevealed.value = true
            entry.target.classList.add('is-revealed')
            if (once && observer) {
              observer.unobserve(entry.target)
            }
          } else if (!once) {
            isRevealed.value = false
            entry.target.classList.remove('is-revealed')
          }
        })
      },
      {
        threshold,
        rootMargin,
      },
    )

    observer.observe(targetRef.value)
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  })

  return {
    isRevealed,
  }
}
