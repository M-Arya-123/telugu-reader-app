"use client";

import { useState } from "react";
import ArticleRenderer from "@/components/reader/ArticleRenderer";
import { sampleArticles, SampleArticle } from "@/data/sampleArticles";
import BookmarkletModal from "@/components/BookmarkletModal";

export default function Home() {
  const [selectedArticle, setSelectedArticle] = useState<SampleArticle>(sampleArticles[0]);
  const [fontSize, setFontSize] = useState<"text-2xl" | "text-3xl" | "text-4xl">("text-3xl");
  const [readingMode, setReadingMode] = useState<"letter" | "word">("letter");
  const [isPracticeMode, setIsPracticeMode] = useState<boolean>(false);
  const [isBookmarkletOpen, setIsBookmarkletOpen] = useState<boolean>(false);
  const [customText, setCustomText] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"samples" | "custom" | "url">("samples");

  // URL Importer State
  const [inputUrl, setInputUrl] = useState<string>("");
  const [isLoadingUrl, setIsLoadingUrl] = useState<boolean>(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [importedArticle, setImportedArticle] = useState<{ title: string; content: string } | null>(null);

  async function handleFetchArticle(e: React.FormEvent) {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    setIsLoadingUrl(true);
    setUrlError(null);

    try {
      const res = await fetch("/api/fetch-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: inputUrl.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to load article");
      }

      setImportedArticle({
        title: data.title,
        content: data.content,
      });
    } catch (err: any) {
      setUrlError(err?.message || "Could not fetch article. Please check the URL.");
    } finally {
      setIsLoadingUrl(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-amber-200">
      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white shadow-xs">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 font-serif text-xl font-bold text-amber-300 shadow-sm">
              తె
            </span>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">
                Telugu Reading Assistant
              </h1>
              <p className="text-xs text-slate-500">
                Phonetic transliteration for Telugu script learners
              </p>
            </div>
          </div>

          {/* Reading Controls: Phone Tool, Practice Mode, Mode Toggle & Font Size */}
          <div className="flex items-center gap-2.5">
            {/* Mobile Bookmarklet Button */}
            <button
              onClick={() => setIsBookmarkletOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-95"
            >
              <span>📱</span>
              <span>Phone Tool</span>
            </button>

            {/* Practice Mode Toggle */}
            <button
              onClick={() => setIsPracticeMode(!isPracticeMode)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${isPracticeMode
                  ? "border-emerald-600 bg-emerald-600 text-white shadow-xs"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                }`}
            >
              <span>🎯</span>
              <span>{isPracticeMode ? "Practice: ON" : "Practice Mode"}</span>
            </button>

            {/* Mode Toggle: Letter vs Word */}
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs font-semibold text-slate-600">
              <button
                onClick={() => setReadingMode("letter")}
                className={`flex items-center gap-1 rounded px-2.5 py-1 transition-colors ${readingMode === "letter"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "hover:text-slate-900"
                  }`}
              >
                <span>🔤</span>
                <span>Letter</span>
              </button>
              <button
                onClick={() => setReadingMode("word")}
                className={`flex items-center gap-1 rounded px-2.5 py-1 transition-colors ${readingMode === "word"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "hover:text-slate-900"
                  }`}
              >
                <span>📖</span>
                <span>Word</span>
              </button>
            </div>

            {/* Font Size Adjuster */}
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs font-semibold text-slate-600">
              <button
                onClick={() => setFontSize("text-2xl")}
                className={`rounded px-2.5 py-1 transition-colors ${fontSize === "text-2xl" ? "bg-white text-slate-900 shadow-xs" : "hover:text-slate-900"
                  }`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize("text-3xl")}
                className={`rounded px-2.5 py-1 transition-colors ${fontSize === "text-3xl" ? "bg-white text-slate-900 shadow-xs" : "hover:text-slate-900"
                  }`}
              >
                A+
              </button>
              <button
                onClick={() => setFontSize("text-4xl")}
                className={`rounded px-2.5 py-1 transition-colors ${fontSize === "text-4xl" ? "bg-white text-slate-900 shadow-xs" : "hover:text-slate-900"
                  }`}
              >
                A++
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Navigation Tabs */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex flex-wrap gap-2">
            {sampleArticles.map((article) => {
              const isActive = activeTab === "samples" && selectedArticle.id === article.id;
              return (
                <button
                  key={article.id}
                  onClick={() => {
                    setSelectedArticle(article);
                    setActiveTab("samples");
                  }}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                    }`}
                >
                  <span className="mr-1.5 opacity-75">{article.difficultyLabel.split(" • ")[0]}</span>
                  {article.title}
                </button>
              );
            })}

            {/* Custom Input Tab */}
            <button
              onClick={() => setActiveTab("custom")}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${activeTab === "custom"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                }`}
            >
              ✍️ Paste Text
            </button>

            {/* Import URL Tab */}
            <button
              onClick={() => setActiveTab("url")}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${activeTab === "url"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                }`}
            >
              🌐 Import URL
            </button>
          </div>

          <div className="text-xs text-slate-500">
            {isPracticeMode ? (
              <span className="font-semibold text-emerald-700">
                🎯 Self-Test: Read in your head first! Click any letter or word to reveal.
              </span>
            ) : (
              <span>💡 Hover or tap any character to reveal pronunciation</span>
            )}
          </div>
        </div>

        {/* Custom Text Mode Input */}
        {activeTab === "custom" && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <label className="mb-2 block text-sm font-semibold text-slate-800">
              Paste any Telugu text or article to practice reading:
            </label>
            <textarea
              rows={3}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="ఇక్కడ తెలుగు వాక్యాలను పేస్ట్ చేయండి (Paste Telugu sentences here)..."
              className="w-full rounded-xl border border-slate-200 p-3 text-base outline-none transition-focus focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
          </div>
        )}

        {/* URL Importer Form */}
        {activeTab === "url" && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <label className="mb-2 block text-sm font-semibold text-slate-800">
              Enter any Telugu article link:
            </label>
            <form onSubmit={handleFetchArticle} className="flex gap-2">
              <input
                type="url"
                required
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://www.eenadu.net/telugu-news/..."
                className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition-focus focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />
              <button
                type="submit"
                disabled={isLoadingUrl}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-slate-800 disabled:opacity-50"
              >
                {isLoadingUrl ? "Fetching..." : "Fetch & Read"}
              </button>
            </form>
            {urlError && (
              <p className="mt-2 text-xs font-medium text-rose-600">
                ⚠️ {urlError}
              </p>
            )}
          </div>
        )}

        {/* Article Reading Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs sm:p-10">
          {activeTab === "samples" && (
            <div className="mb-8 border-b border-slate-100 pb-6">
              <div className="mb-2 flex items-center gap-2.5">
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold tracking-wide text-emerald-700">
                  {selectedArticle.difficultyLabel}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-medium text-slate-500">
                  {selectedArticle.englishTitle}
                </span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                {selectedArticle.title}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {selectedArticle.description}
              </p>
            </div>
          )}

          {activeTab === "url" && importedArticle && (
            <div className="mb-8 border-b border-slate-100 pb-6">
              <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-bold tracking-wide text-sky-700">
                🌐 Live Imported Article
              </span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                {importedArticle.title}
              </h2>
            </div>
          )}

          {/* Render Telugu text with interactive clusters */}
          <div className={`${fontSize} font-normal tracking-wide text-slate-800`}>
            {activeTab === "custom" ? (
              customText.trim() ? (
                <ArticleRenderer
                  text={customText}
                  mode={readingMode}
                  isPracticeMode={isPracticeMode}
                />
              ) : (
                <p className="text-base italic text-slate-400">
                  Paste some Telugu text above to start reading...
                </p>
              )
            ) : activeTab === "url" ? (
              importedArticle ? (
                <ArticleRenderer
                  text={importedArticle.content}
                  mode={readingMode}
                  isPracticeMode={isPracticeMode}
                />
              ) : (
                <p className="text-base italic text-slate-400">
                  Paste a article link above and click "Fetch & Read" to load it here...
                </p>
              )
            ) : (
              <ArticleRenderer
                text={selectedArticle.content}
                mode={readingMode}
                isPracticeMode={isPracticeMode}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bookmarklet Modal */}
      <BookmarkletModal
        isOpen={isBookmarkletOpen}
        onClose={() => setIsBookmarkletOpen(false)}
      />
    </main>
  );
}
