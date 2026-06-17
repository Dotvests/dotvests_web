import React, { useState, useEffect, useRef } from "react";
import { C, FS } from "../constants";
import { Tag, Btn } from "../components/shared";
import Footer from "../components/Footer";
import WaitlistBar from "../components/WaitlistForm";

function MobilePlatformDemo() {
  const ref = useRef();
  useEffect(() => {
    const cv = ref.current; if(!cv) return;
    const cx = cv.getContext('2d');
    const resize = () => { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; };
    resize();
    const W = () => cv.width, H = () => cv.height;
    const PW=160,PH=310,PR=18;
    const getPX = () => W()/2-PW/2, getPY = () => H()/2-PH/2+8;

    const STEPS=['lock','home','market','buy','confirm','success'];
    const stepDur=[140,110,130,120,100,160];
    let step=0,stepTick=0,fingerX=0,fingerY=0,fingerAlpha=0,tapAnim=0,tick=0;
    const particles=[];

    function spawnParticles(){for(let i=0;i<18;i++){const a=Math.random()*Math.PI*2;particles.push({x:W()/2,y:H()/2,vx:Math.cos(a)*(2+Math.random()*3),vy:Math.sin(a)*(2+Math.random()*3)-1,life:1,r:2.5+Math.random()*2.5,color:Math.random()>0.5?'#E8B121':'#22C55E'});}}

    function update(){
      tick++;stepTick++;
      if(stepTick>=stepDur[step]){stepTick=0;step=(step+1)%STEPS.length;if(step===5)spawnParticles();tapAnim=0;}
      const PX=getPX(),PY=getPY();
      if(STEPS[step]==='lock'){fingerX=PX+PW/2;fingerY=PY+PH*0.72;fingerAlpha=Math.min(1,stepTick/20);if(stepTick===60)tapAnim=0.01;}
      else if(STEPS[step]==='market'){fingerX=PX+PW*0.5;fingerY=PY+PH*0.42;fingerAlpha=stepTick>20?Math.min(1,(stepTick-20)/20):0;if(stepTick===50)tapAnim=0.01;}
      else if(STEPS[step]==='buy'){fingerX=PX+PW*0.5;fingerY=PY+PH*0.78;fingerAlpha=stepTick>10?Math.min(1,(stepTick-10)/15):0;if(stepTick===40)tapAnim=0.01;}
      else if(STEPS[step]==='confirm'){fingerX=PX+PW*0.5;fingerY=PY+PH*0.82;fingerAlpha=stepTick>10?Math.min(1,(stepTick-10)/15):0;if(stepTick===35)tapAnim=0.01;}
      else{fingerAlpha=Math.max(0,fingerAlpha-0.04);}
      if(tapAnim>0&&tapAnim<1)tapAnim+=0.04;if(tapAnim>=1)tapAnim=0;
      for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.x+=p.vx;p.y+=p.vy;p.vy+=0.06;p.life-=0.025;if(p.life<=0)particles.splice(i,1);}
    }

    function drawPhone(){
      const PX=getPX(),PY=getPY();
      const gl=cx.createRadialGradient(W()/2,H()/2,0,W()/2,H()/2,140);gl.addColorStop(0,'rgba(201,150,12,0.07)');gl.addColorStop(1,'rgba(0,0,0,0)');cx.fillStyle=gl;cx.fillRect(0,0,W(),H());
      cx.beginPath();if(cx.roundRect)cx.roundRect(PX,PY,PW,PH,PR);else cx.rect(PX,PY,PW,PH);cx.fillStyle='#111';cx.fill();cx.strokeStyle='rgba(201,150,12,0.5)';cx.lineWidth=1;cx.stroke();
      const SX=PX+5,SY=PY+28,SW=PW-10,SH=PH-52;
      cx.beginPath();if(cx.roundRect)cx.roundRect(SX,SY,SW,SH,7);else cx.rect(SX,SY,SW,SH);cx.fillStyle='#0A0A0A';cx.fill();
      cx.beginPath();if(cx.roundRect)cx.roundRect(PX+PW/2-18,PY+7,36,14,7);else cx.rect(PX+PW/2-18,PY+7,36,14);cx.fillStyle='#0D0D0D';cx.fill();cx.strokeStyle='rgba(201,150,12,0.2)';cx.lineWidth=0.5;cx.stroke();
      cx.beginPath();if(cx.roundRect)cx.roundRect(PX+PW/2-22,PY+PH-14,44,4,2);else cx.rect(PX+PW/2-22,PY+PH-14,44,4);cx.fillStyle='rgba(201,150,12,0.3)';cx.fill();
      cx.save();cx.beginPath();if(cx.roundRect)cx.roundRect(SX,SY,SW,SH,7);else cx.rect(SX,SY,SW,SH);cx.clip();
      drawScreen(SX,SY,SW,SH);cx.restore();
    }

    function drawScreen(sx,sy,sw,sh){
      const s=STEPS[step],p=stepTick/stepDur[step];
      if(s==='lock')drawLock(sx,sy,sw,sh,p);
      else if(s==='home')drawHome(sx,sy,sw,sh,p);
      else if(s==='market')drawMarket(sx,sy,sw,sh,p);
      else if(s==='buy')drawBuy(sx,sy,sw,sh,p);
      else if(s==='confirm')drawConfirm(sx,sy,sw,sh,p);
      else if(s==='success')drawSuccess(sx,sy,sw,sh,p);
    }

    function drawLock(sx,sy,sw,sh,p){
      cx.fillStyle='#080808';cx.fillRect(sx,sy,sw,sh);
      cx.fillStyle='rgba(201,150,12,0.9)';cx.font='bold 11px sans-serif';cx.textAlign='center';cx.fillText('◆ DotVests',sx+sw/2,sy+36);
      cx.fillStyle='rgba(255,255,255,0.8)';cx.font='bold 22px sans-serif';cx.fillText('09:41',sx+sw/2,sy+72);
      cx.fillStyle='rgba(255,255,255,0.35)';cx.font='400 8px sans-serif';cx.fillText('Mon, 12 May 2026',sx+sw/2,sy+86);
      const fx=sx+sw/2,fy=sy+sh*0.68,pulse=0.5+0.5*Math.sin(tick*0.08);
      cx.beginPath();cx.arc(fx,fy,20+pulse*3,0,Math.PI*2);cx.strokeStyle=`rgba(201,150,12,${0.12+0.08*pulse})`;cx.lineWidth=1;cx.stroke();
      cx.beginPath();cx.arc(fx,fy,16,0,Math.PI*2);cx.strokeStyle='rgba(201,150,12,0.35)';cx.lineWidth=1;cx.stroke();
      for(let i=0;i<5;i++){cx.beginPath();cx.arc(fx,fy,5+i*2.5,Math.PI*0.2,Math.PI*1.8);cx.strokeStyle=`rgba(232,177,33,${0.25+0.12*i})`;cx.lineWidth=0.7;cx.stroke();}
      if(p>0.3){const sp=Math.min(1,(p-0.3)/0.5);cx.save();cx.beginPath();cx.arc(fx,fy,16,0,Math.PI*2);cx.clip();cx.fillStyle=`rgba(201,150,12,${0.15*sp})`;cx.fillRect(fx-16,fy-16,32,32*sp);cx.restore();}
      cx.fillStyle='rgba(255,255,255,0.25)';cx.font='400 8px sans-serif';cx.textAlign='center';cx.fillText('Touch to unlock',sx+sw/2,sy+sh-18);
    }

    function drawHome(sx,sy,sw,sh,p){
      cx.fillStyle='#090909';cx.fillRect(sx,sy,sw,sh);
      cx.fillStyle='rgba(255,255,255,0.45)';cx.font='400 7px sans-serif';cx.textAlign='left';cx.fillText('9:41',sx+7,sy+13);
      cx.fillStyle='rgba(255,255,255,0.5)';cx.font='400 7px sans-serif';cx.fillText('Good morning, Precious',sx+10,sy+30);
      cx.fillStyle='#E8B121';cx.font='bold 13px sans-serif';cx.fillText('₦248,500',sx+10,sy+46);
      cx.fillStyle='rgba(34,197,94,0.9)';cx.font='400 7px sans-serif';cx.fillText('▲ +3.2% today',sx+10,sy+58);
      const chartX=sx+10,chartY=sy+66,chartW=sw-20,chartH=32;
      const pts=[0.5,0.45,0.55,0.48,0.62,0.58,0.72,0.68,0.78,0.82,0.75,0.88];
      cx.beginPath();cx.moveTo(chartX,chartY+chartH-(pts[0]*chartH));pts.forEach((v,i)=>cx.lineTo(chartX+(i/(pts.length-1))*chartW,chartY+chartH-v*chartH));cx.strokeStyle='rgba(34,197,94,0.6)';cx.lineWidth=1;cx.stroke();
      const assets=[{n:'PiggyVest',v:'₦1,842',c:'+2.3%',up:true},{n:'Carbon',v:'₦983',c:'+3.5%',up:true},{n:'Chowdeck',v:'₦619',c:'-0.8%',up:false}];
      assets.forEach((a,i)=>{
        const ay=sy+108+i*38;
        cx.beginPath();if(cx.roundRect)cx.roundRect(sx+8,ay,sw-16,30,3);else cx.rect(sx+8,ay,sw-16,30);cx.fillStyle='rgba(255,255,255,0.03)';cx.fill();cx.strokeStyle='rgba(201,150,12,0.12)';cx.lineWidth=0.5;cx.stroke();
        cx.fillStyle='rgba(255,255,255,0.75)';cx.font='500 8px sans-serif';cx.textAlign='left';cx.fillText(a.n,sx+13,ay+13);
        cx.fillStyle='rgba(255,255,255,0.9)';cx.font='500 9px sans-serif';cx.textAlign='right';cx.fillText(a.v,sx+sw-13,ay+13);
        cx.fillStyle=a.up?'rgba(34,197,94,0.8)':'rgba(239,68,68,0.8)';cx.font='400 7px sans-serif';cx.fillText(a.c,sx+sw-13,ay+24);
      });
    }

    function drawMarket(sx,sy,sw,sh,p){
      cx.fillStyle='#090909';cx.fillRect(sx,sy,sw,sh);
      cx.fillStyle='rgba(201,150,12,0.8)';cx.font='bold 10px sans-serif';cx.textAlign='left';cx.fillText('Markets',sx+10,sy+24);
      const assets=[{n:'PiggyVest',sec:'Fintech',v:'₦1,842',c:'+2.34%',up:true},{n:'Erisco Foods',sec:'Consumer',v:'₦312',c:'+1.12%',up:true},{n:'Chowdeck',sec:'Logistics',v:'₦619',c:'-0.87%',up:false},{n:'Carbon',sec:'Banking',v:'₦983',c:'+3.56%',up:true}];
      const tapped=p>0.35;
      assets.forEach((a,i)=>{
        const ay=sy+36+i*46;const isSelected=i===0&&tapped;
        cx.beginPath();if(cx.roundRect)cx.roundRect(sx+7,ay,sw-14,38,4);else cx.rect(sx+7,ay,sw-14,38);cx.fillStyle=isSelected?'rgba(201,150,12,0.1)':'rgba(255,255,255,0.03)';cx.fill();cx.strokeStyle=isSelected?'rgba(201,150,12,0.45)':'rgba(255,255,255,0.06)';cx.lineWidth=0.5;cx.stroke();
        cx.fillStyle='rgba(255,255,255,0.82)';cx.font='500 8.5px sans-serif';cx.textAlign='left';cx.fillText(a.n,sx+12,ay+15);
        cx.fillStyle='rgba(255,255,255,0.3)';cx.font='400 7px sans-serif';cx.fillText(a.sec,sx+12,ay+27);
        cx.fillStyle='rgba(255,255,255,0.88)';cx.font='500 9px sans-serif';cx.textAlign='right';cx.fillText(a.v,sx+sw-12,ay+15);
        cx.fillStyle=a.up?'rgba(34,197,94,0.85)':'rgba(239,68,68,0.85)';cx.font='400 7px sans-serif';cx.fillText(a.c,sx+sw-12,ay+27);
      });
    }

    function drawBuy(sx,sy,sw,sh,p){
      cx.fillStyle='#090909';cx.fillRect(sx,sy,sw,sh);
      cx.fillStyle='rgba(201,150,12,0.85)';cx.font='bold 11px sans-serif';cx.textAlign='center';cx.fillText('PiggyVest',sx+sw/2,sy+36);
      cx.fillStyle='rgba(255,255,255,0.45)';cx.font='400 7px sans-serif';cx.fillText('PGV · Fintech · Stage 1',sx+sw/2,sy+48);
      cx.fillStyle='rgba(255,255,255,0.9)';cx.font='bold 18px sans-serif';cx.fillText('₦1,842',sx+sw/2,sy+74);
      cx.fillStyle='rgba(34,197,94,0.75)';cx.font='400 8px sans-serif';cx.fillText('▲ +2.34% today',sx+sw/2,sy+88);
      cx.beginPath();if(cx.roundRect)cx.roundRect(sx+10,sy+100,sw-20,26,4);else cx.rect(sx+10,sy+100,sw-20,26);cx.fillStyle='rgba(255,255,255,0.04)';cx.fill();cx.strokeStyle='rgba(201,150,12,0.35)';cx.lineWidth=0.5;cx.stroke();
      cx.fillStyle='rgba(201,150,12,0.45)';cx.font='400 7px sans-serif';cx.textAlign='left';cx.fillText('Amount (₦)',sx+15,sy+112);cx.fillStyle='rgba(255,255,255,0.85)';cx.font='bold 9px sans-serif';cx.fillText('5,000',sx+15,sy+122);
      cx.fillStyle='rgba(255,255,255,0.35)';cx.font='400 7px sans-serif';cx.textAlign='left';cx.fillText('You receive:',sx+10,sy+140);
      cx.fillStyle='rgba(232,177,33,0.85)';cx.font='bold 8px sans-serif';cx.fillText('2.716 PGV tokens',sx+10,sy+152);
      ['₦1k','₦5k','₦10k'].forEach((amt,i)=>{const bx=sx+9+i*(sw-18)/3+1,bw=(sw-18)/3-2;cx.beginPath();if(cx.roundRect)cx.roundRect(bx,sy+160,bw,16,2);else cx.rect(bx,sy+160,bw,16);cx.fillStyle=i===1?'rgba(201,150,12,0.18)':'rgba(255,255,255,0.03)';cx.fill();cx.strokeStyle=i===1?'rgba(201,150,12,0.45)':'rgba(255,255,255,0.07)';cx.lineWidth=0.5;cx.stroke();cx.fillStyle=i===1?'#E8B121':'rgba(255,255,255,0.45)';cx.font=`${i===1?'500':'400'} 7px sans-serif`;cx.textAlign='center';cx.fillText(amt,bx+bw/2,sy+171);});
      const btnY=sy+sh-48,btnP=p>0.55?0.5+0.5*Math.sin((p-0.55)*30):0;
      cx.beginPath();if(cx.roundRect)cx.roundRect(sx+12,btnY,sw-24,26,5);else cx.rect(sx+12,btnY,sw-24,26);cx.fillStyle=`rgba(201,150,12,${0.85+0.15*btnP})`;cx.fill();cx.fillStyle='#000';cx.font='bold 9px sans-serif';cx.textAlign='center';cx.fillText('Buy PGV Tokens',sx+sw/2,btnY+17);
    }

    function drawConfirm(sx,sy,sw,sh,p){
      cx.fillStyle='#090909';cx.fillRect(sx,sy,sw,sh);
      cx.fillStyle='rgba(255,255,255,0.65)';cx.font='bold 9px sans-serif';cx.textAlign='center';cx.fillText('Confirm Purchase',sx+sw/2,sy+28);
      const rows=[['Asset','PiggyVest (PGV)'],['Amount','₦5,000'],['Tokens','2.716 PGV'],['Network','Polymesh']];
      rows.forEach(([k,v],i)=>{const ry=sy+46+i*26;cx.fillStyle='rgba(255,255,255,0.3)';cx.font='400 7px sans-serif';cx.textAlign='left';cx.fillText(k,sx+12,ry);cx.fillStyle=k==='Network'?'rgba(201,150,12,0.8)':k==='Amount'?'rgba(255,255,255,0.9)':'rgba(255,255,255,0.75)';cx.font=`${k==='Amount'?'bold':'400'} 7px sans-serif`;cx.textAlign='right';cx.fillText(v,sx+sw-12,ry);cx.beginPath();cx.moveTo(sx+10,ry+5);cx.lineTo(sx+sw-10,ry+5);cx.strokeStyle='rgba(255,255,255,0.04)';cx.lineWidth=0.5;cx.stroke();});
      cx.beginPath();if(cx.roundRect)cx.roundRect(sx+12,sy+sh-44,sw-24,28,5);else cx.rect(sx+12,sy+sh-44,sw-24,28);cx.fillStyle='rgba(34,197,94,0.82)';cx.fill();cx.fillStyle='#000';cx.font='bold 8.5px sans-serif';cx.textAlign='center';cx.fillText('✓ Confirm & Buy',sx+sw/2,sy+sh-27);
    }

    function drawSuccess(sx,sy,sw,sh,p){
      cx.fillStyle='#090909';cx.fillRect(sx,sy,sw,sh);
      const fi=Math.min(1,p*4),cy2=sy+sh*0.38;
      cx.beginPath();cx.arc(sx+sw/2,cy2,22,0,Math.PI*2);cx.fillStyle=`rgba(34,197,94,${0.12*fi})`;cx.fill();cx.strokeStyle=`rgba(34,197,94,${0.75*fi})`;cx.lineWidth=1.2;cx.stroke();
      cx.fillStyle=`rgba(34,197,94,${fi})`;cx.font='bold 18px sans-serif';cx.textAlign='center';cx.fillText('✓',sx+sw/2,cy2+7);
      cx.fillStyle=`rgba(255,255,255,${0.88*fi})`;cx.font='bold 9px sans-serif';cx.fillText('Purchase Complete!',sx+sw/2,sy+sh*0.56);
      cx.fillStyle=`rgba(201,150,12,${0.85*fi})`;cx.font='bold 12px sans-serif';cx.fillText('2.716 PGV',sx+sw/2,sy+sh*0.66);
      cx.fillStyle=`rgba(255,255,255,${0.35*fi})`;cx.font='400 7px sans-serif';cx.fillText('Settled on Polymesh · T+0',sx+sw/2,sy+sh*0.76);
    }

    function drawFinger(){
      if(fingerAlpha<=0)return;
      cx.save();cx.globalAlpha=fingerAlpha;cx.translate(fingerX,fingerY+16);
      cx.beginPath();cx.ellipse(0,0,8,12,0,0,Math.PI*2);cx.fillStyle='rgba(255,220,180,0.85)';cx.fill();cx.strokeStyle='rgba(255,200,140,0.4)';cx.lineWidth=0.7;cx.stroke();
      cx.beginPath();cx.ellipse(0,-6,5,3,0,Math.PI,Math.PI*2);cx.fillStyle='rgba(255,240,220,0.55)';cx.fill();
      cx.restore();
      if(tapAnim>0){cx.beginPath();cx.arc(fingerX,fingerY,tapAnim*22,0,Math.PI*2);cx.strokeStyle=`rgba(201,150,12,${0.5*(1-tapAnim)})`;cx.lineWidth=0.8;cx.stroke();}
    }

    const LABELS=['Touch ID login','Home dashboard','Browse markets','Buy tokens','Confirm order','Complete ✓'];

    function render(){
      cx.clearRect(0,0,W(),H());
      cx.strokeStyle='rgba(201,150,12,0.025)';cx.lineWidth=0.5;
      for(let x=0;x<W();x+=52){cx.beginPath();cx.moveTo(x,0);cx.lineTo(x,H());cx.stroke();}
      for(let y=0;y<H();y+=52){cx.beginPath();cx.moveTo(0,y);cx.lineTo(W(),y);cx.stroke();}
      drawPhone();drawFinger();
      particles.forEach(p=>{cx.beginPath();cx.arc(p.x,p.y,p.r,0,Math.PI*2);const c2=p.color;const r=parseInt(c2.slice(1,3),16),g=parseInt(c2.slice(3,5),16),b=parseInt(c2.slice(5,7),16);cx.fillStyle=`rgba(${r},${g},${b},${p.life})`;cx.fill();});
      cx.fillStyle='rgba(201,150,12,0.22)';cx.font='400 9px sans-serif';cx.textAlign='center';
      cx.fillText(LABELS[step],W()/2,H()-18);
      STEPS.forEach((_,i)=>{cx.beginPath();cx.arc(W()/2-(STEPS.length-1)*7+i*14,H()-8,i===step?3.5:2,0,Math.PI*2);cx.fillStyle=i===step?'#E8B121':'rgba(201,150,12,0.22)';cx.fill();});
    }

    let raf;
    function loop(){update();render();raf=requestAnimationFrame(loop);}
    loop();
    return()=>cancelAnimationFrame(raf);
  },[]);
  return (
    <canvas ref={ref} style={{
      width:"100%", height:"100%",
      display:"block", borderRadius:8, background:"#070707"
    }}/>
  );
}


