import React, { useState, useEffect, useRef } from "react";
import { C, FS } from "../constants";
import { Tag } from "../components/shared";
import Footer from "../components/Footer";

function CoinsOnBlocks() {
  const ref = useRef();
  useEffect(() => {
    const cv = ref.current; if(!cv) return;
    const cx = cv.getContext('2d');
    cv.width = cv.offsetWidth; cv.height = cv.offsetHeight;
    const W=cv.width,H=cv.height;
    const BW=52,BH=28,BD=16,COLS=8,ROWS=3;
    const platX=W/2-(COLS*BW*0.52),platY=H*0.76;
    function bPos(c,r){return{x:platX+c*BW+r*(BW*0.22),y:platY-r*BD};}
    const blocks=[];
    for(let r=0;r<ROWS;r++) for(let col=0;col<COLS-r;col++) blocks.push({c:col,r,lit:false,ltk:0,shakeX:0,shakeY:0,hash:(Math.random()*0xfffff|0).toString(16).padStart(5,'0')});

    function drawBlock(b){
      const{x,y}=bPos(b.c,b.r);const sx=b.shakeX||0,sy=b.shakeY||0;const f=b.lit?Math.max(0,1-b.ltk/55):0;
      cx.beginPath();cx.moveTo(x+BW/2+sx,y-BD+sy);cx.lineTo(x+BW+sx,y+sy);cx.lineTo(x+BW/2+sx,y+BH/2+sy);cx.lineTo(x+sx,y+sy);cx.closePath();
      cx.fillStyle=b.lit?`rgba(232,177,33,${0.15+0.35*f})`:'rgba(201,150,12,0.1)';cx.fill();cx.strokeStyle=`rgba(201,150,12,${0.3+0.5*f})`;cx.lineWidth=0.5;cx.stroke();
      cx.fillStyle=`rgba(201,150,12,${0.2+0.3*f})`;cx.font='500 6px monospace';cx.textAlign='center';cx.fillText('0x'+b.hash,x+BW/2+sx,y+3+sy);
      cx.beginPath();cx.moveTo(x+sx,y+sy);cx.lineTo(x+BW/2+sx,y+BH/2+sy);cx.lineTo(x+BW/2+sx,y+BH/2+BD+sy);cx.lineTo(x+sx,y+BD+sy);cx.closePath();
      cx.fillStyle=b.lit?`rgba(90,60,0,${0.6+0.3*f})`:'rgba(25,16,0,0.75)';cx.fill();cx.strokeStyle=`rgba(201,150,12,${0.2+0.3*f})`;cx.stroke();
      cx.beginPath();cx.moveTo(x+BW+sx,y+sy);cx.lineTo(x+BW/2+sx,y+BH/2+sy);cx.lineTo(x+BW/2+sx,y+BH/2+BD+sy);cx.lineTo(x+BW+sx,y+BD+sy);cx.closePath();
      cx.fillStyle=b.lit?`rgba(60,40,0,${0.5+0.3*f})`:'rgba(15,10,0,0.75)';cx.fill();cx.strokeStyle=`rgba(201,150,12,${0.12+0.22*f})`;cx.stroke();
    }

    const SYMS=['₦','₦','₦','$','€'],TOTAL=20;
    let coins=[],phase='wait',ptk=0;

    function buildCoins(){
      coins=[];blocks.forEach(b=>{b.lit=false;b.ltk=0;b.shakeX=0;b.shakeY=0;});
      for(let i=0;i<TOTAL;i++){
        const r=Math.floor(Math.random()*ROWS),col=Math.floor(Math.random()*(COLS-r));
        const{x,y}=bPos(col,r);const lx=x+BW/2+(Math.random()-0.5)*14,ly=y-BD-5;
        coins.push({x:lx+(Math.random()-0.5)*50,y:-15-Math.random()*110,lx,ly,
          vy:2.4+Math.random()*1.8,vx:(Math.random()-0.5)*0.4,
          r:8+Math.random()*4,sym:SYMS[Math.floor(Math.random()*SYMS.length)],
          spin:Math.random()*Math.PI*2,spinV:(Math.random()-0.5)*0.12,
          landed:false,bounces:0,maxBounces:2+Math.floor(Math.random()*2),
          vy_bounce:0,op:1,delay:Math.random()*16|0,active:false,
          tb:blocks.find(b=>b.c===col&&b.r===r)||blocks[0],settled:false});
      }
    }
    buildCoins();

    const sparks=[],rings=[],floats=[];
    function spawnImpact(x,y,force){
      const count=4+Math.floor(force*3);
      for(let i=0;i<count;i++){const a=Math.random()*Math.PI*2,spd=1.5+Math.random()*force*2;sparks.push({x,y,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd-force,life:1,r:1.5+Math.random()*2});}
      rings.push({x,y,r:3,op:0.9});
      if(force>1.5)floats.push({x,y:y-8,vy:-0.8,op:1,label:'◆ TOKENIZED'});
    }
    function shakeBlock(b,force){
      b.shakeX=(Math.random()-0.5)*force*4;b.shakeY=force*2;
      setTimeout(()=>{b.shakeX*=0.5;b.shakeY*=0.5;},60);
      setTimeout(()=>{b.shakeX=0;b.shakeY=0;},120);
    }

    let tick=0;
    function update(){
      tick++;ptk++;
      if(phase==='wait'&&ptk>50){phase='fall';ptk=0;coins.forEach(c=>c.active=true);}
      if(phase==='fall'){
        let allSettled=true;
        coins.forEach(c=>{
          if(!c.active||c.delay-->0)return;
          if(c.settled)return;
          allSettled=false;
          if(!c.landed){
            c.x+=c.vx;c.y+=c.vy;c.vy+=0.13;c.spin+=c.spinV;
            if(c.y>=c.ly){
              c.y=c.ly;c.landed=true;
              const impactForce=Math.min(3,c.vy/3);
              c.vy_bounce=-(c.vy*(0.45+Math.random()*0.15));c.vx*=0.6;c.spinV*=-0.7;
              c.tb.lit=true;c.tb.ltk=0;shakeBlock(c.tb,impactForce);spawnImpact(c.lx,c.ly,impactForce);c.bounces=1;
            }
          } else {
            c.vy_bounce+=0.18;c.y+=c.vy_bounce;c.x+=c.vx*0.85;c.spin+=c.spinV*0.8;c.vx*=0.92;c.spinV*=0.85;
            if(c.y>=c.ly){
              c.y=c.ly;
              if(Math.abs(c.vy_bounce)>0.8&&c.bounces<c.maxBounces){
                const bd=0.35+Math.random()*0.1;c.vy_bounce=-(Math.abs(c.vy_bounce)*bd);
                c.vx+=(Math.random()-0.5)*1.2;c.spinV=(Math.random()-0.5)*0.1;
                const f=Math.abs(c.vy_bounce)/2;spawnImpact(c.x,c.ly,f);if(f>0.5)shakeBlock(c.tb,f*0.5);c.bounces++;
              } else {c.y=c.ly;c.vy_bounce=0;c.vx=0;c.spinV=0;c.settled=true;}
            }
            if(Math.abs(c.vy_bounce)<0.3&&c.y>=c.ly-1&&c.bounces>=c.maxBounces){c.settled=true;c.vy_bounce=0;}
          }
        });
        if(allSettled&&ptk>60){phase='settle';ptk=0;}
      }
      if(phase==='settle'){coins.forEach(c=>{c.op-=0.02;});if(coins[0]&&coins[0].op<=0){phase='wait';ptk=0;buildCoins();}}
      blocks.forEach(b=>{if(b.lit){b.ltk++;if(b.ltk>60){b.lit=false;b.ltk=0;}}});
      for(let i=sparks.length-1;i>=0;i--){const s=sparks[i];s.x+=s.vx;s.y+=s.vy;s.vy+=0.09;s.vx*=0.94;s.life-=0.04;if(s.life<=0)sparks.splice(i,1);}
      for(let i=rings.length-1;i>=0;i--){const rr=rings[i];rr.r+=1.6;rr.op-=0.03;if(rr.op<=0)rings.splice(i,1);}
      for(let i=floats.length-1;i>=0;i--){const f=floats[i];f.y+=f.vy;f.op-=0.015;if(f.op<=0)floats.splice(i,1);}
    }

    function drawCoin(c){
      if(!c.active)return;cx.save();cx.globalAlpha=Math.max(0,c.op);cx.translate(c.x,c.y);cx.rotate(c.spin);
      const stretch=c.landed?Math.max(0.7,1-Math.abs(c.vy_bounce)*0.04):1;
      const squash=c.landed?Math.min(1.3,1+Math.abs(c.vy_bounce)*0.04):1;
      cx.scale(squash,stretch);
      cx.beginPath();cx.arc(0,0,c.r,0,Math.PI*2);
      const g=cx.createRadialGradient(-c.r*.3,-c.r*.3,0,0,0,c.r);g.addColorStop(0,'#F5D060');g.addColorStop(.5,'#C9960C');g.addColorStop(1,'#6B4800');
      cx.fillStyle=g;cx.fill();cx.strokeStyle='#E8B121';cx.lineWidth=0.8;cx.stroke();
      cx.fillStyle='rgba(0,0,0,0.45)';cx.font=`bold ${Math.round(c.r*.9)}px sans-serif`;cx.textAlign='center';cx.textBaseline='middle';cx.fillText(c.sym,0,0);
      cx.restore();
    }

    function render(){
      cx.clearRect(0,0,W,H);
      cx.strokeStyle='rgba(201,150,12,0.03)';cx.lineWidth=0.5;
      for(let x=0;x<W;x+=52){cx.beginPath();cx.moveTo(x,0);cx.lineTo(x,H);cx.stroke();}
      for(let y=0;y<H;y+=52){cx.beginPath();cx.moveTo(0,y);cx.lineTo(W,y);cx.stroke();}
      const tg=cx.createRadialGradient(W/2,0,0,W/2,0,W*.45);tg.addColorStop(0,'rgba(201,150,12,0.06)');tg.addColorStop(1,'rgba(0,0,0,0)');cx.fillStyle=tg;cx.fillRect(0,0,W,H);
      for(let r=ROWS-1;r>=0;r--) for(let col=0;col<COLS-r;col++){const b=blocks.find(b=>b.c===col&&b.r===r);if(b)drawBlock(b);}
      rings.forEach(rr=>{cx.beginPath();cx.arc(rr.x,rr.y,rr.r,0,Math.PI*2);cx.strokeStyle=`rgba(232,177,33,${rr.op})`;cx.lineWidth=0.7;cx.stroke();});
      sparks.forEach(s=>{cx.beginPath();cx.arc(s.x,s.y,s.r,0,Math.PI*2);cx.fillStyle=`rgba(232,177,33,${s.life})`;cx.fill();});
      floats.forEach(f=>{cx.save();cx.globalAlpha=f.op;cx.fillStyle='#E8B121';cx.font='500 9px sans-serif';cx.textAlign='center';cx.fillText(f.label,f.x,f.y);cx.restore();});
      coins.filter(c=>c.landed||c.settled).forEach(drawCoin);
      coins.filter(c=>!c.landed&&!c.settled).forEach(drawCoin);
      cx.fillStyle='rgba(201,150,12,0.22)';cx.font='400 10px sans-serif';cx.textAlign='center';cx.fillText('Polymesh Blockchain · Compliance-Native Tokenization',W/2,H-10);
    }
    let raf;function loop(){update();render();raf=requestAnimationFrame(loop);}loop();
    return()=>cancelAnimationFrame(raf);
  },[]);
  return <canvas ref={ref} style={{width:"100%",height:260,display:"block",borderRadius:6,background:"#070707",marginBottom:48}}/>;
}

