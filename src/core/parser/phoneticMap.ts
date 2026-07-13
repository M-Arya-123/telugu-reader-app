// ==========================================
// PHONETIC SOUND MAPS
// ==========================================
//
// This file contains pronunciation mappings.
//
// Telugu character
//        ↓
// English phonetic sound
//
// IMPORTANT:
//
// This file contains ONLY sound mappings.
//
// NO parsing logic.
// NO Unicode logic.
// NO UI logic.
//
// ==========================================



// ==========================================
// CONSONANT SOUNDS
// ==========================================
//
// Telugu consonants naturally contain
// an inherent "a" vowel sound.
//
// Example:
//
// త = ta
// క = ka
// ప = pa
//
// ==========================================
// INDEPENDENT VOWELS
// ==========================================

export const VOWEL_SOUNDS: Record<string, string> = {
  "అ": "a",
  "ఆ": "aa",
  "ఇ": "i",
  "ఈ": "ee",
  "ఉ": "u",
  "ఊ": "oo",
  "ఋ": "ru",
  "ౠ": "roo",
  "ఌ": "lu",
  "ౡ": "loo",
  "ఎ": "e",
  "ఏ": "ee",
  "ఐ": "ai",
  "ఒ": "o",
  "ఓ": "oo",
  "ఔ": "au"
}



// ==========================================
// VOWEL SIGNS (MATRAS)
// ==========================================

export const MATRA_SOUNDS: Record<string, string> = {
  "ా": "aa",
  "ి": "i",
  "ీ": "ee",
  "ు": "u",
  "ూ": "oo",
  "ృ": "ru",
  "ౄ": "roo",
  "ె": "e",
  "ే": "ee",
  "ై": "ai",
  "ొ": "o",
  "ో": "oo",
  "ౌ": "au"
}



// ==========================================
// CONSONANTS
// ==========================================

export const CONSONANT_SOUNDS: Record<string, string> = {

  // Velars
  "క": "ka",
  "ఖ": "kha",
  "గ": "ga",
  "ఘ": "gha",
  "ఙ": "nga",

  // Palatals
  "చ": "cha",
  "ఛ": "chha",
  "జ": "ja",
  "ఝ": "jha",
  "ఞ": "nya",

  // Retroflex
  "ట": "ta",
  "ఠ": "tha",
  "డ": "da",
  "ఢ": "dha",
  "ణ": "na",

  // Dentals
  "త": "ta",
  "థ": "tha",
  "ద": "da",
  "ధ": "dha",
  "న": "na",

  // Labials
  "ప": "pa",
  "ఫ": "pha",
  "బ": "ba",
  "భ": "bha",
  "మ": "ma",

  // Semivowels
  "య": "ya",
  "ర": "ra",
  "ల": "la",
  "వ": "va",

  // Sibilants
  "శ": "sha",
  "ష": "sha",
  "స": "sa",

  // Aspirate
  "హ": "ha",

  // Additional Telugu letters
  "ళ": "la",
  "ఱ": "ra"
}

export const ANUSVARA_SOUND = "m"
export const VISARGA_SOUND = "h"