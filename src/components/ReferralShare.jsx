import React, { useState } from "react";
import { C, FS } from "../constants";
import { shareLink, SHARE_MESSAGE, copyText } from "../lib/referral";

/**
 * The gold code plate. Click the code itself to copy it.
 */
function CodePlate({ code, size = "lg" }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    if (await copyText(code)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <button
      onClick={onCopy}
      title="Click to copy your code"
      style={{
        background: C.bg2,
        border: `0.5px dashed ${C.goldBrd}`,
        borderRadius: 4,
        padding: size === "lg" ? "14px 26px" : "9px 16px",
        color: C.goldLt,
        fontFamily: "'Sora',sans-serif",
        fontSize: size === "lg" ? 24 : 15,
        fontWeight: 600,
        letterSpacing: "0.14em",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
    >
      {copied ? "Copied ✓" : code}
    </button>
  );
}

const btnBase = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 7,
  fontFamily: "'Sora',sans-serif",
  fontSize: 12.5,
  fontWeight: 500,
  padding: "10px 16px",
  borderRadius: 3,
  cursor: "pointer",
  border: `0.5px solid ${C.brd2}`,
  background: "none",
  color: C.white,
  textDecoration: "none",
  transition: "all 0.2s",
  whiteSpace: "nowrap",
};

/**
 * Copy-link / WhatsApp / X / native-share row for a referral code.
 */
function ShareRow({ code }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const link = shareLink(code);
  const message = SHARE_MESSAGE(code);

  const onCopyLink = async () => {
    if (await copyText(link)) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 1800);
    }
  };

  const onNativeShare = async () => {
    try {
      await navigator.share({ title: "DotVests Waitlist", text: message, url: link });
    } catch {
      /* user dismissed the sheet */
    }
  };

  const canNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
      <button
        onClick={onCopyLink}
        style={{ ...btnBase, background: C.gold, border: "none", color: "#000", fontWeight: 600 }}
      >
        {copiedLink ? "Link copied ✓" : "Copy my link"}
      </button>

      <a
        href={`https://wa.me/?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          ...btnBase,
          border: "0.5px solid rgba(37,211,102,0.35)",
          background: "rgba(37,211,102,0.10)",
          color: "#25D366",
        }}
      >
        WhatsApp
      </a>

      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ ...btnBase }}
      >
        Share on X
      </a>

      {canNativeShare && (
        <button onClick={onNativeShare} style={{ ...btnBase }}>
          More…
        </button>
      )}
    </div>
  );
}

/**
 * Full "you're in, here's your code" panel. Used on the waitlist success
 * screen and on the referral page after a successful code lookup.
 */
function ReferralPanel({ code, heading, blurb, standing, onViewLeaderboard }) {
  return (
    <div
      style={{
        background: C.bg1,
        border: `0.5px solid ${C.goldBrd}`,
        borderRadius: 6,
        padding: "clamp(20px,4vw,30px)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 10,
          color: C.muted,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          marginBottom: 14,
        }}
      >
        {heading || "Your referral code"}
      </div>

      <div style={{ marginBottom: 16 }}>
        <CodePlate code={code} />
      </div>

      {standing && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "clamp(18px,6vw,44px)",
            flexWrap: "wrap",
            margin: "0 0 20px",
            paddingTop: 16,
            borderTop: `0.5px solid ${C.brd}`,
          }}
        >
          <div>
            <div style={{ fontFamily: FS, fontSize: 30, color: C.goldLt, lineHeight: 1.1 }}>
              #{standing.rank}
            </div>
            <div
              style={{
                fontSize: 10,
                color: C.muted,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginTop: 4,
              }}
            >
              Leaderboard rank
            </div>
          </div>
          <div>
            <div style={{ fontFamily: FS, fontSize: 30, color: C.white, lineHeight: 1.1 }}>
              {standing.referral_count}
            </div>
            <div
              style={{
                fontSize: 10,
                color: C.muted,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginTop: 4,
              }}
            >
              {standing.referral_count === 1 ? "Referral" : "Referrals"}
            </div>
          </div>
        </div>
      )}

      {blurb && (
        <p
          style={{
            fontSize: 13,
            color: C.muted,
            lineHeight: 1.8,
            maxWidth: 400,
            margin: "0 auto 18px",
          }}
        >
          {blurb}
        </p>
      )}

      <ShareRow code={code} />

      {onViewLeaderboard && (
        <button
          onClick={onViewLeaderboard}
          style={{
            background: "none",
            border: "none",
            color: C.goldLt,
            fontSize: 12.5,
            marginTop: 18,
            cursor: "pointer",
            fontFamily: "'Sora',sans-serif",
          }}
        >
          View the leaderboard →
        </button>
      )}

      <div style={{ fontSize: 11, color: C.dim, marginTop: 16, lineHeight: 1.7 }}>
        The leaderboard shows referral codes only — never names or email addresses.
      </div>
    </div>
  );
}

export { CodePlate, ShareRow, ReferralPanel };
