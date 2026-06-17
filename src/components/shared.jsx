import React, { useState, useEffect, useRef } from "react";
import { C, FS, FN, ASSETS, REAL_LOGO } from "../constants";

function useLivePrices(siteAssets) {
  const [pData, set] = useState(() => Object.fromEntries(ASSETS.map(a=>[a.id,{price:a.price,chg:a.chg}])));
  useEffect(()=>{
    const id = setInterval(()=>{
      set(prev=>{
        const next={...prev};
        const pool=(siteAssets||ASSETS).filter(a=>a.status!=="frozen");
        if(!pool.length) return prev;
        const a=pool[Math.floor(Math.random()*pool.length)];
        const d=(Math.random()-0.48)*a.price*0.003;
        const chg = a.chgOverride!=null ? a.chgOverride : (prev[a.id]?.chg||a.chg)+(Math.random()-0.5)*0.04;
        next[a.id]={price:Math.max(1,(prev[a.id]?.price||a.price)+d),chg};
        return next;
      });
    },1400);
    return()=>clearInterval(id);
  },[siteAssets]);
  // Apply chgOverride instantly for any admin-overridden asset
  const result={...pData};
  if(siteAssets){
    siteAssets.forEach(a=>{
      if(a.chgOverride!=null && result[a.id]){
        result[a.id]={...result[a.id], chg:a.chgOverride};
      }
    });
  }
  return result;
}

function fmt(n){return"₦"+Math.round(n).toLocaleString();}

function useCountUp(target){
  const [v,set]=useState(0);const r=useRef();
  useEffect(()=>{
    const s=Date.now(),ms=1800;
    const tick=()=>{const p=Math.min(1,(Date.now()-s)/ms);set(Math.round(p*target));if(p<1)r.current=requestAnimationFrame(tick);};
    r.current=requestAnimationFrame(tick);return()=>cancelAnimationFrame(r.current);
  },[target]);return v;
}

// ── PRIMITIVES ────────────────────────────────────────────────────────────────
function Tag({children,gold}){
  return <span style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:10.5,letterSpacing:"0.14em",textTransform:"uppercase",
    color:gold?C.goldLt:C.muted,border:`0.5px solid ${gold?C.goldBrd:C.brd2}`,borderRadius:2,padding:"5px 12px",marginBottom:22}}>
    {gold&&<span style={{width:5,height:5,borderRadius:"50%",background:C.gold,display:"inline-block"}}/>}
    {children}
  </span>;
}

function Btn({children,v="gold",onClick,sx={}}){
  const [h,set]=useState(false);
  const base={display:"inline-flex",alignItems:"center",gap:8,fontSize:13,fontWeight:500,
    letterSpacing:"0.05em",borderRadius:3,border:"none",padding:"11px 24px",transition:"all 0.2s",...sx};
  if(v==="gold") return <button onClick={onClick} onMouseEnter={()=>set(true)} onMouseLeave={()=>set(false)}
    style={{...base,background:h?C.goldLt:C.gold,color:"#000",transform:h?"translateY(-1px)":"none",
      boxShadow:h?`0 8px 24px rgba(201,150,12,0.3)`:"none"}}>{children}</button>;
  if(v==="ghost") return <button onClick={onClick} onMouseEnter={()=>set(true)} onMouseLeave={()=>set(false)}
    style={{...base,background:"none",border:`0.5px solid ${h?C.brd2:C.brd}`,color:h?C.white:C.muted}}>{children}</button>;
  if(v==="og") return <button onClick={onClick} onMouseEnter={()=>set(true)} onMouseLeave={()=>set(false)}
    style={{...base,background:h?C.goldDim:"none",border:`0.5px solid ${h?C.gold:C.goldBrd}`,color:C.goldLt}}>{children}</button>;
}

function MiniChart({up,h=44}){
  const bars=[38,52,44,70,55,75,48,82,60,88,65,72];
  return <div style={{display:"flex",alignItems:"flex-end",gap:2,height:h}}>
    {bars.map((b,i)=><div key={i} style={{flex:1,height:`${b}%`,
      background:up?"rgba(34,197,94,0.55)":"rgba(239,68,68,0.55)",borderRadius:"1px 1px 0 0"}}/>)}
  </div>;
}

// ── LOGO SVG (replicates DotVests mark) ──────────────────────────────────────
function DotVestsLogo({height=44}){
  return(
    <div style={{position:"relative",display:"inline-flex",height:height,
      overflow:"hidden",mixBlendMode:"screen"}}>
      <img src={REAL_LOGO} alt="DotVests Technologies"
        style={{height:height, width:"auto", objectFit:"contain"}}/>
    </div>
  );
}

export { useLivePrices, fmt, useCountUp, Tag, Btn, MiniChart, DotVestsLogo };
