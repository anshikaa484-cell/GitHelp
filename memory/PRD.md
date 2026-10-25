# GitHelp — Product Requirements Document

## Original Problem Statement
Build "GitHelp", a beginner-friendly web app that consolidates Git learning tools into one place. User constraints: **no dark mode**, **no backend** (frontend-only), **static/local JS data only**, no REST/GitHub API calls, no Context/Redux. Scope narrowed by user to: App shell (Navbar + Home), Command Explorer (basic search/filter), Chatbot (rule-based keyword matching). Later requested additions: voice memo (voice input), Jest tests, an Error Finder, video-like animations, and better CSS.

## Architecture
- **Frontend-only** React SPA (CRA + craco), React Router 7, framer-motion for animation.
- **No backend used** (the FastAPI `server.py` exists in the template but is NOT called by the app).
- **Data**: static local JS arrays — `src/data/gitData.js` (24 commands, 13 FAQs, categories) and `src/data/gitErrors.js` (12 common Git errors).
- **Voice**: browser-native Web Speech API (`useSpeechRecognition`), no API key/backend.
- **Styling**: plain CSS3 (`App.css`), light theme only, CSS-only 3D + framer-motion animations.

## User Personas
- Beginner developers intimidated by the Git CLI who need plain-English help fast.
- Students (Front End Engineering-II course context).

## Core Requirements (static)
- Light theme only, responsive, mobile-first.
- Command Explorer with search + category filter + copy.
- Rule-based chatbot (NO AI/LLM) via keyword matching on local FAQ data.
- Error Finder that diagnoses pasted Git errors (rule-based).
- Voice input for search and chat.
- React Router with 404 handling.

## Implemented (2026-06)
- **App shell**: Navbar (Home / Commands / Error Finder / Chatbot) + animated footer.
- **Home** (`/`): animated hero ("Git, made simpler."), typing terminal, drifting orbs + grid background, 3 module cards, "How It Works" steps.
- **Command Explorer** (`/commands`): live debounced search, category chips, 24 command cards with copy + common-mistake callouts, voice search button.
- **Error Finder** (`/errors`): paste a Git error → ranked diagnosis cards (cause + copyable fix), example chips, no-match state, voice dictation.
- **Chatbot** (`/chatbot`): rule-based keyword matcher (`useChatbotMatch`), suggestion chips, voice-to-ask, side panel.
- **Custom hooks**: `useChatbotMatch`, `useErrorMatch`, `useDebounce`, `useSpeechRecognition`.
- **Tests**: Jest + React Testing Library — `useChatbotMatch.test.js`, `CommandCard.test.jsx` (9 tests passing).
- Verified end-to-end by testing agent: iteration 1 & 2 both 100% frontend pass.

## Implemented (2026-02) — v3 batch
- **Copy Toast (P1)**: All copy-to-clipboard actions (command cards + error fix blocks) now show a Sonner toast confirmation with the copied snippet preview. Toaster mounted in `App.js` (light theme, bottom-right).
- **Voice Read-back / TTS (P2)**: New `useSpeechSynthesis` hook wrapping `window.speechSynthesis`. Chatbot has a header toggle ("Muted"/"Read aloud") + per-bot-message speaker icon; new bot answers auto-speak when enabled. Degrades gracefully when API is unsupported.
- **Cheat Sheet (P2)**: New `/cheatsheet` route rendering a printable one-page reference, grouped by category. Print/Save-as-PDF button uses `window.print()`; dedicated `@media print` CSS strips nav/footer/toasts and switches to two-column A4 layout.
- Added Cheat Sheet link in Navbar; nav & footer marked `.no-print` for clean print output.
- 9 Jest tests still passing.

## Backlog / Remaining
- **P1**: Persist favorites/history (would require localStorage or backend — currently out of scope per user).
- **P2**: More commands/errors/FAQ entries; keyboard shortcuts.
- **P2**: Repo Clone Assistant (needs live GitHub API — deferred; user said no REST calls).
- **P2**: Voice-select language / rate control for TTS.
- **P2**: Copy toast — quick "Undo" action.

## Next Tasks
- Await user feedback on new features; expand datasets if requested.
