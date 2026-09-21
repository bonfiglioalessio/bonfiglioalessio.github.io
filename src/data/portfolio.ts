import type { PortfolioData } from '../types/portfolio'

export const portfolioData: PortfolioData = {
  profile: {
    name: 'Alessio Bonfiglio',
    displayLogo: 'A.BONFIGLIO',
    role: 'Frontend Engineer & UI Architect',
    headline: 'Turning complex logic into insane frontend UI.',
    badge: 'Software Engineer @ iliad',
    currentCompany: 'iliad',
    companyUrl: 'https://www.iliad.it/',
    location: 'Milano & Remote',
    level: '>_ FRONTEND ENGINEER & ARCHITECT',
    bio: "Nato a Sanremo ('98), oggi di base a Milano. Da 6+ anni sviluppo per il web muovendomi su due binari: nel contesto enterprise affronto codebase complesse ed ereditate per modernizzarle, ridurre il debito tecnico e garantire stabilità ad alto carico; nel mio lab personale coltivo la passione per il creative frontend, le architetture moderne e l'AI pair-programming.",
    stats: [
      {
        label: 'Experience',
        value: 6,
        prefix: '',
        suffix: '+ YRS',
        description: 'Anni sul campo tra contesti enterprise ad alto traffico e lab creativo',
      },
      {
        label: 'Clean Architecture',
        value: 100,
        prefix: '',
        suffix: '%',
        description: 'Focus su modularità, riduzione del debito tecnico e DX',
      },
      {
        label: 'Smooth UI',
        value: 60,
        prefix: '~',
        suffix: 'fps',
        description: 'Esperienze fluide, accessibilità e cura dei dettagli visivi',
      },
    ],
  },
  sections: {
    stack: {
      sectionNumber: '01',
      title: 'Technical Constellation',
      statusBadge: '● 4 CORE DOMAINS',
      description:
        'Stack primario e strumenti adoperati quotidianamente in produzione. Ogni modulo rappresenta un cluster specializzato.',
    },
    projects: {
      sectionNumber: '02',
      title: 'Selected Work',
      statusBadge: '● 4 SELECTED PROJECTS',
      description:
        'Una selezione di side project ed esperimenti passati. Clicca su [+] inspect diff per visualizzare architettura e dettagli di codice.',
    },
    experience: {
      sectionNumber: '03',
      title: 'Career Mission Log',
      statusBadge: '● 3 MILESTONES',
      description:
        'Percorso professionale e milestone di produzione in ambito telco e media publishing.',
    },
    contact: {
      sectionNumber: '04',
      title: 'Direct Transmission',
      statusBadge: '● DIRECT DISPATCH',
      description:
        'Canale di contatto diretto per collaborazioni, refactoring enterprise, architetture frontend moderne e nuove opportunità.',
    },
  },
  marqueeItems: [
    'FRONTEND ENGINEER',
    'ILIAD & MONDADORI MEDIA',
    'JAVASCRIPT & TYPESCRIPT FRAMEWORKS',
    'ENTERPRISE REFACTORING & CLEAN ARCHITECTURE',
    'CREATIVE WEB & AI PAIR-PROGRAMMING',
    "SANREMO '98 ➔ MILANO",
  ],
  skillsConstellation: [
    {
      clusterNumber: '#01',
      title: 'Frameworks & Architecture',
      skills: [
        {
          name: 'React & Next',
          description: 'Hooks, SSR, App Router & State Sync',
          badge: 'CORE',
          badgeVariant: 'core',
          iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
        },
        {
          name: 'Vue & Nuxt',
          description: 'Composition API, Pinia & SSR',
          badge: 'CORE',
          badgeVariant: 'core',
          iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
        },
        {
          name: 'Angular',
          description: 'Components, RxJS, Signals & DI',
          badge: 'STACK',
          badgeVariant: 'stack',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
        },
      ],
    },
    {
      clusterNumber: '#02',
      title: 'Languages & Type-Safety',
      skills: [
        {
          name: 'TypeScript',
          description: 'Strict Types & Generic Models',
          badge: 'SAFE',
          badgeVariant: 'safe',
          customIconText: 'TS',
          iconBgColor: '#3178c6',
          iconTextColor: '#ffffff',
        },
        {
          name: 'JavaScript',
          description: 'ES6+, DOM & Async Flow',
          badge: 'CORE',
          badgeVariant: 'core',
          customIconText: 'JS',
          iconBgColor: '#fbbf24',
          iconTextColor: '#000000',
        },
        {
          name: 'HTML5 & a11y',
          description: 'Semantic & Screen-readers',
          badge: 'BASE',
          badgeVariant: 'base',
          iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
        },
      ],
    },
    {
      clusterNumber: '#03',
      title: 'Styling & Tooling',
      skills: [
        {
          name: 'TailwindCSS',
          description: 'Design Tokens & Fluid UI',
          badge: 'CSS',
          badgeVariant: 'css',
          iconUrl:
            'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
        },
        {
          name: 'SCSS / SASS',
          description: 'Architecture, Mixins & BEM',
          badge: 'PRE',
          badgeVariant: 'pre',
          iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg',
        },
        {
          name: 'Git & Workflows',
          description: 'Branching & CI/CD Pipelines',
          badge: 'VCS',
          badgeVariant: 'vcs',
          iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
        },
      ],
    },
    {
      clusterNumber: '#04',
      title: 'AI & Agentic Engineering',
      skills: [
        {
          name: 'Anthropic Claude',
          description: 'Context & Architecture',
          badge: 'AI',
          badgeVariant: 'amber',
          iconUrl: '/icons/claude.svg',
        },
        {
          name: 'Google Gemini',
          description: 'Agentic Workflows & Pair Coding',
          badge: 'AI',
          badgeVariant: 'cyan',
          iconUrl: '/icons/gemini.svg',
        },
        {
          name: 'Prompt & Rules',
          description: 'AGENTS.md & Strict Guidelines',
          badge: 'AGENT',
          badgeVariant: 'safe',
          iconUrl: '/icons/agents.svg',
        },
      ],
    },
  ],
  selectedWork: [
    {
      id: 'snorlax-toodo',
      projectNumber: '01',
      title: 'Snorlax Toodo!',
      badge: 'live app',
      typeBadge: 'side project',
      description:
        'To-Do application a tema Snorlax con tour interattivo, persistenza atomica tramite Zustand, drag & drop delle task, sistema di priorità ed animazioni celebrative.',
      stack: ['Preact', 'TypeScript', 'Vite', 'Zustand', 'Material UI'],
      liveUrl: 'https://snorlax-toodo.netlify.app/',
      repoUrl: 'https://github.com/bonfiglioalessio/SnorlaxToodo',
      diff: {
        filename: 'src/store/useTodoStore.ts',
        additions: 145,
        deletions: 56,
        highlights: [
          '+ Migrazione dello store globale a Zustand con middleware di persistenza automatica.',
          '+ Architettura ultra-lightweight con Preact (~3KB) e componenti Material-UI.',
        ],
        codeLines: [
          {
            type: 'context',
            lineNum: 1,
            code: 'import { create } from "zustand"',
          },
          {
            type: 'del',
            lineNum: 2,
            code: '- import { configureStore } from "@reduxjs/toolkit"',
          },
          {
            type: 'add',
            lineNum: 2,
            code: '+ import { persist } from "zustand/middleware"',
          },
          {
            type: 'context',
            lineNum: 10,
            code: 'export const useTodoStore = create<TodoState>()(',
          },
          {
            type: 'add',
            lineNum: 11,
            code: '+   persist((set) => ({',
          },
          {
            type: 'add',
            lineNum: 12,
            code: '+     todos: DEFAULT_TODOS,',
          },
          {
            type: 'add',
            lineNum: 13,
            code: '+     toggleTodo: (id) => set((s) => ({ todos: s.todos.map(...) })),',
          },
          {
            type: 'add',
            lineNum: 14,
            code: '+   }), { name: "snorlax-toodo-storage" })',
          },
          { type: 'context', lineNum: 15, code: ')' },
        ],
      },
    },
    {
      id: 'castform-weather',
      projectNumber: '02',
      title: 'Castform Weather',
      badge: 'live app',
      typeBadge: 'side project',
      description:
        'Web app meteo in tempo reale in stile visionOS / Apple Weather con design glassmorphic, previsioni orarie e a 7 giorni con Recharts e mascotte Castform (#351) interattiva.',
      stack: ['React', 'TypeScript', 'Vite', 'Sass', 'Recharts', 'OpenWeather API'],
      liveUrl: 'https://castform-weathers.netlify.app/',
      repoUrl: 'https://github.com/bonfiglioalessio/castform-weather',
      diff: {
        filename: 'src/components/CastformMascot.tsx',
        additions: 245,
        deletions: 38,
        highlights: [
          '+ Mascotte interattiva Castform (#351) con 4 forme climatiche e Web Audio SFX.',
          '+ Grafici di temperatura orari e previsioni a 7 giorni con Recharts a 60fps.',
        ],
        codeLines: [
          {
            type: 'context',
            lineNum: 18,
            code: 'export const CastformMascot: FC<CastformProps> = ({ weather }) => {',
          },
          {
            type: 'del',
            lineNum: 19,
            code: '-   const icon = getWeatherIcon(weather.main)',
          },
          {
            type: 'add',
            lineNum: 19,
            code: '+   const form = useMemo(() => getCastformForm(weather), [weather])',
          },
          {
            type: 'add',
            lineNum: 20,
            code: '+   const playCry = () => playCastformAudio(form)',
          },
          {
            type: 'context',
            lineNum: 21,
            code: '    return (',
          },
          {
            type: 'add',
            lineNum: 22,
            code: '+     <div className={`castform-card form-${form}`} onClick={playCry}>',
          },
          {
            type: 'add',
            lineNum: 23,
            code: '+       <ParticleEffect type={form} />',
          },
          {
            type: 'context',
            lineNum: 24,
            code: '        <img src={`/castform-${form}.svg`} alt="Castform" />',
          },
          { type: 'context', lineNum: 25, code: '      </div>' },
        ],
      },
    },
    {
      id: 'unique-photography',
      projectNumber: '03',
      title: 'Unique Photography',
      badge: 'live demo',
      typeBadge: 'side project',
      description:
        'Esperimento di portfolio fotografico collegato a Contentful headless CMS tramite query GraphQL.',
      stack: ['Next.js', 'GraphQL', 'Tailwind'],
      liveUrl: 'https://unique-contentful.netlify.app/',
      diff: {
        filename: 'lib/graphql/contentful.ts',
        additions: 540,
        deletions: 110,
        highlights: [
          '+ Query frammentate per asset AVIF ad alta risoluzione con lazy load progressivo.',
          '+ Static Site Generation (SSG) su Next.js con rigenerazione incrementale.',
        ],
        codeLines: [
          { type: 'context', lineNum: 8, code: 'export const GET_GALLERY_ASSETS = gql`' },
          {
            type: 'del',
            lineNum: 9,
            code: '-   query { photoCollection { items { url, title } } }',
          },
          { type: 'add', lineNum: 9, code: '+   query GetOptimizedPhotos($locale: String!) {' },
          { type: 'add', lineNum: 10, code: '+     photoCollection(locale: $locale) {' },
          {
            type: 'add',
            lineNum: 11,
            code: '+       items { url(transform: { format: AVIF, quality: 85 }) }',
          },
          { type: 'context', lineNum: 12, code: '    }' },
          { type: 'context', lineNum: 13, code: '  }' },
        ],
      },
    },
    {
      id: 'bonfiglio-dev',
      projectNumber: '04',
      title: 'bonfiglio.dev',
      badge: 'active repo',
      typeBadge: 'portfolio',
      description:
        'Questo portfolio personale sviluppato con architettura modulare Vue 3, SCSS, CLI cockpit e design geeky.',
      stack: ['Vue 3', 'TailwindCSS', 'Canvas 2D', 'Web Audio'],
      isCurrentSite: true,
      diff: {
        filename: 'engine/webAudioSynth.ts',
        additions: 220,
        deletions: 15,
        highlights: [
          '+ Sintetizzatore Web Audio API puro integrato a zero byte di asset multimediali.',
          '+ Rendering isometrico 3D su Canvas con fisica a molla ed elasticità.',
        ],
        codeLines: [
          { type: 'context', lineNum: 42, code: 'export class AudioSynthEngine {' },
          { type: 'add', lineNum: 43, code: '+   private ctx: AudioContext | null = null' },
          { type: 'add', lineNum: 44, code: '+   playLaserBurst(freq = 880, decay = 0.12) {' },
          { type: 'add', lineNum: 45, code: '+     const osc = this.ctx.createOscillator()' },
          {
            type: 'add',
            lineNum: 46,
            code: '+     osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + decay)',
          },
          { type: 'context', lineNum: 47, code: '  }' },
          { type: 'context', lineNum: 48, code: '}' },
        ],
      },
    },
  ],
  careerMissionLog: [
    {
      id: 'iliad',
      missionNumber: 'MISSION // 01',
      role: 'Software Engineer',
      company: 'iliad',
      companyUrl: 'https://www.iliad.it/',
      location: 'Milan, Italy (Hybrid / Remote)',
      department: 'Software Engineering',
      period: 'July 2023 — Present',
      statusBadge: '● HEAD (DEPLOYED)',
      isCurrent: true,
      commitHash: '8a4f91b',
      description:
        'Sviluppo di applicazioni frontend enterprise, architetture modulari e interfacce critiche ad altissimo carico utenti.',
      diff: {
        filename: 'enterprise/frontend/iliad-core.ts',
        additions: 4820,
        deletions: 1150,
        highlights: [
          '+ [FEATURE] Implementazione di design system reattivi e architetture UI ad alta manutenibilità.',
          '+ [PERF] Ottimizzazione del rendering cross-device per flussi utente ad altissima frequenza.',
        ],
      },
      tags: ['Angular', 'TypeScript', 'SCSS', 'PHP', 'Vue', 'Nuxt'],
    },
    {
      id: 'adkaora',
      missionNumber: 'MISSION // 02',
      role: 'Frontend Developer',
      company: 'AdKaora (Mondadori Media)',
      companyUrl: 'https://adkaora.com/en',
      location: 'Milan, Italy',
      department: 'Frontend Development',
      period: 'July 2020 — July 2023',
      statusBadge: '3 YEARS MILESTONE',
      isCurrent: false,
      commitHash: '5e1c09a',
      description:
        'Creazione di formati interattivi custom ad alto impatto visivo e ottimizzazione rendering cross-browser per i principali brand editoriali italiani.',
      diff: {
        filename: 'src/interactive/creative-engine.js',
        additions: 12400,
        deletions: 3200,
        highlights: [
          '+ [ENGINE] Sviluppo di centinaia di template interattivi personalizzati (Canvas, animazioni CSS/JS).',
          '+ [OPTIMIZATION] Riduzione dei tempi di caricamento delle creative di oltre il 30%.',
        ],
      },
      tags: ['React', 'Next.js', 'TailwindCSS'],
    },
    {
      id: 'origins',
      missionNumber: 'MISSION // 03',
      role: 'Origins',
      company: 'Formazione Web & Design',
      location: 'Imperia, Italy ➔ Turin, Italy',
      department: 'Comics • Delpho • Liceo Artistico',
      period: '2012 — 2020',
      statusBadge: 'FOUNDATIONS',
      isCurrent: false,
      commitHash: 'init_root',
      description:
        'Il percorso formativo: dalla sensibilità visiva e compositiva del liceo artistico multimediale fino ai corsi intensivi di Web Design e Web Programming a Torino che hanno dato il via alla carriera.',
      diff: {
        filename: 'root/academic-foundations.ts',
        additions: 3,
        deletions: 0,
        highlights: [
          '+ [2020] [Delpho Didattica Informatica Torino](https://www.delpho.it/) — Web Programmer (JavaScript & Web Architecture)',
          '+ [2018 — 2019] [Scuola Internazionale di Comics Torino](https://scuolacomics.com/) — Web Design (HTML/CSS/JS, UI/UX & Responsive Web Design)',
          '+ [2012 — 2018] I.I.S Liceo Artistico Imperia — Sezione Multimediale (Visual Design, Fotografia & Video Editing)',
        ],
      },
      tags: ['JavaScript', 'PHP', 'HTML5 / CSS3', 'UI/UX Design', 'Figma', 'Web Programming', 'Visual Design'],
    },
  ],
  socialLinks: [
    {
      platform: 'Email',
      url: 'mailto:bonfi.alessio98@gmail.com',
      label: 'bonfi.alessio98@gmail.com',
      isMailto: true,
    },
    {
      platform: 'LinkedIn',
      url: 'https://www.linkedin.com/in/alessio-bonfiglio/',
      label: 'LinkedIn',
    },
    {
      platform: 'GitHub',
      url: 'https://github.com/bonfiglioalessio',
      label: 'GitHub',
    },
    {
      platform: 'Dev.to',
      url: 'https://dev.to/bonfiglioalessio',
      label: 'Dev.to',
    },
  ],
  contact: {
    headingPart1: "Let's build",
    headingPart2: 'something',
    headingPart3: 'extraordinary.',
    subtitle:
      'Se cerchi un Frontend Engineer con solida esperienza nei framework Javascript, capace di adattarsi al contesto aziendale, ridurre il debito tecnico e guidare il codice verso architetture moderne e strutturate senza rinunciare alla cura dei dettagli visivi, connettiamoci.',
    email: 'bonfi.alessio98@gmail.com',
    copyEmailPrefix: '$ copy:',
    copiedFeedbackText: 'COPIED TO CLIPBOARD',
  },
  footer: {
    statusText: 'SYS_STATUS: OPTIMAL',
    latencyText: 'LATENCY: <1ms',
    engineText: '60FPS ENGINE',
    attribution: 'ALESSIO BONFIGLIO // HUMAN-DIRECTED AI ENGINEERING',
    backToTopText: 'BACK_TO_TOP',
  },
}
