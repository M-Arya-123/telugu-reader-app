"use client";

import { useState, useEffect, useRef } from "react";
import { parseTeluguWord } from "@/core/parser/parseTeluguWord";
import { TELUGU_UNICODE_REGEX } from "@/core/parser/teluguUnicode";
import HoverableWord from "./HoverableWord";

type ArticleRendererProps = {
  text: string;
  mode?: "letter" | "word";
  isPracticeMode?: boolean;
};

export default function ArticleRenderer({
  text,
  mode = "letter",
  isPracticeMode = false,
}: ArticleRendererProps) {
  // Global active ID ensures only ONE popup can ever be visible at a time
  const [activeId, setActiveId] = useState<string | null>(null);
  const containerRef = useRef<HTMLSpanElement | null>(null);

  // Dismiss popup when clicking anywhere outside the active Telugu text
  useEffect(() => {
    if (!activeId) return;

    function handleDocumentClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveId(null);
      }
    }

    document.addEventListener("mousedown", handleDocumentClick);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, [activeId]);

  // Split text keeping words, spaces, and punctuation tokens intact
  const tokens = text.split(/(\s+|[.,!?:;—\-"'()])/);

  return (
    <span ref={containerRef} className="leading-loose">
      {tokens.map((token, index) => {
        // If it's whitespace or punctuation, render as-is
        if (!token || !TELUGU_UNICODE_REGEX.test(token)) {
          return <span key={index}>{token}</span>;
        }

        // It's a Telugu word, parse into structured clusters
        const parsedWord = parseTeluguWord(token);
        const wordId = `word-${index}`;

        return (
          <HoverableWord
            key={index}
            wordId={wordId}
            parsedWord={parsedWord}
            mode={mode}
            isPracticeMode={isPracticeMode}
            activeId={activeId}
            setActiveId={setActiveId}
          />
        );
      })}
    </span>
  );
}
