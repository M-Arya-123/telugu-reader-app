"use client";

import { useState } from "react";
import type { ParsedWord } from "@/core/parser/types";
import ClusterSpan from "./ClusterSpan";
import WordPopup from "./WordPopup";

type HoverableWordProps = {
  wordId: string;
  parsedWord: ParsedWord;
  mode: "letter" | "word";
  isPracticeMode?: boolean;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
};

export default function HoverableWord({
  wordId,
  parsedWord,
  mode,
  isPracticeMode = false,
  activeId,
  setActiveId,
}: HoverableWordProps) {
  const isWordActive = activeId === wordId;

  if (mode === "word") {
    return (
      <span
        className={`relative inline cursor-pointer rounded px-1 transition-colors ${
          isPracticeMode
            ? isWordActive
              ? "bg-emerald-100 text-emerald-900 border-b-2 border-emerald-500"
              : "hover:bg-amber-100/60 border-b border-dashed border-slate-400"
            : isWordActive
            ? "bg-amber-100 text-amber-900"
            : "hover:bg-amber-100 hover:text-amber-900"
        }`}
        onMouseEnter={() => !isPracticeMode && setActiveId(wordId)}
        onMouseLeave={() => !isPracticeMode && setActiveId(null)}
        onClick={() => {
          if (isPracticeMode) {
            setActiveId(isWordActive ? null : wordId);
          }
        }}
      >
        {parsedWord.clusters.map((cluster) => cluster.combined).join("")}
        {isWordActive && <WordPopup parsedWord={parsedWord} />}
      </span>
    );
  }

  // "letter" mode: delegate to individual clusters
  return (
    <span className="inline">
      {parsedWord.clusters.map((cluster, clusterIndex) => {
        const clusterId = `${wordId}-c-${clusterIndex}`;
        return (
          <ClusterSpan
            key={clusterIndex}
            clusterId={clusterId}
            cluster={cluster}
            isPracticeMode={isPracticeMode}
            activeId={activeId}
            setActiveId={setActiveId}
          />
        );
      })}
    </span>
  );
}
