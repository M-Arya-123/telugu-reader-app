import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Please provide a valid article URL" },
        { status: 400 }
      );
    }

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL. Please enter a full link including https://" },
        { status: 400 }
      );
    }

    // Fetch the webpage HTML with a realistic desktop/mobile User-Agent
    const res = await fetch(parsedUrl.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,te;q=0.8",
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Could not fetch article (Status: ${res.status}). The website might be blocking requests.` },
        { status: 502 }
      );
    }

    const html = await res.text();

    // 1. Extract Title
    let title = "";
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    if (titleMatch) {
      title = titleMatch[1]
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();
    }

    // 2. Extract Telugu Paragraphs
    // Find all <p> tags
    const pMatches = html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi);
    const teluguParagraphs: string[] = [];
    const teluguRegex = /[\u0C00-\u0C7F]/;

    for (const match of pMatches) {
      // Strip inner HTML tags like <span>, <a>, <strong>
      const cleanText = match[1]
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, " ")
        .trim();

      // Only include paragraphs that actually contain meaningful Telugu text
      if (cleanText.length > 20 && teluguRegex.test(cleanText)) {
        teluguParagraphs.push(cleanText);
      }
    }

    if (teluguParagraphs.length === 0) {
      return NextResponse.json(
        {
          error:
            "No readable Telugu paragraphs found. The site might be using JavaScript to render text or protecting content.",
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      title: title || "Imported Telugu Article",
      content: teluguParagraphs.join("\n\n"),
      paragraphCount: teluguParagraphs.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to process the article URL" },
      { status: 500 }
    );
  }
}
