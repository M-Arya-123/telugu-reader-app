# Telugu Reader

An interactive Telugu reading assistant that helps users learn to read Telugu script through character-level phonetic transliteration.

---

## Problem

Many Telugu speakers can understand and speak Telugu fluently but struggle to read Telugu script.

Most existing transliteration tools translate entire words directly into English, which does not help users understand:

- how Telugu characters combine,
- how matras modify consonants,
- or how pronunciation is formed.

This project focuses on teaching reading through interactive character-level breakdowns.

---

# How It Works

1. A Telugu paragraph/article is displayed.
2. Every word is hoverable.
3. Hovering over a word opens a popup.
4. The popup breaks the word into Telugu character groups.
5. Each group is transliterated phonetically into English.

Example:

తెలుగు

↓

తె → the  
లు → lu  
గు → gu

---

# V1 Features

- Telugu paragraph rendering
- Hoverable words
- Popup transliteration system
- Telugu character segmentation
- Character-level phonetic mapping

---

# Tech Stack

- **Web App**: Next.js, React 19, TypeScript, Tailwind CSS
- **Browser Extension**: Manifest V3, TypeScript, esbuild
- **Core Parser**: Pure TypeScript Unicode segmentation and phonetic mapping engine

---

# Architecture & Dual Vision

The project consists of two companion products powered by the same shared core parser:

1. **Learning Web Platform (`mainsite`)**:
   - Structured learning environment with beginner stories, alphabet guides, and interactive reading exercises.
2. **Browser Extension (`/extension`)**:
   - Manifest V3 browser extension enabling real-time phonetic reading assistance on any external Telugu webpage (e.g. *Eenadu*, *Sakshi*, *Andhra Jyothy*, Wikipedia).
   - Zero-layout-shift floating tooltip with character boundary and conjunct consonant detection.

```
                  ┌────────────────────────┐
                  │  src/core/parser/      │
                  │  (Unicode Engine)      │
                  └──────────┬─────────────┘
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
   ┌──────────────────┐             ┌──────────────────┐
   │ Next.js Web App  │             │ Browser Extension│
   │ (Learning Site)  │             │ (Live Web Reader)│
   └──────────────────┘             └──────────────────┘
```

---

# Core Engineering Challenge

The most technically important part of the project is correctly handling Telugu Unicode composition.

Example:

తె

Internally:

త + ె

The parser engine must correctly identify Telugu combined character groups while preserving pronunciation structure.

---

# Planned Architecture

ArticleRenderer
│
├── HoverableWord
│
└── TransliterationPopup

> **Note:** The parser engine has been completed as an independent library. The UI consumes its output and should not modify parser logic unless genuine bugs are discovered.

---

# Example Parser Output

Input:

తెలుగు

Output:

[
  { telugu: "తె", english: "the" },
  { telugu: "లు", english: "lu" },
  { telugu: "గు", english: "gu" }
]

---

# Development Roadmap

## Phase 1: Core Unicode Engine
- [x] Project initialization with TypeScript
- [x] Telugu Unicode table definitions (vowels, consonants, matras, virama, anusvara)
- [x] Unicode cluster segmentation (`segmentTelugu.ts`)
- [x] Phonetic transliteration mapping rules (`transliterate.ts`, `phoneticMap.ts`)
- [x] Core test runner script (`npm run parser-test`)

## Phase 2: Web Reader Foundation
- [x] Interactive cluster component (`ClusterSpan.tsx`)
- [x] Floating phonetic transliteration tooltip (`TransliterationPopup.tsx`)
- [x] Reader renderer (`ArticleRenderer.tsx`)
- [x] Isolated test playground route (`/playground`)

## Phase 3: Browser Extension MVP (Manifest V3)
- [x] Extension directory setup with `manifest.json` (V3)
- [x] Bundling pipeline with `esbuild` (`npm run build:extension`)
- [x] DOM text caret detection (`caretRangeFromPoint` / `caretPositionFromPoint`)
- [x] Floating zero-layout-shift tooltip overlay (`content.css`)
- [x] Boundary rollback fix for trailing characters and word edges
- [x] Tuned popup typography and padding for clear legibility
- [x] Extension popup toggle with Chrome storage sync (`popup.html` & `popup.ts`)
- [x] Mobile touch support (tap-to-inspect and drag scrubbing)
- [x] **Temporary Mobile Solution**: Standalone Bookmarklet (`npm run build:bookmarklet`) for running inside mobile Google Chrome (since mobile Chrome lacks native extension support). Future plan: dedicated Mobile PWA & Reader Mode.
- [ ] Options page for setting custom tooltip font size and activation delay

## Phase 4: Web Learning Platform Integration
- [ ] Create curated sample articles dataset (`src/data/sampleArticles.ts`)
- [ ] Clean article reader view on main page (`/`)
- [ ] Support punctuation, paragraph breaks, and mixed English/Telugu text
- [ ] Reading controls toolbar (font size adjuster, line spacing)
- [ ] Custom text input box (paste any Telugu article to read)

## Phase 5: Educational & Assistance Features
- [ ] Word-level breakdown mode (toggle between cluster-only and full-word decomposition)
- [ ] Progressive assistance mode (hide transliterations after successful hover)
- [ ] Audio pronunciation helper for basic consonants and vowels
- [ ] Vocabulary bookmarking / saved words list

---

# Future Ideas

- Progressive assistance reduction
- Story reading mode
- User progress tracking
- AI pronunciation
- OCR from Telugu books/images
- Gamified learning system

---

# Current Status

- ✅ **Core Parser Engine**: Completed and tested. Segments Telugu Unicode into pronunciation clusters and generates phonetic transliterations.
- ✅ **Browser Extension**: Built and working. Users can hover over Telugu words on news websites (e.g., *Eenadu*, *Sakshi*) to see instant phonetic transliteration popups.
- ✅ **Test Playground**: Active at `/playground` for evaluating cluster hover interactions and transliteration fidelity.
- 🚧 **In Progress**: Completing the interactive reader on the main web platform (`/`) with sample articles and learning controls.
