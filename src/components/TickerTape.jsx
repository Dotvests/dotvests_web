import React from "react";
import { C, ASSETS } from "../constants";
import { fmt } from "./shared";

function Ticker({prices}){
  const items=[...ASSETS,...ASSETS];
  return <div style={{borderBottom:`0.5px solid ${C.brd}`,background:C.bg1,overflow:"hidden",height:36,display:"flex",alignItems:"center"}}>
    <div style={{display:"inline-flex",animation:"ticker 28s linear infinite",whiteSpace:"nowrap"}}>
      {items.map((a,i)=>{const p=prices[a.id];const up=p.chg>=0;return(
        <span key={i} style={{display:"inline-flex",alignItems:"center",gap:10,padding:"0 26px",fontSize:"clamp(10px,2.5vw,11.5px)",borderRight:`0.5px solid ${C.brd}`}}>
          <span style={{color:C.muted}}>{a.id}</span>
          <span style={{color:C.white,fontWeight:500}}>{fmt(p.price)}</span>
          <span style={{color:up?C.green:C.red,fontSize:11}}>{up?"▲":"▼"} {Math.abs(p.chg).toFixed(2)}%</span>
        </span>);
      })}
    </div>
  </div>;
}

export default Ticker;
