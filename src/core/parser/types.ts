export type ConsonantPart = {
  // Base Telugu consonant
  // Example: "స"
  telugu: string

  // Example: "sa"
  phonetic: string

  // True if followed by a virama
  hasVirama: boolean
}

export type MatraPart = {
  telugu: string
  phonetic: string
}

export type TeluguCluster = {

  // Every consonant in this cluster
  consonants: ConsonantPart[]

  // Optional matra
  matra?: MatraPart

  // Optional anusvara
  anusvara?: string

  // Original Telugu text
  combined: string

  // Final pronunciation
  combinedPhonetic: string
}

export type ParsedWord={
    original:string
    clusters:TeluguCluster[]
}
