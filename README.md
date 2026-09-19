# 📖 Telugu Reader (తెలుగు రీడర్)

> An interactive Telugu reading assistant and Unicode phonetic engine that teaches learners to read Telugu script through character-level orthographic decomposition.

---

## 🎯 The Core Idea & Linguistic Problem

Many people understand and speak Telugu fluently, but struggle to read the script.

Standard transliteration and translation tools translate entire words into English at once (e.g., `నమస్కారం` → `namaskaram`). While this provides immediate comprehension, it completely obscures the orthographic structure of the language. As a result, learners do not understand:
1. How base consonants combine with vowel matras (*Guninthalu*).
2. How the virama (*halant*) suppresses inherent vowels.
3. How complex conjunct consonants (*Ottulu / Samyuktaksharas*) modify phonetic pronunciation.

**Telugu Reader** shifts the focus from whole-word translation to **character-level orthographic breakdown**. As the user reads, each word is segmented into its linguistic pronunciation clusters, revealing the phonetic anatomy of the script in real time.

```
                  తెలుగు
                    ↓
┌──────────────┬──────────────┬──────────────┐
│      తె      │      లు      │      గు      │
│     the      │      lu      │      gu      │
└──────────────┴──────────────┴──────────────┘
```

---

## ⚙️ How the Engine Works

The core of this project is a lightweight, zero-dependency engine (`src/core/parser/`) that solves two fundamental problems: **grouping combined letters** and **phonetic translation**.

### 1. The Challenge: Telugu Letters Stack
In English, letters sit side-by-side (`c - a - t`). 
In Telugu, a single printable sound unit often stacks multiple characters together:
- A base consonant (`త`) + a vowel sign (`ె`) = **`తె`**
- Stacking sub-consonants (*vattulu*): `స` + `్` + `త` + `్` + `ర` + `ీ` = **`స్త్రీ`** (`strii`)

Standard code splitting (`word.split("")`) breaks these apart into broken, meaningless fragments. The engine ensures characters stay grouped as true phonetic units.

### 2. Two-Step Pipeline

The engine processes text in two simple stages:

1. **Segmentation (`segmentTelugu.ts`)**: 
   Scans words and groups consonants with their attached vowel signs (*matras*) and sub-consonants (*vattulu*) into whole sound units.
   - Input: `"తెలుగు"`
   - Output: `["తె", "లు", "గు"]`

2. **Phonetic Mapping (`transliterate.ts`)**:
   Translates each group into its natural English pronunciation:
   - Base sounds: `క` → `ka`, `ప` → `pa`
   - Modified by vowel signs: `తె` (త + ె) → `the`
   - Blended conjuncts: `త్రు` (త + ర + ు) → `thru`
   - Suppressed vowels via virama: `క్` → `k`

### 3. Example Output

| Telugu Cluster | Structure | Phonetic Sound |
| :--- | :--- | :--- |
| **తె** | Base `త` + Vowel Sign `ె` | `the` |
| **లు** | Base `ల` + Vowel Sign `ు` | `lu` |
| **గు** | Base `గ` + Vowel Sign `ు` | `gu` |

Raw engine output for `"తెలుగు"`:
```json
[
  { "telugu": "తె", "english": "the" },
  { "telugu": "లు", "english": "lu" },
  { "telugu": "గు", "english": "gu" }
]
```


---

## 🏗️ System Architecture & Design

The project is structured around a decoupled **Core Engine** consumed by two companion platforms:

```
                           ┌──────────────────────────────┐
                           │      src/core/parser/        │
                           │   (Zero-dependency Engine)   │
                           │  - unicodeTable.ts           │
                           │  - segmentTelugu.ts          │
                           │  - transliterate.ts          │
                           │  - phoneticMap.ts            │
                           └──────────────┬───────────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
     ┌──────────────────────────┐                    ┌──────────────────────────┐
     │     Next.js Web App      │                    │    Browser Extension     │
     │      (Learning Hub)      │                    │   (Live Web Assistant)   │
     │                          │                    │                          │
     │  ArticleRenderer         │                    │  DOM Caret Detection     │
     │   └─ HoverableWord       │                    │  Floating Overlay        │
     │       └─ ClusterSpan     │                    │  Zero Layout Shifts      │
     │           └─ Popup       │                    │  Touch Scrubbing         │
     └──────────────────────────┘                    └────────────┬─────────────┘
                                                                  │
                                                                  ▼
                                                     ┌──────────────────────────┐
                                                     │    Mobile Bookmarklet    │
                                                     │ (Standalone JS for Phone)│
                                                     └──────────────────────────┘
```

