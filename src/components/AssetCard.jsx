import React from "react";
import { C, FS } from "../constants";
import { fmt, MiniChart } from "./shared";

function AssetCard({asset,prices,delay=0,anim="floatA"}){
  const p=prices[asset.id]||{price:asset.price,chg:asset.chg};
  const up=p.chg>=0;
  return <div style={{background:C.bg2,border:`0.5px solid ${C.brd2}`,borderRadius:10,padding:"18px 20px",minWidth:200,
    animation:`fadeUp 0.8s ${delay}ms both, ${anim} ${4+(delay*0.001)}s ${delay}ms ease-in-out infinite`}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
      <div>
        <div style={{fontSize:10,color:C.muted,marginBottom:2}}>{asset.sector}</div>
        <div style={{fontSize:13,fontWeight:600,color:C.white}}>{asset.name}</div>
      </div>
      <span style={{fontSize:10,padding:"3px 8px",borderRadius:20,
        background:up?"rgba(34,197,94,0.12)":"rgba(239,68,68,0.12)",
        color:up?C.green:C.red}}>{up?"+":""}{p.chg.toFixed(2)}%</span>
    </div>
    <MiniChart up={up} h={32}/>
    <div style={{marginTop:10,fontSize:17,fontWeight:600,color:C.white}}>{fmt(p.price)}</div>
    <div style={{fontSize:10,color:C.muted,marginTop:2}}>per token · min ₦1,000</div>
  </div>;
}

export default AssetCard;
