"use client";

import { useState } from "react";
import { parseTeluguWord } from "@/core/parser/parseTeluguWord";
import ClusterCard from "@/components/parser/ClusterCard";
import TeluguInput from "./TeluguInput";

export default function ParserPlayground() {
  const [word, setWord] = useState("");

  const parsedWord = parseTeluguWord(word);

  return (
    <main>
      <h1>Telugu Reader Playground</h1>
      <TeluguInput value={word} onChange={setWord} />
      {parsedWord.clusters.map((cluster, index) => (
        <ClusterCard
          key={index}
          telugu={cluster.combined}
          phonetic={cluster.combinedPhonetic}
        />
      ))}
    </main>
  );
}
