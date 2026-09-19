"use strict";
(() => {
  // src/core/parser/teluguUnicode.ts
  var TELUGU_VIRAMA = "\u0C4D";
  var TELUGU_ANUSVARA = "\u0C02";
  var TELUGU_MAATRAS = [
    "\u0C3E",
    // aa
    "\u0C3F",
    // i
    "\u0C40",
    // ii
    "\u0C41",
    // u
    "\u0C42",
    // uu
    "\u0C43",
    // ru
    "\u0C46",
    // e
    "\u0C47",
    // ee
    "\u0C48",
    // ai
    "\u0C4A",
    // o
    "\u0C4B",
    // oo
    "\u0C4C"
    // au
  ];
  var TELUGU_VOWELS = [
    "\u0C05",
    "\u0C06",
    "\u0C07",
    "\u0C08",
    "\u0C09",
    "\u0C0A",
    "\u0C0B",
    "\u0C0E",
    "\u0C0F",
    "\u0C10",
    "\u0C12",
    "\u0C13",
    "\u0C14"
  ];
  var TELUGU_CONSONANTS = [
    "\u0C15",
    "\u0C16",
    "\u0C17",
    "\u0C18",
    "\u0C19",
    "\u0C1A",
    "\u0C1B",
    "\u0C1C",
    "\u0C1D",
    "\u0C1E",
    "\u0C1F",
    "\u0C20",
    "\u0C21",
    "\u0C22",
    "\u0C23",
    "\u0C24",
    "\u0C25",
    "\u0C26",
    "\u0C27",
    "\u0C28",
    "\u0C2A",
    "\u0C2B",
    "\u0C2C",
    "\u0C2D",
    "\u0C2E",
    "\u0C2F",
    "\u0C30",
    "\u0C32",
    "\u0C35",
    "\u0C36",
    "\u0C37",
    "\u0C38",
    "\u0C39",
    "\u0C33",
    "\u0C15\u0C4D\u0C37",
    "\u0C31"
  ];
  var TELUGU_UNICODE_REGEX = /[\u0C00-\u0C7F]/;
  function isMatra(char) {
    return TELUGU_MAATRAS.includes(char);
  }
  function isConsonant(char) {
    return TELUGU_CONSONANTS.includes(char);
  }
  function isVowel(char) {
    return TELUGU_VOWELS.includes(char);
  }
  function isVirama(char) {
    return char === TELUGU_VIRAMA;
  }
  function isAnusvara(char) {
    return char === TELUGU_ANUSVARA;
  }

  // src/core/parser/segmentTelugu.ts
  function segmentTelugu(word) {
    const clusters = [];
    let i = 0;
    while (i < word.length) {
      const currentChar = word[i];
      if (isVowel(currentChar)) {
        let combined = currentChar;
        let anusvara;
        if (word[i + 1] && isAnusvara(word[i + 1])) {
          anusvara = word[i + 1];
          combined += anusvara;
          i++;
        }
        clusters.push({
          vowel: currentChar,
          anusvara,
          combined
        });
        i++;
        continue;
      }
      if (isConsonant(currentChar)) {
        const consonants = [];
        let combined = "";
        consonants.push({
          telugu: currentChar,
          hasVirama: false
        });
        combined += currentChar;
        while (word[i + 1] && isVirama(word[i + 1])) {
          combined += word[i + 1];
          const nextConsonant = word[i + 2];
          if (nextConsonant && isConsonant(nextConsonant)) {
            consonants[consonants.length - 1].hasVirama = true;
            consonants.push({
              telugu: nextConsonant,
              hasVirama: false
            });
            combined += nextConsonant;
            i += 2;
          } else {
            break;
          }
        }
        let matra;
        if (word[i + 1] && isMatra(word[i + 1])) {
          matra = word[i + 1];
          combined += matra;
          i++;
        }
        let anusvara;
        if (word[i + 1] && isAnusvara(word[i + 1])) {
          anusvara = word[i + 1];
          combined += anusvara;
          i++;
        }
        clusters.push({
          consonants,
          matra,
          anusvara,
          combined
        });
        i++;
        continue;
      }
      i++;
    }
    return clusters;
  }

  // src/core/parser/phoneticMap.ts
  var VOWEL_SOUNDS = {
    "\u0C05": "a",
    "\u0C06": "aa",
    "\u0C07": "i",
    "\u0C08": "ee",
    "\u0C09": "u",
    "\u0C0A": "oo",
    "\u0C0B": "ru",
    "\u0C60": "roo",
    "\u0C0C": "lu",
    "\u0C61": "loo",
    "\u0C0E": "e",
    "\u0C0F": "ee",
    "\u0C10": "ai",
    "\u0C12": "o",
    "\u0C13": "oo",
    "\u0C14": "au"
  };
  var MATRA_SOUNDS = {
    "\u0C3E": "aa",
    "\u0C3F": "i",
    "\u0C40": "ee",
    "\u0C41": "u",
    "\u0C42": "oo",
    "\u0C43": "ru",
    "\u0C44": "roo",
    "\u0C46": "e",
    "\u0C47": "ee",
    "\u0C48": "ai",
    "\u0C4A": "o",
    "\u0C4B": "oo",
    "\u0C4C": "au"
  };
  var CONSONANT_SOUNDS = {
    // Velars
    "\u0C15": "ka",
    "\u0C16": "kha",
    "\u0C17": "ga",
    "\u0C18": "gha",
    "\u0C19": "nga",
    // Palatals
    "\u0C1A": "cha",
    "\u0C1B": "chha",
    "\u0C1C": "ja",
    "\u0C1D": "jha",
    "\u0C1E": "nya",
    // Retroflex
    "\u0C1F": "ta",
    "\u0C20": "tha",
    "\u0C21": "da",
    "\u0C22": "dha",
    "\u0C23": "na",
    // Dentals
    "\u0C24": "ta",
    "\u0C25": "tha",
    "\u0C26": "da",
    "\u0C27": "dha",
    "\u0C28": "na",
    // Labials
    "\u0C2A": "pa",
    "\u0C2B": "pha",
    "\u0C2C": "ba",
    "\u0C2D": "bha",
    "\u0C2E": "ma",
    // Semivowels
    "\u0C2F": "ya",
    "\u0C30": "ra",
    "\u0C32": "la",
    "\u0C35": "va",
    // Sibilants
    "\u0C36": "sha",
    "\u0C37": "sha",
    "\u0C38": "sa",
    // Aspirate
    "\u0C39": "ha",
    // Additional Telugu letters
    "\u0C33": "la",
    "\u0C31": "ra"
  };

  // src/core/parser/transliterate.ts
  var SPECIAL_CLUSTERS = {
    // క్ + ష
    "\u0C15\u0C4D\u0C37": "ksha",
    // జ్ + ఞ
    "\u0C1C\u0C4D\u0C1E": "gnya",
    // శ్ + ర
    "\u0C36\u0C4D\u0C30": "shra"
  };
  function removeTrailingA(sound) {
    if (sound.endsWith("a")) {
      return sound.slice(0, -1);
    }
    return sound;
  }
  function getAnusvaraSound(nextCluster) {
    if (!nextCluster?.consonants?.length)
      return "m";
    const next = nextCluster.consonants[0].telugu;
    if ("\u0C15\u0C16\u0C17\u0C18\u0C19".includes(next))
      return "ng";
    if ("\u0C2A\u0C2B\u0C2C\u0C2D\u0C2E".includes(next))
      return "m";
    return "n";
  }
  function transliterateCluster(cluster, nextCluster) {
    if (cluster.vowel) {
      const vowelSound = VOWEL_SOUNDS[cluster.vowel] || "[unknown]";
      let combinedPhonetic2 = vowelSound;
      if (cluster.anusvara) {
        combinedPhonetic2 += getAnusvaraSound(nextCluster);
      }
      return {
        // Vowels have no consonant list
        consonants: [],
        anusvara: cluster.anusvara,
        // IMPORTANT:
        // Use the parser's combined text,
        // not just the vowel.
        combined: cluster.combined,
        combinedPhonetic: combinedPhonetic2
      };
    }
    const consonants = [];
    let combinedPhonetic = "";
    const specialPronunciation = SPECIAL_CLUSTERS[cluster.combined];
    if (specialPronunciation) {
      const consonants2 = (cluster.consonants ?? []).map((c) => ({
        telugu: c.telugu,
        phonetic: CONSONANT_SOUNDS[c.telugu] || "[unknown]",
        hasVirama: c.hasVirama
      }));
      return {
        consonants: consonants2,
        combined: cluster.combined,
        combinedPhonetic: specialPronunciation
      };
    }
    for (const consonant of cluster.consonants ?? []) {
      let sound = CONSONANT_SOUNDS[consonant.telugu] || "[unknown]";
      consonants.push({
        telugu: consonant.telugu,
        phonetic: sound,
        hasVirama: consonant.hasVirama
      });
      if (consonant.hasVirama) {
        sound = removeTrailingA(sound);
      }
      combinedPhonetic += sound;
    }
    let matra;
    if (cluster.matra) {
      const matraSound = MATRA_SOUNDS[cluster.matra] || "[unknown]";
      combinedPhonetic = removeTrailingA(combinedPhonetic) + matraSound;
      matra = {
        telugu: cluster.matra,
        phonetic: matraSound
      };
    }
    if (cluster.anusvara) {
      combinedPhonetic += getAnusvaraSound(nextCluster);
    }
    return {
      consonants,
      matra,
      anusvara: cluster.anusvara,
      combined: cluster.combined,
      combinedPhonetic
    };
  }

  // src/core/parser/parseTeluguWord.ts
  function parseTeluguWord(word) {
    const segmentedClusters = segmentTelugu(word);
    const parsedClusters = [];
    for (let i = 0; i < segmentedClusters.length; i++) {
      const currentCluster = segmentedClusters[i];
      const nextCluster = segmentedClusters[i + 1];
      const transliteratedCluster = transliterateCluster(
        currentCluster,
        nextCluster
      );
      parsedClusters.push(
        transliteratedCluster
      );
    }
    return {
      // Original Telugu input
      original: word,
      // Fully parsed educational clusters
      clusters: parsedClusters
    };
  }

  // extension/src/content.ts
  var tooltipElement = null;
  var tooltipContent = null;
  var isLocalApp = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  var isEnabled = !isLocalApp;
  chrome.storage.sync.get({ enabled: true }, (data) => {
    isEnabled = Boolean(data.enabled);
  });
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
  function showTooltip(text, x, y) {
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
  function getWordAtPoint(x, y) {
    let range = null;
    const doc = document;
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
    const textNode = range.startContainer;
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
        rect
      };
    } catch (e) {
      return {
        word: rawWord,
        cluster: targetCluster.combined,
        phonetic: targetCluster.combinedPhonetic
      };
    }
  }
  var hoverTimer = null;
  document.addEventListener("mousemove", (e) => {
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
  document.addEventListener("touchstart", (e) => {
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
  document.addEventListener("touchmove", (e) => {
    if (!isEnabled || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const result = getWordAtPoint(touch.clientX, touch.clientY);
    if (result && result.phonetic) {
      const x = result.rect ? result.rect.left + result.rect.width / 2 : touch.clientX;
      const y = result.rect ? result.rect.top : touch.clientY - 12;
      showTooltip(result.phonetic, x, y);
    }
  }, { passive: true });
  window.addEventListener("scroll", hideTooltip, { passive: true });
})();
