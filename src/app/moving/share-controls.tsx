"use client";

import { useState } from "react";

const SHARE_URL = "https://budgetsf.com/moving";
const SHARE_TEXT =
  "Moving to SF? I wrote a 4-min read on living here for ~$1,600/mo (hacker house, Costco diet, BART). Open source, by locals.";

export function ShareControls() {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  async function handleCopy() {
    setCopyFailed(false);
    let ok = false;

    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(SHARE_URL);
        ok = true;
      } catch {
        ok = false;
      }
    }

    if (!ok) {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = SHARE_URL;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.top = "0";
        textarea.style.left = "0";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        ok = document.execCommand("copy");
        document.body.removeChild(textarea);
      } catch {
        ok = false;
      }
    }

    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      setCopyFailed(true);
      setTimeout(() => setCopyFailed(false), 3000);
    }
  }

  const tweetHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    SHARE_TEXT
  )}&url=${encodeURIComponent(SHARE_URL)}`;

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
      <button
        type="button"
        onClick={handleCopy}
        className="press inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-accent text-white text-sm font-semibold shadow-sm hover:bg-accent-dark transition-colors disabled:opacity-50"
      >
        {copyFailed ? "Try again" : copied ? "Copied!" : "Copy link"}
      </button>
      <a
        href={tweetHref}
        target="_blank"
        rel="noopener noreferrer"
        className="press inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-border bg-white text-sm font-semibold text-foreground hover:bg-warm transition-colors"
      >
        Share on X
        <span aria-hidden>↗</span>
      </a>
    </div>
  );
}