// ── ANIMATION: REGULATORY PIPELINE (Compliance page) ─────────────────────────

function Tokenize({go}){
  return <div style={{padding:"clamp(32px,5vw,72px) clamp(16px,4vw,48px) 60px"}}>
    <Tag>How Tokenization Works</Tag>
    <h1 style={{fontFamily:FS,fontSize:"clamp(28px,9vw,66px)",fontWeight:400,color:C.white,lineHeight:1.1,letterSpacing:"-0.025em",marginBottom:18,maxWidth:680}}>
      Every Share,<br/><em style={{color:C.goldLt}}>On Polymesh.</em>
    </h1>
    <CoinsOnBlocks/>
    <p style={{fontSize:"clamp(14px,3.5vw,16px)",color:C.muted,fontWeight:300,maxWidth:"min(520px,100%)",lineHeight:1.85,marginBottom:40}}>Polymesh is purpose-built for regulated securities. Compliance isn't optional — it's enforced at the chain level before any token moves.</p>
    <div style={{background:C.bg1,border:`0.5px solid ${C.goldBrd}`,borderRadius:6,padding:"clamp(24px,4vw,48px) clamp(16px,4vw,48px)",marginBottom:52,display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(260px,100%),1fr))",gap:"clamp(20px,4vw,64px)"}}>
      <div>
        <div style={{fontSize:11,color:C.gold,letterSpacing:"0.1em",marginBottom:14}}>THE BLOCKCHAIN LAYER</div>
        <h2 style={{fontFamily:FS,fontSize:"clamp(20px,4.5vw,30px)",fontWeight:400,color:C.white,marginBottom:14}}>Why Polymesh Wins for Securities</h2>
        <p style={{fontSize:14,color:C.muted,lineHeight:1.9}}>General-purpose blockchains allow anonymous wallets and free token transfers — a securities law violation by default. Polymesh enforces identity, transfer restrictions, and compliance natively before any transaction executes.</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:20}}>
        {[["Identity Layer","Every wallet tied to a verified identity. No anonymous transfers."],["Compliance Module","Transfer rules and jurisdiction controls enforced by the protocol."],["Dividend Automation","Corporate actions via smart contracts. No intermediaries, no delays."],["Atomic Settlement","T+0 finality. No counterparty risk. No clearing house required."]].map(([t,b],i)=>(
          <div key={i} style={{display:"flex",gap:14}}>
            <div style={{width:24,height:24,borderRadius:"50%",flexShrink:0,border:`0.5px solid ${C.goldBrd}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:C.goldLt}}>{i+1}</div>
            <div><div style={{fontSize:13,fontWeight:500,color:C.white,marginBottom:3}}>{t}</div><div style={{fontSize:13,color:C.muted,lineHeight:1.7}}>{b}</div></div>
          </div>
        ))}
      </div>
    </div>
    <div style={{fontSize:11,color:C.muted,letterSpacing:"0.08em",marginBottom:24,textTransform:"uppercase"}}>Tokenization Process</div>
    {[["01","Company Onboarding","Stage 1 targets: PiggyVest, Chowdeck, Erisco Foods, Carbon. Pre-IPO private companies with strong fundamentals and broad name recognition."],["02","Legal Structuring","Share capital, investor rights, dividend entitlements, and transfer restrictions formally structured through SEC-aligned legal framework before any token is issued."],["03","Polymesh Issuance","Tokens issued on Polymesh. Every holder is KYC-verified at the protocol level. Corporate actions enforced natively by smart contracts."],["04","Investor Access","Verified investors access fractional equity via DotVests. Naira-denominated pricing. Paystack (NGN) and Breet (crypto) rails. Real-time settlement."]].map(([n,t,b],i)=>(
      <div key={i} style={{display:"grid",gridTemplateColumns:"clamp(36px,8vw,64px) 1fr",gap:"clamp(12px,3vw,36px)",padding:"28px 0",borderTop:`0.5px solid ${C.brd}`}}>
        <div style={{fontSize:11,color:C.gold,letterSpacing:"0.1em",paddingTop:3}}>{n}</div>
        <div><h3 style={{fontFamily:FS,fontSize:22,fontWeight:400,color:C.white,marginBottom:10}}>{t}</h3><p style={{fontSize:13.5,color:C.muted,lineHeight:1.85,maxWidth:560}}>{b}</p></div>
      </div>
    ))}
    <div style={{marginTop:72}}><Footer go={go}/></div>
  </div>;
}

// ── COMPLIANCE ────────────────────────────────────────────────────────────────

export default Tokenize;
