import React from "react";
import { C, FS } from "../constants";
import { Tag } from "../components/shared";
import Footer from "../components/Footer";

function TokenEconomics({go}){
  const tokens = [
    {id:"PGV",name:"PiggyVest",type:"Equity Token",supply:"Variable",stage:"Stage 1",color:C.green,
     fields:[["Underlying Asset","Ordinary shares of PiggyVest Limited"],["Token Standard","Polymesh Security Token (ERC-1400 compliant)"],["Minimum Holding","₦1,000 (fractional)"],["Dividend Entitlement","Pro-rata to token holdings"],["Transfer Restrictions","KYC-verified wallets only"],["Settlement","Atomic — T+0 on Polymesh"]]},
    {id:"CHD",name:"Chowdeck",type:"Equity Token",supply:"Variable",stage:"Stage 1",color:"#60A5FA",
     fields:[["Underlying Asset","Ordinary shares of Chowdeck Technologies"],["Token Standard","Polymesh Security Token"],["Minimum Holding","₦1,000 (fractional)"],["Dividend Entitlement","Pro-rata to token holdings"],["Transfer Restrictions","KYC-verified wallets only"],["Settlement","Atomic — T+0 on Polymesh"]]},
  ];

  return <div style={{padding:"clamp(32px,5vw,72px) clamp(16px,4vw,48px) 60px"}}>
    <Tag gold>Token Economics</Tag>
    <h1 style={{fontFamily:FS,fontSize:"clamp(28px,9vw,66px)",fontWeight:400,color:C.white,lineHeight:1.1,letterSpacing:"-0.025em",marginBottom:18,maxWidth:680}}>
      What You Own.<br/><em style={{color:C.goldLt}}>How It Works.</em>
    </h1>
    <p style={{fontSize:"clamp(14px,3.5vw,16px)",color:C.muted,fontWeight:300,maxWidth:"min(520px,100%)",lineHeight:1.85,marginBottom:48}}>
      Every DotVests token represents a verified, on-chain economic interest in an underlying Nigerian company. Not a derivative. Not a synthetic. Actual ownership, structured through a compliant legal framework.
    </p>

    {/* Core mechanics */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:1,background:C.brd,marginBottom:48}}>
      {[
        {n:"01",t:"Issuance",icon:"◈",b:"Tokens are issued on Polymesh after a formal partnership agreement is executed with the underlying company, and all regulatory approvals are in place. Zero tokens exist before legal structure is confirmed."},
        {n:"02",t:"Ownership",icon:"◆",b:"Each token carries a fractional claim on the equity of the issuing company — identical economic rights to the underlying shares, including dividend entitlements and participation in liquidity events."},
        {n:"03",t:"Compliance",icon:"⬡",b:"Polymesh enforces KYC/AML at the protocol level. Every wallet is tied to a verified identity. Transfer restrictions are embedded in the token contract — not bolted on afterwards."},
        {n:"04",t:"Settlement",icon:"⟳",b:"Trades settle atomically on Polymesh. T+0. No clearing house, no counterparty risk, no T+2 delays. Every transaction is immutable and permanently auditable on-chain."},
        {n:"05",t:"Dividends",icon:"₦",b:"Corporate actions — including dividend distributions — are automated via Polymesh smart contracts. When the underlying company declares a dividend, token holders receive their pro-rata share automatically."},
        {n:"06",t:"Exit",icon:"→",b:"Token holders can exit positions peer-to-peer via the DotVests marketplace, or via Breet crypto off-ramp. Naira-denominated settlement to your bank account. No lock-in periods."},
      ].map((f,i)=>(
        <div key={i} style={{background:C.bg1,padding:"clamp(18px,3vw,36px) clamp(14px,2.5vw,32px)"}}>
          <div style={{fontSize:11,color:C.gold,letterSpacing:"0.1em",marginBottom:12}}>{f.n}</div>
          <div style={{fontSize:22,color:C.goldLt,marginBottom:12}}>{f.icon}</div>
          <h3 style={{fontFamily:FS,fontSize:20,fontWeight:400,color:C.white,marginBottom:10}}>{f.t}</h3>
          <p style={{fontSize:13,color:C.muted,lineHeight:1.85}}>{f.b}</p>
        </div>
      ))}
    </div>

    {/* Token specs */}
    <div style={{fontSize:11,color:C.muted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:24}}>Stage 1 Token Specifications</div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(280px,100%),1fr))",gap:2,background:C.brd,marginBottom:48}}>
      {tokens.map((t,i)=>(
        <div key={i} style={{background:C.bg1,padding:"clamp(18px,3vw,36px) clamp(14px,2.5vw,32px)"}}>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:24}}>
            <div style={{width:44,height:44,borderRadius:"50%",background:`rgba(201,150,12,0.1)`,
              border:`0.5px solid ${C.goldBrd}`,display:"flex",alignItems:"center",justifyContent:"center",
              fontFamily:FS,fontSize:14,color:C.goldLt}}>{t.id}</div>
            <div>
              <div style={{fontFamily:FS,fontSize:20,fontWeight:400,color:C.white}}>{t.name}</div>
              <div style={{fontSize:11,color:C.goldLt,letterSpacing:"0.06em"}}>{t.type} · {t.stage}</div>
            </div>
          </div>
          {t.fields.map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",
              borderBottom:`0.5px solid ${C.brd}`,flexWrap:"wrap",gap:8}}>
              <span style={{fontSize:12,color:C.muted}}>{k}</span>
              <span style={{fontSize:12,color:C.white,textAlign:"right",maxWidth:"55%"}}>{v}</span>
            </div>
          ))}
        </div>
      ))}
    </div>

    {/* Risk disclaimer */}
    <div style={{background:"rgba(239,68,68,0.05)",border:"0.5px solid rgba(239,68,68,0.15)",
      borderRadius:6,padding:"28px 32px",marginBottom:48}}>
      <div style={{fontSize:11,color:"rgba(239,68,68,0.7)",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:12}}>Risk Disclosure</div>
      <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",lineHeight:1.85}}>
        Investment in tokenized securities carries risk, including the possible loss of principal. Past performance of underlying companies does not guarantee future token performance. DotVests is in pre-launch phase and does not offer investment services until SEC Nigeria ARIP sandbox approval is granted. All token specifications are indicative and subject to change pending final regulatory and legal structuring. This page is for informational purposes only and does not constitute a prospectus or offer to sell securities.
      </p>
    </div>
    <Footer go={go}/>
  </div>;
}

export default TokenEconomics;