// ── PLATFORM PAGE ────────────────────────────────────────────────────────────

function Platform({ go }) {
  const steps = [
    { n:"01", title:"Sign Up & Verify",
      body:"Create your DotVests account and complete KYC verification through Polymesh's identity layer. Your identity is verified once — and recognised across every tokenized asset on the network." },
    { n:"02", title:"Fund Your Wallet",
      body:"Deposit funds securely via Paystack (NGN bank transfer, card) or Breet (crypto on-ramp). Your balance sits in a segregated wallet tied to your verified Polymesh identity." },
    { n:"03", title:"Browse & Buy",
      body:"Browse the tokenized asset marketplace. Buy fractional shares of Nigerian companies from ₦1,000. Each token represents a verified, on-chain claim on the underlying equity." },
    { n:"04", title:"Trade 24/7",
      body:"Trade your tokenized shares any time — no exchange hours, no broker delays. Blockchain settlement is atomic. T+0. Every transaction is immutable and auditable." },
  ];

  const tokenBenefits = [
    ["Fractional Ownership",   "Own a portion of high-value Nigerian companies from ₦1,000. No minimum lock-in."],
    ["Instant Settlement",     "Trades settle in seconds on Polymesh. No T+2 clearing. No counterparty risk."],
    ["Immutable Transparency", "Every transaction recorded on-chain. Fully auditable. No hidden ledgers."],
    ["Lower Cost",             "Fewer intermediaries means lower fees. Blockchain rails cut out the middlemen."],
  ];

  const africaPoints = [
    ["Remove Borders",         "Invest in Nigerian equities from Lagos, London, or Lusaka — no paperwork."],
    ["Lower Entry Barriers",   "Start with as little as ₦1,000. Premium equity is no longer reserved for the wealthy."],
    ["Financial Inclusion",    "Reach Nigeria's unbanked through mobile-native, blockchain-powered ownership."],
    ["Unlock African Capital", "Billions in diaspora and retail capital waiting for a compliant gateway into African markets."],
  ];

  return (
    <div style={{padding:"clamp(32px,5vw,72px) clamp(16px,4vw,52px) 60px"}}>
      {/* HERO */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(280px,100%),1fr))",gap:"clamp(20px,4vw,48px)",alignItems:"center",marginBottom:60}}>
        <div>
          <Tag gold>Platform</Tag>
          <h1 style={{fontFamily:FS,fontSize:"clamp(40px,5vw,68px)",fontWeight:400,color:C.white,
            lineHeight:1.08,letterSpacing:"-0.025em",marginBottom:20,maxWidth:600}}>
            How Our<br/><em style={{color:C.goldLt}}>Platform Works.</em>
          </h1>
          <p style={{fontSize:16,color:C.muted,fontWeight:300,maxWidth:460,lineHeight:1.85}}>
            A seamless, secure, and transparent way to invest in African stocks —
            built on compliance-native blockchain infrastructure from day one.
          </p>
        </div>
        <div style={{width:200,height:400,flexShrink:0}}>
          <MobilePlatformDemo/>
        </div>
      </div>

      {/* 4 STEPS */}
      <div style={{marginBottom:52}}>
        <div style={{fontSize:11.5,color:C.muted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:32}}>
          Get Started in Four Steps
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(200px,100%),1fr))",gap:1,background:C.brd}}>
          {steps.map((s,i) => (
            <div key={i} style={{background:C.bg1,padding:"40px 32px",position:"relative"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:2,
                background:`linear-gradient(90deg,${C.gold},${C.goldLt})`,opacity:1}}/>
              <div style={{fontSize:11,color:C.gold,letterSpacing:"0.12em",marginBottom:20}}>{s.n}</div>
              <h3 style={{fontFamily:FS,fontSize:22,fontWeight:400,color:C.white,marginBottom:14}}>{s.title}</h3>
              <p style={{fontSize:13.5,color:C.muted,lineHeight:1.85,fontWeight:300}}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* TOKENIZATION SECTION */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(260px,100%),1fr))",gap:1,background:C.brd,marginBottom:52}}>
        {/* What is tokenization */}
        <div style={{background:C.bg1,padding:"56px 48px"}}>
          <div style={{width:32,height:1,background:C.gold,marginBottom:24}}/>
          <h2 style={{fontFamily:FS,fontSize:34,fontWeight:400,color:C.white,marginBottom:18,lineHeight:1.2}}>
            What is<br/><em style={{color:C.goldLt}}>Tokenization?</em>
          </h2>
          <p style={{fontSize:14,color:C.muted,lineHeight:1.9,marginBottom:28}}>
            Tokenization converts real-world assets — like company shares — into digital tokens
            on the blockchain. Each token is a verified, on-chain claim on the underlying equity.
            Not a derivative. Not a synthetic. The actual asset, on-chain.
          </p>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {tokenBenefits.map(([t,b],i) => (
              <div key={i} style={{display:"flex",gap:14}}>
                <div style={{width:20,height:20,borderRadius:"50%",flexShrink:0,marginTop:1,
                  border:`0.5px solid ${C.goldBrd}`,
                  display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:C.gold}}/>
                </div>
                <div>
                  <div style={{fontSize:13.5,fontWeight:500,color:C.white,marginBottom:3}}>{t}</div>
                  <div style={{fontSize:13,color:C.muted,lineHeight:1.7}}>{b}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why it matters for Africa */}
        <div style={{background:C.bg2,padding:"56px 48px"}}>
          <div style={{width:32,height:1,background:C.gold,marginBottom:24}}/>
          <h2 style={{fontFamily:FS,fontSize:34,fontWeight:400,color:C.white,marginBottom:18,lineHeight:1.2}}>
            Why It Matters<br/><em style={{color:C.goldLt}}>For Africa.</em>
          </h2>
          <p style={{fontSize:14,color:C.muted,lineHeight:1.9,marginBottom:28}}>
            Africa's growing middle class and tech-native population are ready for modern
            financial infrastructure. Traditional stock markets remain inaccessible to most.
            DotVests changes that.
          </p>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {africaPoints.map(([t,b],i) => (
              <div key={i} style={{display:"flex",gap:14}}>
                <div style={{width:20,height:20,borderRadius:"50%",flexShrink:0,marginTop:1,
                  border:`0.5px solid ${C.goldBrd}`,
                  display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:C.goldLt}}/>
                </div>
                <div>
                  <div style={{fontSize:13.5,fontWeight:500,color:C.white,marginBottom:3}}>{t}</div>
                  <div style={{fontSize:13,color:C.muted,lineHeight:1.7}}>{b}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* POLYMESH CALLOUT */}
      <div style={{background:C.bg1,border:`0.5px solid ${C.goldBrd}`,borderRadius:6,
        padding:"52px 52px",marginBottom:52,
        display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(260px,100%),1fr))",gap:72}}>
        <div>
          <div style={{fontSize:11,color:C.gold,letterSpacing:"0.1em",marginBottom:16}}>BLOCKCHAIN INFRASTRUCTURE</div>
          <h2 style={{fontFamily:FS,fontSize:"clamp(22px,5vw,32px)",fontWeight:400,color:C.white,marginBottom:16,lineHeight:1.2}}>
            Built on Polymesh —<br/><em style={{color:C.goldLt}}>Not an Afterthought.</em>
          </h2>
          <p style={{fontSize:14,color:C.muted,lineHeight:1.9}}>
            Every other blockchain bolt-on compliance after the fact. Polymesh is purpose-built for
            regulated securities — KYC/AML at the protocol level, transfer restrictions enforced natively,
            and identity baked into every transaction.
          </p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:20}}>
          {[
            ["Protocol-Level KYC",    "Identity verified once, enforced everywhere. No anonymous transfers."],
            ["Native Compliance",     "Transfer rules, investor limits, jurisdiction controls — in the chain, not the app."],
            ["Corporate Actions",     "Dividends, splits, and voting rights automated via smart contracts."],
            ["SEC ARIP Aligned",      "Architecture chosen specifically for Nigeria's regulatory sandbox pathway."],
          ].map(([t,b],i) => (
            <div key={i} style={{paddingLeft:20,borderLeft:`1px solid ${C.goldBrd}`}}>
              <div style={{fontSize:13.5,fontWeight:500,color:C.white,marginBottom:4}}>{t}</div>
              <div style={{fontSize:13,color:C.muted,lineHeight:1.7}}>{b}</div>
            </div>
          ))}
        </div>
      </div>

      {/* WAITLIST CTA */}
      <div style={{background:`linear-gradient(135deg,${C.bg2},rgba(201,150,12,0.05))`,
        border:`0.5px solid ${C.goldBrd}`,borderRadius:6,padding:"60px 56px",textAlign:"center"}}>
        <Tag gold>Early Access</Tag>
        <h2 style={{fontFamily:FS,fontSize:"clamp(26px,6vw,40px)",fontWeight:400,color:C.white,
          letterSpacing:"-0.02em",marginBottom:16}}>Be Among the First.</h2>
        <p style={{fontSize:15,color:C.muted,lineHeight:1.8,maxWidth:480,margin:"0 auto 36px"}}>
          Join thousands of forward-thinking investors getting early access to tokenized African stocks.
          Early supporters get priority access and insider updates.
        </p>
        <WaitlistBar/>
      </div>

      <div style={{marginTop:80}}><Footer go={go}/></div>
    </div>
  );
}

export default Platform;
