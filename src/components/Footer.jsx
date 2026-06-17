import React, { useState } from "react";
import { C, FS } from "../constants";
import { DotVestsLogo } from "./shared";

function FooterLink({label,onClick}){
  const [h,set]=useState(false);
  return <button onClick={onClick} onMouseEnter={()=>set(true)} onMouseLeave={()=>set(false)}
    style={{background:"none",border:"none",textAlign:"left",fontSize:13,color:h?C.white:C.muted}}>{label}</button>;
}

function Footer({go}){
  const cols=[
    {t:"Platform",links:[["Markets","markets"],["Tokenize","tokenize"],["Platform","platform"],["Join Waitlist","waitlist"]]},
    {t:"Company", links:[["About","company"],["Team","team"],["Roadmap","roadmap"],["Token Economics","token-economics"],["Compliance","compliance"],["Contact","company"]]},
    {t:"Legal",   links:[["Privacy Policy","company"],["Risk Disclosure","company"],["Regulatory Info","compliance"]]},
  ];
  return <footer style={{background:C.bg1,borderTop:`0.5px solid ${C.brd}`,padding:"clamp(28px,4vw,56px) clamp(14px,4vw,48px) 28px"}}>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:"clamp(16px,3vw,32px)",marginBottom:36}}>
      <div>
        <div style={{marginBottom:14}}><DotVestsLogo height={36}/></div>
        <p style={{fontSize:13,color:C.muted,lineHeight:1.8,maxWidth:220}}>Redefining Access To African Wealth. Tokenized Nigerian equity on Polymesh.</p>
        <p style={{fontSize:11.5,color:C.dim,marginTop:14,lineHeight:1.7}}>DotVests Technologies Limited<br/>CAC Registered · Nigeria · 2026</p>
        {/* Social Links */}
        <div style={{display:"flex",gap:10,marginTop:16}}>
          <a href="https://wa.me/2349066818379" target="_blank" rel="noopener noreferrer"
            style={{display:"inline-flex",alignItems:"center",justifyContent:"center",
              width:34,height:34,borderRadius:"50%",
              background:"rgba(37,211,102,0.12)",
              border:"0.5px solid rgba(37,211,102,0.35)",
              color:"#25D366",fontSize:16,textDecoration:"none",transition:"all 0.2s"}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </a>
          <a href="https://x.com/dotvests" target="_blank" rel="noopener noreferrer"
            style={{display:"inline-flex",alignItems:"center",justifyContent:"center",
              width:34,height:34,borderRadius:"50%",
              background:"rgba(255,255,255,0.06)",
              border:"0.5px solid rgba(255,255,255,0.15)",
              color:"rgba(255,255,255,0.7)",fontSize:16,textDecoration:"none",transition:"all 0.2s"}}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href="https://www.linkedin.com/feed/update/urn:li:activity:7457715874360279040" target="_blank" rel="noopener noreferrer"
            style={{display:"inline-flex",alignItems:"center",justifyContent:"center",
              width:34,height:34,borderRadius:"50%",
              background:"rgba(10,102,194,0.12)",
              border:"0.5px solid rgba(10,102,194,0.35)",
              color:"#0A66C2",fontSize:16,textDecoration:"none",transition:"all 0.2s"}}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
        </div>
      </div>
      {cols.map(col=><div key={col.t}>
        <div style={{fontSize:10.5,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:18}}>{col.t}</div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {col.links.map(([l,p])=><FooterLink key={l} label={l} onClick={()=>go(p)}/>)}
        </div>
      </div>)}
    </div>
    <div style={{borderTop:`0.5px solid ${C.brd}`,paddingTop:22,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{fontSize:12,color:C.dim}}>© 2026 DotVests Technologies Limited. All rights reserved.</span>
      <span style={{fontSize:11,color:C.dim}}>Pre-launch · No investment services offered · Pending SEC Nigeria ARIP</span>
    </div>
  </footer>;
}

export default Footer;
