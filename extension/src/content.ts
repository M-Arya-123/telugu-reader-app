import { parseTeluguWord } from "../../src/core/parser/parseTeluguWord";
import { TELUGU_UNICODE_REGEX } from "../../src/core/parser/teluguUnicode";

// Create and inject the single global tooltip element
let tooltipElement: HTMLDivElement | null = null;
let tooltipContent: HTMLDivElement | null = null;

// Don't run the extension on the Telugu Reader local dev site to avoid double-tooltips
const isLocalApp = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

// Track whether the reader is active
let isEnabled = !isLocalApp;

// 1. Fetch initial preference from storage
chrome.storage.sync.get({ enabled: true }, (data) => {
  isEnabled = Boolean(data.enabled);
});

// 2. Listen for live updates when the user flips the toggle in popup
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "sync" && changes.enabled) {
    isEnabled = Boolean(changes.enabled.newValue);
    if (!isEnabled) {
      hideTooltip();
    }
  }
});


function initTooltip() {
  if (tooltipElement) return;

  tooltipElement = document.createElement("div");
  tooltipElement.id = "telugu-reader-tooltip";

  tooltipContent = document.createElement("div");
  tooltipContent.className = "tooltip-content";

  const arrow = document.createElement("div");
  arrow.className = "tooltip-arrow";

  tooltipElement.appendChild(tooltipContent);
  tooltipElement.appendChild(arrow);
  document.body.appendChild(tooltipElement);
}

function showTooltip(text: string, x: number, y: number) {
  if (!tooltipElement || !tooltipContent) initTooltip();
  if (!tooltipElement || !tooltipContent) return;

  tooltipContent.textContent = text;
  tooltipElement.style.left = `${x}px`;
  tooltipElement.style.top = `${y}px`;
  tooltipElement.style.display = "block";
}

function hideTooltip() {
  if (tooltipElement) {
    tooltipElement.style.display = "none";
  }
}

// Extract word under caret from mouse coordinates
function getWordAtPoint(x: number, y: number): { word: string; cluster?: string; phonetic?: string; rect?: DOMRect } | null {
  // Use caretPositionFromPoint or caretRangeFromPoint
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

  // If offset is at a boundary (e.g., right edge of the word or space), look back one char
  let char = fullText[offset];
  if (!char || !TELUGU_UNICODE_REGEX.test(char)) {
    if (offset > 0 && TELUGU_UNICODE_REGEX.test(fullText[offset - 1])) {
      offset = offset - 1;
      char = fullText[offset];
    } else {
      return null;
    }
  }

  // Find word boundaries around the offset
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

  // Parse the word using the core parser
  const parsed = parseTeluguWord(rawWord);
  if (!parsed.clusters.length) return null;

  // Find which specific cluster is under the cursor
  let runningLen = wordStart;
  let targetCluster = parsed.clusters[parsed.clusters.length - 1]; // default to last cluster if at end
  let clusterStart = wordStart;

  for (let i = 0; i < parsed.clusters.length; i++) {
    const c = parsed.clusters[i];
    const nextLen = runningLen + c.combined.length;
    // Check if cursor offset falls within this cluster
    if (offset >= runningLen && offset < nextLen) {
      targetCluster = c;
      clusterStart = runningLen;
      break;
    }
    // If offset is exactly at the end of this cluster and it's the last cluster
    if (i === parsed.clusters.length - 1 && offset <= nextLen) {
      targetCluster = c;
      clusterStart = runningLen;
      break;
    }
    runningLen = nextLen;
  }

  // Compute character rect for placing tooltip directly above target character
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
    return {
      word: rawWord,
      cluster: targetCluster.combined,
      phonetic: targetCluster.combinedPhonetic,
    };
  }
}

// Debounce mousemove to keep it fast and responsive
let hoverTimer: number | null = null;

document.addEventListener("mousemove", (e: MouseEvent) => {
  if (!isEnabled) {
    return;
  }


  if (hoverTimer) {
    window.clearTimeout(hoverTimer);
  }

  hoverTimer = window.setTimeout(() => {
    const result = getWordAtPoint(e.clientX, e.clientY);
    if (result && result.phonetic) {
      const x = result.rect ? result.rect.left + result.rect.width / 2 : e.clientX;
      const y = result.rect ? result.rect.top : e.clientY - 10;
      showTooltip(result.phonetic, x, y);
    } else {
      hideTooltip();
    }
  }, 40);
});

// Mobile Touch Support (tap or drag finger over text)
document.addEventListener("touchstart", (e: TouchEvent) => {
  if (!isEnabled || e.touches.length !== 1) return;
  const touch = e.touches[0];
  const result = getWordAtPoint(touch.clientX, touch.clientY);
  if (result && result.phonetic) {
    const x = result.rect ? result.rect.left + result.rect.width / 2 : touch.clientX;
    const y = result.rect ? result.rect.top : touch.clientY - 12;
    showTooltip(result.phonetic, x, y);
  } else {
    hideTooltip();
  }
}, { passive: true });

document.addEventListener("touchmove", (e: TouchEvent) => {
  if (!isEnabled || e.touches.length !== 1) return;
  const touch = e.touches[0];
  const result = getWordAtPoint(touch.clientX, touch.clientY);
  if (result && result.phonetic) {
    const x = result.rect ? result.rect.left + result.rect.width / 2 : touch.clientX;
    const y = result.rect ? result.rect.top : touch.clientY - 12;
    showTooltip(result.phonetic, x, y);
  }
}, { passive: true });

// Hide on scroll
window.addEventListener("scroll", hideTooltip, { passive: true });
