import {
  CONSONANT_SOUNDS,
  MATRA_SOUNDS,
  VOWEL_SOUNDS
} from "./phoneticMap"

import type {
  TeluguCluster,
  ConsonantPart
} from "./types"

import type {
  SegmentedCluster
} from "./segmentTelugu"


// ==========================================
// SPECIAL CONJUNCT PRONUNCIATIONS
// ==========================================
//
// Some Telugu conjuncts have conventional
// pronunciations that differ from simply
// joining consonant sounds.
//
const SPECIAL_CLUSTERS: Record<string, string> = {

  // క్ + ష
  "క్ష": "ksha",

  // జ్ + ఞ
  "జ్ఞ": "gnya",

  // శ్ + ర
  "శ్ర": "shra"
}
// ==========================================
// HELPER:
// REMOVE INHERENT "a" SOUND
// ==========================================
function removeTrailingA(sound: string): string {

  if (sound.endsWith("a")) {
    return sound.slice(0, -1)
  }

  return sound
}

// ==========================================
// HELPER:
// DETERMINE ANUSVARA SOUND
// ==========================================
//
// The pronunciation of "ం" depends on the
// consonant that follows.
//
// Example:
//
// అందం -> an
// కంప -> am
// గంగ -> ang
//
function getAnusvaraSound(
  nextCluster?: SegmentedCluster
): string {

  if (!nextCluster?.consonants?.length)
    return "m"

  const next =
    nextCluster.consonants[0].telugu

  // Velars
  if ("కఖగఘఙ".includes(next))
    return "ng"

  // Labials
  if ("పఫబభమ".includes(next))
    return "m"

  // All other consonant groups
  return "n"
}

// ==========================================
// TRANSLITERATE CLUSTER
// ==========================================
export function transliterateCluster(
  cluster: SegmentedCluster,
  nextCluster?: SegmentedCluster
): TeluguCluster {

  // ========================================
  // CASE 1:
  // STANDALONE VOWEL
  // ========================================
  if (cluster.vowel) {

    const vowelSound =
      VOWEL_SOUNDS[cluster.vowel] || "[unknown]"

    let combinedPhonetic = vowelSound

    // Add anusvara sound if present
    if (cluster.anusvara) {
      combinedPhonetic +=
        getAnusvaraSound(nextCluster)
    }
    return {

      // Vowels have no consonant list
      consonants: [],

      anusvara: cluster.anusvara,

      // IMPORTANT:
      // Use the parser's combined text,
      // not just the vowel.
      combined: cluster.combined,

      combinedPhonetic
    }
  }



  // ========================================
  // CASE 2:
  // CONSONANT CLUSTER
  // ========================================

  const consonants: ConsonantPart[] = []

  let combinedPhonetic = ""

  // ========================================
  // SPECIAL CLUSTERS
  // ========================================

  const specialPronunciation =
    SPECIAL_CLUSTERS[cluster.combined]

  if (specialPronunciation) {

    const consonants: ConsonantPart[] =
      (cluster.consonants ?? []).map(c => ({
        telugu: c.telugu,
        phonetic:
          CONSONANT_SOUNDS[c.telugu] || "[unknown]",
        hasVirama: c.hasVirama
      }))

    return {

      consonants,

      combined: cluster.combined,

      combinedPhonetic: specialPronunciation
    }
  }

  for (const consonant of cluster.consonants ?? []) {

    let sound =
      CONSONANT_SOUNDS[consonant.telugu] || "[unknown]"

    consonants.push({
      telugu: consonant.telugu,
      phonetic: sound,
      hasVirama: consonant.hasVirama
    })

    // Remove inherent vowel if virama exists
    if (consonant.hasVirama) {
      sound = removeTrailingA(sound)
    }

    combinedPhonetic += sound
  }



  // ========================================
  // APPLY MATRA
  // ========================================

  let matra

  if (cluster.matra) {

    const matraSound =
      MATRA_SOUNDS[cluster.matra] || "[unknown]"

    combinedPhonetic =
      removeTrailingA(combinedPhonetic) +
      matraSound

    matra = {
      telugu: cluster.matra,
      phonetic: matraSound
    }
  }



  // ========================================
  // APPLY ANUSVARA
  // ========================================

  if (cluster.anusvara) {
    combinedPhonetic +=
      getAnusvaraSound(nextCluster)
  }



  // ========================================
  // RETURN FINAL STRUCTURE
  // ========================================

  return {

    consonants,

    matra,

    anusvara: cluster.anusvara,

    combined: cluster.combined,

    combinedPhonetic
  }
}