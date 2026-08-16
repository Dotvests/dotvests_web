import React, { useState, useRef } from "react";
import { C, FS } from "../constants";
import { Tag } from "../components/shared";
import Footer from "../components/Footer";
import { ReferralPanel } from "../components/ReferralShare";
import { API_BASE, normaliseCode, refFromUrl } from "../lib/referral";
import {
  SECTIONS,
  emptyForm,
  emptyOther,
  validateSection,
  buildPayload,
  OTHER_MAX_LENGTH,
} from "../lib/waitlistFields";

const OTHER = "__other__";

const labelStyle = {
  fontSize: 13.5,
  color: C.white,
  lineHeight: 1.6,
  marginBottom: 10,
  display: "block",
  fontWeight: 400,
};

const inputStyle = (invalid) => ({
  width: "100%",
  background: C.bg2,
  border: `0.5px solid ${invalid ? C.red : C.brd2}`,
  color: C.white,
  fontSize: 14,
  padding: "12px 14px",
  borderRadius: 3,
  outline: "none",
  transition: "border 0.2s",
  fontFamily: "'Sora',sans-serif",
});

function Option({ label, selected, invalid, multi, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: selected ? C.goldDim : C.bg2,
        border: `0.5px solid ${selected ? C.gold : invalid ? C.red : C.brd2}`,
        color: selected ? C.white : C.muted,
        fontSize: 13,
        lineHeight: 1.45,
        padding: "11px 14px",
        borderRadius: 3,
        cursor: "pointer",
        transition: "all 0.15s",
        fontFamily: "'Sora',sans-serif",
      }}
    >
      <span
        style={{
          width: 14,
          height: 14,
          borderRadius: multi ? 2 : "50%",
          flexShrink: 0,
          border: `1px solid ${selected ? C.gold : C.brd2}`,
          background: selected ? C.gold : "transparent",
          boxShadow: selected ? `inset 0 0 0 2.5px ${C.bg2}` : "none",
        }}
      />
      {label}
    </button>
  );
}

function OptionGrid({ field, value, other, invalid, onChange, onOther }) {
  const multi = field.type === "checkbox";
  const selectedList = multi ? value || [] : value ? [value] : [];

  const toggle = (opt) => {
    if (!multi) {
      onChange(value === opt ? "" : opt);
      return;
    }
    const list = value || [];
    onChange(list.includes(opt) ? list.filter((v) => v !== opt) : [...list, opt]);
  };

  const otherPicked = selectedList.includes(OTHER);

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(230px,100%),1fr))",
          gap: 8,
        }}
      >
        {field.options.map((opt) => (
          <Option
            key={opt}
            label={opt}
            multi={multi}
            selected={selectedList.includes(opt)}
            invalid={invalid}
            onClick={() => toggle(opt)}
          />
        ))}
        {field.allowOther && (
          <Option
            label="Other…"
            multi={multi}
            selected={otherPicked}
            invalid={invalid}
            onClick={() => toggle(OTHER)}
          />
        )}
      </div>

      {field.allowOther && otherPicked && (
        <input
          type="text"
          value={other}
          maxLength={OTHER_MAX_LENGTH}
          placeholder="Tell us in your own words"
          onChange={(e) => onOther(e.target.value)}
          style={{ ...inputStyle(invalid), marginTop: 8 }}
        />
      )}
    </>
  );
}

