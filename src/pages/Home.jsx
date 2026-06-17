import React, { useState } from "react";
import { C, FS, ASSETS } from "../constants";
import { fmt, Tag, Btn, MiniChart, useCountUp } from "../components/shared";
import WaitlistBar from "../components/WaitlistForm";
import FAQSection from "../components/FAQSection";
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

function PillarCard({n,icon,title,sub,body,badge,onClick}){
  const [h,set]=useState(false);
  return <div onClick={onClick} onMouseEnter={()=>set(true)} onMouseLeave={()=>set(false)}
    style={{background:h?C.bg2:C.bg1,padding:"48px 40px",cursor:"pointer",transition:"background 0.25s",position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:0,left:0,right:0,height:2,
      background:`linear-gradient(90deg,transparent,${C.gold},transparent)`,opacity:h?1:0,transition:"opacity 0.3s"}}/>
    <div style={{fontSize:11,color:C.gold,letterSpacing:"0.1em",marginBottom:22}}>{n}</div>
    <div style={{fontSize:24,marginBottom:12,color:C.goldLt}}>{icon}</div>
    <h3 style={{fontFamily:FS,fontSize:"clamp(20px,4.5vw,30px)",fontWeight:400,color:C.white,marginBottom:8}}>{title}</h3>
    <div style={{fontSize:12,color:C.muted,marginBottom:16,fontStyle:"italic"}}>{sub}</div>
    <div style={{width:28,height:1,background:C.goldBrd,marginBottom:16}}/>
    <p style={{fontSize:13,color:C.muted,lineHeight:1.85}}>{body}</p>
    <div style={{marginTop:28,display:"inline-flex",alignItems:"center",gap:8,fontSize:11,color:C.goldLt,
      border:`0.5px solid ${C.goldBrd}`,padding:"4px 12px",borderRadius:20}}>{badge}</div>
  </div>;
}

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

function Stat({value,suffix,label,prefix=""}){
  const n=useCountUp(value);
  return <div style={{textAlign:"center"}}>
    <div style={{fontFamily:FS,fontSize:46,fontWeight:400,color:C.white,lineHeight:1,letterSpacing:"-0.02em",marginBottom:8}}>
      {prefix}{n.toLocaleString()}{suffix}
    </div>
    <div style={{fontSize:11,color:C.muted,letterSpacing:"0.06em",textTransform:"uppercase"}}>{label}</div>
  </div>;
}

function PartnerPipeline(){
  const partners=[
    {name:"PiggyVest",    tag:"Priority · Stage 1", desc:"6M+ users · Pre-IPO",       icon:"🐷"},
    {name:"Chowdeck",     tag:"Target · Stage 1",   desc:"Food delivery · Expansion",  icon:"🚀"},
    {name:"Erisco Foods", tag:"Target · Stage 1",   desc:"FMCG · Market leader",       icon:"🏭"},
    {name:"Carbon",       tag:"Target · Stage 1",   desc:"Digital banking · Credit",   icon:"⚡"},
    {name:"Anchoria",     tag:"Custody Partner",     desc:"Licensed broker · NGX",      icon:"🏦"},
    {name:"Pavestones",   tag:"Legal Counsel",       desc:"FinTech · ARIP track record",icon:"⚖️"},
  ];
  return(
    <section style={{padding:"clamp(32px,5vw,80px) clamp(14px,4vw,48px)",borderBottom:`0.5px solid ${C.brd}`,background:C.bg1}}>
      <div style={{textAlign:"center",marginBottom:48}}>
        <Tag gold>Asset & Partner Pipeline</Tag>
        <h2 style={{fontFamily:FS,fontSize:"clamp(26px,6vw,38px)",fontWeight:400,color:C.white,letterSpacing:"-0.02em"}}>
          In Conversation With<br/><em style={{color:C.goldLt}}>Nigeria's Best.</em>
        </h2>
        <p style={{fontSize:14,color:C.muted,marginTop:12,maxWidth:480,margin:"12px auto 0",lineHeight:1.8}}>
          Stage 1 asset targets and strategic partners driving DotVests to launch.
        </p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(240px,100%),1fr))",gap:1,background:C.brd,maxWidth:900,margin:"0 auto"}}>
        {partners.map((p,i)=>(
          <div key={i} style={{background:C.bg2,padding:"32px 28px",position:"relative"}}>
            <div style={{fontSize:28,marginBottom:14}}>{p.icon}</div>
            <div style={{fontFamily:FS,fontSize:20,fontWeight:400,color:C.white,marginBottom:6}}>{p.name}</div>
            <div style={{fontSize:11,color:C.goldLt,border:`0.5px solid ${C.goldBrd}`,
              display:"inline-block",padding:"2px 10px",borderRadius:2,letterSpacing:"0.06em",marginBottom:10}}>{p.tag}</div>
            <div style={{fontSize:12.5,color:C.muted}}>{p.desc}</div>
          </div>
        ))}
      </div>
      <p style={{textAlign:"center",fontSize:11.5,color:C.dim,marginTop:20}}>
        * "In Conversation With" — formal partnerships pending regulatory sandbox approval.
      </p>
    </section>
  );
}

