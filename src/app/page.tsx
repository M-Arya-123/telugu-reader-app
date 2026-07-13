import Image from "next/image";
import { sampleArticle } from "@/data/sampleArticle";

export default function Home() {
  return (
    <main className="min-h-screen bg-white p-10">
      <div className="mx-auto max-w-4x1">
        <h1 className="text-4xl text-black font-bold text-center">
          Telugu Reader App
        </h1>
        <div className="rounded-2x1 border p-8 shadow-sm">
          <h2 className="mb-6 text-2x1 text-black font-semibold">
            {" "}
            Reading Practice
          </h2>
          <p className="text-3x1 text-black leading-loose">{sampleArticle}</p>
        </div>
      </div>
    </main>
  );
}