function Field({ field, value, other, error, onChange, onOther }) {
  const invalid = Boolean(error);

  return (
    <div style={{ marginBottom: 26 }}>
      <label htmlFor={`f-${field.key}`} style={labelStyle}>
        {field.label}
        {field.required && <span style={{ color: C.gold, marginLeft: 5 }}>*</span>}
        {field.hint && (
          <span style={{ display: "block", fontSize: 12, color: C.muted, marginTop: 4 }}>
            {field.hint}
          </span>
        )}
      </label>

      {field.type === "radio" || field.type === "checkbox" ? (
        // The id lives on the wrapper so validation can scroll to option
        // groups the same way it scrolls to a plain input.
        <div id={`f-${field.key}`}>
          <OptionGrid
            field={field}
            value={value}
            other={other}
            invalid={invalid}
            onChange={onChange}
            onOther={onOther}
          />
        </div>
      ) : field.type === "textarea" ? (
        <textarea
          id={`f-${field.key}`}
          value={value}
          rows={4}
          maxLength={field.maxLength}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...inputStyle(invalid), resize: "vertical" }}
        />
      ) : field.type === "datalist" ? (
        <>
          <input
            id={`f-${field.key}`}
            list={`dl-${field.key}`}
            value={value}
            maxLength={field.maxLength}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
            style={inputStyle(invalid)}
          />
          <datalist id={`dl-${field.key}`}>
            {field.options.map((o) => (
              <option key={o} value={o} />
            ))}
          </datalist>
        </>
      ) : (
        <input
          id={`f-${field.key}`}
          type={field.type}
          value={value}
          maxLength={field.maxLength}
          placeholder={field.placeholder}
          autoComplete={field.autoComplete}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle(invalid)}
        />
      )}

      {error && <div style={{ fontSize: 11.5, color: C.red, marginTop: 6 }}>{error}</div>}
    </div>
  );
}

