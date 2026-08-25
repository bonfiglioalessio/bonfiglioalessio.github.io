<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
  import type { Project } from '../../types/portfolio'
  import { useAudioSynth } from '../../composables/useAudioSynth'

  interface Props {
    project: Project | null
    allProjects: Project[]
    isOpen: boolean
  }

  const props = defineProps<Props>()
  const emit = defineEmits<{
    (e: 'close'): void
    (e: 'select', project: Project): void
  }>()

  const { playClick, playSupernova } = useAudioSynth()

  type DeviceMode = 'desktop' | 'tablet' | 'mobile'
  const activeDevice = ref<DeviceMode>('desktop')
  const isIframeLoading = ref(true)
  const iframeKey = ref(0)

  const currentIndex = computed(() => {
    if (!props.project) return 0
    return props.allProjects.findIndex((p) => p.id === props.project?.id)
  })

  function setDevice(mode: DeviceMode) {
    playClick()
    activeDevice.value = mode
  }

  function reloadIframe() {
    playClick()
    isIframeLoading.value = true
    iframeKey.value++
  }

  function handleIframeLoad() {
    isIframeLoading.value = false
  }

  function prevProject() {
    if (currentIndex.value > 0) {
      emit('select', props.allProjects[currentIndex.value - 1])
    } else {
      emit('select', props.allProjects[props.allProjects.length - 1])
    }
    playClick()
  }

  function nextProject() {
    if (currentIndex.value < props.allProjects.length - 1) {
      emit('select', props.allProjects[currentIndex.value + 1])
    } else {
      emit('select', props.allProjects[0])
    }
    playClick()
  }

  function handleClose() {
    playClick()
    emit('close')
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (!props.isOpen) return
    if (e.key === 'Escape') {
      handleClose()
    } else if (e.key === 'ArrowLeft') {
      prevProject()
    } else if (e.key === 'ArrowRight') {
      nextProject()
    }
  }

  watch(
    () => props.project,
    () => {
      isIframeLoading.value = true
      iframeKey.value++
    },
  )

  watch(
    () => props.isOpen,
    (open) => {
      if (open) {
        document.body.style.overflow = 'hidden'
        playSupernova()
      } else {
        document.body.style.overflow = ''
      }
    },
  )

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
    document.body.style.overflow = ''
  })

  const deviceWidthClass = computed(() => {
    switch (activeDevice.value) {
      case 'mobile':
        return 'w-[375px] max-w-full'
      case 'tablet':
        return 'w-[768px] max-w-full'
      case 'desktop':
      default:
        return 'w-full'
    }
  })
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen && project"
        class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 select-none"
        role="dialog"
        aria-modal="true"
        :aria-label="`Preview of ${project.title}`"
      >
        <!-- Backdrop Blur Overlay -->
        <div
          class="fixed inset-0 bg-dark-950/85 backdrop-blur-xl transition-opacity cursor-pointer"
          @click="handleClose"
        />

        <!-- Modal Shell -->
        <div
          class="relative z-10 w-full max-w-6xl h-[92vh] max-h-[850px] bg-dark-950/95 border border-lime-400/30 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_30px_rgba(226,241,97,0.15)] flex flex-col overflow-hidden ring-1 ring-lime-400/20"
        >
          <!-- Top Cyber Bar / Browser Frame Controls -->
          <div
            class="px-4 py-3 bg-dark-900/90 border-b border-lime-400/15 flex items-center justify-between gap-3 shrink-0"
          >
            <!-- Left: macOS Traffic Lights & Project Identifier -->
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="Close preview"
                  class="w-3 h-3 rounded-full bg-rose-500 hover:bg-rose-400 cursor-pointer transition-transform active:scale-90 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
                  @click="handleClose"
                />
                <button
                  type="button"
                  aria-label="Toggle device mode"
                  class="w-3 h-3 rounded-full bg-amber-500 hover:bg-amber-400 cursor-pointer transition-transform active:scale-90 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                  @click="setDevice(activeDevice === 'desktop' ? 'mobile' : 'desktop')"
                />
                <button
                  type="button"
                  aria-label="Reload demo frame"
                  class="w-3 h-3 rounded-full bg-emerald-500 hover:bg-emerald-400 cursor-pointer transition-transform active:scale-90 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                  @click="reloadIframe"
                />
              </div>

              <div class="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-700">
                <span class="text-lime-400 font-mono font-bold text-xs">
                  {{ project.projectNumber }} //
                </span>
                <span class="text-white font-syne font-bold text-sm truncate max-w-[180px]">
                  {{ project.title }}
                </span>
              </div>
            </div>

            <!-- Center: URL Bar Mockup with Clickable External Link -->
            <div
              class="hidden md:flex items-center gap-2 px-3.5 py-1 rounded-xl bg-dark-950 border border-lime-400/20 font-mono text-xs text-slate-300 max-w-md w-full justify-between"
            >
              <div class="flex items-center gap-2 truncate">
                <span class="text-lime-400 text-[10px]">🔒</span>
                <a
                  v-if="project.liveUrl"
                  :href="project.liveUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-slate-300 hover:text-lime-400 truncate hover:underline transition-colors flex items-center gap-1"
                >
                  <span class="truncate">{{ project.liveUrl }}</span>
                  <span class="text-[10px] text-lime-400">↗</span>
                </a>
                <span v-else class="text-slate-400 truncate">
                  https://bonfiglio.dev/active-session
                </span>
              </div>

              <button
                type="button"
                aria-label="Reload preview frame"
                class="text-slate-400 hover:text-lime-400 text-xs transition-colors cursor-pointer"
                @click="reloadIframe"
              >
                ⟳
              </button>
            </div>

            <!-- Right: Device Mode Switcher & Close [ESC] -->
            <div class="flex items-center gap-2 font-mono">
              <!-- Responsive Device Buttons -->
              <div class="flex items-center bg-dark-950 border border-lime-400/20 rounded-xl p-0.5">
                <button
                  type="button"
                  title="Desktop View (100%)"
                  class="px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer flex items-center gap-1"
                  :class="
                    activeDevice === 'desktop'
                      ? 'bg-lime-400 text-black font-bold shadow-[0_0_10px_rgba(226,241,97,0.4)]'
                      : 'text-slate-400 hover:text-white'
                  "
                  @click="setDevice('desktop')"
                >
                  <span class="hidden sm:inline">🖥️</span>
                  <span>Desk</span>
                </button>
                <button
                  type="button"
                  title="Tablet View (768px)"
                  class="px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer flex items-center gap-1"
                  :class="
                    activeDevice === 'tablet'
                      ? 'bg-lime-400 text-black font-bold shadow-[0_0_10px_rgba(226,241,97,0.4)]'
                      : 'text-slate-400 hover:text-white'
                  "
                  @click="setDevice('tablet')"
                >
                  <span class="hidden sm:inline">💻</span>
                  <span>Tab</span>
                </button>
                <button
                  type="button"
                  title="Mobile View (375px)"
                  class="px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer flex items-center gap-1"
                  :class="
                    activeDevice === 'mobile'
                      ? 'bg-lime-400 text-black font-bold shadow-[0_0_10px_rgba(226,241,97,0.4)]'
                      : 'text-slate-400 hover:text-white'
                  "
                  @click="setDevice('mobile')"
                >
                  <span class="hidden sm:inline">📱</span>
                  <span>Mob</span>
                </button>
              </div>

              <!-- Close Button -->
              <button
                type="button"
                aria-label="Close Lightbox"
                class="px-2.5 py-1 rounded-xl bg-dark-950 border border-lime-400/30 text-slate-300 hover:text-lime-400 hover:border-lime-400 text-xs font-bold transition-all cursor-pointer"
                @click="handleClose"
              >
                ✕ <span class="hidden sm:inline text-[10px] text-slate-500">ESC</span>
              </button>
            </div>
          </div>

          <!-- Main Stage: Device Sandbox Frame -->
          <div
            class="flex-1 bg-dark-950/80 p-2 sm:p-4 overflow-hidden flex items-center justify-center relative"
          >
            <!-- Background Radial Glow inside Modal -->
            <div
              class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(226,241,97,0.04)_0%,transparent_70%)] pointer-events-none"
            />

            <!-- Iframe Container with Dynamic Device Width & Smooth Transition -->
            <div
              class="h-full bg-dark-900 border border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl relative transition-all duration-300 flex flex-col"
              :class="[
                deviceWidthClass,
                activeDevice !== 'desktop'
                  ? 'border-2 border-lime-400/40 shadow-[0_0_30px_rgba(226,241,97,0.15)]'
                  : '',
              ]"
            >
              <!-- Loading Spinner Overlay -->
              <div
                v-if="isIframeLoading && project.liveUrl"
                class="absolute inset-0 bg-dark-950 flex flex-col items-center justify-center gap-3 z-20 font-mono text-xs text-lime-400"
              >
                <div
                  class="w-8 h-8 border-2 border-lime-400/20 border-t-lime-400 rounded-full animate-spin shadow-[0_0_12px_#e2f161]"
                />
                <div class="flex items-center gap-1.5 animate-pulse">
                  <span>&gt; CONNECTING LIVE DEMO...</span>
                </div>
              </div>

              <!-- Live Iframe for external web apps -->
              <iframe
                v-if="project.liveUrl"
                :key="iframeKey"
                :src="project.liveUrl"
                class="w-full h-full border-0 bg-white"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                loading="lazy"
                :title="project.title"
                @load="handleIframeLoad"
              />

              <!-- Fallback / Interactive Card for Current Active Site (bonfiglio.dev) -->
              <div
                v-else
                class="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-6 bg-dark-950 font-mono"
              >
                <div
                  class="w-16 h-16 rounded-2xl bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(226,241,97,0.25)]"
                >
                  ⚡
                </div>

                <div class="space-y-2 max-w-md">
                  <h4 class="text-xl font-bold font-syne text-white">
                    {{ project.title }}
                  </h4>
                  <p class="text-xs text-slate-300 leading-relaxed">
                    {{ project.description }}
                  </p>
                </div>

                <div
                  class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lime-400/10 border border-lime-400/30 text-lime-400 text-xs font-bold"
                >
                  <span class="w-2 h-2 rounded-full bg-lime-400 animate-ping inline-block" />
                  <span>ACTIVE RUNTIME SESSION IN YOUR BROWSER</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Footer Bar: Navigation, Tech Stack, & Direct Launch Link -->
          <div
            class="px-4 py-3 bg-dark-900/90 border-t border-lime-400/15 flex items-center justify-between gap-4 shrink-0 flex-wrap"
          >
            <!-- Left: Stepper Navigation -->
            <div class="flex items-center gap-2 font-mono text-xs">
              <button
                type="button"
                class="px-3 py-1.5 rounded-xl bg-dark-950 border border-lime-400/20 hover:border-lime-400 text-slate-300 hover:text-white transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
                @click="prevProject"
              >
                <span>&larr;</span>
                <span class="hidden sm:inline">PREV</span>
              </button>

              <span class="text-slate-500 font-bold px-1">
                {{ currentIndex + 1 }} / {{ allProjects.length }}
              </span>

              <button
                type="button"
                class="px-3 py-1.5 rounded-xl bg-dark-950 border border-lime-400/20 hover:border-lime-400 text-slate-300 hover:text-white transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
                @click="nextProject"
              >
                <span class="hidden sm:inline">NEXT</span>
                <span>&rarr;</span>
              </button>
            </div>

            <!-- Middle: Tech Stack Pills -->
            <div class="hidden lg:flex items-center gap-2 font-mono text-xs">
              <span
                v-for="tech in project.stack"
                :key="tech"
                class="px-2 py-0.5 rounded-md bg-dark-950 border border-lime-400/15 text-slate-300 text-[11px]"
              >
                {{ tech }}
              </span>
            </div>

            <!-- Right: Open Live Site External Button -->
            <div class="flex items-center gap-2 font-mono text-xs">
              <a
                v-if="project.liveUrl"
                :href="project.liveUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="px-4 py-1.5 rounded-xl bg-lime-400 text-black font-bold shadow-[0_0_15px_rgba(226,241,97,0.35)] hover:shadow-[0_0_25px_rgba(226,241,97,0.65)] hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                @click="playClick"
              >
                <span>VISIT LIVE SITE</span>
                <span class="text-sm">&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
