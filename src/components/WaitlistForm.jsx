import React, { useState } from "react";
import { C, FS } from "../constants";
import { API_BASE, normaliseCode, refFromUrl } from "../lib/referral";
import { ReferralPanel } from "./ReferralShare";

function WaitlistBar({ go }){
  const [done, setDone] = useState(false);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Referral code: prefilled from ?ref= on the URL, editable by hand.
  const [referral, setReferral] = useState(() => refFromUrl() || "");
  const [fromLink, setFromLink] = useState(() => Boolean(refFromUrl()));

  const validate = (form) => {
    const errs = {};
    const company = form['company']?.value?.trim();
    const name    = form['name']?.value?.trim();
    const email   = form['email']?.value?.trim();
    const privacy = document.getElementById('privacyConsent');
    if (!company) errs.company = 'Company / Organisation is required.';
    if (!name)    errs.name    = 'Full name is required.';
    if (email) {
      const at = email.indexOf('@'), dot = email.lastIndexOf('.');
      if (at < 1 || dot < at+2 || dot+2 >= email.length) errs.email = 'Enter a valid email address.';
    }
    if (referral.trim() && !normaliseCode(referral)) {
      errs.referral = 'That code looks off. Codes look like DV-7K3Q9.';
    }
    if (!privacy?.checked) errs.privacy = 'Please accept the privacy notice.';
    return errs;
  };

  const submit = async (form, { withReferral }) => {
    setErrors({});
    setSubmitting(true);
    try {
      const payload = {
        name: form['name'].value.trim(),
        email: form['email'].value.trim(),
        company: form['company'].value.trim(),
        investor_type: form['investor_type'].value,
        investment_range: form['investment_range'].value,
        source: 'landing_page',
      };

      const code = withReferral ? normaliseCode(referral) : null;
      if (code) payload.referral_code = code;

      const res = await fetch(`${API_BASE}/api/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        // A bad referral code should never cost someone their signup — offer
        // a one-click path to join without it.
        if (data.code === 'INVALID_REFERRAL_CODE' || data.code === 'SELF_REFERRAL') {
          setErrors({ referral: data.message, canSkipReferral: true });
          return;
        }
        throw new Error(data.message || 'Something went wrong. Please try again.');
      }

      setResult(data.data);
      setDone(true);
    } catch (err) {
      setErrors({ submit: err.message || 'Something went wrong. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    await submit(form, { withReferral: true });
  };

  const joinWithoutReferral = async () => {
    const form = document.getElementById('waitlist-form');
    if (!form) return;
    setReferral("");
    setFromLink(false);
    await submit(form, { withReferral: false });
  };

  if (done) return (
    <div style={{textAlign:"center", padding:"28px 0 8px", animation:"fadeUp 0.4s ease both"}}>
      <div style={{fontSize:40, marginBottom:12}}>✓</div>
      <div style={{fontFamily:FS, fontSize:22, color:C.green, marginBottom:10}}>You're on the list.</div>
      <div style={{fontSize:14, color:C.muted, lineHeight:1.8, maxWidth:420, margin:"0 auto 26px"}}>
        Welcome to the future of African investing. We'll be in touch before launch with everything you need to know.
      </div>

      {result?.referral_code && (
        <ReferralPanel
          code={result.referral_code}
          heading="Your referral code"
          blurb="Every person who joins the waitlist with your code moves you up the leaderboard. Your position is public — your identity is not."
          onViewLeaderboard={go ? () => go("referral") : undefined}
        />
      )}

      <div style={{fontSize:13, color:C.goldLt, marginTop:22, fontStyle:"italic"}}>
        DotVests — Redefining Access To African Wealth.
      </div>
    </div>
  );

  const inputStyle = (errKey) => ({
    width:"100%", background:C.bg2,
    border:`0.5px solid ${errors[errKey]?C.red:C.brd2}`,
    color:C.white, fontSize:13.5, padding:"11px 14px",
    borderRadius:3, outline:"none", transition:"border 0.2s",
  });

  const selectStyle = (errKey) => ({
    width:"100%", background:C.bg2,
    border:`0.5px solid ${errors[errKey]?C.red:C.brd2}`,
    color:C.white, fontSize:13.5, padding:"11px 14px",
    borderRadius:3, outline:"none",
  });

  return (
    <div style={{maxWidth:560, margin:"0 auto"}}>
      <form id="waitlist-form" onSubmit={handleSubmit} noValidate>

        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(min(260px,100%),1fr))", gap:12, marginBottom:12}}>
          <div>
            <div style={{fontSize:10, color:C.muted, letterSpacing:"0.08em", marginBottom:6, textTransform:"uppercase"}}>Company / Organisation *</div>
            <input type="text" name="company" maxLength={200} placeholder="Your company or N/A" style={inputStyle('company')}/>
            {errors.company && <div style={{fontSize:11,color:C.red,marginTop:4}}>{errors.company}</div>}
          </div>
          <div>
            <div style={{fontSize:10, color:C.muted, letterSpacing:"0.08em", marginBottom:6, textTransform:"uppercase"}}>Full Name *</div>
            <input type="text" name="name" maxLength={80} placeholder="Your full name" style={inputStyle('name')}/>
            {errors.name && <div style={{fontSize:11,color:C.red,marginTop:4}}>{errors.name}</div>}
          </div>
        </div>

        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(min(260px,100%),1fr))", gap:12, marginBottom:12}}>
          <div>
            <div style={{fontSize:10, color:C.muted, letterSpacing:"0.08em", marginBottom:6, textTransform:"uppercase"}}>Email Address</div>
            <input type="text" name="email" maxLength={100} placeholder="you@email.com" style={inputStyle('email')}/>
            {errors.email && <div style={{fontSize:11,color:C.red,marginTop:4}}>{errors.email}</div>}
          </div>
          <div>
            <div style={{fontSize:10, color:C.muted, letterSpacing:"0.08em", marginBottom:6, textTransform:"uppercase"}}>Investor Type</div>
            <select name="investor_type" style={selectStyle('type')}>
              <option value="">Select type</option>
              <option value="Retail">Retail Investor</option>
              <option value="Institutional">Institutional</option>
              <option value="Diaspora">Diaspora Investor</option>
              <option value="High Net-Worth HNI">High Net-Worth (HNI)</option>
            </select>
          </div>
        </div>

        <div style={{marginBottom:12}}>
          <div style={{fontSize:10, color:C.muted, letterSpacing:"0.08em", marginBottom:6, textTransform:"uppercase"}}>Investment Range</div>
          <select name="investment_range" style={selectStyle('amount')}>
            <option value="">Select range</option>
            <option value="Under ₦100,000">Under ₦100,000</option>
            <option value="₦100,000–₦500,000">₦100,000 – ₦500,000</option>
            <option value="₦500,000–₦2,000,000">₦500,000 – ₦2,000,000</option>
            <option value="₦2M–₦10M">₦2M – ₦10M</option>
            <option value="Over ₦10M">Over ₦10M</option>
          </select>
        </div>

        {/* Referral code */}
        <div style={{marginBottom:16}}>
          <div style={{fontSize:10, color:C.muted, letterSpacing:"0.08em", marginBottom:6, textTransform:"uppercase"}}>
            Referral Code <span style={{textTransform:"none",letterSpacing:0,color:C.dim}}>(optional)</span>
          </div>
          <input
            type="text" name="referral_code" maxLength={12} placeholder="DV-7K3Q9"
            value={referral}
            onChange={(e)=>{ setReferral(e.target.value.toUpperCase()); setFromLink(false); }}
            style={{...inputStyle('referral'), letterSpacing:"0.08em"}}/>
          {fromLink && !errors.referral && (
            <div style={{fontSize:11,color:C.green,marginTop:5}}>
              ✓ Referral code applied from your invite link.
            </div>
          )}
          {errors.referral && <div style={{fontSize:11,color:C.red,marginTop:5}}>{errors.referral}</div>}
          {errors.canSkipReferral && (
            <button type="button" onClick={joinWithoutReferral} disabled={submitting}
              style={{background:"none",border:"none",color:C.goldLt,fontSize:11.5,marginTop:6,
                textDecoration:"underline",cursor:"pointer",fontFamily:"'Sora',sans-serif",padding:0}}>
              Join without a referral code
            </button>
          )}
        </div>

        <div style={{display:"flex", gap:12, alignItems:"flex-start", marginBottom:16,
          background:C.bg2, border:`0.5px solid ${errors.privacy?C.red:C.brd}`,
          borderRadius:4, padding:"14px 16px", transition:"border 0.2s"}}>
          <input type="checkbox" id="privacyConsent"
            style={{marginTop:3, flexShrink:0, accentColor:C.gold, width:16, height:16}}/>
          <label htmlFor="privacyConsent" style={{fontSize:12, color:C.muted, lineHeight:1.7, cursor:"pointer"}}>
            I consent to DotVests collecting and using my information for research and product development purposes.
            Data will not be sold or shared with third parties. Contact: <a href="mailto:info@dotvests.com" style={{color:"#E8B121",textDecoration:"none"}}>info@dotvests.com</a>
          </label>
        </div>
        {errors.privacy && <div style={{fontSize:11,color:C.red,marginBottom:10}}>{errors.privacy}</div>}

        {errors.submit && <div style={{fontSize:13,color:C.red,marginBottom:12,textAlign:"center"}}>{errors.submit}</div>}

        <button type="submit" disabled={submitting} style={{
          width:"100%", background:C.gold, border:"none", color:"#000",
          fontFamily:"'Sora',sans-serif", fontSize:13.5, fontWeight:600,
          padding:"13px", borderRadius:3, cursor:submitting?"not-allowed":"pointer", letterSpacing:"0.05em",
          opacity:submitting?0.6:1,
        }}>{submitting ? 'Submitting…' : 'Request Early Access →'}</button>

        <div style={{fontSize:11, color:C.dim, marginTop:10, textAlign:"center"}}>
          No spam. No investment solicitation. Informational updates only.
        </div>
      </form>
    </div>
  );
}

export default WaitlistBar;
