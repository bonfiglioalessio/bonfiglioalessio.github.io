import { ref } from 'vue'

const STORAGE_KEY = 'bonfiglio_sfx_enabled'

// Global singleton audio state: Default is OFF until user gives consent
const isAudioEnabled = ref<boolean>(
  typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) === 'true' : false,
)

let audioCtx: AudioContext | null = null
let sfxGain: GainNode | null = null
let musicGain: GainNode | null = null

// Space Ambient Music Active Nodes
let ambientOscs: OscillatorNode[] = []
let ambientIntervalId: ReturnType<typeof setInterval> | null = null
let isMusicPlaying = false
let lastParticleSoundTime = 0

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null

  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()

      // SFX Master Gain: Crisp, punchy and clearly audible
      sfxGain = audioCtx.createGain()
      sfxGain.gain.setValueAtTime(0.32, audioCtx.currentTime)
      sfxGain.connect(audioCtx.destination)

      // Ambient Music Master Gain: Subtle, calm, gentle background presence (0.055)
      musicGain = audioCtx.createGain()
      musicGain.gain.setValueAtTime(0, audioCtx.currentTime)
      musicGain.connect(audioCtx.destination)
    }
  }

  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }

  return audioCtx
}

// Start Generative Deep-Space Ambient Drone & Celestial Bells (Subtle Atmospheric Bed)
function startAmbientMusic() {
  if (isMusicPlaying) return
  const ctx = getAudioContext()
  if (!ctx || !musicGain) return

  isMusicPlaying = true
  const now = ctx.currentTime

  // Smooth fade-in of space ambient music to a very subtle background level (0.035)
  musicGain.gain.cancelScheduledValues(now)
  musicGain.gain.setValueAtTime(0.001, now)
  musicGain.gain.linearRampToValueAtTime(0.035, now + 2.0)

  // 1. Cosmic Harmonic Drone (Sub-bass + Soft Ethereal Space Pads)
  // Chord: D minor add9 (D2: 73.4Hz, A2: 110Hz, F3: 174.6Hz, A3: 220Hz, E4: 329.6Hz)
  const droneFreqs = [73.41, 110.0, 174.61, 220.0, 329.63]

  ambientOscs = droneFreqs.map((freq, idx) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    osc.type = idx <= 1 ? 'sine' : 'triangle'
    osc.frequency.setValueAtTime(freq + (Math.random() - 0.5) * 0.5, now)

    // Soft warm lowpass filter
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(900 + idx * 120, now)

    // Soft individual pad volume
    const padVol = idx <= 1 ? 0.45 : 0.2
    gain.gain.setValueAtTime(padVol, now)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(musicGain!)

    osc.start(now)
    return osc
  })

  // 2. Generative Celestial Chimes (Subtle Stardust Bells)
  const celestialNotes = [440, 523.25, 587.33, 659.25, 783.99, 880, 1046.5] // Pentatonic

  function triggerCosmicBell() {
    if (!isMusicPlaying || !audioCtx || !musicGain) return
    const bellNow = audioCtx.currentTime
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()

    const note = celestialNotes[Math.floor(Math.random() * celestialNotes.length)]
    osc.type = 'sine'
    osc.frequency.setValueAtTime(note, bellNow)

    // Soft gentle bell decay
    gain.gain.setValueAtTime(0.04, bellNow)
    gain.gain.exponentialRampToValueAtTime(0.0001, bellNow + 3.0)

    osc.connect(gain)
    gain.connect(musicGain)

    osc.start(bellNow)
    osc.stop(bellNow + 3.1)
  }

  // Play initial chime
  triggerCosmicBell()
  ambientIntervalId = setInterval(() => {
    if (isMusicPlaying) {
      triggerCosmicBell()
    }
  }, 4500)
}

// Stop Ambient Music smoothly
function stopAmbientMusic() {
  if (!isMusicPlaying) return
  isMusicPlaying = false

  if (ambientIntervalId) {
    clearInterval(ambientIntervalId)
    ambientIntervalId = null
  }

  if (audioCtx && musicGain) {
    const now = audioCtx.currentTime
    musicGain.gain.cancelScheduledValues(now)
    musicGain.gain.setValueAtTime(musicGain.gain.value, now)
    musicGain.gain.linearRampToValueAtTime(0.0001, now + 0.8)
  }

  setTimeout(() => {
    ambientOscs.forEach((osc) => {
      try {
        osc.stop()
        osc.disconnect()
      } catch {
        // Safe disconnect
      }
    })
    ambientOscs = []
  }, 900)
}

