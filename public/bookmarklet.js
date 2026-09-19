"use strict";(()=>{var B=["\u0C3E","\u0C3F","\u0C40","\u0C41","\u0C42","\u0C43","\u0C46","\u0C47","\u0C48","\u0C4A","\u0C4B","\u0C4C"],Y=["\u0C05","\u0C06","\u0C07","\u0C08","\u0C09","\u0C0A","\u0C0B","\u0C0E","\u0C0F","\u0C10","\u0C12","\u0C13","\u0C14"],j=["\u0C15","\u0C16","\u0C17","\u0C18","\u0C19","\u0C1A","\u0C1B","\u0C1C","\u0C1D","\u0C1E","\u0C1F","\u0C20","\u0C21","\u0C22","\u0C23","\u0C24","\u0C25","\u0C26","\u0C27","\u0C28","\u0C2A","\u0C2B","\u0C2C","\u0C2D","\u0C2E","\u0C2F","\u0C30","\u0C32","\u0C35","\u0C36","\u0C37","\u0C38","\u0C39","\u0C33","\u0C15\u0C4D\u0C37","\u0C31"],E=/[\u0C00-\u0C7F]/;function P(t){return B.includes(t)}function L(t){return j.includes(t)}function k(t){return Y.includes(t)}function D(t){return t==="\u0C4D"}function O(t){return t==="\u0C02"}function M(t){let o=[],e=0;for(;e<t.length;){let n=t[e];if(k(n)){let l=n,r;t[e+1]&&O(t[e+1])&&(r=t[e+1],l+=r,e++),o.push({vowel:n,anusvara:r,combined:l}),e++;continue}if(L(n)){let l=[],r="";for(l.push({telugu:n,hasVirama:!1}),r+=n;t[e+1]&&D(t[e+1]);){r+=t[e+1];let m=t[e+2];if(m&&L(m))l[l.length-1].hasVirama=!0,l.push({telugu:m,hasVirama:!1}),r+=m,e+=2;else break}let s;t[e+1]&&P(t[e+1])&&(s=t[e+1],r+=s,e++);let i;t[e+1]&&O(t[e+1])&&(i=t[e+1],r+=i,e++),o.push({consonants:l,matra:s,anusvara:i,combined:r}),e++;continue}e++}return o}var G={\u0C05:"a",\u0C06:"aa",\u0C07:"i",\u0C08:"ee",\u0C09:"u",\u0C0A:"oo",\u0C0B:"ru",\u0C60:"roo",\u0C0C:"lu",\u0C61:"loo",\u0C0E:"e",\u0C0F:"ee",\u0C10:"ai",\u0C12:"o",\u0C13:"oo",\u0C14:"au"},I={"\u0C3E":"aa","\u0C3F":"i","\u0C40":"ee","\u0C41":"u","\u0C42":"oo","\u0C43":"ru","\u0C44":"roo","\u0C46":"e","\u0C47":"ee","\u0C48":"ai","\u0C4A":"o","\u0C4B":"oo","\u0C4C":"au"},V={\u0C15:"ka",\u0C16:"kha",\u0C17:"ga",\u0C18:"gha",\u0C19:"nga",\u0C1A:"cha",\u0C1B:"chha",\u0C1C:"ja",\u0C1D:"jha",\u0C1E:"nya",\u0C1F:"ta",\u0C20:"tha",\u0C21:"da",\u0C22:"dha",\u0C23:"na",\u0C24:"ta",\u0C25:"tha",\u0C26:"da",\u0C27:"dha",\u0C28:"na",\u0C2A:"pa",\u0C2B:"pha",\u0C2C:"ba",\u0C2D:"bha",\u0C2E:"ma",\u0C2F:"ya",\u0C30:"ra",\u0C32:"la",\u0C35:"va",\u0C36:"sha",\u0C37:"sha",\u0C38:"sa",\u0C39:"ha",\u0C33:"la",\u0C31:"ra"};var q={\u0C15\u0C4D\u0C37:"ksha",\u0C1C\u0C4D\u0C1E:"gnya",\u0C36\u0C4D\u0C30:"shra"};function X(t){return t.endsWith("a")?t.slice(0,-1):t}function W(t){if(!t?.consonants?.length)return"m";let o=t.consonants[0].telugu;return"\u0C15\u0C16\u0C17\u0C18\u0C19".includes(o)?"ng":"\u0C2A\u0C2B\u0C2C\u0C2D\u0C2E".includes(o)?"m":"n"}function $(t,o){if(t.vowel){let i=G[t.vowel]||"[unknown]";return t.anusvara&&(i+=W(o)),{consonants:[],anusvara:t.anusvara,combined:t.combined,combinedPhonetic:i}}let e=[],n="",l=q[t.combined];if(l)return{consonants:(t.consonants??[]).map(i=>({telugu:i.telugu,phonetic:V[i.telugu]||"[unknown]",hasVirama:i.hasVirama})),combined:t.combined,combinedPhonetic:l};for(let s of t.consonants??[]){let i=V[s.telugu]||"[unknown]";e.push({telugu:s.telugu,phonetic:i,hasVirama:s.hasVirama}),s.hasVirama&&(i=X(i)),n+=i}let r;if(t.matra){let s=I[t.matra]||"[unknown]";n=X(n)+s,r={telugu:t.matra,phonetic:s}}return t.anusvara&&(n+=W(o)),{consonants:e,matra:r,anusvara:t.anusvara,combined:t.combined,combinedPhonetic:n}}function F(t){let o=M(t),e=[];for(let n=0;n<o.length;n++){let l=o[n],r=o[n+1],s=$(l,r);e.push(s)}return{original:t,clusters:e}}function z(){let t=document.getElementById("telugu-reader-toast");t&&t.remove();let o=document.createElement("div");o.id="telugu-reader-toast",o.style.cssText=`
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #0f172a;
    color: #38bdf8;
    padding: 10px 20px;
    border-radius: 9999px;
    font-size: 14px;
    font-weight: 700;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    z-index: 2147483647;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
    border: 1.5px solid #0284c7;
    pointer-events: none;
    transition: opacity 0.5s ease-out, transform 0.5s ease-out;
    text-align: center;
    white-space: nowrap;
  `,o.textContent="\u2728 Telugu Reader Active! Tap any word",document.body.appendChild(o),setTimeout(()=>{o.style.opacity="0",o.style.transform="translateX(-50%) translateY(-10px)",setTimeout(()=>o.remove(),500)},2500)}if(window.__teluguReaderLoaded)z();else{let m=function(u,a){s=Date.now(),e.style.left=`${a.left}px`,e.style.top=`${a.top}px`,e.style.width=`${a.width}px`,e.style.height=`${a.height}px`,e.style.display="block",l.textContent=u,n.style.left=`${a.left+a.width/2}px`,n.style.top=`${a.top}px`,n.style.display="block"},w=function(){e.style.display="none",n.style.display="none"},U=function(u,a){let c=null,f=document;if(f.caretRangeFromPoint)c=f.caretRangeFromPoint(u,a);else if(f.caretPositionFromPoint){let d=f.caretPositionFromPoint(u,a);d&&d.offsetNode&&(c=document.createRange(),c.setStart(d.offsetNode,d.offset),c.collapse(!0))}if(!c||!c.startContainer||c.startContainer.nodeType!==Node.TEXT_NODE)return null;let R=c.startContainer,g=R.textContent||"",p=c.startOffset,N=g[p];if(!N||!E.test(N))if(p>0&&E.test(g[p-1]))p=p-1,N=g[p];else return null;let h=p;for(;h>0&&!/\s|[.,\/#!$%\^&\*;:{}=\-_`~()?]/.test(g[h-1]);)h--;let S=p;for(;S<g.length&&!/\s|[.,\/#!$%\^&\*;:{}=\-_`~()?]/.test(g[S]);)S++;let v=g.slice(h,S);if(!v||!E.test(v))return null;let x=F(v);if(!x.clusters.length)return null;let b=h,C=x.clusters[x.clusters.length-1],T=h;for(let d=0;d<x.clusters.length;d++){let y=x.clusters[d],_=b+y.combined.length;if(p>=b&&p<_){C=y,T=b;break}if(d===x.clusters.length-1&&p<=_){C=y,T=b;break}b=_}try{let d=document.createRange();d.setStart(R,Math.max(0,T)),d.setEnd(R,Math.min(g.length,T+C.combined.length));let y=d.getBoundingClientRect();return{word:v,cluster:C.combined,phonetic:C.combinedPhonetic,rect:y}}catch{return null}},A=function(u,a){let c=U(u,a);if(c&&c.phonetic&&c.rect){let f=window.getSelection();f&&f.removeAllRanges(),m(c.phonetic,c.rect)}else w()};H=m,J=w,K=U,Q=A,window.__teluguReaderLoaded=!0,z();let t=`
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
  `,o=document.createElement("style");o.textContent=t,document.head.appendChild(o);let e=document.createElement("div");e.id="telugu-reader-highlight",document.body.appendChild(e);let n=document.createElement("div");n.id="telugu-reader-tooltip";let l=document.createElement("div");l.className="tooltip-content";let r=document.createElement("div");r.className="tooltip-arrow",n.appendChild(l),n.appendChild(r),document.body.appendChild(n);let s=0,i=0;document.addEventListener("touchend",u=>{if(u.changedTouches.length!==1)return;i=Date.now();let a=u.changedTouches[0];A(a.clientX,a.clientY)},{passive:!0}),document.addEventListener("click",u=>{Date.now()-i<600||A(u.clientX,u.clientY)}),document.addEventListener("contextmenu",u=>{let a=U(u.clientX,u.clientY);a&&(u.preventDefault(),a.phonetic&&a.rect&&m(a.phonetic,a.rect))}),window.addEventListener("scroll",()=>{Date.now()-s>400&&w()},{passive:!0})}var H,J,K,Q;})();
