// ===============================
// TELUGU UNICODE DEFINITIONS
// ===============================
//
// This file contains:
//
// 1. Telugu Unicode constants
// 2. Telugu character classification helpers
// 3. Matra detection logic
// 4. Consonant detection logic
//
// IMPORTANT:
//
// This file should ONLY contain
// Unicode-related utilities.
//
// NO parsing logic.
// NO transliteration logic.
// NO UI logic.
//
// ===============================



// ==========================================
// VIRAMA
// ==========================================
//
// Telugu virama symbol:
//
// "్"
//
// Virama removes the default vowel sound.
//
// Example:
//
// క = ka
// క్ = k
//
// Internally:
//
// క + ్
//
// Later this becomes VERY important
// for conjunct consonants.
//
export const TELUGU_VIRAMA = "్"



// ==========================================
// TELUGU MAATRAS (VOWEL MODIFIERS)
// ==========================================
//
// These modify consonant pronunciation.
//
// Example:
//
// త + ె = తె
//
// Here:
//
// త = ta
// ె = e
// తె = the
//

// ==========================================
// ANUSVARA
// ==========================================
//
// Telugu nasal sound modifier.
//
// Example:
//
// కం
//
// = క + ం
//
// Pronunciation changes:
// ka → kam
//
export const TELUGU_ANUSVARA = "ం"

export const TELUGU_MAATRAS = [
  "ా", // aa
  "ి", // i
  "ీ", // ii
  "ు", // u
  "ూ", // uu
  "ృ", // ru
  "ె", // e
  "ే", // ee
  "ై", // ai
  "ొ", // o
  "ో", // oo
  "ౌ"  // au
]



// ==========================================
// TELUGU INDEPENDENT VOWELS
// ==========================================
//
// These are FULL vowel letters.
//
// Example:
//
// అ
// ఆ
// ఇ
//
// Unlike maatras,
// these can stand alone.
//
export const TELUGU_VOWELS = [
  "అ",
  "ఆ",
  "ఇ",
  "ఈ",
  "ఉ",
  "ఊ",
  "ఋ",
  "ఎ",
  "ఏ",
  "ఐ",
  "ఒ",
  "ఓ",
  "ఔ"
]



// ==========================================
// TELUGU CONSONANTS
// ==========================================
//
// Main consonant letters.
//
// Example:
//
// క
// ఖ
// గ
// చ
// జ
//
export const TELUGU_CONSONANTS = [
  "క","ఖ","గ","ఘ","ఙ",
  "చ","ఛ","జ","ఝ","ఞ",
  "ట","ఠ","డ","ఢ","ణ",
  "త","థ","ద","ధ","న",
  "ప","ఫ","బ","భ","మ",
  "య","ర","ల","వ",
  "శ","ష","స","హ",
  "ళ","క్ష","ఱ"
]



// ==========================================
// TELUGU UNICODE RANGE
// ==========================================
//
// Telugu Unicode block:
//
// U+0C00 → U+0C7F
//
// We use this to verify
// whether a character belongs
// to Telugu script.
//
export const TELUGU_UNICODE_REGEX = /[\u0C00-\u0C7F]/



// ==========================================
// HELPER: IS TELUGU CHARACTER
// ==========================================
//
// Checks whether a character
// belongs to Telugu Unicode.
//
export function isTeluguCharacter(char: string): boolean {
  return TELUGU_UNICODE_REGEX.test(char)
}



// ==========================================
// HELPER: IS MATRA
// ==========================================
//
// Example:
//
// "ె" → true
// "త" → false
//
export function isMatra(char: string): boolean {
  return TELUGU_MAATRAS.includes(char)
}



// ==========================================
// HELPER: IS CONSONANT
// ==========================================
//
// Example:
//
// "త" → true
// "ె" → false
//
export function isConsonant(char: string): boolean {
  return TELUGU_CONSONANTS.includes(char)
}



// ==========================================
// HELPER: IS VOWEL
// ==========================================
//
// Example:
//
// "అ" → true
// "త" → false
//
export function isVowel(char: string): boolean {
  return TELUGU_VOWELS.includes(char)
}



// ==========================================
// HELPER: IS VIRAMA
// ==========================================
//
// Example:
//
// "్" → true
//
export function isVirama(char: string): boolean {
  return char === TELUGU_VIRAMA
}

// ==========================================
// HELPER: IS ANUSVARA
// ==========================================
//
// Example:
//
// "ం" → true
//
export function isAnusvara(char: string):boolean{
  return char===TELUGU_ANUSVARA
}