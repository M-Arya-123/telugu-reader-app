// Import your main parser engine
//
import { parseTeluguWord } from "./parseTeluguWord"



// ==========================================
// TEST WORDS
// ==========================================
//
// Add many Telugu words here
// to test parser behavior.
//
const testWords = [
  "తెలుగు",
  "భాష",
  "పుస్తకం",
  "నమస్తే",
  "అమ్మ",
  "కృష్ణ",
  "క్షమ",
  "జ్ఞానం",
  "శ్రద్ధ",
  "విద్య",
  "ప్రపంచం",
  "స్వాగతం",
  "గ్రామం",
  "క్లాస్",
  "త్రయం",
  "స్నేహం",
  "అందం",
  "గంగ",
  "కంప",
  "పండు"
]



// ==========================================
// RUN TESTS
// ==========================================
//
// Loop through every word
// and inspect parser output.
//
for (const word of testWords) {

  console.log("\n====================")
  console.log("WORD:", word)
  console.log("====================")



  // Parse Telugu word
  const result =
    parseTeluguWord(word)



  // Pretty-print parser output
  console.log(
    JSON.stringify(result, null, 2)
  )
}

