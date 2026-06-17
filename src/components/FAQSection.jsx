import React, { useState } from "react";
import { C, FS } from "../constants";
import { Tag } from "./shared";

const FAQS = [
  {q:"Is DotVests legal and regulated?",
   a:"DotVests Technologies Limited is a CAC-registered company pursuing the SEC Nigeria Advanced Regulatory Incubation Programme (ARIP). We are in pre-launch phase and do not offer investment services until sandbox approval is granted. All operations are designed to comply with the Investments and Securities Act and NDPA 2023."},
  {q:"What exactly do I own when I buy a token?",
   a:"Each token represents a verified, on-chain fractional claim on the underlying equity of the issuing company. Not a derivative, not a synthetic instrument — actual economic ownership interest, structured through a compliant legal framework before issuance."},
  {q:"How are my shares protected if DotVests shuts down?",
   a:"Token ownership is recorded on the Polymesh blockchain — an immutable public ledger. Your holdings exist independently of DotVests' operational status. The legal structure governing each tokenized company also provides investor protections outside the platform itself."},
  {q:"Why Polymesh and not Ethereum or Solana?",
   a:"General-purpose blockchains allow anonymous wallets and unrestricted token transfers — both securities law violations by default. Polymesh is purpose-built for regulated securities, with KYC/AML identity verification, transfer restrictions, and compliance rules enforced at the protocol level. It was selected specifically for its alignment with SEC Nigeria's regulatory requirements."},
  {q:"What is the minimum investment?",
   a:"Fractional ownership starts from ₦1,000. You do not need to purchase a whole share. This is one of DotVests' core value propositions — removing the capital barriers that have historically locked retail investors out of premium Nigerian equity."},
  {q:"When will the platform launch?",
   a:"DotVests is currently in pre-launch phase pending SEC Nigeria ARIP sandbox approval. Join the waitlist to receive priority access and updates. We are actively pursuing all regulatory milestones required for a compliant launch."},
  {q:"Which companies will be available at launch?",
   a:"Stage 1 targets are high-growth private Nigerian companies — beginning with PiggyVest, Chowdeck, Erisco Foods, and Carbon. These are pre-IPO companies with strong fundamentals and wide name recognition, chosen specifically because they are not NGX-listed, making them appropriate for the ARIP sandbox stage."},
  {q:"How do I receive dividends or returns?",
   a:"Dividend entitlements are embedded in the token structure at the point of issuance. Corporate actions — including dividend distributions — are automated via Polymesh smart contracts and settled directly to your verified wallet in naira or the agreed denomination."},
];

function FAQItem({faq,idx}){
  const [open,setOpen]=useState(false);
  return(
    <div style={{borderTop:`0.5px solid ${C.brd}`,overflow:"hidden"}}>
      <div onClick={(e)=>{e.stopPropagation();setOpen(o=>!o);}} style={{display:"flex",justifyContent:"space-between",
        alignItems:"center",padding:"22px 0",cursor:"pointer",userSelect:"none"}}>
        <span style={{fontSize:15,fontWeight:500,color:open?C.goldLt:C.white,
          fontFamily:FS,paddingRight:24,lineHeight:1.4}}>{faq.q}</span>
        <span style={{fontSize:18,color:open?C.goldLt:C.muted,flexShrink:0,
          transform:open?"rotate(45deg)":"rotate(0deg)",transition:"transform 0.25s"}}>+</span>
      </div>
      {open&&<div style={{paddingBottom:24,fontSize:14,color:C.muted,lineHeight:1.9,maxWidth:680,
        animation:"fadeUp 0.2s ease both"}}>{faq.a}</div>}
    </div>
  );
}

function FAQSection(){
  return(
    <section style={{padding:"clamp(32px,5vw,80px) clamp(14px,4vw,48px)",borderBottom:`0.5px solid ${C.brd}`}}>
      <div style={{maxWidth:"min(780px,100%)",margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:52}}>
          <Tag>FAQ</Tag>
          <h2 style={{fontFamily:FS,fontSize:"clamp(26px,6vw,40px)",fontWeight:400,color:C.white,letterSpacing:"-0.02em"}}>
            Frequently Asked Questions
          </h2>
        </div>
        {FAQS.map((f,i)=><FAQItem key={i} faq={f} idx={i}/>)}
        <div style={{borderTop:`0.5px solid ${C.brd}`,paddingTop:28,marginTop:8,textAlign:"center"}}>
          <span style={{fontSize:13,color:C.muted}}>Still have questions? </span>
          <span style={{fontSize:13,color:C.goldLt,cursor:"pointer"}}><a href="mailto:info@dotvests.com" style={{color:"#E8B121",textDecoration:"none"}}><a href="mailto:info@dotvests.com" style={{color:"#E8B121",textDecoration:"none"}}><a href="mailto:info@dotvests.com" style={{color:"#E8B121",textDecoration:"none"}}><a href="mailto:info@dotvests.com" style={{color:"#E8B121",textDecoration:"none"}}><a href="mailto:info@dotvests.com" style={{color:"#E8B121",textDecoration:"none"}}>info@dotvests.com</a></a></a></a></a></span>
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
