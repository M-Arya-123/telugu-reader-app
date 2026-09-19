import { parseTeluguWord } from "../../src/core/parser/parseTeluguWord";
import { TELUGU_UNICODE_REGEX } from "../../src/core/parser/teluguUnicode";

// Prevent double injection
if ((window as any).__teluguReaderLoaded) {
  alert("Telugu Reader is already active! Tap any Telugu word.");
} else {
  (window as any).__teluguReaderLoaded = true;

  // 1. Inject CSS for tooltip and amber highlight
  const css = `
    #telugu-reader-tooltip {
      position: fixed;
      z-index: 2147483647;
      pointer-events: none;
      display: none;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      transform: translate(-50%, -100%);
      margin-top: -8px;
      filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.25));
    }
    #telugu-reader-tooltip .tooltip-content {
      background-color: #0f172a;
      color: #34d399;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.03em;
      padding: 5px 10px;
      border-radius: 8px;
      white-space: nowrap;
      position: relative;
      line-height: 1.2;
    }
    #telugu-reader-tooltip .tooltip-arrow {
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-width: 6px;
      border-style: solid;
      border-color: #0f172a transparent transparent transparent;
    }
    #telugu-reader-highlight {
      position: fixed;
      z-index: 2147483646;
      pointer-events: none;
      display: none;
      background-color: #fef3c7; /* amber-100 */
      border-radius: 3px;
      mix-blend-mode: multiply;
      transition: all 0.15s ease-out;
    }
  `;
  const styleEl = document.createElement("style");
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // 2. Inject Highlight Overlay & Tooltip DOM
  const highlightElement = document.createElement("div");
  highlightElement.id = "telugu-reader-highlight";
  document.body.appendChild(highlightElement);

  const tooltipElement = document.createElement("div");
  tooltipElement.id = "telugu-reader-tooltip";

  const tooltipContent = document.createElement("div");
  tooltipContent.className = "tooltip-content";

  const arrow = document.createElement("div");
  arrow.className = "tooltip-arrow";

  tooltipElement.appendChild(tooltipContent);
  tooltipElement.appendChild(arrow);
  document.body.appendChild(tooltipElement);

  function showAt(text: string, rect: DOMRect) {
    // 1. Position amber highlight exactly over the character
    highlightElement.style.left = `${rect.left}px`;
    highlightElement.style.top = `${rect.top}px`;
    highlightElement.style.width = `${rect.width}px`;
    highlightElement.style.height = `${rect.height}px`;
    highlightElement.style.display = "block";

    // 2. Position tooltip directly above the character
    tooltipContent.textContent = text;
    tooltipElement.style.left = `${rect.left + rect.width / 2}px`;
    tooltipElement.style.top = `${rect.top}px`;
    tooltipElement.style.display = "block";
  }

  function hideAll() {
    highlightElement.style.display = "none";
    tooltipElement.style.display = "none";
  }

  // 3. Offset and Character Detection
  function getWordAtPoint(x: number, y: number) {
    let range: Range | null = null;
    const doc = document as any;

    if (doc.caretRangeFromPoint) {
      range = doc.caretRangeFromPoint(x, y);
    } else if (doc.caretPositionFromPoint) {
      const pos = doc.caretPositionFromPoint(x, y);
      if (pos && pos.offsetNode) {
        range = document.createRange();
        range.setStart(pos.offsetNode, pos.offset);
        range.collapse(true);
      }
    }

    if (!range || !range.startContainer || range.startContainer.nodeType !== Node.TEXT_NODE) {
      return null;
    }

    const textNode = range.startContainer as Text;
    const fullText = textNode.textContent || "";
    let offset = range.startOffset;

    let char = fullText[offset];
    if (!char || !TELUGU_UNICODE_REGEX.test(char)) {
      if (offset > 0 && TELUGU_UNICODE_REGEX.test(fullText[offset - 1])) {
        offset = offset - 1;
        char = fullText[offset];
      } else {
        return null;
      }
    }

    let wordStart = offset;
    while (wordStart > 0 && !/\s|[.,\/#!$%\^&\*;:{}=\-_`~()?]/.test(fullText[wordStart - 1])) {
      wordStart--;
    }

    let wordEnd = offset;
    while (wordEnd < fullText.length && !/\s|[.,\/#!$%\^&\*;:{}=\-_`~()?]/.test(fullText[wordEnd])) {
      wordEnd++;
    }

    const rawWord = fullText.slice(wordStart, wordEnd);
    if (!rawWord || !TELUGU_UNICODE_REGEX.test(rawWord)) {
      return null;
    }

    const parsed = parseTeluguWord(rawWord);
    if (!parsed.clusters.length) return null;

    let runningLen = wordStart;
    let targetCluster = parsed.clusters[parsed.clusters.length - 1];
    let clusterStart = wordStart;

    for (let i = 0; i < parsed.clusters.length; i++) {
      const c = parsed.clusters[i];
      const nextLen = runningLen + c.combined.length;
      if (offset >= runningLen && offset < nextLen) {
        targetCluster = c;
        clusterStart = runningLen;
        break;
      }
      if (i === parsed.clusters.length - 1 && offset <= nextLen) {
        targetCluster = c;
        clusterStart = runningLen;
        break;
      }
      runningLen = nextLen;
    }

    try {
      const charRange = document.createRange();
      charRange.setStart(textNode, Math.max(0, clusterStart));
      charRange.setEnd(textNode, Math.min(fullText.length, clusterStart + targetCluster.combined.length));
      const rect = charRange.getBoundingClientRect();
      return {
        word: rawWord,
        cluster: targetCluster.combined,
        phonetic: targetCluster.combinedPhonetic,
        rect,
      };
    } catch (e) {
      return null;
    }
  }

  // 4. Tap Handler (Click or Mobile Tap)
  // Clear any accidental text selection triggered by touch
  function handleTap(clientX: number, clientY: number) {
    const result = getWordAtPoint(clientX, clientY);
    if (result && result.phonetic && result.rect) {
      // Clear native text selection to kill the "Copy / Paste" menu
      const sel = window.getSelection();
      if (sel) sel.removeAllRanges();
      showAt(result.phonetic, result.rect);
    } else {
      hideAll();
    }
  }

  // Tap listener for both mobile and desktop
  document.addEventListener("click", (e: MouseEvent) => {
    handleTap(e.clientX, e.clientY);
  });

  // Tap on touch devices
  document.addEventListener("touchend", (e: TouchEvent) => {
    if (e.changedTouches.length !== 1) return;
    const touch = e.changedTouches[0];
    handleTap(touch.clientX, touch.clientY);
  });

  // Prevent default copy/select popup on long press
  document.addEventListener("contextmenu", (e) => {
    const result = getWordAtPoint(e.clientX, e.clientY);
    if (result) {
      e.preventDefault();
      if (result.phonetic && result.rect) {
        showAt(result.phonetic, result.rect);
      }
    }
  });

  window.addEventListener("scroll", hideAll, { passive: true });
}