function Progress({ step }) {
  return (
    <div style={{ marginBottom: 30 }}>
      <div style={{ display: "flex", gap: 5, marginBottom: 10 }}>
        {SECTIONS.map((s, i) => (
          <div
            key={s.id}
            style={{
              flex: 1,
              height: 2,
              borderRadius: 2,
              background: i <= step ? C.gold : "rgba(255,255,255,0.10)",
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>
      <div style={{ fontSize: 10.5, color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        Step {step + 1} of {SECTIONS.length} — {SECTIONS[step].title}
      </div>
    </div>
  );
}

function Waitlist({ go }) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState(emptyForm);
  const [other, setOther] = useState(emptyOther);
  const [referral, setReferral] = useState(() => refFromUrl() || "");
  const [fromLink, setFromLink] = useState(() => Boolean(refFromUrl()));
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const topRef = useRef(null);

  const section = SECTIONS[step];
  const isLast = step === SECTIONS.length - 1;

  const scrollTop = () => {
    if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const setValue = (key) => (v) => {
    setValues((prev) => ({ ...prev, [key]: v }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const setOtherText = (key) => (v) => {
    setOther((prev) => ({ ...prev, [key]: v }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const next = () => {
    const errs = validateSection(section, values, other);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const first = section.fields.find((f) => errs[f.key]);
      if (first)
        document.getElementById(`f-${first.key}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setErrors({});
    setStep((s) => s + 1);
    scrollTop();
  };

  const back = () => {
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
    scrollTop();
  };

  const post = async ({ withReferral }) => {
    setSubmitting(true);
    try {
      const payload = { ...buildPayload(values, other), source: "waitlist_page" };
      const code = withReferral ? normaliseCode(referral) : null;
      if (code) payload.referral_code = code;

      const res = await fetch(`${API_BASE}/api/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.code === "INVALID_REFERRAL_CODE" || data.code === "SELF_REFERRAL") {
          setErrors({ referral: data.message, canSkipReferral: true });
          return;
        }
        if (data.errors && typeof data.errors === "object") {
          setErrors(data.errors);
          // Send them back to whichever step owns the first failing field.
          const bad = Object.keys(data.errors)[0];
          const owner = SECTIONS.findIndex((s) => s.fields.some((f) => f.key === bad));
          if (owner >= 0 && owner !== step) setStep(owner);
          scrollTop();
          return;
        }
        throw new Error(data.message || "Something went wrong. Please try again.");
      }

      setResult(data.data);
      scrollTop();
    } catch (err) {
      setErrors({ submit: err.message || "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmit = async () => {
    const errs = {};
    if (referral.trim() && !normaliseCode(referral))
      errs.referral = "That code looks off. Codes look like DV-7K3Q9.";
    if (!consent) errs.consent = "Please confirm your consent to continue.";
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    await post({ withReferral: true });
  };

  // ── Success ────────────────────────────────────────────────────────────────
  if (result) {
    return (
      <div style={{ padding: "clamp(32px,5vw,72px) clamp(16px,4vw,48px) 60px" }}>
        <div ref={topRef} style={{ maxWidth: 620, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 44, marginBottom: 14, color: C.green }}>✓</div>
          <h1 style={{ fontFamily: FS, fontSize: "clamp(26px,7vw,44px)", fontWeight: 400, color: C.white, marginBottom: 14 }}>
            You're on the list.
          </h1>
          <p style={{ fontSize: 14.5, color: C.muted, lineHeight: 1.85, maxWidth: 460, margin: "0 auto 30px" }}>
            We've sent your referral code to <strong style={{ color: C.white }}>{result.email}</strong>.
            If it isn't in your inbox in a few minutes, check your spam folder.
          </p>

          {result.referral_code && (
            <ReferralPanel
              code={result.referral_code}
              heading="Your referral code"
              blurb="Every person who joins the waitlist with your code moves you up the leaderboard. Your position is public — your identity is not."
              onViewLeaderboard={() => go("referral")}
            />
          )}

          <div style={{ fontSize: 13, color: C.goldLt, marginTop: 26, fontStyle: "italic" }}>
            DotVests — Redefining Access To African Wealth.
          </div>
        </div>
        <div style={{ marginTop: 56 }}>
          <Footer go={go} />
        </div>
      </div>
    );
  }

  // ── Wizard ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: "clamp(32px,5vw,72px) clamp(16px,4vw,48px) 60px" }}>
      <div ref={topRef} style={{ maxWidth: 620, margin: "0 auto" }}>
        <Tag gold>Early Access</Tag>

        <h1
          style={{
            fontFamily: FS,
            fontSize: "clamp(26px,7vw,46px)",
            fontWeight: 400,
            color: C.white,
            lineHeight: 1.12,
            letterSpacing: "-0.025em",
            marginBottom: 14,
          }}
        >
          Dotvests <em style={{ color: C.goldLt }}>Investor Interest</em>
        </h1>

        <p style={{ fontSize: 14.5, color: C.muted, lineHeight: 1.85, marginBottom: 30 }}>
          Help us understand who our community is made of. You'll get a referral code the moment
          you finish — every person who joins with it moves you up the{" "}
          <button
            type="button"
            onClick={() => go("referral")}
            style={{
              background: "none",
              border: "none",
              color: C.goldLt,
              fontSize: 14.5,
              padding: 0,
              textDecoration: "underline",
              cursor: "pointer",
              fontFamily: "'Sora',sans-serif",
            }}
          >
            leaderboard
          </button>
          .
        </p>

        <Progress step={step} />

        <h2
          style={{
            fontFamily: FS,
            fontSize: "clamp(20px,5vw,28px)",
            fontWeight: 400,
            color: C.white,
            marginBottom: section.blurb ? 8 : 22,
          }}
        >
          {section.title}
        </h2>
        {section.blurb && (
          <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.8, marginBottom: 26 }}>
            {section.blurb}
          </p>
        )}

        <form onSubmit={(e) => e.preventDefault()} noValidate>
          {section.fields.map((f) => (
            <Field
              key={f.key}
              field={f}
              value={values[f.key]}
              other={other[f.key] || ""}
              error={errors[f.key]}
              onChange={setValue(f.key)}
              onOther={setOtherText(f.key)}
            />
          ))}

          {isLast && (
            <>
              {/* Referral code */}
              <div style={{ marginBottom: 26 }}>
                <label htmlFor="f-referral" style={labelStyle}>
                  Referral code
                  <span style={{ color: C.dim, marginLeft: 8, fontSize: 12 }}>optional</span>
                </label>
                <input
                  id="f-referral"
                  type="text"
                  value={referral}
                  maxLength={12}
                  placeholder="DV-7K3Q9"
                  onChange={(e) => {
                    setReferral(e.target.value.toUpperCase());
                    setFromLink(false);
                    setErrors((p) => ({ ...p, referral: undefined, canSkipReferral: undefined }));
                  }}
                  style={{ ...inputStyle(Boolean(errors.referral)), letterSpacing: "0.08em" }}
                />
                {fromLink && !errors.referral && (
                  <div style={{ fontSize: 11.5, color: C.green, marginTop: 6 }}>
                    ✓ Referral code applied from your invite link.
                  </div>
                )}
                {errors.referral && (
                  <div style={{ fontSize: 11.5, color: C.red, marginTop: 6 }}>{errors.referral}</div>
                )}
                {errors.canSkipReferral && (
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => {
                      setReferral("");
                      setFromLink(false);
                      setErrors({});
                      post({ withReferral: false });
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: C.goldLt,
                      fontSize: 12,
                      marginTop: 7,
                      textDecoration: "underline",
                      cursor: "pointer",
                      fontFamily: "'Sora',sans-serif",
                      padding: 0,
                    }}
                  >
                    Join without a referral code
                  </button>
                )}
              </div>

              {/* Consent */}
              <div
                style={{
                  background: C.bg2,
                  border: `0.5px solid ${errors.consent ? C.red : C.brd}`,
                  borderRadius: 4,
                  padding: "16px 18px",
                  marginBottom: 18,
                }}
              >
                <div style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.75, marginBottom: 14 }}>
                  This survey is conducted by DotVests for market research and product validation
                  purposes only. We do not request sensitive financial or identity information such
                  as BVN, NIN, bank passwords, card PINs, or private wallet keys. Participation is
                  voluntary. Questions:{" "}
                  <a href="mailto:info@dotvests.com" style={{ color: C.goldLt, textDecoration: "none" }}>
                    info@dotvests.com
                  </a>
                </div>
                <label
                  htmlFor="privacyConsent"
                  style={{ display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer" }}
                >
                  <input
                    type="checkbox"
                    id="privacyConsent"
                    checked={consent}
                    onChange={(e) => {
                      setConsent(e.target.checked);
                      setErrors((p) => ({ ...p, consent: undefined }));
                    }}
                    style={{ marginTop: 2, flexShrink: 0, accentColor: C.gold, width: 16, height: 16 }}
                  />
                  <span style={{ fontSize: 12.5, color: C.white, lineHeight: 1.7 }}>
                    I consent to the collection and use of my responses for research and product
                    development purposes.
                    <span style={{ color: C.gold, marginLeft: 4 }}>*</span>
                  </span>
                </label>
              </div>
              {errors.consent && (
                <div style={{ fontSize: 11.5, color: C.red, marginBottom: 12 }}>{errors.consent}</div>
              )}
            </>
          )}

          {errors.submit && (
            <div style={{ fontSize: 13, color: C.red, marginBottom: 14, textAlign: "center" }}>
              {errors.submit}
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            {step > 0 && (
              <button
                type="button"
                onClick={back}
                disabled={submitting}
                style={{
                  background: "none",
                  border: `0.5px solid ${C.brd2}`,
                  color: C.muted,
                  fontFamily: "'Sora',sans-serif",
                  fontSize: 13.5,
                  padding: "14px 24px",
                  borderRadius: 3,
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                ← Back
              </button>
            )}
            <button
              type="button"
              onClick={isLast ? onSubmit : next}
              disabled={submitting}
              style={{
                flex: 1,
                background: C.gold,
                border: "none",
                color: "#000",
                fontFamily: "'Sora',sans-serif",
                fontSize: 14,
                fontWeight: 600,
                padding: "14px",
                borderRadius: 3,
                cursor: submitting ? "not-allowed" : "pointer",
                letterSpacing: "0.05em",
                opacity: submitting ? 0.6 : 1,
              }}
            >
              {submitting ? "Submitting…" : isLast ? "Join The Waitlist →" : "Continue →"}
            </button>
          </div>

          {!isLast && step > 0 && (
            <div style={{ textAlign: "center", marginTop: 12 }}>
              <button
                type="button"
                onClick={() => {
                  setErrors({});
                  setStep(SECTIONS.length - 1);
                  scrollTop();
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: C.dim,
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: "'Sora',sans-serif",
                }}
              >
                Skip the research questions
              </button>
            </div>
          )}

          <div style={{ fontSize: 11.5, color: C.dim, marginTop: 14, textAlign: "center", lineHeight: 1.7 }}>
            No spam. No investment solicitation. Informational updates only.
            <br />
            DotVests is pre-launch and pending SEC Nigeria ARIP approval.
          </div>
        </form>
      </div>

      <div style={{ marginTop: 56 }}>
        <Footer go={go} />
      </div>
    </div>
  );
}

export default Waitlist;
