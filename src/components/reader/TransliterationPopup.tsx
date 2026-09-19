import type { TeluguCluster } from "@/core/parser/types";

type TransliterationPopupProps = {
  cluster: TeluguCluster;
};

export default function TransliterationPopup({
  cluster,
}: TransliterationPopupProps) {
  // Check if this character has parts to break down (conjunct consonants, matras, or anusvara)
  const isConjunct = cluster.consonants && cluster.consonants.length > 1;
  const hasMatra = Boolean(cluster.matra);
  const hasAnusvara = Boolean(cluster.anusvara);
  const hasBreakdown = isConjunct || hasMatra || hasAnusvara;

  return (
    <span
      role="tooltip"
      className="pointer-events-none absolute bottom-[115%] left-1/2 z-50 -translate-x-1/2 select-none"
    >
      <span className="relative flex flex-col items-center rounded-lg bg-slate-900 px-2.5 py-1 text-white shadow-xl whitespace-nowrap border border-slate-700/80">
        {/* Main Pronunciation */}
        <span className="text-sm font-bold tracking-wide text-emerald-400">
          {cluster.combinedPhonetic}
        </span>

        {/* Educational Breakdown: Consonant + Matra / Conjunct Equation */}
        {hasBreakdown && (
          <span className="mt-0.5 flex items-center gap-1 border-t border-slate-700/60 pt-0.5 text-[11px] text-slate-300 font-normal">
            {/* Consonant(s) */}
            {cluster.consonants.map((c, idx) => (
              <span key={idx} className="flex items-center gap-0.5">
                <span className="text-amber-300 font-serif">{c.telugu}</span>
                <span className="text-[10px] text-slate-400">({c.phonetic})</span>
                {idx < cluster.consonants.length - 1 && (
                  <span className="text-slate-500 font-sans mx-0.5">+</span>
                )}
              </span>
            ))}

            {/* Matra (Vowel Sign) */}
            {cluster.matra && (
              <>
                <span className="text-slate-500 font-sans mx-0.5">+</span>
                <span className="flex items-center gap-0.5 text-sky-300">
                  <span className="font-serif">{cluster.matra.telugu}</span>
                  <span className="text-[10px] text-sky-400">({cluster.matra.phonetic})</span>
                </span>
              </>
            )}

            {/* Anusvara (Sunna / ం) */}
            {cluster.anusvara && (
              <>
                <span className="text-slate-500 font-sans mx-0.5">+</span>
                <span className="flex items-center gap-0.5 text-amber-200">
                  <span className="font-serif">{cluster.anusvara}</span>
                  <span className="text-[10px] text-amber-400">(m)</span>
                </span>
              </>
            )}
          </span>
        )}

        {/* Downward pointing tooltip arrow */}
        <span className="absolute top-full left-1/2 -mt-[1px] -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
      </span>
    </span>
  );
}
