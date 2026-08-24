import { ref } from 'vue'
import { useAudioSynth } from './useAudioSynth'

export interface CliEntry {
  id: string
  type: 'input' | 'output' | 'error' | 'system' | 'matrix'
  text?: string
  html?: string
}

export function useCliEngine() {
  const { playClick, playDiffToggle, playSupernova, toggleAudio, isAudioEnabled } = useAudioSynth()

  const entries = ref<CliEntry[]>([
    {
      id: 'init-1',
      type: 'system',
      html: `<div class="space-y-0.5">
        <div class="text-slate-400 font-mono">// Interactive CLI environment ready.</div>
        <div class="text-lime-400 font-mono flex items-center gap-1.5 flex-wrap">
          <span>&gt; Type</span>
          <span class="text-white font-bold bg-dark-900 px-1.5 py-0.2 rounded border border-lime-400/30">help</span>
          <span>for commands or click quick actions below.</span>
        </div>
      </div>`,
    },
  ])

  const history = ref<string[]>([])
  const historyIndex = ref<number>(-1)
  const currentInput = ref('')

  const COMMAND_LIST = [
    'help',
    'skills',
    'experience',
    'projects',
    'spark',
    'sudo hire',
    'clear',
    'audio',
    'matrix',
    'whoami',
    'contact',
  ]

  function handleAutoComplete(input: string): string {
    const trimmed = input.trim().toLowerCase()
    if (!trimmed) return input

    const match = COMMAND_LIST.find((cmd) => cmd.startsWith(trimmed))
    if (match) {
      playClick()
      return match
    }
    return input
  }

  function navigateHistory(direction: 'up' | 'down'): string {
    if (history.value.length === 0) return currentInput.value

    if (direction === 'up') {
      if (historyIndex.value === -1) {
        historyIndex.value = history.value.length - 1
      } else if (historyIndex.value > 0) {
        historyIndex.value--
      }
    } else if (direction === 'down') {
      if (historyIndex.value !== -1) {
        if (historyIndex.value < history.value.length - 1) {
          historyIndex.value++
        } else {
          historyIndex.value = -1
          return ''
        }
      }
    }

    if (historyIndex.value >= 0 && historyIndex.value < history.value.length) {
      playClick()
      return history.value[historyIndex.value]
    }

    return currentInput.value
  }

  function executeCommand(rawCommand: string) {
    const trimmed = rawCommand.trim()
    if (!trimmed) return

    playClick()

    // Add user input entry
    entries.value.push({
      id: `in-${Date.now()}-${Math.random()}`,
      type: 'input',
      text: trimmed,
    })

    // Store in history
    history.value.push(trimmed)
    historyIndex.value = -1

    const lower = trimmed.toLowerCase()

    switch (lower) {
      case 'help':
        entries.value.push({
          id: `out-${Date.now()}`,
          type: 'output',
          html: `<div class="text-slate-300 font-mono text-[11px] leading-relaxed">
            Available commands: <span class="text-lime-400 font-bold">skills</span>, <span class="text-lime-400 font-bold">experience</span>, <span class="text-lime-400 font-bold">projects</span>, <span class="text-lime-400 font-bold">spark</span>, <span class="text-lime-400 font-bold">sudo hire</span>, <span class="text-lime-400 font-bold">clear</span>
          </div>`,
        })
        break

      case 'skills':
      case 'stack':
        entries.value.push({
          id: `out-${Date.now()}`,
          type: 'output',
          html: `<div class="space-y-1 text-[11px] font-mono text-slate-300">
            <div class="text-lime-400 font-bold">⚡ TECHNICAL SKILLS:</div>
            <div>&bull; <strong class="text-slate-200">Core:</strong> Vue 3, React, TypeScript, Next.js, Angular</div>
            <div>&bull; <strong class="text-slate-200">Styling &amp; Motion:</strong> TailwindCSS, SCSS, Canvas 3D</div>
            <div>&bull; <strong class="text-slate-200">AI Engineering:</strong> Agentic Workflows, Multi-Agent Prompts, LLM Tools</div>
            <div>&bull; <strong class="text-slate-200">Platform:</strong> Vite, Web Audio API, Docker, CI/CD, 60fps Optimization</div>
          </div>`,
        })
        break

      case 'experience':
      case 'exp':
      case 'career':
        entries.value.push({
          id: `out-${Date.now()}`,
          type: 'output',
          html: `<div class="space-y-1 text-[11px] font-mono text-slate-300">
            <div class="text-lime-400 font-bold">🛰️ CAREER MISSIONS:</div>
            <div>&bull; <span class="text-lime-300 font-bold">2023 — Present:</span> Software Engineer @ <strong class="text-white">iliad</strong> (Milano &amp; Remote)</div>
            <div>&bull; <span class="text-slate-300 font-bold">2020 — 2023:</span> Frontend Developer @ <strong class="text-white">AdKaora (Mondadori Media)</strong></div>
            <div>&bull; <span class="text-slate-400 font-bold">2017 — 2020:</span> Origins • Liceo Artistico Multimediale (Sanremo)</div>
          </div>`,
        })
        break

      case 'projects':
      case 'work':
        entries.value.push({
          id: `out-${Date.now()}`,
          type: 'output',
          html: `<div class="space-y-1 text-[11px] font-mono text-slate-300">
            <div class="text-lime-400 font-bold">🚀 SELECTED WORK:</div>
            <div>01. <strong class="text-white">snorlax-toodo</strong> &bull; Task manager with Pinia &amp; Tailwind</div>
            <div>02. <strong class="text-white">weather-app</strong> &bull; Real-time OpenWeather dashboard</div>
            <div>03. <strong class="text-white">unique-photography</strong> &bull; Curated Unsplash visual showcase</div>
            <div>04. <strong class="text-white">bonfiglio.dev</strong> &bull; Interactive 60fps portfolio with Web Audio</div>
          </div>`,
        })
        break

      case 'contact':
        entries.value.push({
          id: `out-${Date.now()}`,
          type: 'output',
          html: `<div class="space-y-1 text-slate-300 font-mono text-[11px]">
            <div class="text-lime-400 font-bold">📬 DIRECT COMMUNICATIONS:</div>
            <div>&bull; Email: <a href="mailto:bonfi.alessio98@gmail.com" class="text-lime-300 underline font-bold">bonfi.alessio98@gmail.com</a></div>
            <div>&bull; GitHub: <a href="https://github.com/bonfiglioalessio" target="_blank" class="text-lime-300 underline">github.com/bonfiglioalessio</a></div>
            <div>&bull; LinkedIn: <a href="https://www.linkedin.com/in/alessio-bonfiglio/" target="_blank" class="text-lime-300 underline">linkedin.com/in/alessio-bonfiglio</a></div>
          </div>`,
        })
        break

      case 'sudo hire':
      case 'hire':
        playDiffToggle(true)
        entries.value.push({
          id: `out-${Date.now()}`,
          type: 'output',
          html: `<div class="p-2 rounded-lg bg-lime-400/10 border border-lime-400/40 text-slate-200 space-y-1 font-mono text-[11px]">
            <div class="text-lime-400 font-bold">🚀 [ROOT ACCESS GRANTED]</div>
            <div>Alessio Bonfiglio is available for Senior Frontend &amp; AI Engineering missions.</div>
            <div class="pt-0.5">
              Direct Transmission: <a href="mailto:bonfi.alessio98@gmail.com?subject=Collaboration%20Opportunity" class="text-lime-300 underline font-bold">bonfi.alessio98@gmail.com</a>
            </div>
          </div>`,
        })
        break

      case 'spark':
      case 'supernova':
        playSupernova()
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('space-supernova-event'))
        }
        entries.value.push({
          id: `out-${Date.now()}`,
          type: 'output',
          html: `<div class="text-emerald-400 font-bold font-mono text-[11px] drop-shadow-[0_0_8px_#10b981]">
            💥 [SUPERNOVA DETONATED] 3D Cosmic shockwave ignited across the starfield!
          </div>`,
        })
        break

      case 'matrix':
        entries.value.push({
          id: `out-${Date.now()}`,
          type: 'matrix',
          html: `<div class="font-mono text-emerald-400 text-[10px] leading-tight space-y-0.5 animate-pulse">
            <div>01000001 01101100 01100101 01110011 01110011 01101001 01101111</div>
            <div>&gt; SYSTEM BREACH: 60fps rendering unlocked.</div>
            <div>&gt; AGENTIC PIPELINE: Multi-agent synchronized.</div>
          </div>`,
        })
        break

      case 'audio':
        toggleAudio()
        entries.value.push({
          id: `out-${Date.now()}`,
          type: 'output',
          html: `<div class="text-lime-400 font-bold font-mono text-[11px]">
            🔊 AUDIO STATUS: [${isAudioEnabled.value ? 'ONLINE / PLAYING' : 'MUTED'}]
          </div>`,
        })
        break

      case 'whoami':
        entries.value.push({
          id: `out-${Date.now()}`,
          type: 'output',
          html: `<div class="text-slate-200 font-mono text-[11px]">
            <span class="text-lime-400 font-bold">alessio.bonfiglio</span> (Senior Frontend Engineer @ iliad)
          </div>`,
        })
        break

      case 'clear':
        entries.value = [
          {
            id: `init-${Date.now()}`,
            type: 'system',
            html: `<div class="space-y-0.5">
              <div class="text-slate-400 font-mono">// Interactive CLI environment ready.</div>
              <div class="text-lime-400 font-mono flex items-center gap-1.5 flex-wrap">
                <span>&gt; Type</span>
                <span class="text-white font-bold bg-dark-900 px-1.5 py-0.2 rounded border border-lime-400/30">help</span>
                <span>for commands or click quick actions below.</span>
              </div>
            </div>`,
          },
        ]
        break

      default:
        entries.value.push({
          id: `err-${Date.now()}`,
          type: 'error',
          text: `Command not found: '${trimmed}'. Type 'help' for available commands.`,
        })
        break
    }
  }

  return {
    entries,
    currentInput,
    executeCommand,
    handleAutoComplete,
    navigateHistory,
  }
}
