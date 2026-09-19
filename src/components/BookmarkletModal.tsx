"use client";

import { useState } from "react";

type BookmarkletModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

// 1. Lightweight Loader Bookmarklet (142 characters) - Never gets truncated by mobile Chrome
const SHORT_BOOKMARKLET_CODE = `javascript:(function(){var s=document.createElement('script');s.src='https://telugu-reader-app.vercel.app/bookmarklet.js?t='+Date.now();document.body.appendChild(s);})();`;

export default function BookmarkletModal({ isOpen, onClose }: BookmarkletModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(SHORT_BOOKMARKLET_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = SHORT_BOOKMARKLET_CODE;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          ✕
        </button>

        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-2xl font-bold text-amber-300 shadow-sm">
            📱
          </span>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Mobile Chrome Bookmarklet
            </h2>
            <p className="text-xs text-slate-500">
              Read any Telugu website with tap-to-transliterate on your phone!
            </p>
          </div>
        </div>

        {/* 1-Click Copy Button */}
        <div className="mb-5 rounded-2xl bg-slate-900 p-4 text-center">
          <button
            onClick={handleCopy}
            className={`w-full rounded-xl py-3 text-sm font-bold tracking-wide transition-all shadow-md ${copied
              ? "bg-emerald-500 text-white"
              : "bg-amber-400 text-slate-950 hover:bg-amber-300 active:scale-[0.98]"
              }`}
          >
            {copied ? "✓ Copied to Clipboard!" : "📋 1-Click Copy Bookmarklet Code"}
          </button>
          <p className="mt-2 text-[11px] text-slate-400">
            Compact 140-char code • Fits phone bookmark limits • Auto-updates
          </p>
        </div>

        {/* Instructions */}
        <div className="space-y-3 text-xs text-slate-600">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            How to set up on your phone:
          </h3>
          <div className="flex items-start gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700">
              1
            </span>
            <p>
              In Chrome or Safari on your phone, <strong>bookmark any webpage</strong> and name it <strong>"Read Telugu"</strong>.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700">
              2
            </span>
            <p>
              Edit the bookmark: clear the URL field completely and <strong>paste the copied code</strong>.
            </p>
          </div>

          {/* Critical Mobile Chrome Tip */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-amber-950">
            <div className="flex items-center gap-1.5 font-bold text-[12px] text-amber-900 mb-1">
              <span>⚠️</span>
              <span>Crucial Mobile Chrome Step (How to run it):</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Mobile Chrome <strong>blocks bookmarks tapped from the Bookmarks menu</strong>. To launch it:
            </p>
            <ol className="mt-1.5 list-decimal pl-4 space-y-1 text-[11px]">
              <li>Open any Telugu site (e.g., <em>eenadu.net</em>).</li>
              <li>Tap the <strong>top URL address bar</strong> and type <strong>"Read Telugu"</strong>.</li>
              <li>Tap the matching item in the dropdown with the <strong>⭐ star/bookmark icon</strong>!</li>
              <li>You will see a <strong>"✨ Telugu Reader Active"</strong> toast at the top. Tap any word to read!</li>
            </ol>
          </div>
        </div>

        {/* Alternative Tip */}
        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3 text-[11px] text-slate-500">
          <span className="font-semibold text-slate-700">💡 Zero-setup alternative: </span>
          You can also just copy any news article link and paste it into the <strong>"Import Web Link"</strong> field on this web app. It will extract and display the article with instant tap-to-read on your phone!
        </div>

        {/* Done button */}
        <button
          onClick={onClose}
          className="mt-4 w-full rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
