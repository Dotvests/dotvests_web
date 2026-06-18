import React, { useState } from "react";
import { C, FS } from "../constants";

function WaitlistBar(){
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

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
    if (!privacy?.checked) errs.privacy = 'Please accept the privacy notice.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);
    try {
      const res = await fetch('https://dotvests-backend.onrender.com/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form['name'].value.trim(),
          email: form['email'].value.trim(),
          company: form['company'].value.trim(),
          investor_type: form['investor_type'].value,
          investment_range: form['investment_range'].value,
          source: 'landing_page',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Something went wrong. Please try again.');
      setDone(true);
    } catch (err) {
      setErrors({ submit: err.message || 'Something went wrong. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (done) return (
    <div style={{textAlign:"center", padding:"36px 0", animation:"fadeUp 0.4s ease both"}}>
      <div style={{fontSize:40, marginBottom:12}}>✓</div>
      <div style={{fontFamily:FS, fontSize:22, color:C.green, marginBottom:10}}>You're on the list.</div>
      <div style={{fontSize:14, color:C.muted, lineHeight:1.8, maxWidth:420, margin:"0 auto"}}>
        Welcome to the future of African investing. We'll be in touch before launch with everything you need to know.
        <br/><br/>
        <em style={{color:C.goldLt}}>DotVests — Redefining Access To African Wealth.</em>
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
      <form onSubmit={handleSubmit} noValidate>

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

        <div style={{marginBottom:16}}>
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

        <div style={{display:"flex", gap:12, alignItems:"flex-start", marginBottom:16,
          background:C.bg2, border:`0.5px solid ${errors.privacy?C.red:C.brd}`,
          borderRadius:4, padding:"14px 16px", transition:"border 0.2s"}}>
          <input type="checkbox" id="privacyConsent"
            style={{marginTop:3, flexShrink:0, accentColor:C.gold, width:16, height:16}}/>
          <label htmlFor="privacyConsent" style={{fontSize:12, color:C.muted, lineHeight:1.7, cursor:"pointer"}}>
            I consent to DotVests collecting and using my information for research and product development purposes.
            Data will not be sold or shared with third parties. Contact: <span style={{color:C.goldLt}}><a href="mailto:info@dotvests.com" style={{color:"#E8B121",textDecoration:"none"}}><a href="mailto:info@dotvests.com" style={{color:"#E8B121",textDecoration:"none"}}><a href="mailto:info@dotvests.com" style={{color:"#E8B121",textDecoration:"none"}}><a href="mailto:info@dotvests.com" style={{color:"#E8B121",textDecoration:"none"}}><a href="mailto:info@dotvests.com" style={{color:"#E8B121",textDecoration:"none"}}>info@dotvests.com</a></a></a></a></a></span>
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
