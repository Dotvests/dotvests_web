import React, { useState, useEffect, useRef } from "react";
import { C, FS } from "../constants";
import { Tag } from "../components/shared";
import Footer from "../components/Footer";

function RegulatoryPipeline() {
  const ref = useRef();
  useEffect(() => {
    const cv = ref.current; if(!cv) return;
    const cx = cv.getContext('2d');
    cv.width = cv.offsetWidth; cv.height = cv.offsetHeight;
    const W=cv.width,H=cv.height;
    const STAGES=[{label:'Stage 1',sub:'SEC ARIP'},{label:'Stage 2',sub:'NASD DSP'},{label:'Stage 3',sub:'NGX Blue-Chip'},{label:'Stage 4',sub:'Pan-African'}];
    const PAD=60,spacing=(W-PAD*2)/(STAGES.length-1),lineY=H*0.42,boxW=92,boxH=52;
    let dotT=0,dotSpeed=0.004,litStage=-1,litTick=0;
    function stageX(i){return PAD+i*spacing;}
    function update(){
      dotT+=dotSpeed;
      const idx=Math.floor(dotT),frac=dotT-idx;
      if(frac<0.08&&idx!==litStage&&idx<STAGES.length){litStage=idx;litTick=0;}
      if(litTick<60)litTick++;
      if(dotT>=STAGES.length-1+0.15){dotSpeed=0;setTimeout(()=>{dotT=0;dotSpeed=0.004;litStage=-1;},1200);}
    }
    function render(){
      cx.clearRect(0,0,W,H);
      cx.strokeStyle='rgba(201,150,12,0.03)';cx.lineWidth=0.5;
      for(let x=0;x<W;x+=52){cx.beginPath();cx.moveTo(x,0);cx.lineTo(x,H);cx.stroke();}
      for(let y=0;y<H;y+=52){cx.beginPath();cx.moveTo(0,y);cx.lineTo(W,y);cx.stroke();}
      cx.beginPath();cx.moveTo(PAD,lineY);cx.lineTo(W-PAD,lineY);cx.strokeStyle='rgba(201,150,12,0.15)';cx.lineWidth=1.5;cx.stroke();
      const toX=PAD+dotT*spacing;
      if(toX>PAD){const g=cx.createLinearGradient(PAD,0,toX,0);g.addColorStop(0,'rgba(201,150,12,0.08)');g.addColorStop(1,'rgba(232,177,33,0.55)');cx.beginPath();cx.moveTo(PAD,lineY);cx.lineTo(toX,lineY);cx.strokeStyle=g;cx.lineWidth=1.5;cx.stroke();}
      STAGES.forEach((s,i)=>{
        const x=stageX(i),isActive=i===0,isLit=i===litStage,litF=isLit?Math.max(0,1-litTick/45):0,isDone=dotT>i,nr=8;
        if(isLit||isDone||isActive){const gg=cx.createRadialGradient(x,lineY,0,x,lineY,nr*3.5);gg.addColorStop(0,`rgba(232,177,33,${isActive?0.25:0.12+0.2*litF})`);gg.addColorStop(1,'rgba(0,0,0,0)');cx.beginPath();cx.arc(x,lineY,nr*3.5,0,Math.PI*2);cx.fillStyle=gg;cx.fill();}
        cx.beginPath();cx.arc(x,lineY,nr,0,Math.PI*2);cx.fillStyle=(isDone||isActive||isLit)?`rgba(232,177,33,${0.5+0.5*(isLit?litF:1)})`:'rgba(201,150,12,0.15)';cx.fill();
        cx.strokeStyle=(isDone||isActive||isLit)?`rgba(232,177,33,${0.7+0.3*litF})`:'rgba(201,150,12,0.25)';cx.lineWidth=0.8;cx.stroke();
        const bx=x-boxW/2,by=lineY+22;
        cx.beginPath();if(cx.roundRect)cx.roundRect(bx,by,boxW,boxH,4);else cx.rect(bx,by,boxW,boxH);
        cx.fillStyle=isActive?'rgba(201,150,12,0.1)':isDone?'rgba(201,150,12,0.06)':'rgba(255,255,255,0.02)';cx.fill();
        cx.strokeStyle=isActive?'rgba(201,150,12,0.45)':isDone?'rgba(201,150,12,0.2)':'rgba(255,255,255,0.06)';cx.lineWidth=0.5;cx.stroke();
        cx.fillStyle=isActive?'#E8B121':isDone?'rgba(201,150,12,0.7)':'rgba(255,255,255,0.25)';cx.font='500 10px sans-serif';cx.textAlign='center';cx.fillText(s.label,x,by+18);
        cx.fillStyle=isActive?'rgba(232,177,33,0.75)':isDone?'rgba(201,150,12,0.45)':'rgba(255,255,255,0.18)';cx.font='400 9.5px sans-serif';cx.fillText(s.sub,x,by+34);
        if(isActive){cx.beginPath();if(cx.roundRect)cx.roundRect(x-19,by+42,38,14,2);else cx.rect(x-19,by+42,38,14);cx.fillStyle='#C9960C';cx.fill();cx.fillStyle='#000';cx.font='600 8px sans-serif';cx.textAlign='center';cx.fillText('ACTIVE',x,by+52);}
        cx.beginPath();cx.moveTo(x,lineY+nr);cx.lineTo(x,by);cx.strokeStyle=isActive?'rgba(201,150,12,0.3)':isDone?'rgba(201,150,12,0.15)':'rgba(255,255,255,0.06)';cx.lineWidth=0.5;cx.setLineDash([2,3]);cx.stroke();cx.setLineDash([]);
      });
      const dx=PAD+dotT*spacing;
      for(let i=0;i<8;i++){cx.beginPath();cx.arc(dx-i*5,lineY,3-i*0.25,0,Math.PI*2);cx.fillStyle=`rgba(232,177,33,${0.55-i*0.07})`;cx.fill();}
      cx.beginPath();cx.arc(dx,lineY,4.5,0,Math.PI*2);cx.fillStyle='#E8B121';cx.fill();
      cx.beginPath();cx.arc(dx,lineY,2,0,Math.PI*2);cx.fillStyle='#fff';cx.fill();
      cx.fillStyle='rgba(201,150,12,0.22)';cx.font='400 10px sans-serif';cx.textAlign='center';cx.fillText('Four-Stage Regulatory Roadmap · DotVests Technologies',W/2,H-10);
    }
    let raf;function loop(){update();render();raf=requestAnimationFrame(loop);}loop();
    return()=>cancelAnimationFrame(raf);
  },[]);
  return <canvas ref={ref} style={{width:"100%",height:180,display:"block",borderRadius:6,background:"#070707",marginBottom:48}}/>;
}