function MobileAppSection(){
  return(
    <section style={{padding:"clamp(32px,5vw,80px) clamp(14px,4vw,48px)",borderBottom:`0.5px solid ${C.brd}`}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(280px,100%),1fr))",gap:"clamp(20px,4vw,80px)",alignItems:"center",maxWidth:1000,margin:"0 auto"}}>
        <div>
          <Tag gold>Mobile App</Tag>
          <h2 style={{fontFamily:FS,fontSize:"clamp(26px,6vw,40px)",fontWeight:400,color:C.white,lineHeight:1.15,marginBottom:18}}>
            Your Portfolio,<br/><em style={{color:C.goldLt}}>In Your Pocket.</em>
          </h2>
          <p style={{fontSize:"clamp(13px,3vw,14.5px)",color:C.muted,lineHeight:1.9,marginBottom:32}}>
            The DotVests mobile app is in development alongside the platform. Native iOS and Android — built for the 40M+ smartphone users in Nigeria who deserve access to African equity markets.
          </p>
          <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:36}}>
            {[["Real-time portfolio tracking","Watch your tokenized equity move with live Polymesh settlement"],
              ["Naira in, naira out","Paystack deposits and withdrawals without leaving the app"],
              ["Biometric security","Face ID and fingerprint authentication on every session"],
              ["Push notifications","Price alerts, dividend payments, corporate action updates"]
            ].map(([t,b],i)=>(
              <div key={i} style={{display:"flex",gap:14}}>
                <div style={{width:20,height:20,borderRadius:"50%",flexShrink:0,marginTop:2,
                  border:`0.5px solid ${C.goldBrd}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:C.gold}}/>
                </div>
                <div>
                  <div style={{fontSize:13.5,fontWeight:500,color:C.white,marginBottom:3}}>{t}</div>
                  <div style={{fontSize:12.5,color:C.muted,lineHeight:1.6}}>{b}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:12}}>
            <div style={{background:C.bg2,border:`0.5px solid ${C.brd2}`,borderRadius:6,
              padding:"12px 20px",display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
              <span style={{fontSize:22}}>🍎</span>
              <div><div style={{fontSize:10,color:C.muted}}>Coming Soon</div><div style={{fontSize:13,fontWeight:500,color:C.white}}>App Store</div></div>
            </div>
            <div style={{background:C.bg2,border:`0.5px solid ${C.brd2}`,borderRadius:6,
              padding:"12px 20px",display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
              <span style={{fontSize:22}}>🤖</span>
              <div><div style={{fontSize:10,color:C.muted}}>Coming Soon</div><div style={{fontSize:13,fontWeight:500,color:C.white}}>Google Play</div></div>
            </div>
          </div>
        </div>
        {/* Phone mockup */}
        <div style={{display:"flex",justifyContent:"center"}}>
          <div style={{width:220,height:420,background:C.bg2,borderRadius:36,border:`2px solid ${C.brd2}`,
            position:"relative",overflow:"hidden",boxShadow:`0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px ${C.goldBrd}`}}>
            {/* Notch */}
            <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",
              width:80,height:24,background:C.bg,borderRadius:"0 0 16px 16px",zIndex:2}}/>
            {/* Screen content */}
            <div style={{padding:"36px 16px 16px",height:"100%",display:"flex",flexDirection:"column",gap:12}}>
              <div style={{fontSize:10,color:C.muted,letterSpacing:"0.06em"}}>PORTFOLIO VALUE</div>
              <div style={{fontFamily:FS,fontSize:28,color:C.white,fontWeight:400}}>₦248,500</div>
              <div style={{fontSize:11,color:C.green}}>▲ +3.2% today</div>
              <div style={{height:60,background:C.bg3,borderRadius:6,overflow:"hidden",display:"flex",alignItems:"flex-end",padding:"0 4px 4px"}}>
                {[40,55,45,70,60,80,65,90,75,95].map((h,i)=>(
                  <div key={i} style={{flex:1,height:`${h}%`,background:`linear-gradient(to top,${C.gold},${C.goldLt})`,borderRadius:2,margin:"0 1px"}}/>
                ))}
              </div>
              {[{n:"PiggyVest",v:"₦124,000",c:"+2.3%",u:true},{n:"Chowdeck",v:"₦62,000",c:"-0.8%",u:false},{n:"Carbon",v:"₦62,500",c:"+3.5%",u:true}].map((a,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                  background:C.bg3,borderRadius:6,padding:"10px 12px"}}>
                  <div>
                    <div style={{fontSize:12,fontWeight:500,color:C.white}}>{a.n}</div>
                    <div style={{fontSize:10,color:C.muted}}>{a.v}</div>
                  </div>
                  <div style={{fontSize:11,color:a.u?C.green:C.red}}>{a.c}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PressSection(){
  const outlets=[
    "TechCabal","Nairametrics","Techpoint Africa","BusinessDay","Ventures Africa","The Cable"
  ];
  return(
    <section style={{padding:"60px 48px",borderBottom:`0.5px solid ${C.brd}`,background:C.bg1}}>
      <div style={{textAlign:"center",marginBottom:36}}>
        <div style={{fontSize:11,color:C.muted,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:4}}>As Seen In</div>
        <div style={{fontSize:12,color:C.dim}}>Coverage & Recognition — Coming Soon</div>
      </div>
      <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:0,flexWrap:"wrap",
        border:`0.5px solid ${C.brd}`,borderRadius:6,overflow:"hidden",maxWidth:900,margin:"0 auto"}}>
        {outlets.map((o,i)=>(
          <div key={i} style={{flex:"1 1 150px",padding:"20px 24px",textAlign:"center",
            borderRight:i<outlets.length-1?`0.5px solid ${C.brd}`:"none",
            filter:"grayscale(1)",opacity:0.35}}>
            <div style={{fontSize:13,fontWeight:500,color:C.white,letterSpacing:"0.04em"}}>{o}</div>
          </div>
        ))}
      </div>
      <p style={{textAlign:"center",fontSize:11,color:C.dim,marginTop:14}}>
        Press enquiries: press@dotvests.com
      </p>
    </section>
  );
}

function Home({go,prices,siteAssets,setSiteAssets}){
  const pillars=[
    {n:"01",icon:"◈",title:"Tokenize",sub:"Nigerian equity → blockchain tokens",body:"Polymesh converts private company shares into compliance-native tokens. KYC/AML enforced at protocol level.",badge:"Polymesh Native",cta:"tokenize"},
    {n:"02",icon:"◎",title:"Trade",sub:"Fractional ownership from ₦1,000",body:"Buy and sell tokenized equity 24/7. Naira-denominated. Paystack and Breet rails. Instant settlement.",badge:"Naira Denominated",cta:"markets"},
    {n:"03",icon:"◇",title:"Comply",sub:"SEC Nigeria ARIP sandbox pathway",body:"Every architecture decision maps to a regulatory requirement. Building through compliance, not around it.",badge:"ARIP Active",cta:"compliance"},
  ];
  return <div>
    {/* HERO */}
    <section className="hero-grid" style={{minHeight:"90vh",display:"flex",alignItems:"center",flexWrap:"wrap",padding:"clamp(24px,4vw,64px) clamp(16px,4vw,48px) 48px",position:"relative",overflow:"hidden",borderBottom:`0.5px solid ${C.brd}`}}>
      <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(${C.brd} 1px,transparent 1px),linear-gradient(90deg,${C.brd} 1px,transparent 1px)`,backgroundSize:"64px 64px",maskImage:"linear-gradient(to bottom,transparent,rgba(0,0,0,0.5) 15%,rgba(0,0,0,0.5) 85%,transparent)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",top:"30%",left:"40%",width:500,height:350,background:`radial-gradient(ellipse,rgba(201,150,12,0.06) 0%,transparent 65%)`,pointerEvents:"none",animation:"glow 4s ease-in-out infinite"}}/>
      <div style={{flex:1,maxWidth:580,position:"relative",zIndex:2}}>
        <Tag gold>Nigeria · Blockchain · Pre-Launch</Tag>
        <h1 style={{fontFamily:FS,fontSize:"clamp(46px,5.5vw,80px)",fontWeight:400,lineHeight:1.07,letterSpacing:"-0.025em",color:C.white,marginBottom:22,animation:"fadeUp 0.9s 0.1s both"}}>
          Redefining Access<br/><em style={{color:C.goldLt}}>To African Wealth.</em>
        </h1>
        <p style={{fontSize:16,fontWeight:300,color:C.muted,lineHeight:1.85,maxWidth:440,marginBottom:36,animation:"fadeUp 0.9s 0.25s both"}}>
          Fractional tokenized equity in Nigeria's highest-growth companies. Compliance-native. Naira-denominated. Built for SEC Nigeria's regulatory sandbox.
        </p>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",animation:"fadeUp 0.9s 0.4s both"}}>
          <Btn v="gold" onClick={()=>go("markets")}>Explore Assets →</Btn>
          <Btn v="ghost" onClick={()=>go("platform")}>Explore Platform →</Btn>
        </div>
        <div style={{marginTop:48,display:"flex",gap:0,borderTop:`0.5px solid ${C.brd}`,animation:"fadeUp 0.9s 0.55s both"}}>
          {["CAC Registered","Polymesh Blockchain","SEC ARIP Sandbox","NDPC Compliant"].map((t,i)=>(
            <div key={i} style={{padding:"12px 18px 0",borderRight:i<3?`0.5px solid ${C.brd}`:"none",display:"flex",alignItems:"center",gap:7,paddingLeft:i===0?0:18}}>
              <div style={{width:4,height:4,borderRadius:"50%",background:C.gold,flexShrink:0}}/>
              <span style={{fontSize:11,color:C.muted}}>{t}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:14,position:"relative",zIndex:2,paddingLeft:36}}>
        <div style={{display:"flex",gap:14,justifyContent:"flex-end"}}>
          <AssetCard asset={(siteAssets||ASSETS).find(a=>a.id==="PGV")||ASSETS[0]} prices={prices} delay={200} anim="floatA"/>
          <AssetCard asset={(siteAssets||ASSETS).find(a=>a.id==="CBT")||ASSETS[3]} prices={prices} delay={500} anim="floatB"/>
        </div>
        <div style={{display:"flex",gap:14,justifyContent:"flex-end",marginLeft:44}}>
          <AssetCard asset={(siteAssets||ASSETS).find(a=>a.id==="CHD")||ASSETS[1]} prices={prices} delay={350} anim="floatB"/>
          <AssetCard asset={(siteAssets||ASSETS).find(a=>a.id==="ERF")||ASSETS[2]} prices={prices} delay={650} anim="floatA"/>
        </div>
      </div>
    </section>
    {/* STATS */}
    <section style={{background:C.bg1,borderBottom:`0.5px solid ${C.brd}`,padding:"56px 48px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(200px,100%),1fr))",gap:1}}>
      {[{v:160,s:"T+",p:"₦",l:"NGX Market Capitalisation"},{v:154,s:"+",p:"",l:"NGX Listed Companies"},{v:10,s:"M",p:"₦",l:"DotVests Share Capital"},{v:6,s:"M+",p:"",l:"PiggyVest Users — Stage 1"}].map((s,i)=>(
        <div key={i} style={{textAlign:"center",padding:"0 20px",borderRight:i<3?`0.5px solid ${C.brd}`:"none"}}><Stat value={s.v} suffix={s.s} prefix={s.p} label={s.l}/></div>
      ))}
    </section>
    {/* PILLARS */}
    <section style={{padding:"90px 48px",borderBottom:`0.5px solid ${C.brd}`}}>
      <div style={{textAlign:"center",marginBottom:56}}>
        <Tag>Platform Architecture</Tag>
        <h2 style={{fontFamily:FS,fontSize:"clamp(26px,6vw,40px)",fontWeight:400,color:C.white,letterSpacing:"-0.02em"}}>One Platform. Three Functions.</h2>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(240px,100%),1fr))",gap:1,background:C.brd}}>
        {pillars.map(p=><PillarCard key={p.n} {...p} onClick={()=>go(p.cta)}/>)}
      </div>
    </section>
    {/* LIVE TABLE */}
    <section style={{padding:"90px 48px",borderBottom:`0.5px solid ${C.brd}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:32}}>
        <div><Tag gold>Live Asset Feed</Tag><h2 style={{fontFamily:FS,fontSize:"clamp(24px,5vw,36px)",fontWeight:400,color:C.white,letterSpacing:"-0.02em"}}>Tokenized Asset Pipeline</h2></div>
        <Btn v="og" onClick={()=>go("markets")}>View All →</Btn>
      </div>
      <div style={{border:`0.5px solid ${C.brd}`,borderRadius:6,overflow:"hidden"}}>
        <div style={{display:"grid",gridTemplateColumns:"clamp(30px,5vw,44px) 1fr clamp(80px,15vw,120px) clamp(70px,12vw,120px) clamp(60px,10vw,90px)",padding:"10px 22px",background:C.bg2,borderBottom:`0.5px solid ${C.brd}`,fontSize:10.5,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase"}}>
          <span>#</span><span>Asset</span><span>Sector</span><span style={{textAlign:"right"}}>Price</span><span style={{textAlign:"right"}}>24h</span><span style={{textAlign:"right"}}>Stage</span>
        </div>
        {(siteAssets||ASSETS).filter(a=>a.status!=="frozen").map((a,i)=><TableRow key={a.id} asset={a} idx={i} prices={prices}/>)}
      </div>
      <p style={{fontSize:11,color:C.dim,marginTop:8,textAlign:"right"}}>* Simulated prices. No investment services offered.</p>
    </section>
    {/* PLATFORM CTA */}
    <section style={{padding:"0 48px 90px",borderBottom:`0.5px solid ${C.brd}`}}>
      <div style={{background:`linear-gradient(135deg,${C.bg2},rgba(201,150,12,0.04))`,border:`0.5px solid ${C.goldBrd}`,borderRadius:8,padding:"64px 56px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(260px,100%),1fr))",gap:60,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,right:0,width:520,height:200,background:`radial-gradient(circle at top right,${C.goldDim},transparent)`,pointerEvents:"none"}}/>
        <div>
          <Tag gold>New Feature</Tag>
          <h2 style={{fontFamily:FS,fontSize:"clamp(24px,5vw,36px)",fontWeight:400,color:C.white,lineHeight:1.2,marginBottom:18}}>How the Platform<br/><em style={{color:C.goldLt}}>Works.</em></h2>
          <p style={{fontSize:14,color:C.muted,lineHeight:1.9,marginBottom:28}}>A seamless, secure, and transparent way to invest in African stocks — built on compliance-native Polymesh blockchain infrastructure from day one.</p>
          <Btn v="gold" onClick={()=>go("platform")}>Launch Simulator →</Btn>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:0}}>
          {[["Sign Up & Verify","Create account and complete KYC via Polymesh identity layer"],["Fund Your Wallet","Deposit via Paystack NGN or Breet crypto on-ramp"],["Browse & Buy","Fractional shares from ₦1,000 — no minimum lock-in"],["Trade 24/7","Atomic blockchain settlement. T+0. No T+2 delays."]].map(([k,v],i)=>(
            <div key={i} style={{display:"flex",gap:14,padding:"16px 0",borderBottom:`0.5px solid ${C.brd}`}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:C.gold,flexShrink:0,marginTop:6}}/>
              <div><div style={{fontSize:13,fontWeight:500,color:C.white,marginBottom:3}}>{k}</div><div style={{fontSize:12.5,color:C.muted}}>{v}</div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
    {/* WAITLIST */}
    <PartnerPipeline/>
    <MobileAppSection/>
    <PressSection/>
    <FAQSection/>
    <section id="waitlist-section" style={{padding:"90px 48px",borderBottom:`0.5px solid ${C.brd}`}}>
      <div style={{maxWidth:560,margin:"0 auto",textAlign:"center"}}>
        <Tag gold>Early Access</Tag>
        <h2 style={{fontFamily:FS,fontSize:"clamp(26px,6vw,40px)",fontWeight:400,color:C.white,letterSpacing:"-0.02em",marginBottom:14}}>Be First In Line.</h2>
        <p style={{fontSize:15,color:C.muted,lineHeight:1.8,marginBottom:36}}>Join the waitlist. Get priority access, insider updates, and be first to invest when we launch post-ARIP approval.</p>
        <WaitlistBar/>
      </div>
    </section>
    <Footer go={go}/>
  </div>;
}

export default Home;
