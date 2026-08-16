import React, { useState, useEffect, useCallback } from "react";
import { C, FS } from "../constants";
import { Tag } from "../components/shared";
import Footer from "../components/Footer";
import { ReferralPanel } from "../components/ReferralShare";
import { fetchLeaderboard, fetchStanding, normaliseCode } from "../lib/referral";

const LIMIT = 25;

/** Medal treatment for the top three, plain gold beneath. */
function rankStyle(rank) {
  if (rank === 1) return { color: "#E8B121", glow: "rgba(232,177,33,0.35)", label: "🥇" };
  if (rank === 2) return { color: "#C8CDD4", glow: "rgba(200,205,212,0.25)", label: "🥈" };
  if (rank === 3) return { color: "#CD8032", glow: "rgba(205,128,50,0.25)", label: "🥉" };
  return { color: C.muted, glow: "transparent", label: null };
}

function StatBlock({ value, label }) {
  return (
    <div
      style={{
        background: C.bg1,
        border: `0.5px solid ${C.brd}`,
        borderRadius: 6,
        padding: "18px 22px",
        minWidth: 140,
        flex: "1 1 140px",
      }}
    >
      <div style={{ fontFamily: FS, fontSize: "clamp(24px,5vw,32px)", color: C.goldLt, lineHeight: 1.1 }}>
        {value}
      </div>
      <div
        style={{
          fontSize: 10,
          color: C.muted,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginTop: 6,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function LeaderRow({ entry, isMe }) {
  const style = rankStyle(entry.rank);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "clamp(46px,12vw,64px) 1fr auto",
        alignItems: "center",
        gap: "clamp(8px,2vw,18px)",
        padding: "13px clamp(12px,3vw,20px)",
        borderBottom: `0.5px solid ${C.brd}`,
        background: isMe ? C.goldDim : entry.rank <= 3 ? "rgba(255,255,255,0.02)" : "transparent",
        borderLeft: isMe ? `2px solid ${C.gold}` : "2px solid transparent",
        transition: "background 0.2s",
      }}
    >
      <div
        style={{
          fontFamily: FS,
          fontSize: entry.rank <= 3 ? 19 : 16,
          color: style.color,
          textShadow: style.glow !== "transparent" ? `0 0 14px ${style.glow}` : "none",
          display: "flex",
          alignItems: "center",
          gap: 5,
        }}
      >
        {style.label || <span style={{ color: C.dim, fontSize: 13 }}>#</span>}
        {entry.rank}
      </div>

      <div
        style={{
          fontFamily: "'Sora',sans-serif",
          fontSize: "clamp(13px,3.2vw,15px)",
          color: isMe ? C.goldLt : C.white,
          letterSpacing: "0.1em",
          fontWeight: entry.rank <= 3 ? 600 : 400,
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {entry.referral_code}
        {isMe && (
          <span style={{ fontSize: 9.5, color: C.gold, letterSpacing: "0.1em", marginLeft: 8 }}>
            YOU
          </span>
        )}
      </div>

      <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
        <span style={{ fontSize: "clamp(14px,3.4vw,17px)", color: C.white, fontWeight: 500 }}>
          {entry.referral_count}
        </span>
        <span style={{ fontSize: 10.5, color: C.muted, marginLeft: 6, letterSpacing: "0.06em" }}>
          {entry.referral_count === 1 ? "REFERRAL" : "REFERRALS"}
        </span>
      </div>
    </div>
  );
}

function MyRankLookup({ onFound, standing, code, onClear }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const lookup = async (e) => {
    e.preventDefault();
    const parsed = normaliseCode(input);
    if (!parsed) {
      setError("Codes look like DV-7K3Q9. Check yours and try again.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await fetchStanding(parsed);
      onFound(data);
      setInput("");
    } catch (err) {
      setError(err.message || "Could not find that referral code.");
    } finally {
      setLoading(false);
    }
  };

  if (standing && code) {
    return (
      <div>
        <ReferralPanel
          code={code}
          heading="Your standing"
          blurb="Share your code again — every new signup with it moves you up."
          standing={standing}
        />
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <button
            onClick={onClear}
            style={{
              background: "none",
              border: "none",
              color: C.muted,
              fontSize: 12,
              cursor: "pointer",
              fontFamily: "'Sora',sans-serif",
            }}
          >
            Check a different code
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: C.bg1,
        border: `0.5px solid ${C.brd}`,
        borderRadius: 6,
        padding: "clamp(18px,4vw,26px)",
      }}
    >
      <div
        style={{
          fontSize: 10,
          color: C.muted,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        Find your position
      </div>
      <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.8, marginBottom: 16 }}>
        Enter the referral code from your welcome email to see your rank and referral count — even
        if you're not in the top {LIMIT} yet.
      </p>
      <form onSubmit={lookup} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input
          type="text"
          value={input}
          maxLength={12}
          onChange={(e) => setInput(e.target.value.toUpperCase())}
          placeholder="DV-7K3Q9"
          style={{
            flex: "1 1 180px",
            background: C.bg2,
            border: `0.5px solid ${error ? C.red : C.brd2}`,
            color: C.white,
            fontSize: 13.5,
            padding: "11px 14px",
            borderRadius: 3,
            outline: "none",
            letterSpacing: "0.1em",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            background: C.gold,
            border: "none",
            color: "#000",
            fontFamily: "'Sora',sans-serif",
            fontSize: 13,
            fontWeight: 600,
            padding: "11px 22px",
            borderRadius: 3,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
            whiteSpace: "nowrap",
          }}
        >
          {loading ? "Checking…" : "Check rank"}
        </button>
      </form>
      {error && <div style={{ fontSize: 11.5, color: C.red, marginTop: 8 }}>{error}</div>}
    </div>
  );
}

function Referral({ go }) {
  const [board, setBoard] = useState([]);
  const [totals, setTotals] = useState({ total_referrers: 0, total_members: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [standing, setStanding] = useState(null);

  // Bumping this re-runs the effect — used by the "Try again" button.
  const [reloadKey, setReloadKey] = useState(0);
  const retry = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const data = await fetchLeaderboard(LIMIT);
        if (cancelled) return;
        setError("");
        setBoard(data.data || []);
        setTotals({
          total_referrers: data.total_referrers || 0,
          total_members: data.total_members || 0,
        });
      } catch (err) {
        if (!cancelled) setError(err.message || "Could not load the leaderboard.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const timer = setTimeout(run, 0);
    const interval = setInterval(run, 60000);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [reloadKey]);

  const myCode = standing?.referral_code || null;

  const toWaitlist = () => go("waitlist");

  return (
    <div style={{ padding: "clamp(32px,5vw,72px) clamp(16px,4vw,48px) 60px" }}>
      <Tag gold>Referral Leaderboard</Tag>

      <h1
        style={{
          fontFamily: FS,
          fontSize: "clamp(28px,9vw,66px)",
          fontWeight: 400,
          color: C.white,
          lineHeight: 1.1,
          letterSpacing: "-0.025em",
          marginBottom: 18,
          maxWidth: 720,
        }}
      >
        Bring People With You.
        <br />
        <em style={{ color: C.goldLt }}>Move Up The List.</em>
      </h1>

      <p
        style={{
          fontSize: "clamp(14px,3.5vw,16px)",
          color: C.muted,
          fontWeight: 300,
          maxWidth: "min(560px,100%)",
          lineHeight: 1.85,
          marginBottom: 34,
        }}
      >
        Every waitlist member gets a referral code. Every person who joins with your code moves you
        up. Only codes appear here — never names, never email addresses.
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 40 }}>
        <StatBlock value={totals.total_members.toLocaleString()} label="On the waitlist" />
        <StatBlock value={totals.total_referrers.toLocaleString()} label="Active referrers" />
        <StatBlock
          value={board.length ? board[0].referral_count.toLocaleString() : "—"}
          label="Top score"
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(320px,100%),1fr))",
          gap: "clamp(18px,3vw,32px)",
          alignItems: "start",
          marginBottom: 48,
        }}
      >
        {/* Leaderboard */}
        <div
          style={{
            background: C.bg1,
            border: `0.5px solid ${C.brd}`,
            borderRadius: 6,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "13px clamp(12px,3vw,20px)",
              borderBottom: `0.5px solid ${C.brd}`,
              background: C.bg2,
            }}
          >
            <span
              style={{
                fontSize: 10,
                color: C.muted,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              Top {LIMIT}
            </span>
            <span style={{ fontSize: 10, color: C.dim, letterSpacing: "0.08em" }}>
              Updates every minute
            </span>
          </div>

          {loading && (
            <div style={{ padding: "40px 20px", textAlign: "center", fontSize: 13, color: C.muted }}>
              Loading the leaderboard…
            </div>
          )}

          {!loading && error && (
            <div style={{ padding: "36px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 13, color: C.red, marginBottom: 12 }}>{error}</div>
              <button
                onClick={retry}
                style={{
                  background: "none",
                  border: `0.5px solid ${C.brd2}`,
                  color: C.white,
                  fontSize: 12.5,
                  padding: "8px 18px",
                  borderRadius: 3,
                  cursor: "pointer",
                  fontFamily: "'Sora',sans-serif",
                }}
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && board.length === 0 && (
            <div style={{ padding: "44px 24px", textAlign: "center" }}>
              <div style={{ fontFamily: FS, fontSize: 20, color: C.white, marginBottom: 10 }}>
                No one has referred anyone yet.
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: C.muted,
                  lineHeight: 1.8,
                  maxWidth: 340,
                  margin: "0 auto 18px",
                }}
              >
                First position is wide open. Join the waitlist, grab your code, and claim it.
              </p>
              <button
                onClick={toWaitlist}
                style={{
                  background: C.gold,
                  border: "none",
                  color: "#000",
                  fontFamily: "'Sora',sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  padding: "11px 22px",
                  borderRadius: 3,
                  cursor: "pointer",
                }}
              >
                Join the waitlist →
              </button>
            </div>
          )}

          {!loading &&
            !error &&
            board.map((entry) => (
              <LeaderRow key={entry.referral_code} entry={entry} isMe={entry.referral_code === myCode} />
            ))}
        </div>

        {/* Sidebar: my rank + how it works */}
        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(14px,2.5vw,20px)" }}>
          <MyRankLookup
            standing={standing}
            code={myCode}
            onFound={setStanding}
            onClear={() => setStanding(null)}
          />

          <div
            style={{
              background: C.bg1,
              border: `0.5px solid ${C.brd}`,
              borderRadius: 6,
              padding: "clamp(18px,4vw,26px)",
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
              How it works
            </div>
            {[
              ["01", "Join the waitlist", "You get a personal code like DV-7K3Q9, sent to your email."],
              ["02", "Share your link", "Anyone opening your link has the code filled in automatically."],
              ["03", "Climb", "Each verified signup with your code is +1. Ties go to whoever joined first."],
            ].map(([n, title, body]) => (
              <div key={n} style={{ display: "flex", gap: 14, marginBottom: 16 }}>
                <div
                  style={{
                    fontFamily: FS,
                    fontSize: 15,
                    color: C.gold,
                    flexShrink: 0,
                    paddingTop: 1,
                  }}
                >
                  {n}
                </div>
                <div>
                  <div style={{ fontSize: 13.5, color: C.white, marginBottom: 3 }}>{title}</div>
                  <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.7 }}>{body}</div>
                </div>
              </div>
            ))}

            <div
              style={{
                borderTop: `0.5px solid ${C.brd}`,
                paddingTop: 14,
                marginTop: 4,
                fontSize: 11.5,
                color: C.dim,
                lineHeight: 1.75,
              }}
            >
              Leaderboard position carries no monetary value and confers no investment right,
              allocation or entitlement. DotVests is pre-launch and pending SEC Nigeria ARIP
              approval.
            </div>
          </div>

          <button
            onClick={toWaitlist}
            style={{
              background: "none",
              border: `0.5px solid ${C.goldBrd}`,
              color: C.goldLt,
              fontFamily: "'Sora',sans-serif",
              fontSize: 13,
              fontWeight: 500,
              padding: "13px",
              borderRadius: 3,
              cursor: "pointer",
            }}
          >
            Not on the list yet? Join →
          </button>
        </div>
      </div>

      <Footer go={go} />
    </div>
  );
}

export default Referral;
