import type { PortfolioData } from '../types/portfolio'

export const portfolioData: PortfolioData = {
  profile: {
    name: 'Alessio Bonfiglio',
    displayLogo: 'A.BONFIGLIO',
    role: 'Senior Frontend Engineer & UI Architect',
    headline: 'Turning complex logic into insane frontend UI.',
    badge: 'Software Engineer @ iliad',
    currentCompany: 'iliad',
    companyUrl: 'https://www.iliad.it/',
    location: 'Milano & Remote',
    level: '>_ LEVEL 06 DEVELOPER',
    bio: "Nato a Sanremo ('98) con la fissa per il codice dal liceo artistico multimediale. Oggi sviluppo interfacce critiche ad altissimo traffico tra iliad e Mondadori Media. 6+ anni sul campo e la stessa fame di spingere ogni singolo rendering al limite.",
    stats: [
      {
        label: 'Experience',
        value: 6,
        prefix: '',
        suffix: '+ YRS',
        description: 'Anni di esperienza professionale in produzione',
      },
      {
        label: 'Passion Index',
        value: 100,
        prefix: '',
        suffix: '%',
        description: 'Dedizione a DX, UI architetture e dettagli visivi',
      },
      {
        label: 'Smooth UI',
        value: 60,
        prefix: '~',
        suffix: 'fps',
        description: 'Rendering fluido a 60 frame per secondo',
      },
    ],
  },
  marqueeItems: [
    'FRONTEND DEVELOPER',
    'ILIAD & MONDADORI MEDIA',
    'REACT / VUE / NEXT / NUXT / ANGULAR',
    '6+ YEARS IN PRODUCTION',
    'UI ENGINEERING & 60FPS LOVER',
    "SANREMO '98",
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
        'Task management app minimal per la gestione rapida delle to-do list con sincronizzazione dello stato e persistenza locale.',
      stack: ['Preact', 'Redux', 'Material UI'],
      liveUrl: 'https://snorlax-toodo.netlify.app/',
      diff: {
        filename: 'state/snorlaxStore.ts',
        additions: 180,
        deletions: 42,
        highlights: [
          '+ Migrazione da React a Preact per ridurre il bundle a soli ~8KB gzip.',
          '+ Persistenza localStorage atomica con debounce a zero frame drop.',
        ],
      },
    },
    {
      id: 'weather-app',
      projectNumber: '02',
      title: 'Weather App',
      badge: 'live app',
      typeBadge: 'side project',
      description:
        'Semplice web app meteo con geolocalizzazione, grafici dinamici e previsioni real-time tramite OpenWeather API.',
      stack: ['React', 'Sass', 'Recharts'],
      liveUrl: 'https://bonfi-weather-app.netlify.app/',
      diff: {
        filename: 'api/forecastRadar.ts',
        additions: 310,
        deletions: 85,
        highlights: [
          '+ Integrazione API OpenWeather con caching in-memory su service worker.',
          '+ Visualizzazioni grafiche animate con Recharts su metriche a 60fps.',
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
      department: 'Core Platform Engineering',
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
      tags: ['TypeScript', 'React', 'Vue'],
    },
    {
      id: 'adkaora',
      missionNumber: 'MISSION // 02',
      role: 'Frontend Developer',
      company: 'AdKaora (Mondadori Media)',
      location: 'Milan, Italy',
      department: 'Digital Advertising, Editorial & Creative Engineering',
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
      tags: ['JavaScript ES6+', 'SCSS / SASS', 'HTML5 Canvas'],
    },
    {
      id: 'origins',
      missionNumber: 'MISSION // 03',
      role: 'Origins • Liceo Artistico Multimediale + Formazione Web',
      company: 'Origins',
      location: 'Sanremo, Italy',
      period: '2017 — 2020',
      commitHash: 'init_root',
      description:
        'Il punto di partenza: basi visive, composizione grafica e la prima ossessione per il codice web trasformata in 6+ anni di sviluppo professionale sul campo.',
      tags: ['Visual Design', 'Web Foundations', 'Creative Coding'],
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
}
