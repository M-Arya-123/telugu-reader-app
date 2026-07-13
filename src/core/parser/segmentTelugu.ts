import {
  isConsonant,
  isMatra,
  isVowel,
  isVirama,
  isAnusvara,
} from "./teluguUnicode"



// ==========================================
// SEGMENT TYPE
// ==========================================
//
// Temporary lightweight structure
// returned by segmentation phase.
//
// Transliteration happens later.
//
export type ParsedConsonant = {
  telugu: string
  hasVirama: boolean
}

export type SegmentedCluster = {
    // Multiple consonants possible now
  //
  // Example:
  // ["స్", "త"]
  //
  consonants?: ParsedConsonant[]

  matra?: string

  vowel?: string
  // Optional anusvara
  //
  // Example:
  // ం
  //
  anusvara?: string

  combined: string
}



// ==========================================
// SEGMENT TELUGU WORD
// ==========================================
//
// This function splits a Telugu word
// into pronunciation clusters.
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
//   },
//   ...
// ]
//
// ==========================================
export function segmentTelugu(
  word: string
): SegmentedCluster[] {

  const clusters: SegmentedCluster[] = []



  // Loop through word manually
  //
  // We use while-loop because
  // parser sometimes jumps multiple chars.
  //
  let i = 0



  while (i < word.length) {

    const currentChar = word[i]



    // ======================================
    // CASE 1:
    // STANDALONE VOWEL
    // ======================================

    if (isVowel(currentChar)) {

      let combined = currentChar

      let anusvara: string | undefined

      if (
        word[i + 1] &&
        isAnusvara(word[i + 1])
      ) {
        anusvara = word[i + 1]
        combined += anusvara
        i++
      }

      clusters.push({
        vowel: currentChar,
        anusvara,
        combined
      })

      i++
      continue
    }



    // ======================================
    // CASE 2:
    // CONSONANT / CONSONANT CLUSTER
    // ======================================
    //
    if (isConsonant(currentChar)) {

      // Store consonant chain
      //
      // Example:
      // ["స్", "త"]
      //
      const consonants: ParsedConsonant[] = []



      // Final Telugu cluster text
      //
      let combined = ""



      // Current consonant
      consonants.push({
        telugu: currentChar,
        hasVirama: false
      })

      combined += currentChar



      // ====================================
      // LOOK FOR VIRAMA CHAIN
      // ====================================
      //
      // Example:
      //
      // స + ్ + త
      //
      while (
        word[i + 1] &&
        isVirama(word[i + 1])
      ) {

        // Add virama
        combined += word[i + 1]



        // Next consonant after virama
        const nextConsonant =
          word[i + 2]



        if (
          nextConsonant &&
          isConsonant(nextConsonant)
        ) {

          // Previous consonant now ends with a virama
          consonants[consonants.length - 1].hasVirama = true

          // Start the next consonant
          consonants.push({
              telugu: nextConsonant,
              hasVirama: false
          })

          combined += nextConsonant



          // Skip:
          // virama + consonant
          //
          i += 2
        }

        else {
          break
        }
      }



      // ====================================
      // OPTIONAL MATRA
      // ====================================
      //
      let matra: string | undefined



      if (
        word[i + 1] &&
        isMatra(word[i + 1])
      ) {

        matra = word[i + 1]

        combined += matra

        i++
      }



      // ====================================
      // OPTIONAL ANUSVARA
      // ====================================
      //
      let anusvara: string | undefined



      if (
        word[i + 1] &&
        isAnusvara(word[i + 1])
      ) {

        anusvara = word[i + 1]

        combined += anusvara

        i++
      }



      // Store final cluster
      clusters.push({
        consonants,

        matra,

        anusvara,

        combined
      })

      i++
      continue
    }



    // Safety fallback
    i++
  }

  return clusters
}