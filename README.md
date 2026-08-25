# &lt;A.BONFIGLIO/&gt; — Next-Gen Cyber Frontend Architecture Portfolio

[![Deploy to GitHub Pages](https://github.com/bonfiglioalessio/bonfiglioalessio.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/bonfiglioalessio/bonfiglioalessio.github.io/actions/workflows/deploy.yml)
[![Vue 3](https://img.shields.io/badge/Vue-3.5-42b883.svg?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646cff.svg?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8.svg?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

> Portfolio per sviluppatore moderno ad alte prestazioni e architettura cyberpunk/deep-space. Sviluppato con **Vue 3.5**, **TypeScript**, **Tailwind CSS** e **SCSS**. Include animazioni particellari 3D in Canvas, sintetizzatore sonoro procedurale a 0-byte (Web Audio API), cockpit/CLI interattivo, data store disaccoppiato in JSON e pipeline CI/CD su GitHub Pages.

🌐 **Live Demo**: [https://bonfiglioalessio.github.io/](https://bonfiglioalessio.github.io/)

---

## 🤖 Filosofia di Sviluppo: "Human-Directed AI Engineering"

Questo intero repository e la sua base di codice sono stati sviluppati in pair-programming con un **Agente AI avanzato** (Google Antigravity / Gemini), **interamente progettato, guidato, supervisionato e vincolato da specifiche e requisiti ingegneristici umani**.

### 💡 Perché questo è rilevante per Recruiter, Tech Lead e Sviluppatori:
- **Padronanza del Dominio Tecnico**: Non è possibile guidare un agente AI verso codice di standard elevato senza possedere solide competenze di architettura frontend. Ogni decisione architetturale, token di design, fase di *Progressive Enhancement* e contratto TypeScript è stata richiesta e validata secondo standard senior di ingegneria del software.
- **Orchestrazione AI & Flussi Agentici**: Dimostra la capacità di adottare il moderno paradigma di **sviluppo software aumentato dall'AI** — attraverso file di regole persistenti (`AGENTS.md` / `GEMINI.md`), context engineering, verifiche passo-passo, commit convenzionali atomici e pulizia del codice, evitando codice non strutturato o generato alla cieca.
- **Zero Tolleranza per il Debito Tecnico**: Chiara separazione delle responsabilità, tipizzazione centralizzata (`src/types/portfolio.ts`), data layer reattivo disaccoppiato (`public/data/portfolio.json`), componenti modulari riutilizzabili e pipeline di linting/formattazione a zero errori.

---

## ⚙️ Stack Tecnologico & Architettura

- **Core**: [Vue 3.5](https://vuejs.org/) (Composition API, `<script setup>`)
- **Linguaggio**: [TypeScript 5.7](https://www.typescriptlang.org/) (Strict Mode)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/) + [SCSS](https://sass-lang.com/) (`sass-embedded`)
- **Data Layer Disaccoppiato**: JSON Store dinamico (`public/data/portfolio.json`) con composable reattivo `usePortfolioData.ts` e fallback offline istantaneo
- **Icone & Utility**: [Lucide Vue Next](https://lucide.dev/), [@vueuse/core](https://vueuse.org/)
- **Audio Engine**: Procedurale a 0-byte via Web Audio API nativa (`useAudioSynth.ts`)
- **Qualità del Codice**: ESLint 9 (Flat Config) + Prettier
- **Automazione Release**: Conventional Commits + generazione automatica del changelog (`CHANGELOG.md`)
- **CI/CD & Deploy**: GitHub Actions con deploy automatico di produzione su GitHub Pages
- **Container**: `Dockerfile` multi-stage (Node 20 Alpine ➔ Nginx Alpine con compressione gzip e security headers) + `docker-compose.yml`

---

## 🚀 Architettura & Feature Principali

1. **SpaceCanvas 3D Perspective & Starfield**:
   - Rete particellare 2D/3D interattiva sensibile al mouse con coordinate orbitali z, drifting armonico, costellazioni spaziali, sciami meteorici e onde d'urto supernova al click.
   - Page Visibility API integrata: pausa automatica a 0% CPU/GPU quando la scheda non è attiva.
   - Capped DPR (1.5x max) e calcoli di distanza quadratica ($dx^2 + dy^2$) per 60–120 FPS granitici.

2. **Sintetizzatore Sonoro Procedurale (Web Audio API)**:
   - Zero file audio esterni da scaricare (0 KB di banda per il sonoro).
   - Generazione di toni sinusoidali, frequenze FM, rumore bianco filtrato e riverberi cyberpunk per hover, click, digitazione CLI e supernova.

3. **Hero Satellite Cockpit & Shell CLI Interattiva**:
   - Hardware assembly 3D con reattività al movimento del mouse (`use3DTilt.ts`).
   - Terminale shell eseguibile (`help`, `bio`, `skills`, `projects`, `clear`, ecc.) con storico comandi.
   - Streaming typewriter con algoritmo di Ghost Layout Lock per azzerare il layout shift (**CLS = 0.00**).

4. **Tech Constellation**:
   - Cluster di competenze organizzati per domini (Framework, Architecture, DevOps, UI Engineering, AI Orchestration).
   - Card interattive con spotlight cursore e animazioni radar.
   - Dock a 4 settori responsive per smartphone con navigazione swipe.

5. **Selected Work con Code Diff Terminal**:
   - Vetrina progetti a 2 colonne sfalsate con spectrum theming.
   - Terminale interattivo `[+] inspect diff` per ispezionare architettura, modifiche e codice sorgente reale di ogni progetto.
   - Swipe carousel nativo per dispositivi mobile con indicatori di stato.

6. **Career Mission Log**:
   - Timeline continua con raggio laser neon sincronizzato allo scroll progressivo (`useScrollReveal.ts`).
   - Card interattive con focus-aware dimming e metadati di produzione.

7. **Direct Transmission & Magnetic Assist**:
   - Sezione contatti fullscreen con glide magnetico assistito verso il centro dello schermo.
   - Copia istantanea email con feedback sonoro e link di contatto diretti.

---

## 🌿 Git Flow & Standard di Progetto

- **Modello dei Branch**:
  - `main`: Branch di produzione (protetto).
  - `develop`: Branch centrale di sviluppo e integrazione.
  - `feat/*`, `fix/*`, `chore/*`, `perf/*`: Feature branch dedicati aperti da `develop` e integrati tramite Pull Request con template dedicato ([`.github/PULL_REQUEST_TEMPLATE.md`](.github/PULL_REQUEST_TEMPLATE.md)).
- **Conventional Commits**: Messaggi di commit atomici in inglese su singola riga (`feat: ...`, `fix: ...`, `chore: ...`, `perf: ...`).
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
git clone https://github.com/bonfiglioalessio/bonfiglioalessio.github.io.git
cd bonfiglioalessio.github.io

# Installa le dipendenze
yarn install

# Avvia il server di sviluppo con Vite
yarn dev
```

L'applicazione sarà accessibile in locale su `http://localhost:3000`.

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
- Ruolo: Senior Frontend Engineer & UI Architect @ **iliad** | Ex **AdKaora (Mondadori Media)**
- Sito Web: [bonfiglioalessio.github.io](https://bonfiglioalessio.github.io/)
- GitHub: [@bonfiglioalessio](https://github.com/bonfiglioalessio)
- LinkedIn: [Alessio Bonfiglio](https://www.linkedin.com/in/alessio-bonfiglio/)
- Email: [bonfi.alessio98@gmail.com](mailto:bonfi.alessio98@gmail.com)

---

## 📄 Licenza

Questo progetto è distribuito sotto licenza [MIT](LICENSE).