### Component Hierarchy (Web Platform)

- **`ArticleRenderer`**: Parses raw Telugu text into paragraphs and words, coordinating single-active popup state across the entire document.
- **`HoverableWord`**: Wraps individual words, computes cluster boundaries, and handles keyboard/mouse/touch events.
- **`ClusterSpan`**: Highlights active phonetic segments on hover/tap.
- **`TransliterationPopup`**: Zero-layout-shift floating tooltip presenting the cluster-by-cluster breakdown.

### Extension System Design (Manifest V3)

- **Target**: Any live Telugu webpage (*Eenadu*, *Sakshi*, *BBC Telugu*, Wikipedia).
- **DOM Inspection Technique**: Uses non-destructive `document.caretRangeFromPoint()` and `document.caretPositionFromPoint()` to locate word boundaries directly within raw text nodes without wrapping or altering host page DOM elements.
- **Zero Layout Shifts**: Renders a fixed floating tooltip layer above the viewport to avoid reflowing delicate news site layouts.

---

## 📜 Development Log & Evolution

The project was engineered incrementally across distinct phases:

### Phase 1: Engine Foundation
- Defined complete Telugu Unicode classification tables (`unicodeTable.ts`).
- Implemented cluster segmentation regexes and state handlers (`segmentTelugu.ts`).
- Created phonetic mapping tables and conjunct resolving rules (`transliterate.ts`, `phoneticMap.ts`).
- Built standalone CLI testing suite (`npm run parser-test`) to validate edge cases (viramas, vowel signs, conjuncts).

### Phase 2: Web Reader Foundation
- Built React components for rendering Telugu text with hoverable clusters (`ClusterSpan`, `HoverableWord`, `TransliterationPopup`).
- Created an isolated test playground route (`/playground`) to stress-test interactive hover states and viewport boundary clipping.

### Phase 3: Desktop Browser Extension (Chrome MV3)
- Packaged the core parser with `esbuild` into a zero-dependency Chrome extension.
- Solved boundary rollback bugs where trailing matras or viramas were lost during caret hit-testing.
- Added background sync toggle via `chrome.storage.local` to enable/disable reading assistance on demand.

### Phase 4: Mobile Adaptation & Content Tools
- **Mobile Bookmarklet**: Developed a standalone, minified bookmarklet (`extension/bookmarklet.min.js`) with touch drag-scrubbing for mobile Chrome.
- **Web App Enhancements**: Integrated graded stories (Beginner to Advanced), URL text importer (`/api/fetch-article`), font scaling controls, and Active Recall mode.

---

## 💻 Developer Guide & Commands

### 1. Test the Parser Engine
Run the standalone TypeScript parser test suite:
```bash
npm run parser-test
```

### 2. Run the Next.js Web App
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to inspect the reader, or [http://localhost:3000/playground](http://localhost:3000/playground) for the isolated cluster inspector.

### 3. Build the Extension Bundle
```bash
npm run build:extension
```
Bundles `extension/src/content.ts` and `extension/src/popup.ts` into `extension/content.js` and `extension/popup.js`.

### 4. Build the Mobile Bookmarklet
```bash
npm run build:bookmarklet
```
Generates the minified, single-file bundle in `extension/bookmarklet.min.js`.

### 5. Live Deployment
The web platform is live at:  
👉 **[telugu-reader-app.vercel.app](https://telugu-reader-app.vercel.app/)**


---

## 🗺️ Roadmap & Next Steps

- [x] **Core Unicode Segmentation & Conjunct Parser**
- [x] **Phonetic Transliteration Engine**
- [x] **Zero-Layout-Shift Web Reader Components**
- [x] **Manifest V3 Chrome Extension for External Sites**
- [x] **Mobile Touch & Drag-Scrubbing Bookmarklet**
- [ ] **Audio Phoneme Synthesis**: Pronunciation synthesis for individual vowels and base consonants.
- [ ] **Saved Vocabulary / Spaced Repetition**: Bookmarking difficult conjuncts for active practice.
- [ ] **Progressive Assistance Mode**: Automatically fading transliteration aids as reading accuracy improves.

---

## 📄 License

MIT License.
