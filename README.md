# &lt;A.BONFIGLIO/&gt; — Portfolio di Alessio Bonfiglio (Senior Frontend Developer & UI Architect)

[![Vue 3](https://img.shields.io/badge/Vue-3.5-42b883.svg?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646cff.svg?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8.svg?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

> Portfolio per sviluppatore moderno, ad alte prestazioni e a tema cyberpunk/space, sviluppato con **Vue 3**, **TypeScript**, **Tailwind CSS** e **SCSS**. Include animazioni particellari Canvas, sintetizzatore sonoro nativo con Web Audio API, cockpit/CLI interattivo ed un assistente AI Twin.

---

## 🤖 Filosofia di Sviluppo: "Human-Directed AI Engineering"

Questo intero repository e la sua base di codice sono stati sviluppati in pair-programming con un **Agente AI avanzato** (Google Antigravity / Gemini), **interamente progettato, guidato, supervisionato e vincolato da specifiche e requisiti ingegneristici umani**.

### 💡 Perché questo è rilevante per Recruiter, Tech Lead e Sviluppatori:
- **Padronanza del Dominio Tecnico**: Non è possibile guidare un agente AI verso codice di standard elevato senza possedere solide competenze di architettura frontend. Ogni decisione architetturale, token di design, fase di *Progressive Enhancement* e contratto TypeScript è stata richiesta e validata secondo standard senior di ingegneria del software.
- **Orchestrazione AI & Flussi Agentici**: Dimostra la capacità di adottare il moderno paradigma di **sviluppo software aumentato dall'AI** — attraverso file di regole persistenti (`AGENTS.md` / `GEMINI.md`), context engineering, verifiche passo-passo, commit convenzionali atomici e pulizia del codice, evitando codice non strutturato o generato alla cieca.
- **Zero Tolleranza per il Debito Tecnico**: Chiara separazione delle responsabilità, tipizzazione centralizzata (`src/types/portfolio.ts`), componenti modulari riutilizzabili e pipeline di linting/formattazione a zero errori.

---

## ⚙️ Stack Tecnologico & Architettura

- **Core**: [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`)
- **Linguaggio**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [SCSS](https://sass-lang.com/) (`sass-embedded`)
- **Icone & Utility**: [Lucide Vue Next](https://lucide.dev/), [@vueuse/core](https://vueuse.org/), `canvas-confetti`
- **Qualità del Codice**: ESLint 9 (Flat Config) + Prettier
- **Automazione Release**: Conventional Commits + generazione automatica del changelog
- **DevOps**: `Dockerfile` multi-stage (Node 20 Alpine ➔ Nginx Alpine con compressione gzip e security headers) + `docker-compose.yml`

---

## 🚀 Strategia di Sviluppo: Progressive Enhancement

Lo sviluppo segue rigorosamente una suddivisione a **due fasi incrementali**:

1. **Fase 1 — Struttura Pulita & Architettura Semantica (Clean Foundation)**:
   - Data Layer centralizzato e tipizzato (`src/data/portfolio.ts` & `src/types/portfolio.ts`).
   - HTML5 semantico, accessibile e responsive (Desktop-First con supporto completo mobile).
   - Componenti UI base riutilizzabili (`AppButton`, `AppBadge`, `AppCard`, `SectionHeader`).
   - Header globale, Ticker Marquee a scorrimento e sezioni principali (Hero, Stack, Progetti, Esperienza, Contatti).

2. **Fase 2 — Interattività & Effetti Sensoriali ("Superpoteri")**:
   - **Canvas Hyperspace Warp & Glyphs**: Rete particellare 2D interattiva sensibile a mouse e click.
   - **Sintetizzatore Web Audio API**: Generatore sonoro nativo del browser per feedback su hover e click (zero file audio esterni da scaricare).
   - **Cockpit CLI & Terminale Interattivo**: Shell nel browser con esecuzione comandi reali e tab di configurazione.
   - **3D Tilt Engine**: Prospettiva 3D interattiva sulle card con mirini HUD in stile sci-fi e glassmorphism.
   - **Widget Chat AI Twin**: Finestra di chat galleggiante per rispondere a domande su stack, background e disponibilità.

---

## 🌿 Git Flow & Standard di Progetto

- **Modello dei Branch**:
  - `main`: Branch di produzione (protetto).
  - `develop`: Branch centrale di sviluppo e integrazione.
  - `feat/*`, `fix/*`, `chore/*`: Feature branch dedicati aperti da `develop` e integrati tramite Pull Request con template dedicato ([`.github/PULL_REQUEST_TEMPLATE.md`](.github/PULL_REQUEST_TEMPLATE.md)).
- **Conventional Commits**: Messaggi di commit atomici in inglese su singola riga (`feat: ...`, `fix: ...`, `chore: ...`).
- **Automated Changelog**: Generato automaticamente tramite `yarn changelog`.

---

## 🛠️ Guida all'Avvio

### Prerequisiti
- Node.js `>= 20.x`
- Yarn `>= 1.22.x` (oppure npm / pnpm)
- Docker & Docker Compose *(opzionale, per la preview di produzione)*

### Installazione & Sviluppo Locale

```bash
# Clona il repository
git clone https://github.com/bonfiglioalessio/portfolio.git
cd portfolio

# Installa le dipendenze
yarn install

# Avvia il server di sviluppo con Vite
yarn dev
```

L'applicazione sarà accessibile in locale su `http://localhost:5173`.

### Script di Qualità e Build

```bash
# Controllo tipi TypeScript e build di produzione
yarn build

# Anteprima locale della build
yarn preview

# Linting automatico con ESLint
yarn lint

# Formattazione del codice con Prettier
yarn format

# Aggiornamento automatico del CHANGELOG.md
yarn changelog
```

### Preview di Produzione con Docker

```bash
# Costruisci e avvia il container ottimizzato Nginx
docker-compose up --build
```

L'anteprima Nginx di produzione sarà accessibile su `http://localhost:8080`.

---

## 👤 Autore

**Alessio Bonfiglio**
- Ruolo: Software Engineer @ **iliad** | Ex **AdKaora (Mondadori Media)**
- GitHub: [@bonfiglioalessio](https://github.com/bonfiglioalessio)
- LinkedIn: [Alessio Bonfiglio](https://www.linkedin.com/in/alessio-bonfiglio/)
- Email: [bonfi.alessio98@gmail.com](mailto:bonfi.alessio98@gmail.com)

---

## 📄 Licenza

Questo progetto è distribuito sotto licenza [MIT](LICENSE).
