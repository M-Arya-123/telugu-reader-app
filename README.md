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

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui

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

## Phase 1
Project setup

## Phase 2
Render Telugu paragraph

## Phase 3
Make words hoverable

## Phase 4
Build Telugu parser engine

## Phase 5
Create transliteration popup

## Phase 6
Connect parser to popup system

## Phase 7
UI polish and deployment

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

V2 UI phase.