// Automatic resume on user gesture if audio is enabled
if (typeof window !== 'undefined') {
  const resumeOnFirstInteraction = () => {
    if (isAudioEnabled.value && !isMusicPlaying) {
      getAudioContext()
      startAmbientMusic()
    }
  }
  window.addEventListener('click', resumeOnFirstInteraction, { once: true })
  window.addEventListener('keydown', resumeOnFirstInteraction, { once: true })
}

export function useAudioSynth() {
  function toggleAudio() {
    isAudioEnabled.value = !isAudioEnabled.value
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, String(isAudioEnabled.value))
    }
    if (isAudioEnabled.value) {
      getAudioContext()
      playStartupChime()
      startAmbientMusic()
    } else {
      stopAmbientMusic()
    }
  }

  function setAudio(enabled: boolean) {
    isAudioEnabled.value = enabled
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, String(enabled))
    }
    if (enabled) {
      getAudioContext()
      startAmbientMusic()
    } else {
      stopAmbientMusic()
    }
  }

  // Startup activation chime when user enables sound
  function playStartupChime() {
    const ctx = getAudioContext()
    if (!ctx || !sfxGain) return

    try {
      const now = ctx.currentTime
      const freqs = [440, 660, 880, 1320]

      freqs.forEach((freq, i) => {
        if (!ctx || !sfxGain) return
        const startTime = now + i * 0.045
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, startTime)

        gain.gain.setValueAtTime(0.12, startTime)
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.08)

        osc.connect(gain)
        gain.connect(sfxGain)

        osc.start(startTime)
        osc.stop(startTime + 0.085)
      })
    } catch {
      // Audio fallback
    }
  }

  // 1. Sci-Fi HUD Laser Energy Charge & Particle Shimmer (For Stat Badges & Skill Card Borders)
  function playBorderLoad(duration = 0.8) {
    if (!isAudioEnabled.value) return
    const ctx = getAudioContext()
    if (!ctx || !sfxGain) return

    try {
      const now = ctx.currentTime

      // Dual Harmonic Laser Oscillators (Sine + Triangle Shimmer)
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gain = ctx.createGain()
      const filter = ctx.createBiquadFilter()

      // Resonant Cyber Filter Sweep
      filter.type = 'bandpass'
      filter.Q.setValueAtTime(2.5, now)
      filter.frequency.setValueAtTime(500, now)
      filter.frequency.exponentialRampToValueAtTime(3400, now + duration)

      // Harmonic frequency sweeps
      osc1.type = 'sine'
      osc1.frequency.setValueAtTime(460, now)
      osc1.frequency.exponentialRampToValueAtTime(1380, now + duration)

      osc2.type = 'triangle'
      osc2.frequency.setValueAtTime(920, now)
      osc2.frequency.exponentialRampToValueAtTime(2760, now + duration)

      // Master Gain Envelope
      gain.gain.setValueAtTime(0.001, now)
      gain.gain.linearRampToValueAtTime(0.14, now + 0.04)
      gain.gain.setValueAtTime(0.14, now + duration - 0.08)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

      osc1.connect(filter)
      osc2.connect(filter)
      filter.connect(gain)
      gain.connect(sfxGain)

      osc1.start(now)
      osc2.start(now)

      osc1.stop(now + duration)
      osc2.stop(now + duration)

      // High-Tech Completion Ping (when the border completes the loop)
      const pingOsc = ctx.createOscillator()
      const pingGain = ctx.createGain()
      const pingTime = now + duration - 0.05

      pingOsc.type = 'sine'
      pingOsc.frequency.setValueAtTime(1760, pingTime)
      pingOsc.frequency.exponentialRampToValueAtTime(2300, pingTime + 0.06)

      pingGain.gain.setValueAtTime(0.12, pingTime)
      pingGain.gain.exponentialRampToValueAtTime(0.0001, pingTime + 0.06)

      pingOsc.connect(pingGain)
      pingGain.connect(sfxGain)

      pingOsc.start(pingTime)
      pingOsc.stop(pingTime + 0.065)
    } catch {
      // Audio fallback
    }
  }

  // 2. Interactive Stardust Particles Shimmer (Subtle Whisper)
  function playParticleShimmer() {
    if (!isAudioEnabled.value) return
    const nowMs = performance.now()
    if (nowMs - lastParticleSoundTime < 90) return // Throttle rate
    lastParticleSoundTime = nowMs

    const ctx = getAudioContext()
    if (!ctx || !sfxGain) return

    try {
      const now = ctx.currentTime
      const notes = [880, 987.77, 1174.66, 1318.51, 1567.98, 1760, 2093, 2349.32]
      const note = notes[Math.floor(Math.random() * notes.length)]

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(note, now)

      gain.gain.setValueAtTime(0.018, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1)

      osc.connect(gain)
      gain.connect(sfxGain)

      osc.start(now)
      osc.stop(now + 0.11)
    } catch {
      // Audio fallback
    }
  }

  // 3. Subtle Micro Hover Blip (For Cards & Badges)
  function playHover() {
    if (!isAudioEnabled.value) return
    const ctx = getAudioContext()
    if (!ctx || !sfxGain) return

    try {
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(1100, now)
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.035)

      gain.gain.setValueAtTime(0.12, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035)

      osc.connect(gain)
      gain.connect(sfxGain)

      osc.start(now)
      osc.stop(now + 0.04)
    } catch {
      // Audio fallback
    }
  }

  // 4. Tactile Mechanical Cyber Click (Buttons & Actions) - Punchy & Crisp!
  function playClick() {
    if (!isAudioEnabled.value) return
    const ctx = getAudioContext()
    if (!ctx || !sfxGain) return

    try {
      const now = ctx.currentTime

      // Dual component click: High-frequency transient + punchy body
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gain1 = ctx.createGain()
      const gain2 = ctx.createGain()

      // 1. High transient snap (sine)
      osc1.type = 'sine'
      osc1.frequency.setValueAtTime(1800, now)
      osc1.frequency.exponentialRampToValueAtTime(600, now + 0.02)

      gain1.gain.setValueAtTime(0.24, now)
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.02)

      // 2. Punchy tactile body (triangle)
      osc2.type = 'triangle'
      osc2.frequency.setValueAtTime(540, now)
      osc2.frequency.exponentialRampToValueAtTime(180, now + 0.05)

      gain2.gain.setValueAtTime(0.28, now)
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.05)

      osc1.connect(gain1)
      osc2.connect(gain2)
      gain1.connect(sfxGain)
      gain2.connect(sfxGain)

      osc1.start(now)
      osc2.start(now)

      osc1.stop(now + 0.025)
      osc2.stop(now + 0.055)
    } catch {
      // Audio fallback
    }
  }

  // 5. Resonant Deep Space Supernova Explosion (Canvas Starfield Click)
  function playSupernova() {
    if (!isAudioEnabled.value) return
    const ctx = getAudioContext()
    if (!ctx || !sfxGain) return

    try {
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const filter = ctx.createBiquadFilter()

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(900, now)
      filter.frequency.exponentialRampToValueAtTime(140, now + 0.6)

      osc.type = 'sine'
      osc.frequency.setValueAtTime(320, now)
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.6)

      gain.gain.setValueAtTime(0.35, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(sfxGain)

      osc.start(now)
      osc.stop(now + 0.62)
    } catch {
      // Audio fallback
    }
  }

  // 6. Matrix Code Diff Toggle Arpeggio (Inspect Diff)
  function playDiffToggle(isOpen = true) {
    if (!isAudioEnabled.value) return
    const ctx = getAudioContext()
    if (!ctx || !sfxGain) return

    try {
      const now = ctx.currentTime
      const freqs = isOpen ? [580, 870, 1160] : [1100, 780, 480]

      freqs.forEach((freq, i) => {
        if (!ctx || !sfxGain) return
        const startTime = now + i * 0.04
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, startTime)

        gain.gain.setValueAtTime(0.16, startTime)
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.065)

        osc.connect(gain)
        gain.connect(sfxGain)

        osc.start(startTime)
        osc.stop(startTime + 0.07)
      })
    } catch {
      // Audio fallback
    }
  }

  return {
    isAudioEnabled,
    toggleAudio,
    setAudio,
    startAmbientMusic,
    stopAmbientMusic,
    playBorderLoad,
    playParticleShimmer,
    playHover,
    playClick,
    playSupernova,
    playDiffToggle,
  }
}
