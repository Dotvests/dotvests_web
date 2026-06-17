import React, { useState } from "react";
import { C, FS } from "../constants";

function WaitlistBar(){
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const form = document.forms['WebToLeads7406654000000605590'];
    const errs = {};
    if (!form) return errs;
    const company = form['Company']?.value?.trim();
    const name    = form['Last Name']?.value?.trim();
    const email   = form['Email']?.value?.trim();
    const privacy = document.getElementById('privacyTool7406654000000605590');
    if (!company) errs.company = 'Company / Organisation is required.';
    if (!name)    errs.name    = 'Full name is required.';
    if (email) {
      const at = email.indexOf('@'), dot = email.lastIndexOf('.');
      if (at < 1 || dot < at+2 || dot+2 >= email.length) errs.email = 'Enter a valid email address.';
    }
    if (!privacy?.checked) errs.privacy = 'Please accept the privacy notice.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    // Submit via hidden iframe — bypasses CORS, data lands in Zoho CRM
    const form = document.forms['WebToLeads7406654000000605590'];
    form.target = 'zoho_iframe';
    form.action = 'https://crm.zoho.com/crm/WebToLeadForm';
    form.method = 'POST';
    form.submit();
    setTimeout(() => setDone(true), 800);
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
      {/* Hidden iframe target — receives Zoho redirect silently */}
      <iframe name="zoho_iframe" style={{display:"none"}} title="zoho_submit"/>

      <form name="WebToLeads7406654000000605590" onSubmit={handleSubmit} noValidate>
        {/* Zoho hidden auth fields */}
        <input type="text" style={{display:"none"}} name="xnQsjsdp" defaultValue="be0707caeac2fe05dd2ccd38ad3085037747e72912a40197be635504935ac6dd"/>
        <input type="hidden" name="zc_gad" defaultValue=""/>
        <input type="text" style={{display:"none"}} name="xmIwtLD" defaultValue="67396539347e76c6e554f2aa574b0a41ed75811b42fdf41fda4bee5ec18dc94b9970ae8d12ba4c7bd65258105620b932"/>
        <input type="text" style={{display:"none"}} name="actionType" defaultValue="TGVhZHM="/>
        <input type="text" style={{display:"none"}} name="returnURL" defaultValue="null"/>
        <input type="text" style={{display:"none"}} name="aG9uZXlwb3Q" defaultValue=""/>

        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(min(260px,100%),1fr))", gap:12, marginBottom:12}}>
          <div>
            <div style={{fontSize:10, color:C.muted, letterSpacing:"0.08em", marginBottom:6, textTransform:"uppercase"}}>Company / Organisation *</div>
            <input type="text" name="Company" maxLength={200} placeholder="Your company or N/A" style={inputStyle('company')}/>
            {errors.company && <div style={{fontSize:11,color:C.red,marginTop:4}}>{errors.company}</div>}
          </div>
          <div>
            <div style={{fontSize:10, color:C.muted, letterSpacing:"0.08em", marginBottom:6, textTransform:"uppercase"}}>Full Name *</div>
            <input type="text" name="Last Name" maxLength={80} placeholder="Your full name" style={inputStyle('name')}/>
            {errors.name && <div style={{fontSize:11,color:C.red,marginTop:4}}>{errors.name}</div>}
          </div>
        </div>

        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(min(260px,100%),1fr))", gap:12, marginBottom:12}}>
          <div>
            <div style={{fontSize:10, color:C.muted, letterSpacing:"0.08em", marginBottom:6, textTransform:"uppercase"}}>Email Address</div>
            <input type="text" name="Email" maxLength={100} placeholder="you@email.com" style={inputStyle('email')}/>
            {errors.email && <div style={{fontSize:11,color:C.red,marginTop:4}}>{errors.email}</div>}
          </div>
          <div>
            <div style={{fontSize:10, color:C.muted, letterSpacing:"0.08em", marginBottom:6, textTransform:"uppercase"}}>Investor Type</div>
            <select name="Lead Source" style={selectStyle('type')}>
              <option value="-None-">Select type</option>
              <option value="Web Research">Retail Investor</option>
              <option value="Advertisement">Institutional</option>
              <option value="External Referral">Diaspora Investor</option>
              <option value="Partner">High Net-Worth (HNI)</option>
            </select>
          </div>
        </div>

        <div style={{marginBottom:16}}>
          <div style={{fontSize:10, color:C.muted, letterSpacing:"0.08em", marginBottom:6, textTransform:"uppercase"}}>Investment Range</div>
          <select name="Description" style={selectStyle('amount')}>
            <option value="">Select range</option>
            <option value="Under ₦100,000">Under ₦100,000</option>
            <option value="₦100,000 – ₦500,000">₦100,000 – ₦500,000</option>
            <option value="₦500,000 – ₦2,000,000">₦500,000 – ₦2,000,000</option>
            <option value="₦2M – ₦10M">₦2M – ₦10M</option>
            <option value="Over ₦10M">Over ₦10M</option>
          </select>
        </div>

        <div style={{display:"flex", gap:12, alignItems:"flex-start", marginBottom:16,
          background:C.bg2, border:`0.5px solid ${errors.privacy?C.red:C.brd}`,
          borderRadius:4, padding:"14px 16px", transition:"border 0.2s"}}>
          <input type="checkbox" id="privacyTool7406654000000605590"
            style={{marginTop:3, flexShrink:0, accentColor:C.gold, width:16, height:16}}/>
          <label htmlFor="privacyTool7406654000000605590" style={{fontSize:12, color:C.muted, lineHeight:1.7, cursor:"pointer"}}>
            I consent to DotVests collecting and using my information for research and product development purposes.
            Data will not be sold or shared with third parties. Contact: <span style={{color:C.goldLt}}><a href="mailto:info@dotvests.com" style={{color:"#E8B121",textDecoration:"none"}}><a href="mailto:info@dotvests.com" style={{color:"#E8B121",textDecoration:"none"}}><a href="mailto:info@dotvests.com" style={{color:"#E8B121",textDecoration:"none"}}><a href="mailto:info@dotvests.com" style={{color:"#E8B121",textDecoration:"none"}}><a href="mailto:info@dotvests.com" style={{color:"#E8B121",textDecoration:"none"}}>info@dotvests.com</a></a></a></a></a></span>
          </label>
        </div>
        {errors.privacy && <div style={{fontSize:11,color:C.red,marginBottom:10}}>{errors.privacy}</div>}

        <button type="submit" style={{
          width:"100%", background:C.gold, border:"none", color:"#000",
          fontFamily:"'Sora',sans-serif", fontSize:13.5, fontWeight:600,
          padding:"13px", borderRadius:3, cursor:"pointer", letterSpacing:"0.05em",
        }}>Request Early Access →</button>

        <div style={{fontSize:11, color:C.dim, marginTop:10, textAlign:"center"}}>
          No spam. No investment solicitation. Informational updates only.
        </div>
      </form>
    </div>
  );
}

export default WaitlistBar;
