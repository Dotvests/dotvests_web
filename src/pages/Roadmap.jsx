import React from "react";
import { C, FS } from "../constants";
import { Tag } from "../components/shared";
import Footer from "../components/Footer";

function Roadmap({go}){
  const milestones = [
    {q:"Q1 2025",label:"Foundation",done:true,items:["DotVests Technologies Limited incorporated (CAC)","Polymesh selected as blockchain layer","Legal framework research initiated","Core team assembled"]},
    {q:"Q2 2025",label:"Architecture",done:true,items:["Backend deployed on Render (Node.js/Express)","Paystack payment rails integrated","Breet crypto on/off ramp integrated","Polymesh testnet onboarding initiated"]},
    {q:"Q3 2025",label:"Product Build",done:true,items:["MVP frontend completed","Admin dashboard with asset controls","Zoho CRM waitlist integration","QA Testing Manual produced for SEC"]},
    {q:"Q4 2025 – Q1 2026",label:"Regulatory Preparation",done:true,items:["OES Grant (₦10M) awarded — first external validation","Legal Instruction Brief produced (Ref: DTV/LIB-2026/001)","ARIP pre-application initiated","Mid-tier legal counsel engaged (Pavestones Legal)"]},
    {q:"Q2 2026",label:"Active — ARIP Submission",done:false,active:true,items:["SEC Nigeria ARIP formal application","Anchoria Investment — broker/custody partnership","Stage 1 asset partner outreach (PiggyVest, Chowdeck, Erisco, Carbon)","Visa Africa FinTech Accelerator Cohort 6"]},
    {q:"Q3 2026",label:"Sandbox Launch",done:false,items:["SEC ARIP sandbox approval (target)","Closed beta — verified investors only","First tokenized asset issued on Polymesh","Real-time portfolio tracking live"]},
    {q:"Q4 2026 – Q1 2027",label:"Stage 1 Public",done:false,items:["Full public launch post-ARIP","Stage 1 assets: PiggyVest, Chowdeck, Carbon, Erisco Foods","Naira fractional investing from ₦1,000","Dividend automation via Polymesh smart contracts"]},
    {q:"2027",label:"Stage 2 — NASD DSP",done:false,items:["NASD Dealing and Settlement Platform membership","OTC market integration","Unlisted securities trading enabled","Institutional investor onboarding"]},
    {q:"2028+",label:"Stage 3–4 — NGX & Pan-African",done:false,items:["Licensed NGX broker-custodian partnership","GTBank, MTN Nigeria, Dangote Cement, Zenith tokenization","Multi-jurisdiction expansion: Ghana, Kenya, Egypt","Proprietary chain migration — DotVests as continental infrastructure"]},
  ];

  return <div style={{padding:"clamp(32px,5vw,72px) clamp(16px,4vw,48px) 60px"}}>
    <Tag gold>Roadmap</Tag>
    <h1 style={{fontFamily:FS,fontSize:"clamp(28px,9vw,66px)",fontWeight:400,color:C.white,lineHeight:1.1,letterSpacing:"-0.025em",marginBottom:18,maxWidth:680}}>
      From Registration<br/><em style={{color:C.goldLt}}>To Continental Infrastructure.</em>
    </h1>
    <p style={{fontSize:"clamp(14px,3.5vw,16px)",color:C.muted,fontWeight:300,maxWidth:"min(520px,100%)",lineHeight:1.85,marginBottom:48}}>
      Every milestone is a regulatory and technical prerequisite for the next. DotVests is not moving fast — it is moving correctly.
    </p>

    <div style={{position:"relative",marginBottom:48}}>
      {/* Vertical timeline line */}
      <div style={{position:"absolute",left:"clamp(50px,13vw,119px)",top:0,bottom:0,width:1,background:`linear-gradient(to bottom,${C.gold},rgba(201,150,12,0.1))`}}/>

      {milestones.map((m,i)=>(
        <div key={i} style={{display:"grid",gridTemplateColumns:"clamp(50px,14vw,120px) 1fr",gap:"clamp(10px,2.5vw,40px)",marginBottom:36,position:"relative"}}>
          {/* Quarter label */}
          <div style={{textAlign:"right",paddingTop:4}}>
            <div style={{fontSize:11,color:m.active?C.goldLt:m.done?C.gold:"rgba(255,255,255,0.25)",
              fontWeight:m.active?600:400,letterSpacing:"0.06em",lineHeight:1.4}}>{m.q}</div>
          </div>

          {/* Timeline dot */}
          <div style={{position:"absolute",left:"clamp(43px,12.5vw,111px)",top:6,width:12,height:12,borderRadius:"50%",
            background:m.active?C.gold:m.done?C.gold:"rgba(255,255,255,0.1)",
            border:`2px solid ${m.active||m.done?C.gold:"rgba(255,255,255,0.15)"}`,
            boxShadow:m.active?`0 0 12px rgba(201,150,12,0.6)`:m.done?`0 0 6px rgba(201,150,12,0.2)`:"none",
            zIndex:1}}/>

          {/* Content */}
          <div style={{background:m.active?C.bg2:m.done?C.bg1:"rgba(255,255,255,0.02)",
            border:`0.5px solid ${m.active?C.goldBrd:m.done?"rgba(201,150,12,0.15)":C.brd}`,
            borderRadius:6,padding:"clamp(14px,3vw,24px) clamp(12px,2.5vw,28px)",opacity:m.done||m.active?1:0.55}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
              <h3 style={{fontFamily:FS,fontSize:20,fontWeight:400,color:m.active?C.goldLt:C.white}}>{m.label}</h3>
              {m.done&&<span style={{fontSize:9,background:"rgba(34,197,94,0.15)",color:"#22C55E",
                border:"0.5px solid rgba(34,197,94,0.3)",padding:"2px 9px",borderRadius:2,letterSpacing:"0.08em"}}>COMPLETE</span>}
              {m.active&&<span style={{fontSize:9,background:C.goldDim,color:C.goldLt,
                border:`0.5px solid ${C.goldBrd}`,padding:"2px 9px",borderRadius:2,letterSpacing:"0.08em"}}>ACTIVE</span>}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {m.items.map((it,j)=>(
                <div key={j} style={{display:"flex",alignItems:"center",gap:10,fontSize:13.5,color:m.done?"rgba(255,255,255,0.65)":m.active?C.white:"rgba(255,255,255,0.35)"}}>
                  <div style={{width:5,height:5,borderRadius:"50%",flexShrink:0,
                    background:m.done?"#22C55E":m.active?C.gold:"rgba(255,255,255,0.2)"}}/>
                  {it}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
    <Footer go={go}/>
  </div>;
}

export default Roadmap;
