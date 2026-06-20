import React from "react";
import { C, FS, PHOTO_PRECIOUS, PHOTO_SHERRIFF } from "../constants";
import { Tag } from "../components/shared";
import Footer from "../components/Footer";

function Team({go}){
  const members = [
    {
      name:"Precious Okon",
      role:"Founder & CEO",
      photo:PHOTO_PRECIOUS,
      bio:"Banker turned blockchain founder. Background spanning Stanbic IBTC, Fidelity Bank, and Ecobank. Built DotVests to solve the access problem he witnessed firsthand — premium Nigerian equity locked away from ordinary investors.",
      tags:["Banking","Regulatory Strategy","Business Development"],
      linkedin:"https://www.linkedin.com/feed/update/urn:li:activity:7457715874360279040",
    },
    {
      name:"Sherriff",
      role:"Co-Founder & CTO",
      photo:PHOTO_SHERRIFF,
      bio:"Full-stack engineer and blockchain developer. Architecting the Polymesh integration, backend infrastructure, and the tokenization engine that powers DotVests. Builds systems the SEC can audit.",
      tags:["Blockchain","Full-Stack","Polymesh"],
      linkedin:"#",
    },
  ];

  return <div style={{padding:"clamp(32px,5vw,72px) clamp(16px,4vw,48px) 60px"}}>
    <Tag gold>The Team</Tag>
    <h1 style={{fontFamily:FS,fontSize:"clamp(28px,9vw,66px)",fontWeight:400,color:C.white,lineHeight:1.1,letterSpacing:"-0.025em",marginBottom:18,maxWidth:680}}>
      Built by People Who<br/><em style={{color:C.goldLt}}>Know the Problem.</em>
    </h1>
    <p style={{fontSize:"clamp(14px,3.5vw,16px)",color:C.muted,fontWeight:300,maxWidth:"min(520px,100%)",lineHeight:1.85,marginBottom:48}}>
      Bankers and engineers who have seen what African capital markets look like from the inside — and are building the infrastructure to change them.
    </p>

    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(280px,100%),1fr))",gap:2,background:C.brd,marginBottom:48}}>
      {members.map((m,i)=>(
        <div key={i} style={{background:C.bg1,padding:"clamp(24px,4vw,48px) clamp(16px,4vw,44px)"}}>
          <div style={{display:"flex",gap:"clamp(14px,3vw,28px)",alignItems:"flex-start",marginBottom:24,flexWrap:"wrap"}}>
            <div style={{width:96,height:96,borderRadius:"50%",overflow:"hidden",flexShrink:0,
              border:`2px solid ${C.goldBrd}`,boxShadow:`0 0 0 4px rgba(201,150,12,0.08)`}}>
              <img src={m.photo} alt={m.name} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top"}}/>
            </div>
            <div>
              <h2 style={{fontFamily:FS,fontSize:26,fontWeight:400,color:C.white,marginBottom:4}}>{m.name}</h2>
              <div style={{fontSize:12,color:C.goldLt,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:12}}>{m.role}</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {m.tags.map(t=>(
                  <span key={t} style={{fontSize:10,color:C.muted,border:`0.5px solid ${C.brd2}`,padding:"2px 9px",borderRadius:2,letterSpacing:"0.05em"}}>{t}</span>
                ))}
              </div>
            </div>
          </div>
          <p style={{fontSize:14,color:C.muted,lineHeight:1.9,marginBottom:24}}>{m.bio}</p>
          {m.linkedin!=="#"&&<a href={m.linkedin} target="_blank" rel="noopener noreferrer"
            style={{display:"inline-flex",alignItems:"center",gap:8,fontSize:12,color:C.goldLt,
              border:`0.5px solid ${C.goldBrd}`,padding:"7px 16px",borderRadius:3,textDecoration:"none"}}>
            LinkedIn →
          </a>}
        </div>
      ))}
    </div>

    <div style={{background:C.bg1,border:`0.5px solid ${C.brd}`,borderRadius:6,padding:"clamp(24px,4vw,44px) clamp(16px,4vw,48px)",marginBottom:48}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(260px,100%),1fr))",gap:"clamp(20px,4vw,52px)"}}>
        <div>
          <Tag>Join the Team</Tag>
          <h2 style={{fontFamily:FS,fontSize:"clamp(22px,5vw,32px)",fontWeight:400,color:C.white,marginBottom:14}}>We're Building the<br/>Infrastructure Layer.</h2>
          <p style={{fontSize:14,color:C.muted,lineHeight:1.85}}>DotVests is pre-launch and growing. If you're a Polymesh developer, securities lawyer, compliance specialist, or Nigerian fintech operator who believes in the mission — we want to hear from you.</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:16,justifyContent:"center"}}>
          {[["Open Roles","Polymesh Smart Contract Developer · Legal Counsel (SEC/ARIP Track)"],["Location","Remote-first · Nigeria"],["Contact","info@dotvests.com"]].map(([k,v])=>(
            <div key={k} style={{padding:"16px 0",borderBottom:`0.5px solid ${C.brd}`}}>
              <div style={{fontSize:10,color:C.muted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:5}}>{k}</div>
              <div style={{fontSize:13,color:C.white}}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <Footer go={go}/>
  </div>;
}

export default Team;
