import { ref } from 'vue'
import { portfolioData } from '../data/portfolio'
import { useAudioSynth } from './useAudioSynth'

export interface CliEntry {
  id: string
  type: 'input' | 'output' | 'error' | 'system' | 'matrix'
  text?: string
  html?: string
  isStreaming?: boolean
}

export function useCliEngine() {
  const { playClick, playDiffToggle, playSupernova, toggleAudio, isAudioEnabled } = useAudioSynth()

  const entries = ref<CliEntry[]>([
    {
      id: 'init-1',
      type: 'system',
      html: `<div class="space-y-0.5">
        <div class="text-slate-400 font-mono">// Orbital Satellite Station v1.0 connected.</div>
        <div class="text-lime-400 font-mono flex items-center gap-1.5 flex-wrap">
          <span>&gt; Type</span>
          <span class="text-white font-bold bg-dark-900 px-1.5 py-0.2 rounded border border-lime-400/30">help</span>
          <span>or click quick telemetry actions below.</span>
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
    'contact',
    'supernova',
    'matrix',
    'audio',
    'whoami',
    'clear',
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

  // Typewriter streaming helper for HTML / Text outputs
  function pushStreamedOutput(
    lines: string[],
    wrapperClass = 'space-y-1 text-[11px] font-mono text-slate-300',
    type: 'output' | 'system' | 'matrix' = 'output',
  ) {
    const entryId = `out-${Date.now()}-${Math.random()}`
    const isReducedMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (isReducedMotion) {
      entries.value.push({
        id: entryId,
        type,
        html: `<div class="${wrapperClass}">${lines.join('')}</div>`,
      })
      return
    }

    // Interactive progressive typewriter line streaming
    const entry: CliEntry = {
      id: entryId,
      type,
      html: `<div class="${wrapperClass}">${lines[0] || ''}</div>`,
      isStreaming: true,
    }
    entries.value.push(entry)

    let currentLine = 1
    const interval = setInterval(() => {
      if (currentLine < lines.length) {
        const displayed = lines.slice(0, currentLine + 1).join('')
        entry.html = `<div class="${wrapperClass}">${displayed}</div>`
        currentLine++
      } else {
        entry.isStreaming = false
        clearInterval(interval)
      }
    }, 60)
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
        pushStreamedOutput(
          [
            `<div class="text-slate-300 font-mono text-[11px] leading-relaxed">
              Available commands: <span class="text-lime-400 font-bold">skills</span>, <span class="text-lime-400 font-bold">projects</span>, <span class="text-lime-400 font-bold">experience</span>, <span class="text-lime-400 font-bold">contact</span>, <span class="text-lime-400 font-bold">clear</span>
            </div>`,
          ],
          'space-y-0.5',
        )
        break

      case 'skills':
      case 'stack': {
        const skillLines = [
          `<div class="text-lime-400 font-bold">⚡ TECHNICAL SKILLS CONSTELLATION:</div>`,
          ...portfolioData.skillsConstellation.map(
            (c) =>
              `<div>&bull; <strong class="text-slate-200">${c.title}:</strong> ${c.skills.map((s) => s.name).join(', ')}</div>`,
          ),
        ]
        pushStreamedOutput(skillLines)
        break
      }

      case 'experience':
      case 'exp':
      case 'career': {
        const expLines = [
          `<div class="text-lime-400 font-bold">🛰️ CAREER MISSIONS:</div>`,
          ...portfolioData.careerMissionLog.map(
            (m) =>
              `<div>&bull; <span class="text-lime-300 font-bold">${m.period}:</span> ${m.role} @ <strong class="text-white">${m.company}</strong></div>`,
          ),
        ]
        pushStreamedOutput(expLines)
        break
      }

      case 'projects':
      case 'work':
      case 'explore':
      case 'explore_work': {
        const projectLines = [
          `<div class="text-lime-400 font-bold">🚀 SELECTED WORK &amp; EXPERIMENTS:</div>`,
          ...portfolioData.selectedWork.map(
            (p, idx) =>
              `<div>0${idx + 1}. <strong class="text-white">${p.title}</strong> &bull; ${p.description.slice(0, 52)}... <span class="text-slate-400">(${p.stack.join(', ')})</span></div>`,
          ),
        ]
        pushStreamedOutput(projectLines)
        break
      }

      case 'contact':
      case 'contact_me':
      case 'hire':
      case 'sudo hire': {
        playDiffToggle(true)
        const contactLines = [
          `<div class="text-lime-400 font-bold">📬 DIRECT TRANSMISSION CHANNEL:</div>`,
          `<div>${portfolioData.profile.name} &bull; ${portfolioData.profile.role}</div>`,
          ...portfolioData.socialLinks.map(
            (s) =>
              `<div>${s.platform}: <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="text-lime-300 underline font-bold">${s.label}</a></div>`,
          ),
        ]
        pushStreamedOutput(
          contactLines,
          'p-2 rounded-lg bg-lime-400/10 border border-lime-400/40 text-slate-200 space-y-1 font-mono text-[11px]',
        )
        break
      }

      case 'supernova':
        playSupernova()
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('space-supernova-event'))
        }
        pushStreamedOutput([
          `<div class="text-emerald-400 font-bold font-mono text-[11px] drop-shadow-[0_0_8px_#10b981]">
            💥 [SUPERNOVA DETONATED] 3D Cosmic shockwave ignited across the starfield!
          </div>`,
        ])
        break

      case 'matrix':
        pushStreamedOutput(
          [
            `<div>01000001 01101100 01100101 01110011 01110011 01101001 01101111</div>`,
            `<div>&gt; SYSTEM BREACH: 120Hz high-frequency rendering unlocked.</div>`,
            `<div>&gt; AGENTIC PIPELINE: Multi-agent synchronized.</div>`,
          ],
          'font-mono text-emerald-400 text-[10px] leading-tight space-y-0.5 animate-pulse',
          'matrix',
        )
        break

      case 'audio':
        toggleAudio()
        pushStreamedOutput([
          `<div class="text-lime-400 font-bold font-mono text-[11px]">
            🔊 AUDIO STATUS: [${isAudioEnabled.value ? 'ONLINE / PLAYING' : 'MUTED'}]
          </div>`,
        ])
        break

      case 'whoami':
        pushStreamedOutput([
          `<div class="text-slate-200 font-mono text-[11px]">
            <span class="text-lime-400 font-bold">${portfolioData.profile.name.toLowerCase().replace(' ', '.')}</span> (${portfolioData.profile.role} @ ${portfolioData.profile.currentCompany})
          </div>`,
        ])
        break

      case 'clear':
        entries.value = [
          {
            id: `init-${Date.now()}`,
            type: 'system',
            html: '<div class="text-slate-400 font-mono">// Terminal cleared. Satellite online. Type <span class="text-lime-400 font-bold">help</span>.</div>',
          },
        ]
        break

      default:
        entries.value.push({
          id: `err-${Date.now()}`,
          type: 'error',
          text: `zsh: command not found: ${trimmed}. Type 'help' for available commands.`,
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
