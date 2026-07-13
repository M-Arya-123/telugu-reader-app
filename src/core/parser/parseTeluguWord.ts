// Import segmentation engine
//
// Responsible for:
// Telugu Unicode grouping
//
import { segmentTelugu } from "./segmentTelugu"



// Import transliteration engine
//
// Responsible for:
// Telugu → phonetic conversion
//
import { transliterateCluster } from "./transliterate"



// Import shared TypeScript types
//
import type {
  ParsedWord,
  TeluguCluster
} from "./types"



// ==========================================
// PARSE TELUGU WORD
// ==========================================
//
// Main public parser function.
//
// Entire application will eventually use THIS.
//
// Example:
//
// parseTeluguWord("తెలుగు")
//
// ==========================================
export function parseTeluguWord(
  word: string
): ParsedWord {



  // ========================================
  // STEP 1:
  // SEGMENT WORD
  // ========================================
  //
  // Example:
  //
  // తెలుగు
  //
  // becomes:
  //
  // [
  //   {
  //     consonant: "త",
  //     matra: "ె",
  //     combined: "తె"
  //   }
  // ]
  //
  const segmentedClusters =
    segmentTelugu(word)



  // ========================================
  // FINAL PARSED OUTPUT ARRAY
  // ========================================
  //
  // Will contain fully transliterated
  // educational structures.
  //
  const parsedClusters: TeluguCluster[] = []



  // ========================================
  // STEP 2:
  // TRANSLITERATE EACH CLUSTER
  // ========================================
  //
  // Example:
  //
  // {
  //   consonant: "త",
  //   matra: "ె"
  // }
  //
  // becomes:
  //
  // {
  //   consonant: {
  //     telugu: "త",
  //     phonetic: "ta"
  //   },
  //
  //   matra: {
  //     telugu: "ె",
  //     phonetic: "e"
  //   },
  //
  //   combinedPhonetic: "te"
  // }
  //
  for (let i = 0; i < segmentedClusters.length; i++) {
    const currentCluster =
      segmentedClusters[i]

    const nextCluster =
      segmentedClusters[i + 1]

    const transliteratedCluster =
      transliterateCluster(
        currentCluster,
        nextCluster
      )

    parsedClusters.push(
      transliteratedCluster
    )
  }



  // ========================================
  // STEP 3:
  // RETURN FINAL PARSED WORD
  // ========================================
  //
  return {

    // Original Telugu input
    original: word,



    // Fully parsed educational clusters
    clusters: parsedClusters
  }
}