import type { ParsedWord } from "@/core/parser/types";

type WordPopupProps = {
  parsedWord: ParsedWord;
};

export default function WordPopup({ parsedWord }: WordPopupProps) {
  // Combine all cluster phonetics to form the complete word transliteration
  const fullPhonetic = parsedWord.clusters.map((c) => c.combinedPhonetic).join("");

  return (
    <span
      role="tooltip"
      className="pointer-events-none absolute bottom-[115%] left-1/2 z-50 -translate-x-1/2 select-none"
    >
      <span className="relative flex flex-col items-center rounded-xl bg-slate-900 px-3 py-2 text-white shadow-2xl border border-slate-700/80 whitespace-nowrap">
        {/* Full Word Transliteration Header */}
        <span className="flex items-center gap-2">
          <span className="font-serif text-base font-bold text-amber-300">
            {parsedWord.original}
          </span>
          <span className="text-xs text-slate-400">→</span>
          <span className="text-sm font-bold tracking-wide text-emerald-400">
            {fullPhonetic}
          </span>
        </span>

        {/* Breakdown of each syllable / cluster */}
        <span className="mt-1.5 flex items-center gap-1 border-t border-slate-700/60 pt-1.5 text-xs text-slate-300">
          {parsedWord.clusters.map((c, idx) => (
            <span
              key={idx}
              className="flex items-center gap-1 rounded bg-slate-800/80 px-1.5 py-0.5"
            >
              <span className="font-serif text-amber-200">{c.combined}</span>
              <span className="text-[10px] text-emerald-300 font-semibold">
                {c.combinedPhonetic}
              </span>
            </span>
          ))}
        </span>

        {/* Downward pointing tooltip arrow */}
        <span className="absolute top-full left-1/2 -mt-[1px] -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
      </span>
    </span>
  );
}
