import React, { useState, useEffect, useRef } from "react";
import { C, FS, ASSETS } from "../constants";
import { fmt, Tag, Btn, MiniChart } from "../components/shared";
import WaitlistBar from "../components/WaitlistForm";
import Footer from "../components/Footer";

function TableRow({asset,idx,prices}){
  const [h,set]=useState(false);
  const p=prices[asset.id]||{price:asset.price,chg:asset.chg};
  const up=p.chg>=0;
  return <div onMouseEnter={()=>set(true)} onMouseLeave={()=>set(false)}
    style={{display:"grid",gridTemplateColumns:"clamp(30px,5vw,44px) 1fr clamp(80px,15vw,120px) clamp(70px,12vw,120px) clamp(60px,10vw,90px)",
      padding:"16px 22px",background:h?C.bg2:"transparent",
      borderBottom:idx<ASSETS.length-1?`0.5px solid ${C.brd}`:"none",
      transition:"background 0.18s",cursor:"pointer",alignItems:"center"}}>
    <span style={{fontSize:11.5,color:C.dim}}>{String(idx+1).padStart(2,"0")}</span>
    <div><div style={{fontSize:14,fontWeight:500,color:C.white}}>{asset.name}</div><div style={{fontSize:11,color:C.muted}}>{asset.id}</div></div>
    <span style={{fontSize:12,color:C.muted}}>{asset.sector}</span>
    <span style={{fontSize:15,fontWeight:500,color:C.white,textAlign:"right"}}>{fmt(p.price)}</span>
    <span style={{textAlign:"right",fontSize:13,color:up?C.green:C.red}}>{up?"+":""}{p.chg.toFixed(2)}%</span>
    <span style={{textAlign:"right"}}>
      <span style={{fontSize:10,padding:"3px 9px",borderRadius:20,letterSpacing:"0.04em",
        background:asset.stage===1?C.goldDim:"rgba(255,255,255,0.05)",
        color:asset.stage===1?C.goldLt:C.muted,
        border:`0.5px solid ${asset.stage===1?C.goldBrd:C.brd}`}}>S{asset.stage}</span>
    </span>
  </div>;
}

