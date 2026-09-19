import ParserPlayground from "@/components/parser/ParserPlayground";
import ArticleRenderer from "@/components/reader/ArticleRenderer";

export default function PlaygroundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-10 text-slate-900">
      <div className="max-w-xl rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-4 text-xl font-bold text-slate-800">Reader Popup Test</h1>
        <p className="mb-4 text-sm text-slate-500">
          Hover over any character to see the phonetic transliteration popup:
        </p>
        <div className="text-3xl font-medium leading-relaxed tracking-wide">
          <ArticleRenderer text="తెలుగు ప్రపంచం నమస్కారం" />
        </div>
      </div>
    </div>
  );
}
