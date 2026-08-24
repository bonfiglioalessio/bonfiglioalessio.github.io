# Regole di Progetto e Linee Guida di Sviluppo

## 1. ⚙️ Stack Tecnologico & Architettura
- **Stack**: Vite + Vue 3 (Composition API / `<script setup>`) + TypeScript + Tailwind CSS + **SCSS** (`sass-embedded`).
- **Filosofia di sviluppo (Progressive Enhancement)**:
  - *Fase 1*: Struttura solida, HTML semantico, accessibilità, responsive design e componenti base.
  - *Fase 2*: Interazioni avanzate, animazioni e "superpoteri" (Canvas starfield, Web Audio SFX, 3D tilt, terminale interattivo).
- **Data Layer centralizzato & tipizzato**: tutti i testi e le sezioni sono mockati e gestiti in `src/data/portfolio.ts` con interfacce in `src/types/portfolio.ts` per consentire update facili senza toccare il markup.
- **Desktop-First & SEO**: layout prioritario per desktop (per stupire HR/tech lead), responsive per mobile, metatag e semantica corretta.

---

## 2. 🤖 Regole di Collaborazione con l'AI
- **Prima il Plan, poi il codice**: stilare sempre prima la TODO list e la pianificazione dettagliata.
- **Zero codice senza approvazione**: non scrivere o modificare file senza l'esplicito ok dell'utente.
- **Zero commit/push senza approvazione**: non eseguire alcun `git commit` o `git push` senza l'esplicita autorizzazione dell'utente.
- **Approccio a piccoli passi (Step-by-Step)**: un task alla volta, verificabile e testabile.

---

## 3. 🌿 Git Flow, Commit & Release Standards
- **Branch Strategy**:
  - `main` (bloccato/protetto, solo per release e deploy di produzione).
  - `develop` (default branch di sviluppo e integrazione).
  - Feature branches dedicati (es. `feat/...`, `fix/...`, `chore/...`) creati a partire da `develop`.
- **Pull Request**: ogni feature branch deve avere la sua PR su GitHub verso `develop` (usando il template `.github/PULL_REQUEST_TEMPLATE.md`).
- **Conventional Commits**:
  - Messaggi strettamente in **inglese** (`feat: ...`, `chore: ...`, `style: ...`, `fix: ...`).
  - **Singola riga** (nessun body/descrizione lunga).
  - **Nessun footer `Co-authored-by`**.
  - Commit atomici e granulari per singola modifica/file.
- **Automated Changelog**: generazione automatica del file `CHANGELOG.md` tramite `yarn changelog` prima di ogni rilascio da `develop` verso `main`.

---

## 4. 🛠️ Code Quality & DevOps
- **Linting & Formatting**: ESLint 9 (flat config con regole Vue 3 & TypeScript) + Prettier.
- **Docker**:
  - Sviluppo in locale nativo e veloce con `yarn dev`.
  - Multi-stage `Dockerfile` (Node 20 Alpine -> Nginx Alpine con gzip e security headers) e `docker-compose.yml` usati solo per testare la preview di produzione su `http://localhost:8080`.