function MarketCard({asset,prices,statusOverride}){
  const [h,set]=useState(false);
  const p=prices[asset.id];const up=p.chg>=0;
  return <div onMouseEnter={()=>set(true)} onMouseLeave={()=>set(false)}
    style={{background:h?C.bg3:C.bg2,padding:"32px 28px",transition:"background 0.2s",cursor:"pointer",position:"relative",overflow:"hidden"}}>
    {h&&<div style={{position:"absolute",top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${C.gold},transparent)`}}/>}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
      <div>
        <div style={{fontSize:10,color:C.muted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:4}}>{asset.sector}</div>
        <div style={{fontFamily:FS,fontSize:20,fontWeight:400,color:C.white}}>{asset.name}</div>
        <div style={{fontSize:11,color:C.dim,marginTop:2}}>{asset.id}</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
        <span style={{fontSize:11,padding:"3px 9px",borderRadius:20,
          background:up?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)",
          color:up?C.green:C.red}}>{up?"+":""}{p.chg.toFixed(2)}%</span>
        <span style={{fontSize:10,color:asset.stage===1?C.goldLt:C.muted,
          border:`0.5px solid ${asset.stage===1?C.goldBrd:C.brd}`,
          padding:"2px 8px",borderRadius:2}}>Stage {asset.stage}</span>
      </div>
    </div>
    <MiniChart up={up} h={38}/>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginTop:14}}>
      <div><div style={{fontSize:22,fontWeight:600,color:C.white}}>{fmt(p.price)}</div><div style={{fontSize:11,color:C.muted,marginTop:2}}>per token</div></div>
      <div style={{fontSize:12,color:C.muted}}>Min ₦1,000</div>
    </div>
  </div>;
}

function FilterBtn({label,active,onClick}){
  const [h,set]=useState(false);
  return <button onClick={onClick} onMouseEnter={()=>set(true)} onMouseLeave={()=>set(false)}
    style={{background:active?C.goldDim:"none",border:`0.5px solid ${active?C.gold:h?C.brd2:C.brd}`,
      color:active?C.goldLt:h?C.white:C.muted,fontSize:13,padding:"8px 16px",borderRadius:3,
      transition:"all 0.2s"}}>{label}</button>;
}


function LiveMarketChart() {
  const ref = useRef();
  useEffect(() => {
    const cv = ref.current; if(!cv) return;
    const cx = cv.getContext('2d');
    cv.width = cv.offsetWidth; cv.height = cv.offsetHeight;
    const W=cv.width,H=cv.height;
    const AS=[{id:'PGV',color:'#22C55E'},{id:'CHD',color:'#EF4444'},{id:'ERF',color:'#60A5FA'},{id:'CBT',color:'#A78BFA'},{id:'GTB',color:'#E8B121'},{id:'MTN',color:'#F97316'}];
    const POINTS=60,PAD={l:44,r:14,t:40,b:26};
    const CW=W-PAD.l-PAD.r,CH=H-PAD.t-PAD.b;
    const histories=AS.map(()=>{const arr=[];let v=0.5;for(let i=0;i<POINTS;i++){v+=(Math.random()-0.49)*0.06;v=Math.max(0.05,Math.min(0.95,v));arr.push(v);}return{arr,vel:(Math.random()-0.5)*0.04};});
    let tick=0,hov=-1;
    function toX(i){return PAD.l+(i/(POINTS-1))*CW;}
    function toY(v){return PAD.t+CH-v*CH;}
    function hr(hex){return parseInt(hex.slice(1,3),16);}
    function hg(hex){return parseInt(hex.slice(3,5),16);}
    function hb(hex){return parseInt(hex.slice(5,7),16);}
    function update(){tick++;if(tick%6!==0)return;histories.forEach(h=>{h.vel+=(Math.random()-0.495)*0.025;h.vel*=0.88;h.vel=Math.max(-0.06,Math.min(0.06,h.vel));let v=h.arr[h.arr.length-1]+h.vel;v=Math.max(0.04,Math.min(0.96,v));if(v<0.12)h.vel+=0.03;if(v>0.88)h.vel-=0.03;h.arr.push(v);if(h.arr.length>POINTS)h.arr.shift();});}
    function render(){
      cx.clearRect(0,0,W,H);
      cx.strokeStyle='rgba(201,150,12,0.025)';cx.lineWidth=0.5;
      for(let x=0;x<W;x+=48){cx.beginPath();cx.moveTo(x,0);cx.lineTo(x,H);cx.stroke();}
      for(let y=0;y<H;y+=48){cx.beginPath();cx.moveTo(0,y);cx.lineTo(W,y);cx.stroke();}
      for(let i=0;i<=4;i++){const y=PAD.t+(i/4)*CH;cx.beginPath();cx.moveTo(PAD.l,y);cx.lineTo(W-PAD.r,y);cx.strokeStyle='rgba(255,255,255,0.04)';cx.lineWidth=0.5;cx.stroke();}
      AS.forEach((a,i)=>{
        if(i===hov)return;
        const h=histories[i],pts=h.arr.map((v,j)=>({x:toX(j),y:toY(v)}));
        const dim=hov!==-1,alpha=dim?0.12:1;
        const r=hr(a.color),g=hg(a.color),b=hb(a.color);
        cx.beginPath();cx.moveTo(pts[0].x,PAD.t+CH);pts.forEach(p=>cx.lineTo(p.x,p.y));cx.lineTo(pts[pts.length-1].x,PAD.t+CH);cx.closePath();
        const grad=cx.createLinearGradient(0,PAD.t,0,PAD.t+CH);grad.addColorStop(0,`rgba(${r},${g},${b},${0.2*alpha})`);grad.addColorStop(1,`rgba(${r},${g},${b},0.01)`);cx.fillStyle=grad;cx.fill();
        cx.beginPath();cx.moveTo(pts[0].x,pts[0].y);for(let j=1;j<pts.length-1;j++){const mx=(pts[j].x+pts[j+1].x)/2,my=(pts[j].y+pts[j+1].y)/2;cx.quadraticCurveTo(pts[j].x,pts[j].y,mx,my);}cx.lineTo(pts[pts.length-1].x,pts[pts.length-1].y);
        cx.strokeStyle=`rgba(${r},${g},${b},${alpha})`;cx.lineWidth=1.3;cx.stroke();
        const last=pts[pts.length-1];cx.beginPath();cx.arc(last.x,last.y,2.5,0,Math.PI*2);cx.fillStyle=`rgba(${r},${g},${b},${alpha})`;cx.fill();
      });
      if(hov!==-1){
        const a=AS[hov],h=histories[hov],pts=h.arr.map((v,j)=>({x:toX(j),y:toY(v)}));
        const r=hr(a.color),g=hg(a.color),b=hb(a.color);
        cx.beginPath();cx.moveTo(pts[0].x,PAD.t+CH);pts.forEach(p=>cx.lineTo(p.x,p.y));cx.lineTo(pts[pts.length-1].x,PAD.t+CH);cx.closePath();
        const grad=cx.createLinearGradient(0,PAD.t,0,PAD.t+CH);grad.addColorStop(0,`rgba(${r},${g},${b},0.25)`);grad.addColorStop(1,`rgba(${r},${g},${b},0.01)`);cx.fillStyle=grad;cx.fill();
        cx.beginPath();cx.moveTo(pts[0].x,pts[0].y);for(let j=1;j<pts.length-1;j++){const mx=(pts[j].x+pts[j+1].x)/2,my=(pts[j].y+pts[j+1].y)/2;cx.quadraticCurveTo(pts[j].x,pts[j].y,mx,my);}cx.lineTo(pts[pts.length-1].x,pts[pts.length-1].y);
        cx.strokeStyle=`rgba(${r},${g},${b},1)`;cx.lineWidth=2;cx.stroke();
        const last=pts[pts.length-1];const pulse=0.5+0.5*Math.sin(tick*0.12);
        cx.beginPath();cx.arc(last.x,last.y,5+pulse*3,0,Math.PI*2);cx.strokeStyle=`rgba(${r},${g},${b},0.3)`;cx.lineWidth=0.8;cx.stroke();
        cx.beginPath();cx.arc(last.x,last.y,4,0,Math.PI*2);cx.fillStyle=`rgba(${r},${g},${b},1)`;cx.fill();
      }
      const colW=CW/AS.length;
      AS.forEach((a,i)=>{
        const x=PAD.l+i*colW,isH=hov===i,dim=hov!==-1&&!isH;
        const r=hr(a.color),g=hg(a.color),b=hb(a.color);
        const last=histories[i].arr[histories[i].arr.length-1],prev=histories[i].arr[histories[i].arr.length-5]||last;
        const up=last>=prev,chg=((last-prev)/(prev||1)*100).toFixed(2);
        cx.beginPath();cx.arc(x+8,16,4,0,Math.PI*2);cx.fillStyle=`rgba(${r},${g},${b},${dim?0.2:1})`;cx.fill();
        cx.fillStyle=dim?'rgba(255,255,255,0.2)':'rgba(255,255,255,0.75)';cx.font=`${isH?'500':'400'} 10px sans-serif`;cx.textAlign='left';cx.fillText(a.id,x+16,20);
        cx.fillStyle=dim?'rgba(255,255,255,0.12)':(up?'#22C55E':'#EF4444');cx.font='400 9px sans-serif';cx.fillText((up?'+':'')+chg+'%',x+16,32);
      });
      cx.fillStyle='rgba(201,150,12,0.2)';cx.font='400 9px sans-serif';cx.textAlign='center';cx.fillText('Simulated · Pre-launch · No investment services offered',W/2,H-8);
    }
    cv.addEventListener('mousemove',e=>{const rect=cv.getBoundingClientRect();const mx=(e.clientX-rect.left)*(W/rect.width);const colW=CW/AS.length;const idx=Math.floor((mx-PAD.l)/colW);hov=(idx>=0&&idx<AS.length)?idx:-1;});
    cv.addEventListener('mouseleave',()=>{hov=-1;});
    let raf;function loop(){update();render();raf=requestAnimationFrame(loop);}loop();
    return()=>cancelAnimationFrame(raf);
  },[]);
  return <canvas ref={ref} style={{width:"100%",height:240,display:"block",borderRadius:6,background:"#0D0D0D",marginBottom:32}}/>;
}

// ── ANIMATION: ROTATING DIAMOND (Markets page) ────────────────────────────────
function RotatingDiamond() {
  const ref = useRef();
  useEffect(() => {
    const cv = ref.current; if(!cv) return;
    const cx = cv.getContext('2d');
    cv.width = cv.offsetWidth; cv.height = cv.offsetHeight;
    const W=cv.width,H=cv.height,CX=W/2,CY=H/2;
    const R=Math.min(W,H)*0.32,HC=R*0.57,HP=R*1.0,N=8;
    function makeVerts(){const v=[];v.push([0,-HC-14,0]);for(let i=0;i<N;i++){const a=(i/N)*Math.PI*2-Math.PI/N;v.push([Math.cos(a)*R*0.44,-HC,Math.sin(a)*R*0.44]);}for(let i=0;i<N;i++){const a=(i/N)*Math.PI*2;v.push([Math.cos(a)*R,0,Math.sin(a)*R]);}for(let i=0;i<N;i++){const a=(i/N)*Math.PI*2+Math.PI/N;v.push([Math.cos(a)*R*0.9,-3,Math.sin(a)*R*0.9]);}v.push([0,HP,0]);return v;}
    const BASE=makeVerts();
    function makeFaces(){const f=[];for(let i=0;i<N;i++){const ni=(i+1)%N;f.push({v:[0,1+i,1+ni],t:'ct'});}for(let i=0;i<N;i++){const ni=(i+1)%N;f.push({v:[1+i,9+i,1+ni],t:'cm'});f.push({v:[9+i,9+ni,1+ni],t:'cl'});}for(let i=0;i<N;i++){const ni=(i+1)%N;f.push({v:[9+i,17+i,9+ni],t:'g'});f.push({v:[17+i,17+ni,9+ni],t:'g'});}for(let i=0;i<N;i++){const ni=(i+1)%N;f.push({v:[9+i,25,9+ni],t:'pm'});f.push({v:[17+i,25,17+ni],t:'pi'});}return f;}
    const FACES=makeFaces();
    let rX=0.1,rY=0,rZ=0,vX=0.006,vY=0.018,vZ=0.004,ct=0;
    function rot(v,ax,ay,az){let[x,y,z]=v;let ny=y*Math.cos(ax)-z*Math.sin(ax),nz=y*Math.sin(ax)+z*Math.cos(ax);y=ny;z=nz;let nx2=x*Math.cos(ay)+z*Math.sin(ay),nz2=-x*Math.sin(ay)+z*Math.cos(ay);x=nx2;z=nz2;let nx3=x*Math.cos(az)-y*Math.sin(az),ny3=x*Math.sin(az)+y*Math.cos(az);return[nx3,ny3,z];}
    const FOCAL=Math.min(W,H)*1.3;
    function project(v){const[x,y,z]=v;const s=FOCAL/(FOCAL+z+Math.min(W,H)*0.4);return[CX+x*s,CY+y*s,z,s];}
    function n2d(p,vi){const ax=p[vi[1]][0]-p[vi[0]][0],ay=p[vi[1]][1]-p[vi[0]][1],bx=p[vi[2]][0]-p[vi[0]][0],by=p[vi[2]][1]-p[vi[0]][1];return ax*by-ay*bx;}
    function fc(t,nrm,cz){const lit=Math.max(0,Math.min(1,-cz/120+0.5)),face=nrm>0?1:0,rr=201,gg=150,bb=12,rl=232,gl=177,bl=33;if(t==='ct'){const br=0.55+0.45*lit;return`rgba(${rl*br|0},${gl*br|0},${bl*br|0},${face?0.95:0.25})`;}if(t==='cm'){const br=0.4+0.6*lit;return`rgba(${rr*br|0},${gg*br|0},${bb*br|0},${face?0.9:0.2})`;}if(t==='cl'){const br=0.3+0.55*lit;return`rgba(${rl*br|0},${gl*br|0},${bl*br|0},${face?0.85:0.18})`;}if(t==='g'){return`rgba(${rl},${gl},${bl},${0.55+0.3*lit})`;}if(t==='pm'){const br=0.2+0.7*(1-lit);return`rgba(${rr*br|0},${gg*br|0},${bb*br|0},${face?0.88:0.18})`;}if(t==='pi'){const br=0.12+0.6*(1-lit);return`rgba(${rl*br|0},${gl*br|0},${bl*br|0},${face?0.82:0.12})`;}return'rgba(201,150,12,0.5)';}
    let tick=0;
    function render(){
      tick++;ct++;if(ct>150){vX+=(Math.random()-0.5)*0.005;vY+=(Math.random()-0.5)*0.004;vZ+=(Math.random()-0.5)*0.003;vX=Math.max(-0.032,Math.min(0.032,vX));vY=Math.max(-0.032,Math.min(0.032,vY));vZ=Math.max(-0.022,Math.min(0.022,vZ));ct=0;}
      rX+=vX;rY+=vY;rZ+=vZ;
      cx.clearRect(0,0,W,H);
      cx.strokeStyle='rgba(201,150,12,0.03)';cx.lineWidth=0.5;
      for(let x=0;x<W;x+=52){cx.beginPath();cx.moveTo(x,0);cx.lineTo(x,H);cx.stroke();}
      for(let y=0;y<H;y+=52){cx.beginPath();cx.moveTo(0,y);cx.lineTo(W,y);cx.stroke();}
      const ag=cx.createRadialGradient(CX,CY,0,CX,CY,120);ag.addColorStop(0,`rgba(201,150,12,${0.06+0.03*Math.sin(tick*0.02)})`);ag.addColorStop(1,'rgba(0,0,0,0)');cx.fillStyle=ag;cx.fillRect(0,0,W,H);
      const tv=BASE.map(v=>rot(v,rX,rY,rZ)),pv=tv.map(v=>project(v));
      const sorted=FACES.map(f=>{let cz=0;f.v.forEach(i=>cz+=pv[i][2]);cz/=f.v.length;return{...f,cz};}).sort((a,b)=>b.cz-a.cz);
      sorted.forEach(f=>{const pts=f.v.map(i=>pv[i]),nrm=n2d(pv,f.v);let cz=0;f.v.forEach(i=>cz+=pv[i][2]);cz/=f.v.length;cx.beginPath();cx.moveTo(pts[0][0],pts[0][1]);pts.slice(1).forEach(p=>cx.lineTo(p[0],p[1]));cx.closePath();cx.fillStyle=fc(f.t,nrm,cz);cx.fill();cx.strokeStyle=`rgba(232,177,33,${nrm>0?0.4:0.08})`;cx.lineWidth=0.4;cx.stroke();});
    }
    let raf;function loop(){render();raf=requestAnimationFrame(loop);}loop();
    return()=>cancelAnimationFrame(raf);
  },[]);
  return <canvas ref={ref} style={{width:"100%",height:"100%",display:"block",borderRadius:6,background:"#070707"}}/>;
}

// ── MARKETS ───────────────────────────────────────────────────────────────────
function Markets({go,prices,siteAssets}){
  const [filter,setFilter]=useState("all");
  const activeAssets=(siteAssets||ASSETS).filter(a=>a.status!=="frozen");
  const filtered=filter==="all"?activeAssets:activeAssets.filter(a=>filter==="Stage 1"?a.stage===1:a.stage===3);
  return <div style={{padding:"clamp(32px,5vw,72px) clamp(16px,4vw,48px) 60px"}}>
    <Tag gold>Asset Marketplace</Tag>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:44}}>
      <h1 style={{fontFamily:FS,fontSize:"clamp(28px,9vw,66px)",fontWeight:400,color:C.white,lineHeight:1.1,letterSpacing:"-0.025em"}}>
        Tokenized<br/><em style={{color:C.goldLt}}>Nigerian Equity.</em>
      </h1>
      <div style={{display:"flex",gap:8}}>
        {["all","Stage 1","Stage 3"].map(s=><FilterBtn key={s} label={s==="all"?"All Assets":s} active={filter===s} onClick={()=>setFilter(s)}/>)}
      </div>
    </div>
    <LiveMarketChart/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(280px,100%),1fr))",gap:1,background:C.brd,marginBottom:48}}>
      {filtered.map(a=><MarketCard key={a.id} asset={a} prices={prices} statusOverride={a.status}/>)}
    </div>
    <div style={{background:C.bg1,border:`0.5px solid ${C.brd}`,borderRadius:4,padding:"18px 24px",fontSize:12.5,color:C.muted,lineHeight:1.8,marginBottom:60}}>
      <strong style={{color:C.goldLt}}>Pre-Launch Notice: </strong>DotVests is pre-launch pending SEC Nigeria ARIP approval. All prices are simulated. No investment services offered. Stage 3 assets available only post full regulatory approval.
    </div>
    <div style={{display:"flex",justifyContent:"center",padding:"20px 0 40px"}}>
      <div style={{width:"100%",height:500}}><RotatingDiamond/></div>
    </div>
    <div style={{maxWidth:540,margin:"0 auto",textAlign:"center",marginBottom:52}}>
      <Tag>Early Access</Tag>
      <h2 style={{fontFamily:FS,fontSize:"clamp(22px,5vw,32px)",fontWeight:400,color:C.white,letterSpacing:"-0.02em",marginBottom:14}}>Join the Waitlist</h2>
      <p style={{fontSize:14,color:C.muted,lineHeight:1.8,marginBottom:28}}>Be first to access tokenized Nigerian equity post-ARIP approval.</p>
      <WaitlistBar/>
    </div>
    <Footer go={go}/>
  </div>;
}



export default Markets;
