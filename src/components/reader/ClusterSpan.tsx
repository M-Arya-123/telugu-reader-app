"use client";

import { useState } from "react";

import type { TeluguCluster } from "@/core/parser/types";
import TransliterationPopup from "./TransliterationPopup";

type ClusterSpanProps = {
  clusterId: string;
  cluster: TeluguCluster;
  isPracticeMode?: boolean;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
};

export default function ClusterSpan({
  clusterId,
  cluster,
  isPracticeMode = false,
  activeId,
  setActiveId,
}: ClusterSpanProps) {
  const isClusterActive = activeId === clusterId;

  return (
    <span
      className={`relative inline cursor-pointer rounded px-0.5 transition-colors ${
        isPracticeMode
          ? isClusterActive
            ? "bg-emerald-100 text-emerald-900 border-b-2 border-emerald-500"
            : "hover:bg-amber-100/60 border-b border-dashed border-slate-400"
          : isClusterActive
          ? "bg-amber-100 text-amber-900"
          : "hover:bg-amber-100 hover:text-amber-900"
      }`}
      onMouseEnter={() => !isPracticeMode && setActiveId(clusterId)}
      onMouseLeave={() => !isPracticeMode && setActiveId(null)}
      onClick={() => {
        if (isPracticeMode) {
          setActiveId(isClusterActive ? null : clusterId);
        }
      }}
    >
      {cluster.combined}

      {isClusterActive && <TransliterationPopup cluster={cluster} />}
    </span>
  );
}