// ── ANIMATION: LIVE MARKET CHART (Markets page) ───────────────────────────────

function Compliance({go}){
  const roadmap=[
    {s:"Stage 1 · Active",t:"SEC Nigeria ARIP Sandbox",active:true,b:"ARIP pre-application in progress. Legal counsel engaged. Polymesh selected for compliance-native KYC/AML. Target: tokenize private Nigerian company equity within sandbox.",items:["ARIP Initial Assessment Form Submitted","Legal Counsel: Pavestones Legal / Banwo & Ighodalo","Polymesh Testnet Deployment","QA Testing Manual for SEC Submission"]},
    {s:"Stage 2",t:"NASD DSP Membership",active:false,b:"Post-ARIP graduation. NASD Dealing and Settlement Platform membership enables OTC and unlisted securities trading.",items:[]},
    {s:"Stage 3",t:"NGX Blue-Chip Tokenization",active:false,b:"Licensed NGX broker-custodian partnership. GTBank, Dangote Cement, MTN Nigeria, Zenith Bank. Exchange-grade infrastructure required.",items:[]},
    {s:"Stage 4",t:"Pan-African Expansion",active:false,b:"Proprietary chain deployment. Multi-jurisdiction regulatory coverage. DotVests as the continental infrastructure layer.",items:[]},
  ];
  const regs=[
    {reg:"SEC Nigeria",role:"Primary securities regulator",note:"ARIP sandbox is the direct entry pathway. Pre-application active."},
    {reg:"CBN",role:"Central Bank of Nigeria",note:"Naira payment rails via Paystack. Breet for crypto on/off ramp."},
    {reg:"NDPC",role:"Data Protection Commission",note:"All investor PII handled under Nigeria Data Protection Act 2023."},
    {reg:"NASD",role:"OTC Market Operator",note:"Stage 2 target. DSP membership enables unlisted company trading."},
    {reg:"NGX",role:"Nigerian Exchange Group",note:"Stage 3 target. Requires licensed broker-custodian partnership."},
    {reg:"Polymesh",role:"Blockchain Protocol",note:"Purpose-built for regulated securities. Compliance at the chain level."},
  ];
  return <div style={{padding:"clamp(32px,5vw,72px) clamp(16px,4vw,48px) 60px"}}>
    <Tag gold>Regulatory Architecture</Tag>
    <h1 style={{fontFamily:FS,fontSize:"clamp(28px,9vw,66px)",fontWeight:400,color:C.white,lineHeight:1.1,letterSpacing:"-0.025em",marginBottom:18,maxWidth:680}}>
      Compliance is<br/><em style={{color:C.goldLt}}>The Architecture.</em>
    </h1>
    <RegulatoryPipeline/>
    <p style={{fontSize:"clamp(14px,3.5vw,16px)",color:C.muted,fontWeight:300,maxWidth:"min(520px,100%)",lineHeight:1.85,marginBottom:40}}>Not bolted on after the fact. Every infrastructure decision at DotVests traces directly to a regulatory requirement.</p>
    <div style={{marginBottom:48}}>
      <div style={{fontSize:11,color:C.muted,letterSpacing:"0.08em",marginBottom:24,textTransform:"uppercase"}}>Four-Stage Regulatory Roadmap</div>
      {roadmap.map((r,i)=>(
        <div key={i} style={{display:"grid",gridTemplateColumns:"clamp(60px,18vw,160px) 1fr",gap:"clamp(10px,2vw,36px)",padding:"20px 0",borderTop:`0.5px solid ${r.active?C.goldBrd:C.brd}`,opacity:r.active?1:0.5}}>
          <div>
            <div style={{fontSize:11,color:r.active?C.goldLt:C.muted,letterSpacing:"0.06em",marginBottom:8}}>{r.s}</div>
            {r.active&&<span style={{fontSize:10,background:C.gold,color:"#000",padding:"2px 10px",borderRadius:20}}>ACTIVE</span>}
          </div>
          <div>
            <h3 style={{fontFamily:FS,fontSize:24,fontWeight:400,color:C.white,marginBottom:10}}>{r.t}</h3>
            <p style={{fontSize:13.5,color:C.muted,lineHeight:1.85,maxWidth:540,marginBottom:r.items.length?16:0}}>{r.b}</p>
            {r.items.length>0&&<div style={{display:"flex",flexDirection:"column",gap:9}}>
              {r.items.map((it,j)=><div key={j} style={{display:"flex",alignItems:"center",gap:10,fontSize:13,color:C.muted}}><div style={{width:5,height:5,borderRadius:"50%",background:C.gold,flexShrink:0}}/>{it}</div>)}
            </div>}
          </div>
        </div>
      ))}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(240px,100%),1fr))",gap:1,background:C.brd}}>
      {regs.map((f,i)=>(
        <div key={i} style={{background:C.bg1,padding:"clamp(18px,3vw,32px) clamp(14px,2.5vw,28px)"}}>
          <div style={{display:"inline-block",fontSize:10.5,color:C.goldLt,border:`0.5px solid ${C.goldBrd}`,padding:"3px 10px",borderRadius:2,letterSpacing:"0.08em",marginBottom:12}}>{f.reg}</div>
          <div style={{fontSize:13,color:C.white,fontWeight:500,marginBottom:7}}>{f.role}</div>
          <p style={{fontSize:12.5,color:C.muted,lineHeight:1.8}}>{f.note}</p>
        </div>
      ))}
    </div>
    <div style={{marginTop:72}}><Footer go={go}/></div>
  </div>;
}

// ── COMPANY ───────────────────────────────────────────────────────────────────

export default Compliance;
