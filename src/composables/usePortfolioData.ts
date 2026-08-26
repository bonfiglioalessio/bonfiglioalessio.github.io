import { computed, ref } from 'vue'
import { portfolioData as fallbackPortfolioData } from '../data/portfolio'
import type {
  PortfolioData,
  Profile,
  SkillCluster,
  Project,
  Experience,
  SocialLink,
} from '../types/portfolio'

// Singleton reactive state across the entire Vue application
const portfolioState = ref<PortfolioData>(fallbackPortfolioData)
const isLoading = ref(false)
const isLoaded = ref(false)
const isError = ref(false)

/**
 * Composable for accessing and asynchronously fetching portfolio copies & data.
 * Fully decoupled from static application deployment with instant offline fallback.
 */
export function usePortfolioData() {
  const profile = computed<Profile>(() => portfolioState.value.profile)
  const sections = computed(() => portfolioState.value.sections)
  const marqueeItems = computed<string[]>(() => portfolioState.value.marqueeItems)
  const skillsConstellation = computed<SkillCluster[]>(
    () => portfolioState.value.skillsConstellation,
  )
  const selectedWork = computed<Project[]>(() => portfolioState.value.selectedWork)
  const careerMissionLog = computed<Experience[]>(() => portfolioState.value.careerMissionLog)
  const socialLinks = computed<SocialLink[]>(() => portfolioState.value.socialLinks)
  const contact = computed(() => portfolioState.value.contact)
  const footer = computed(() => portfolioState.value.footer)

  /**
   * Fetches the latest copy from a remote URL (e.g. GitHub Raw, CDN, or /data/portfolio.json).
   * Automatically falls back to embedded TypeScript data if the network is unavailable.
   */
  async function fetchPortfolioData(overrideUrl?: string): Promise<boolean> {
    if (isLoading.value) return false
    isLoading.value = true
    isError.value = false

    const targetUrl =
      overrideUrl || (import.meta.env.VITE_PORTFOLIO_DATA_URL as string) || '/data/portfolio.json'

    try {
      // 3-second timeout controller to guarantee snappy experience
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000)

      const response = await fetch(targetUrl, {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
        },
      })
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const remoteData: PortfolioData = await response.json()

      // Basic validation ensuring required fields exist
      if (remoteData && remoteData.profile && remoteData.selectedWork) {
        portfolioState.value = {
          ...fallbackPortfolioData,
          ...remoteData,
        }
        isLoaded.value = true
        return true
      } else {
        throw new Error('Invalid JSON schema received')
      }
    } catch (err) {
      console.warn('[usePortfolioData] Could not load remote copy, using embedded fallback.', err)
      isError.value = true
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    portfolioData: portfolioState,
    profile,
    sections,
    marqueeItems,
    skillsConstellation,
    selectedWork,
    careerMissionLog,
    socialLinks,
    contact,
    footer,
    isLoading,
    isLoaded,
    isError,
    fetchPortfolioData,
  }
}
