import { useState, useEffect, useRef } from "react";

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const C = {
  bg:"#070707", bg1:"#0D0D0D", bg2:"#131313", bg3:"#1A1A1A",
  gold:"#C9960C", goldLt:"#E8B121", goldDim:"rgba(201,150,12,0.12)", goldBrd:"rgba(201,150,12,0.22)",
  white:"#F2F0E8", muted:"#7A7870", dim:"#3A3835",
  brd:"rgba(255,255,255,0.06)", brd2:"rgba(255,255,255,0.10)",
  green:"#22C55E", red:"#EF4444",
};
const FS = "'Playfair Display', serif";
const FN = "'Sora', sans-serif";

const GF = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Sora:wght@300;400;500;600&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;border:none;}html,body{margin:0;padding:0;border:0;outline:0;}
  body{background:${C.bg};color:${C.white};font-family:${FN};-webkit-font-smoothing:antialiased;}
  button{cursor:pointer;font-family:${FN};}
  input,select{font-family:${FN};}
  @keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  @keyframes floatA{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
  @keyframes floatB{0%,100%{transform:translateY(-5px)}50%{transform:translateY(5px)}}
  @keyframes dropIn{from{opacity:0;transform:translateY(-8px) translateX(-50%)}to{opacity:1;transform:translateY(0) translateX(-50%)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
  @keyframes glow{0%,100%{opacity:0.35}50%{opacity:0.7}}
  @keyframes shimUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
  html,body{max-width:100%;overflow-x:hidden;margin:0;padding:0;}#root{width:100%;overflow:hidden;}
  #rs{overflow-x:hidden;}
  @media(max-width:900px){
    .hero-cards{display:none !important;}
    .hide-mobile{display:none !important;}
    .two-col{grid-template-columns:1fr !important;}
    .three-col{grid-template-columns:1fr !important;}
    .four-col{grid-template-columns:1fr 1fr !important;}
    .stats-strip{grid-template-columns:1fr 1fr !important;}
    .footer-grid{grid-template-columns:1fr 1fr !important;}
    .admin-stats{grid-template-columns:1fr 1fr !important;}
    .page-section{padding:80px 20px 60px !important;}
    .nav-search{display:none !important;}
  }
  @media(max-width:600px){
    .four-col{grid-template-columns:1fr !important;}
    .stats-strip{grid-template-columns:1fr !important;}
    .footer-grid{grid-template-columns:1fr !important;}
  }

`;

// ── ASSETS ────────────────────────────────────────────────────────────────────
const ASSETS = [
  {id:"PGV",name:"PiggyVest",    sector:"Fintech",          price:1840,chg:+2.34,stage:1},
  {id:"CHW",name:"Chowdeck",     sector:"Food & Logistics", price:620, chg:-0.87,stage:1},
  {id:"ERF",name:"Erisco Foods", sector:"Consumer Goods",   price:310, chg:+1.12,stage:1},
  {id:"CBN",name:"Carbon",       sector:"Digital Banking",  price:980, chg:+3.56,stage:1},
  {id:"GTB",name:"GT Bank",      sector:"Banking",          price:4220,chg:+0.44,stage:3},
  {id:"MTN",name:"MTN Nigeria",  sector:"Telecom",          price:3150,chg:-1.21,stage:3},
];

function useLivePrices() {
  const [prices, set] = useState(() => Object.fromEntries(ASSETS.map(a=>[a.id,{price:a.price,chg:a.chg}])));
  useEffect(()=>{
    const id = setInterval(()=>{
      set(prev=>{
        const next={...prev};
        const a=ASSETS[Math.floor(Math.random()*ASSETS.length)];
        const d=(Math.random()-0.48)*a.price*0.003;
        next[a.id]={price:Math.max(1,prev[a.id].price+d),chg:prev[a.id].chg+(Math.random()-0.5)*0.04};
        return next;
      });
    },1400);
    return ()=>clearInterval(id);
  },[]);
  return prices;
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
  return (
    <svg height={height} viewBox="0 0 220 60" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gA" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E8B121"/>
          <stop offset="50%" stopColor="#C9960C"/>
          <stop offset="100%" stopColor="#A07808"/>
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* Icon mark — two vertical bars + dot (matches brand) */}
      <g filter="url(#glow)">
        <rect x="4" y="10" width="8" height="38" rx="4" fill="url(#gA)"/>
        <rect x="17" y="18" width="8" height="30" rx="4" fill="url(#gA)" opacity="0.85"/>
        <circle cx="8" cy="6" r="4" fill="url(#gA)"/>
        <circle cx="21" cy="14" r="3.5" fill="url(#gA)" opacity="0.85"/>
      </g>
      {/* Wordmark */}
      <text x="36" y="34" fontFamily="'Playfair Display',serif" fontSize="22" fontWeight="500"
        fill="url(#gA)" letterSpacing="0.5">DOTVests</text>
      <text x="37" y="50" fontFamily="'Sora',sans-serif" fontSize="8" fontWeight="300"
        fill="#C9960C" letterSpacing="3" opacity="0.8">TECHNOLOGIES</text>
    </svg>
  );
}

// ── TICKER ────────────────────────────────────────────────────────────────────
function Ticker({prices}){
  const items=[...ASSETS,...ASSETS];
  return <div style={{borderBottom:`0.5px solid ${C.brd}`,background:C.bg1,overflow:"hidden",height:36,display:"flex",alignItems:"center"}}>
    <div style={{display:"inline-flex",animation:"ticker 28s linear infinite",whiteSpace:"nowrap"}}>
      {items.map((a,i)=>{const p=prices[a.id];const up=p.chg>=0;return(
        <span key={i} style={{display:"inline-flex",alignItems:"center",gap:10,padding:"0 26px",fontSize:11.5,borderRight:`0.5px solid ${C.brd}`}}>
          <span style={{color:C.muted}}>{a.id}</span>
          <span style={{color:C.white,fontWeight:500}}>{fmt(p.price)}</span>
          <span style={{color:up?C.green:C.red,fontSize:11}}>{up?"▲":"▼"} {Math.abs(p.chg).toFixed(2)}%</span>
        </span>);
      })}
    </div>
  </div>;
}


// ── SEARCH ────────────────────────────────────────────────────────────────────
const SEARCH_INDEX = [
  {label:"Home",             page:"home",      keywords:"home overview hero landing"},
  {label:"Markets",          page:"markets",   keywords:"markets assets trade buy sell equity"},
  {label:"PiggyVest",        page:"markets",   keywords:"piggyvest fintech savings pgv"},
  {label:"Chowdeck",         page:"markets",   keywords:"chowdeck food delivery logistics chw"},
  {label:"Erisco Foods",     page:"markets",   keywords:"erisco foods consumer goods erf"},
  {label:"Carbon",           page:"markets",   keywords:"carbon digital banking cbn"},
  {label:"GT Bank",          page:"markets",   keywords:"gt bank gtb banking stage 3"},
  {label:"MTN Nigeria",      page:"markets",   keywords:"mtn nigeria telecom stage 3"},
  {label:"Tokenize",         page:"tokenize",  keywords:"tokenize blockchain polymesh how it works"},
  {label:"Compliance",       page:"compliance",keywords:"compliance sec nigeria arip regulatory roadmap"},
  {label:"ARIP Sandbox",     page:"compliance",keywords:"arip sandbox sec nigeria regulatory sandbox"},
  {label:"Polymesh",         page:"tokenize",  keywords:"polymesh blockchain substrate kyc aml"},
  {label:"Company",          page:"company",   keywords:"company about dotvests team mission contact"},
  {label:"Contact",          page:"company",   keywords:"contact email phone address"},
  {label:"Platform",         page:"platform",  keywords:"platform how it works sign up fund wallet"},
  {label:"Join Waitlist",    page:"waitlist",  keywords:"waitlist early access join signup email name investor"},
  {label:"FAQ",               page:"home",      keywords:"faq questions legal regulated shares protected minimum"},
  {label:"Mobile App",        page:"home",      keywords:"mobile app ios android download"},
  {label:"Partner Pipeline",  page:"home",      keywords:"piggyvest chowdeck erisco carbon partners"},
  {label:"Press",             page:"home",      keywords:"press media techcabal techpoint businessday"},

  {label:"Paystack",         page:"platform",  keywords:"paystack payment rails ngn"},
  {label:"Breet",            page:"platform",  keywords:"breet crypto on ramp"},
  {label:"Admin",            page:"admin",     keywords:"admin dashboard login"},
];

function SearchBar({go}){
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const ref = useRef();

  const results = q.trim().length > 0
    ? SEARCH_INDEX.filter(s =>
        s.label.toLowerCase().includes(q.toLowerCase()) ||
        s.keywords.toLowerCase().includes(q.toLowerCase())
      ).slice(0, 6)
    : [];

  useEffect(() => { setIdx(0); }, [q]);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setQ(""); }};
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const choose = (page) => {
    setQ(""); setOpen(false);
    if(page === "waitlist"){
      go("home");
      setTimeout(()=>{
        const el=document.getElementById("waitlist-section");
        if(el)el.scrollIntoView({behavior:"smooth",block:"start"});
      },80);
    } else {
      go(page);
    }
  };

  const onKey = (e) => {
    if (!results.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setIdx(i => Math.min(i+1, results.length-1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setIdx(i => Math.max(i-1, 0)); }
    if (e.key === "Enter")     { choose(results[idx].page); }
    if (e.key === "Escape")    { setQ(""); setOpen(false); }
  };

  return (
    <div ref={ref} style={{position:"relative"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,background:C.bg2,
        border:`0.5px solid ${open||q?C.goldBrd:C.brd}`,
        borderRadius:3, padding:"7px 14px", transition:"border 0.2s", width:"clamp(120px,15vw,200px)"}}>
        <span style={{fontSize:13,color:C.dim}}>⌕</span>
        <input
          type="text" placeholder="Search..."
          value={q}
          onChange={e=>{
            const val = e.target.value;
            setQ(val);
            setOpen(true);
            if(val.trim().toLowerCase() === "dtv//admin"){
              setQ(""); setOpen(false); go("admin");
            }
          }}
          onFocus={()=>setOpen(true)}
          onKeyDown={onKey}
          style={{background:"none",border:"none",outline:"none",color:C.white,
            fontSize:13,width:"100%",fontFamily:"'Sora',sans-serif"}}/>
        {q && <button onClick={()=>{setQ("");setOpen(false);}}
          style={{background:"none",border:"none",color:C.muted,fontSize:14,lineHeight:1,padding:0}}>✕</button>}
      </div>

      {open && results.length > 0 && (
        <div style={{position:"absolute",top:"calc(100% + 8px)",left:0,right:0,
          background:"rgba(8,8,8,0.99)",border:`0.5px solid ${C.goldBrd}`,
          borderRadius:6,overflow:"hidden",zIndex:400,
          boxShadow:`0 24px 48px rgba(0,0,0,0.9)`}}>
          {results.map((r,i)=>(
            <div key={i} onClick={()=>choose(r.page)}
              style={{padding:"11px 16px",cursor:"pointer",
                background:i===idx?C.bg2:"transparent",
                borderBottom:i<results.length-1?`0.5px solid ${C.brd}`:"none",
                display:"flex",justifyContent:"space-between",alignItems:"center"}}
              onMouseEnter={()=>setIdx(i)}>
              <span style={{fontSize:13,color:C.white}}>{r.label}</span>
              <span style={{fontSize:10,color:C.muted,letterSpacing:"0.06em",textTransform:"capitalize"}}>{r.page}</span>
            </div>
          ))}
        </div>
      )}

      {open && q.trim().length > 0 && results.length === 0 && (
        <div style={{position:"absolute",top:"calc(100% + 8px)",left:0,right:0,
          background:"rgba(8,8,8,0.99)",border:`0.5px solid ${C.brd}`,
          borderRadius:6,padding:"14px 16px",zIndex:400}}>
          <span style={{fontSize:13,color:C.muted}}>No results for "{q}"</span>
        </div>
      )}
    </div>
  );
}

// ── NAV ───────────────────────────────────────────────────────────────────────
const DROP_ITEMS=[
  {l:"Home",           p:"home",      desc:"Overview & live market feed"},
  {l:"Markets",        p:"markets",   desc:"Browse tokenized assets"},
  {l:"Tokenize",       p:"tokenize",  desc:"How tokenization works"},
  {l:"Compliance",     p:"compliance",desc:"Four-stage regulatory roadmap"},
  {l:"Company",        p:"company",   desc:"About DotVests Technologies"},
  {l:"Platform",       p:"platform",  desc:"How the platform works"},
  {l:"Explore Assets", p:"markets",   desc:"Start investing today"},
];

function DropItem({item,go,close}){
  const [h,set]=useState(false);
  return <div onMouseEnter={()=>set(true)} onMouseLeave={()=>set(false)}
    onClick={()=>{go(item.p);close();}}
    style={{padding:"13px 22px",cursor:"pointer",background:h?C.bg2:"transparent",
      borderBottom:`0.5px solid ${C.brd}`,display:"flex",justifyContent:"space-between",
      alignItems:"center",transition:"background 0.15s"}}>
    <div>
      <div style={{fontSize:13.5,fontWeight:500,color:C.white}}>{item.l}</div>
      <div style={{fontSize:11,color:C.muted,marginTop:2}}>{item.desc}</div>
    </div>
    <span style={{fontSize:12,color:h?C.goldLt:C.dim}}>→</span>
  </div>;
}

function Nav({page,go}){
  const [sc,setSc]=useState(false);
  const [open,setOpen]=useState(false);
  const ref=useRef();
  useEffect(()=>{
    const el=document.getElementById("rs");if(!el)return;
    const h=()=>setSc(el.scrollTop>50);el.addEventListener("scroll",h);return()=>el.removeEventListener("scroll",h);
  },[]);
  useEffect(()=>{
    const h=(e)=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);};
    document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h);
  },[]);
  return(
    <nav ref={ref} className="nav-inner" style={{position:"relative",top:0,left:0,right:0,zIndex:200,height:64,
      display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 48px",
      background:"rgba(7,7,7,0.97)",
      width:"100%",
      borderBottom:sc?`0.5px solid ${C.brd}`:"0.5px solid transparent",
      backdropFilter:sc?"blur(16px)":"none",transition:"all 0.35s"}}>
      <div onClick={()=>{go("home");setOpen(false);}} style={{cursor:"pointer"}}>
        <DotVestsLogo height={42}/>
      </div>
      <div style={{position:"relative"}}>
        <button onClick={(e)=>{e.stopPropagation();setOpen(o=>!o);}} style={{
          background:open?C.goldDim:"none",
          border:`0.5px solid ${open?C.gold:C.brd}`,
          color:open?C.goldLt:C.white,
          fontSize:14,fontWeight:500,letterSpacing:"0.05em",
          padding:"9px 22px",borderRadius:3,
          display:"flex",alignItems:"center",gap:10,transition:"all 0.2s"}}>
          {({home:"Home",markets:"Markets",tokenize:"Tokenize",compliance:"Compliance",company:"Company",platform:"Platform",admin:"Admin"})[page]||"DotVests"}
          <span style={{fontSize:9,color:open?C.goldLt:C.muted,
            transform:open?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.25s",display:"inline-block"}}>▼</span>
        </button>
        {open&&(
          <div style={{position:"absolute",top:"calc(100% + 12px)",left:"50%",
            width:290,background:"rgba(8,8,8,0.99)",
            border:`0.5px solid ${C.goldBrd}`,borderRadius:6,
            backdropFilter:"blur(24px)",
            boxShadow:`0 32px 64px rgba(0,0,0,0.9)`,
            animation:"dropIn 0.18s ease both",overflow:"hidden",zIndex:300}}>
            <div style={{padding:"13px 22px 11px",borderBottom:`0.5px solid ${C.brd}`,
              display:"flex",alignItems:"center",gap:10}}>
              <DotVestsLogo height={22}/>
              <span style={{fontSize:10,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase"}}>Navigate</span>
            </div>
            {DROP_ITEMS.map(item=><DropItem key={item.l} item={item} go={go} close={()=>setOpen(false)}/>)}
          </div>
        )}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:12}}><SearchBar go={go}/><Btn v="gold" onClick={()=>{
  setOpen(false);
  go("home");
  setTimeout(()=>{
    const el=document.getElementById("waitlist-section");
    if(el)el.scrollIntoView({behavior:"smooth",block:"start"});
  },80);
}}>Join Waitlist →</Btn></div>
    </nav>
  );
}

// ── SHARED COMPONENTS ─────────────────────────────────────────────────────────
function TableRow({asset,idx,prices}){
  const [h,set]=useState(false);
  const p=prices[asset.id];const up=p.chg>=0;
  return <div onMouseEnter={()=>set(true)} onMouseLeave={()=>set(false)}
    style={{display:"grid",gridTemplateColumns:"44px 1fr 1fr 120px 120px 90px",
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

function MarketCard({asset,prices}){
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

function WaitlistBar(){
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const form = document.forms['WebToLeads7406654000000605590'];
    const errs = {};
    if (!form) return errs;
    const company = form['Company']?.value?.trim();
    const name    = form['Last Name']?.value?.trim();
    const email   = form['Email']?.value?.trim();
    const privacy = document.getElementById('privacyTool7406654000000605590');
    if (!company) errs.company = 'Company / Organisation is required.';
    if (!name)    errs.name    = 'Full name is required.';
    if (email) {
      const at = email.indexOf('@'), dot = email.lastIndexOf('.');
      if (at < 1 || dot < at+2 || dot+2 >= email.length) errs.email = 'Enter a valid email address.';
    }
    if (!privacy?.checked) errs.privacy = 'Please accept the privacy notice.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    // Submit via hidden iframe — bypasses CORS, data lands in Zoho CRM
    const form = document.forms['WebToLeads7406654000000605590'];
    form.target = 'zoho_iframe';
    form.action = 'https://crm.zoho.com/crm/WebToLeadForm';
    form.method = 'POST';
    form.submit();
    setTimeout(() => setDone(true), 800);
  };

  if (done) return (
    <div style={{textAlign:"center", padding:"36px 0", animation:"fadeUp 0.4s ease both"}}>
      <div style={{fontSize:40, marginBottom:12}}>✓</div>
      <div style={{fontFamily:FS, fontSize:22, color:C.green, marginBottom:10}}>You're on the list.</div>
      <div style={{fontSize:14, color:C.muted, lineHeight:1.8, maxWidth:420, margin:"0 auto"}}>
        Welcome to the future of African investing. We'll be in touch before launch with everything you need to know.
        <br/><br/>
        <em style={{color:C.goldLt}}>DotVests — Redefining Access To African Wealth.</em>
      </div>
    </div>
  );

  const inputStyle = (errKey) => ({
    width:"100%", background:C.bg2,
    border:`0.5px solid ${errors[errKey]?C.red:C.brd2}`,
    color:C.white, fontSize:13.5, padding:"11px 14px",
    borderRadius:3, outline:"none", transition:"border 0.2s",
  });

  const selectStyle = (errKey) => ({
    width:"100%", background:C.bg2,
    border:`0.5px solid ${errors[errKey]?C.red:C.brd2}`,
    color:C.white, fontSize:13.5, padding:"11px 14px",
    borderRadius:3, outline:"none",
  });

  return (
    <div style={{maxWidth:560, margin:"0 auto"}}>
      {/* Hidden iframe target — receives Zoho redirect silently */}
      <iframe name="zoho_iframe" style={{display:"none"}} title="zoho_submit"/>

      <form name="WebToLeads7406654000000605590" onSubmit={handleSubmit} noValidate>
        {/* Zoho hidden auth fields */}
        <input type="text" style={{display:"none"}} name="xnQsjsdp" defaultValue="be0707caeac2fe05dd2ccd38ad3085037747e72912a40197be635504935ac6dd"/>
        <input type="hidden" name="zc_gad" defaultValue=""/>
        <input type="text" style={{display:"none"}} name="xmIwtLD" defaultValue="67396539347e76c6e554f2aa574b0a41ed75811b42fdf41fda4bee5ec18dc94b9970ae8d12ba4c7bd65258105620b932"/>
        <input type="text" style={{display:"none"}} name="actionType" defaultValue="TGVhZHM="/>
        <input type="text" style={{display:"none"}} name="returnURL" defaultValue="null"/>
        <input type="text" style={{display:"none"}} name="aG9uZXlwb3Q" defaultValue=""/>

        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12}}>
          <div>
            <div style={{fontSize:10, color:C.muted, letterSpacing:"0.08em", marginBottom:6, textTransform:"uppercase"}}>Company / Organisation *</div>
            <input type="text" name="Company" maxLength={200} placeholder="Your company or N/A" style={inputStyle('company')}/>
            {errors.company && <div style={{fontSize:11,color:C.red,marginTop:4}}>{errors.company}</div>}
          </div>
          <div>
            <div style={{fontSize:10, color:C.muted, letterSpacing:"0.08em", marginBottom:6, textTransform:"uppercase"}}>Full Name *</div>
            <input type="text" name="Last Name" maxLength={80} placeholder="Your full name" style={inputStyle('name')}/>
            {errors.name && <div style={{fontSize:11,color:C.red,marginTop:4}}>{errors.name}</div>}
          </div>
        </div>

        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12}}>
          <div>
            <div style={{fontSize:10, color:C.muted, letterSpacing:"0.08em", marginBottom:6, textTransform:"uppercase"}}>Email Address</div>
            <input type="text" name="Email" maxLength={100} placeholder="you@email.com" style={inputStyle('email')}/>
            {errors.email && <div style={{fontSize:11,color:C.red,marginTop:4}}>{errors.email}</div>}
          </div>
          <div>
            <div style={{fontSize:10, color:C.muted, letterSpacing:"0.08em", marginBottom:6, textTransform:"uppercase"}}>Investor Type</div>
            <select name="Lead Source" style={selectStyle('type')}>
              <option value="-None-">Select type</option>
              <option value="Web Research">Retail Investor</option>
              <option value="Advertisement">Institutional</option>
              <option value="External Referral">Diaspora Investor</option>
              <option value="Partner">High Net-Worth (HNI)</option>
            </select>
          </div>
        </div>

        <div style={{marginBottom:16}}>
          <div style={{fontSize:10, color:C.muted, letterSpacing:"0.08em", marginBottom:6, textTransform:"uppercase"}}>Investment Range</div>
          <select name="Description" style={selectStyle('amount')}>
            <option value="">Select range</option>
            <option value="Under ₦100,000">Under ₦100,000</option>
            <option value="₦100,000 – ₦500,000">₦100,000 – ₦500,000</option>
            <option value="₦500,000 – ₦2,000,000">₦500,000 – ₦2,000,000</option>
            <option value="₦2M – ₦10M">₦2M – ₦10M</option>
            <option value="Over ₦10M">Over ₦10M</option>
          </select>
        </div>

        <div style={{display:"flex", gap:12, alignItems:"flex-start", marginBottom:16,
          background:C.bg2, border:`0.5px solid ${errors.privacy?C.red:C.brd}`,
          borderRadius:4, padding:"14px 16px", transition:"border 0.2s"}}>
          <input type="checkbox" id="privacyTool7406654000000605590"
            style={{marginTop:3, flexShrink:0, accentColor:C.gold, width:16, height:16}}/>
          <label htmlFor="privacyTool7406654000000605590" style={{fontSize:12, color:C.muted, lineHeight:1.7, cursor:"pointer"}}>
            I consent to DotVests collecting and using my information for research and product development purposes.
            Data will not be sold or shared with third parties. Contact: <span style={{color:C.goldLt}}>info@dotvests.com</span>
          </label>
        </div>
        {errors.privacy && <div style={{fontSize:11,color:C.red,marginBottom:10}}>{errors.privacy}</div>}

        <button type="submit" style={{
          width:"100%", background:C.gold, border:"none", color:"#000",
          fontFamily:"'Sora',sans-serif", fontSize:13.5, fontWeight:600,
          padding:"13px", borderRadius:3, cursor:"pointer", letterSpacing:"0.05em",
        }}>Request Early Access →</button>

        <div style={{fontSize:11, color:C.dim, marginTop:10, textAlign:"center"}}>
          No spam. No investment solicitation. Informational updates only.
        </div>
      </form>
    </div>
  );
}

function FooterLink({label,onClick}){
  const [h,set]=useState(false);
  return <button onClick={onClick} onMouseEnter={()=>set(true)} onMouseLeave={()=>set(false)}
    style={{background:"none",border:"none",textAlign:"left",fontSize:13,color:h?C.white:C.muted}}>{label}</button>;
}

function Footer({go}){
  const cols=[
    {t:"Platform",links:[["Markets","markets"],["Tokenize","tokenize"],["Platform","platform"],["Join Waitlist","waitlist"]]},
    {t:"Company", links:[["About","company"],["Compliance","compliance"],["Contact","company"]]},
    {t:"Legal",   links:[["Privacy Policy","company"],["Risk Disclosure","company"],["Regulatory Info","compliance"]]},
  ];
  return <footer style={{background:C.bg1,borderTop:`0.5px solid ${C.brd}`,padding:"56px 48px 32px"}}>
    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:52,marginBottom:48}}>
      <div>
        <div style={{marginBottom:14}}><DotVestsLogo height={36}/></div>
        <p style={{fontSize:13,color:C.muted,lineHeight:1.8,maxWidth:220}}>Redefining Access To African Wealth. Tokenized Nigerian equity on Polymesh.</p>
        <p style={{fontSize:11.5,color:C.dim,marginTop:14,lineHeight:1.7}}>DotVests Technologies Limited<br/>CAC Registered · Nigeria · 2024</p>
      </div>
      {cols.map(col=><div key={col.t}>
        <div style={{fontSize:10.5,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:18}}>{col.t}</div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {col.links.map(([l,p])=><FooterLink key={l} label={l} onClick={()=>go(p)}/>)}
        </div>
      </div>)}
    </div>
    <div style={{borderTop:`0.5px solid ${C.brd}`,paddingTop:22,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{fontSize:12,color:C.dim}}>© 2026 DotVests Technologies Limited.</span>
      <span style={{fontSize:11,color:C.dim}}>Pre-launch · No investment services offered · Pending SEC Nigeria ARIP</span>
    </div>
  </footer>;
}

// ── HOME ──────────────────────────────────────────────────────────────────────
function PillarCard({n,icon,title,sub,body,badge,onClick}){
  const [h,set]=useState(false);
  return <div onClick={onClick} onMouseEnter={()=>set(true)} onMouseLeave={()=>set(false)}
    style={{background:h?C.bg2:C.bg1,padding:"48px 40px",cursor:"pointer",transition:"background 0.25s",position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:0,left:0,right:0,height:2,
      background:`linear-gradient(90deg,transparent,${C.gold},transparent)`,opacity:h?1:0,transition:"opacity 0.3s"}}/>
    <div style={{fontSize:11,color:C.gold,letterSpacing:"0.1em",marginBottom:22}}>{n}</div>
    <div style={{fontSize:24,marginBottom:12,color:C.goldLt}}>{icon}</div>
    <h3 style={{fontFamily:FS,fontSize:30,fontWeight:400,color:C.white,marginBottom:8}}>{title}</h3>
    <div style={{fontSize:12,color:C.muted,marginBottom:16,fontStyle:"italic"}}>{sub}</div>
    <div style={{width:28,height:1,background:C.goldBrd,marginBottom:16}}/>
    <p style={{fontSize:13,color:C.muted,lineHeight:1.85}}>{body}</p>
    <div style={{marginTop:28,display:"inline-flex",alignItems:"center",gap:8,fontSize:11,color:C.goldLt,
      border:`0.5px solid ${C.goldBrd}`,padding:"4px 12px",borderRadius:20}}>{badge}</div>
  </div>;
}

function AssetCard({asset,prices,delay=0,anim="floatA"}){
  const p=prices[asset.id];const up=p.chg>=0;
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

function Home({go,prices}){
  const pillars=[
    {n:"01",icon:"◈",title:"Tokenize",sub:"Nigerian equity → blockchain tokens",body:"Polymesh converts private company shares into compliance-native tokens. KYC/AML enforced at protocol level.",badge:"Polymesh Native",cta:"tokenize"},
    {n:"02",icon:"◎",title:"Trade",sub:"Fractional ownership from ₦1,000",body:"Buy and sell tokenized equity 24/7. Naira-denominated. Paystack and Breet rails. Instant settlement.",badge:"Naira Denominated",cta:"markets"},
    {n:"03",icon:"◇",title:"Comply",sub:"SEC Nigeria ARIP sandbox pathway",body:"Every architecture decision maps to a regulatory requirement. Building through compliance, not around it.",badge:"ARIP Active",cta:"compliance"},
  ];
  return <div>
    {/* HERO */}
    <section className="hero-grid" style={{minHeight:"100vh",display:"flex",alignItems:"center",padding:"120px 48px 80px",position:"relative",overflow:"hidden",borderBottom:`0.5px solid ${C.brd}`}}>
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
          <Btn v="ghost" onClick={()=>go("platform")}>Try Portfolio Simulator</Btn>
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
          <AssetCard asset={ASSETS[0]} prices={prices} delay={200} anim="floatA"/>
          <AssetCard asset={ASSETS[3]} prices={prices} delay={500} anim="floatB"/>
        </div>
        <div style={{display:"flex",gap:14,justifyContent:"flex-end",marginLeft:44}}>
          <AssetCard asset={ASSETS[1]} prices={prices} delay={350} anim="floatB"/>
          <AssetCard asset={ASSETS[2]} prices={prices} delay={650} anim="floatA"/>
        </div>
      </div>
    </section>
    {/* STATS */}
    <section style={{background:C.bg1,borderBottom:`0.5px solid ${C.brd}`,padding:"56px 48px",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1}}>
      {[{v:160,s:"T+",p:"₦",l:"NGX Market Capitalisation"},{v:167,s:"+",p:"",l:"NGX Listed Companies"},{v:10,s:"M",p:"₦",l:"DotVests Share Capital"},{v:6,s:"M+",p:"",l:"PiggyVest Users — Stage 1"}].map((s,i)=>(
        <div key={i} style={{textAlign:"center",padding:"0 20px",borderRight:i<3?`0.5px solid ${C.brd}`:"none"}}><Stat value={s.v} suffix={s.s} prefix={s.p} label={s.l}/></div>
      ))}
    </section>
    {/* PILLARS */}
    <section style={{padding:"90px 48px",borderBottom:`0.5px solid ${C.brd}`}}>
      <div style={{textAlign:"center",marginBottom:56}}>
        <Tag>Platform Architecture</Tag>
        <h2 style={{fontFamily:FS,fontSize:40,fontWeight:400,color:C.white,letterSpacing:"-0.02em"}}>One Platform. Three Functions.</h2>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1,background:C.brd}}>
        {pillars.map(p=><PillarCard key={p.n} {...p} onClick={()=>go(p.cta)}/>)}
      </div>
    </section>
    {/* LIVE TABLE */}
    <section style={{padding:"90px 48px",borderBottom:`0.5px solid ${C.brd}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:32}}>
        <div><Tag gold>Live Asset Feed</Tag><h2 style={{fontFamily:FS,fontSize:36,fontWeight:400,color:C.white,letterSpacing:"-0.02em"}}>Tokenized Asset Pipeline</h2></div>
        <Btn v="og" onClick={()=>go("markets")}>View All →</Btn>
      </div>
      <div style={{border:`0.5px solid ${C.brd}`,borderRadius:6,overflow:"hidden"}}>
        <div style={{display:"grid",gridTemplateColumns:"44px 1fr 1fr 120px 120px 90px",padding:"10px 22px",background:C.bg2,borderBottom:`0.5px solid ${C.brd}`,fontSize:10.5,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase"}}>
          <span>#</span><span>Asset</span><span>Sector</span><span style={{textAlign:"right"}}>Price</span><span style={{textAlign:"right"}}>24h</span><span style={{textAlign:"right"}}>Stage</span>
        </div>
        {ASSETS.map((a,i)=><TableRow key={a.id} asset={a} idx={i} prices={prices}/>)}
      </div>
      <p style={{fontSize:11,color:C.dim,marginTop:8,textAlign:"right"}}>* Simulated prices. No investment services offered.</p>
    </section>
    {/* PLATFORM CTA */}
    <section style={{padding:"0 48px 90px",borderBottom:`0.5px solid ${C.brd}`}}>
      <div style={{background:`linear-gradient(135deg,${C.bg2},rgba(201,150,12,0.04))`,border:`0.5px solid ${C.goldBrd}`,borderRadius:8,padding:"64px 56px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,right:0,width:200,height:200,background:`radial-gradient(circle at top right,${C.goldDim},transparent)`,pointerEvents:"none"}}/>
        <div>
          <Tag gold>New Feature</Tag>
          <h2 style={{fontFamily:FS,fontSize:36,fontWeight:400,color:C.white,lineHeight:1.2,marginBottom:18}}>How the Platform<br/><em style={{color:C.goldLt}}>Works.</em></h2>
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
        <h2 style={{fontFamily:FS,fontSize:40,fontWeight:400,color:C.white,letterSpacing:"-0.02em",marginBottom:14}}>Be First In Line.</h2>
        <p style={{fontSize:15,color:C.muted,lineHeight:1.8,marginBottom:36}}>Join the waitlist. Get priority access, insider updates, and be first to invest when we launch post-ARIP approval.</p>
        <WaitlistBar/>
      </div>
    </section>
    <Footer go={go}/>
  </div>;
}


// ── ANIMATION: COINS ON BLOCKCHAIN (Tokenize page) ───────────────────────────
function CoinsOnBlocks() {
  const ref = useRef();
  useEffect(() => {
    const cv = ref.current; if(!cv) return;
    const cx = cv.getContext('2d');
    cv.width = cv.offsetWidth; cv.height = cv.offsetHeight;
    const W = cv.width, H = cv.height;
    const BW=52,BH=28,BD=16,COLS=8,ROWS=3;
    const platX=W/2-(COLS*BW*0.52), platY=H*0.78;
    function bPos(c,r){return{x:platX+c*BW+r*(BW*0.22),y:platY-r*BD};}
    const blocks=[];
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS-r;c++) blocks.push({c,r,lit:false,ltk:0,hash:(Math.random()*0xfffff|0).toString(16).padStart(5,'0')});
    function drawBlock(b){
      const{x,y}=bPos(b.c,b.r);const f=b.lit?Math.max(0,1-b.ltk/55):0;
      cx.beginPath();cx.moveTo(x+BW/2,y-BD);cx.lineTo(x+BW,y);cx.lineTo(x+BW/2,y+BH/2);cx.lineTo(x,y);cx.closePath();
      cx.fillStyle=b.lit?`rgba(232,177,33,${0.12+0.3*f})`:'rgba(201,150,12,0.1)';cx.fill();
      cx.strokeStyle=`rgba(201,150,12,${0.3+0.45*f})`;cx.lineWidth=0.5;cx.stroke();
      cx.fillStyle=`rgba(201,150,12,${0.18+0.28*f})`;cx.font='500 6px monospace';cx.textAlign='center';cx.fillText('0x'+b.hash,x+BW/2,y+3);
      cx.beginPath();cx.moveTo(x,y);cx.lineTo(x+BW/2,y+BH/2);cx.lineTo(x+BW/2,y+BH/2+BD);cx.lineTo(x,y+BD);cx.closePath();
      cx.fillStyle=b.lit?`rgba(90,60,0,${0.55+0.3*f})`:'rgba(25,16,0,0.75)';cx.fill();cx.strokeStyle=`rgba(201,150,12,${0.18+0.28*f})`;cx.stroke();
      cx.beginPath();cx.moveTo(x+BW,y);cx.lineTo(x+BW/2,y+BH/2);cx.lineTo(x+BW/2,y+BH/2+BD);cx.lineTo(x+BW,y+BD);cx.closePath();
      cx.fillStyle=b.lit?`rgba(60,40,0,${0.45+0.3*f})`:'rgba(15,10,0,0.75)';cx.fill();cx.strokeStyle=`rgba(201,150,12,${0.12+0.22*f})`;cx.stroke();
    }
    const SYMS=['₦','₦','₦','$','€'],TOTAL=22;
    let coins=[],phase='wait',ptk=0;
    function buildCoins(){
      coins=[];blocks.forEach(b=>{b.lit=false;b.ltk=0;});
      for(let i=0;i<TOTAL;i++){
        const r=Math.floor(Math.random()*ROWS),col=Math.floor(Math.random()*(COLS-r));
        const{x,y}=bPos(col,r);const lx=x+BW/2+(Math.random()-0.5)*18,ly=y-BD-6;
        coins.push({x:lx+(Math.random()-0.5)*55,y:-15-Math.random()*120,lx,ly,vy:2.2+Math.random()*1.8,r:8+Math.random()*4,sym:SYMS[Math.floor(Math.random()*SYMS.length)],spin:Math.random()*Math.PI*2,landed:false,bounce:0,bv:0,op:1,delay:Math.random()*14|0,active:false,tb:blocks.find(b=>b.c===col&&b.r===r)||blocks[0]});
      }
    }
    buildCoins();
    const sparks=[],rings=[];
    function spawnImpact(x,y){for(let i=0;i<7;i++){const a=Math.random()*Math.PI*2;sparks.push({x,y,vx:Math.cos(a)*(1.5+Math.random()*2),vy:Math.sin(a)*(1.5+Math.random()*2)-0.5,life:1});}rings.push({x,y,r:4,op:0.9});}
    function update(){
      ptk++;
      if(phase==='wait'&&ptk>50){phase='fall';ptk=0;coins.forEach(c=>c.active=true);}
      if(phase==='fall'){let all=true;coins.forEach(c=>{if(!c.active||c.delay-->0)return;if(c.landed){c.bounce+=c.bv;c.bv*=0.68;if(Math.abs(c.bv)<0.08)c.bv=0;return;}all=false;c.y+=c.vy;c.vy+=0.11;c.spin+=0.045;if(c.y>=c.ly){c.y=c.ly;c.landed=true;c.bv=-(c.vy*0.25);if(c.tb){c.tb.lit=true;c.tb.ltk=0;}spawnImpact(c.lx,c.ly);}});if(all&&ptk>70){phase='settle';ptk=0;}}
      if(phase==='settle'){coins.forEach(c=>{c.op-=0.022;});if(coins[0]&&coins[0].op<=0){phase='wait';ptk=0;buildCoins();}}
      blocks.forEach(b=>{if(b.lit){b.ltk++;if(b.ltk>65){b.lit=false;b.ltk=0;}}});
      for(let i=sparks.length-1;i>=0;i--){const s=sparks[i];s.x+=s.vx;s.y+=s.vy;s.vy+=0.07;s.life-=0.05;if(s.life<=0)sparks.splice(i,1);}
      for(let i=rings.length-1;i>=0;i--){const r=rings[i];r.r+=1.4;r.op-=0.028;if(r.op<=0)rings.splice(i,1);}
    }
    function drawCoin(c){
      if(!c.active)return;cx.save();cx.globalAlpha=Math.max(0,c.op);cx.translate(c.x,c.y+c.bounce);cx.rotate(c.spin);
      cx.beginPath();cx.arc(0,0,c.r,0,Math.PI*2);
      const g=cx.createRadialGradient(-c.r*.3,-c.r*.3,0,0,0,c.r);g.addColorStop(0,'#F5D060');g.addColorStop(.5,'#C9960C');g.addColorStop(1,'#6B4800');
      cx.fillStyle=g;cx.fill();cx.strokeStyle='#E8B121';cx.lineWidth=0.8;cx.stroke();
      cx.fillStyle='rgba(0,0,0,0.45)';cx.font=`bold ${Math.round(c.r*.9)}px sans-serif`;cx.textAlign='center';cx.textBaseline='middle';cx.fillText(c.sym,0,0);cx.restore();
    }
    function render(){
      cx.clearRect(0,0,W,H);
      cx.strokeStyle='rgba(201,150,12,0.03)';cx.lineWidth=0.5;
      for(let x=0;x<W;x+=52){cx.beginPath();cx.moveTo(x,0);cx.lineTo(x,H);cx.stroke();}
      for(let y=0;y<H;y+=52){cx.beginPath();cx.moveTo(0,y);cx.lineTo(W,y);cx.stroke();}
      const tg=cx.createRadialGradient(W/2,0,0,W/2,0,W*0.5);tg.addColorStop(0,'rgba(201,150,12,0.06)');tg.addColorStop(1,'rgba(0,0,0,0)');cx.fillStyle=tg;cx.fillRect(0,0,W,H);
      for(let r=ROWS-1;r>=0;r--) for(let col=0;col<COLS-r;col++){const b=blocks.find(b=>b.c===col&&b.r===r);if(b)drawBlock(b);}
      rings.forEach(r=>{cx.beginPath();cx.arc(r.x,r.y,r.r,0,Math.PI*2);cx.strokeStyle=`rgba(232,177,33,${r.op})`;cx.lineWidth=0.8;cx.stroke();});
      sparks.forEach(s=>{cx.beginPath();cx.arc(s.x,s.y,1.8,0,Math.PI*2);cx.fillStyle=`rgba(232,177,33,${s.life})`;cx.fill();});
      coins.filter(c=>c.landed).forEach(drawCoin);coins.filter(c=>!c.landed).forEach(drawCoin);
      cx.fillStyle='rgba(201,150,12,0.25)';cx.font='400 10px sans-serif';cx.textAlign='center';cx.fillText('Polymesh Blockchain · Compliance-Native Tokenization',W/2,H-10);
    }
    let raf;function loop(){update();render();raf=requestAnimationFrame(loop);}loop();
    return()=>cancelAnimationFrame(raf);
  },[]);
  return <canvas ref={ref} style={{width:"100%",height:260,display:"block",borderRadius:6,background:"#070707",marginBottom:48}}/>;
}

// ── ANIMATION: REGULATORY PIPELINE (Compliance page) ─────────────────────────
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
function LiveMarketChart() {
  const ref = useRef();
  useEffect(() => {
    const cv = ref.current; if(!cv) return;
    const cx = cv.getContext('2d');
    cv.width = cv.offsetWidth; cv.height = cv.offsetHeight;
    const W=cv.width,H=cv.height;
    const AS=[{id:'PGV',color:'#22C55E'},{id:'CHW',color:'#EF4444'},{id:'ERF',color:'#60A5FA'},{id:'CBN',color:'#A78BFA'},{id:'GTB',color:'#E8B121'},{id:'MTN',color:'#F97316'}];
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
    const R=80,HC=46,HP=80,N=8;
    function makeVerts(){const v=[];v.push([0,-HC-14,0]);for(let i=0;i<N;i++){const a=(i/N)*Math.PI*2-Math.PI/N;v.push([Math.cos(a)*R*0.44,-HC,Math.sin(a)*R*0.44]);}for(let i=0;i<N;i++){const a=(i/N)*Math.PI*2;v.push([Math.cos(a)*R,0,Math.sin(a)*R]);}for(let i=0;i<N;i++){const a=(i/N)*Math.PI*2+Math.PI/N;v.push([Math.cos(a)*R*0.9,-3,Math.sin(a)*R*0.9]);}v.push([0,HP,0]);return v;}
    const BASE=makeVerts();
    function makeFaces(){const f=[];for(let i=0;i<N;i++){const ni=(i+1)%N;f.push({v:[0,1+i,1+ni],t:'ct'});}for(let i=0;i<N;i++){const ni=(i+1)%N;f.push({v:[1+i,9+i,1+ni],t:'cm'});f.push({v:[9+i,9+ni,1+ni],t:'cl'});}for(let i=0;i<N;i++){const ni=(i+1)%N;f.push({v:[9+i,17+i,9+ni],t:'g'});f.push({v:[17+i,17+ni,9+ni],t:'g'});}for(let i=0;i<N;i++){const ni=(i+1)%N;f.push({v:[9+i,25,9+ni],t:'pm'});f.push({v:[17+i,25,17+ni],t:'pi'});}return f;}
    const FACES=makeFaces();
    let rX=0.1,rY=0,rZ=0,vX=0.006,vY=0.018,vZ=0.004,ct=0;
    function rot(v,ax,ay,az){let[x,y,z]=v;let ny=y*Math.cos(ax)-z*Math.sin(ax),nz=y*Math.sin(ax)+z*Math.cos(ax);y=ny;z=nz;let nx2=x*Math.cos(ay)+z*Math.sin(ay),nz2=-x*Math.sin(ay)+z*Math.cos(ay);x=nx2;z=nz2;let nx3=x*Math.cos(az)-y*Math.sin(az),ny3=x*Math.sin(az)+y*Math.cos(az);return[nx3,ny3,z];}
    const FOCAL=400;
    function project(v){const[x,y,z]=v;const s=FOCAL/(FOCAL+z+160);return[CX+x*s,CY+y*s,z,s];}
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
  return <canvas ref={ref} style={{width:"100%",height:280,display:"block",borderRadius:6,background:"#070707"}}/>;
}

// ── MARKETS ───────────────────────────────────────────────────────────────────
function Markets({go,prices}){
  const [filter,setFilter]=useState("all");
  const filtered=filter==="all"?ASSETS:ASSETS.filter(a=>filter==="Stage 1"?a.stage===1:a.stage===3);
  return <div style={{padding:"110px 48px 80px"}}>
    <Tag gold>Asset Marketplace</Tag>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:44}}>
      <h1 style={{fontFamily:FS,fontSize:"clamp(40px,5vw,66px)",fontWeight:400,color:C.white,lineHeight:1.1,letterSpacing:"-0.025em"}}>
        Tokenized<br/><em style={{color:C.goldLt}}>Nigerian Equity.</em>
      </h1>
      <div style={{display:"flex",gap:8}}>
        {["all","Stage 1","Stage 3"].map(s=><FilterBtn key={s} label={s==="all"?"All Assets":s} active={filter===s} onClick={()=>setFilter(s)}/>)}
      </div>
    </div>
    <LiveMarketChart/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:1,background:C.brd,marginBottom:48}}>
      {filtered.map(a=><MarketCard key={a.id} asset={a} prices={prices}/>)}
    </div>
    <div style={{background:C.bg1,border:`0.5px solid ${C.brd}`,borderRadius:4,padding:"18px 24px",fontSize:12.5,color:C.muted,lineHeight:1.8,marginBottom:60}}>
      <strong style={{color:C.goldLt}}>Pre-Launch Notice: </strong>DotVests is pre-launch pending SEC Nigeria ARIP approval. All prices are simulated. No investment services offered. Stage 3 assets available only post full regulatory approval.
    </div>
    <div style={{display:"flex",justifyContent:"center",padding:"20px 0 40px"}}>
      <div style={{width:"min(400px,100%)",aspectRatio:"4/3"}}><RotatingDiamond/></div>
    </div>
    <div style={{maxWidth:540,margin:"0 auto",textAlign:"center",marginBottom:80}}>
      <Tag>Early Access</Tag>
      <h2 style={{fontFamily:FS,fontSize:32,fontWeight:400,color:C.white,letterSpacing:"-0.02em",marginBottom:14}}>Join the Waitlist</h2>
      <p style={{fontSize:14,color:C.muted,lineHeight:1.8,marginBottom:28}}>Be first to access tokenized Nigerian equity post-ARIP approval.</p>
      <WaitlistBar/>
    </div>
    <Footer go={go}/>
  </div>;
}


// ── TOKENIZE ──────────────────────────────────────────────────────────────────
function Tokenize({go}){
  return <div style={{padding:"110px 48px 80px"}}>
    <Tag>How Tokenization Works</Tag>
    <h1 style={{fontFamily:FS,fontSize:"clamp(40px,5vw,66px)",fontWeight:400,color:C.white,lineHeight:1.1,letterSpacing:"-0.025em",marginBottom:18,maxWidth:680}}>
      Every Share,<br/><em style={{color:C.goldLt}}>On Polymesh.</em>
    </h1>
    <CoinsOnBlocks/>
    <p style={{fontSize:16,color:C.muted,fontWeight:300,maxWidth:500,lineHeight:1.85,marginBottom:40}}>Polymesh is purpose-built for regulated securities. Compliance isn't optional — it's enforced at the chain level before any token moves.</p>
    <div style={{background:C.bg1,border:`0.5px solid ${C.goldBrd}`,borderRadius:6,padding:"48px 48px",marginBottom:52,display:"grid",gridTemplateColumns:"1fr 1fr",gap:64}}>
      <div>
        <div style={{fontSize:11,color:C.gold,letterSpacing:"0.1em",marginBottom:14}}>THE BLOCKCHAIN LAYER</div>
        <h2 style={{fontFamily:FS,fontSize:30,fontWeight:400,color:C.white,marginBottom:14}}>Why Polymesh Wins for Securities</h2>
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
      <div key={i} style={{display:"grid",gridTemplateColumns:"64px 1fr",gap:36,padding:"36px 0",borderTop:`0.5px solid ${C.brd}`}}>
        <div style={{fontSize:11,color:C.gold,letterSpacing:"0.1em",paddingTop:3}}>{n}</div>
        <div><h3 style={{fontFamily:FS,fontSize:22,fontWeight:400,color:C.white,marginBottom:10}}>{t}</h3><p style={{fontSize:13.5,color:C.muted,lineHeight:1.85,maxWidth:560}}>{b}</p></div>
      </div>
    ))}
    <div style={{marginTop:72}}><Footer go={go}/></div>
  </div>;
}

// ── COMPLIANCE ────────────────────────────────────────────────────────────────
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
  return <div style={{padding:"110px 48px 80px"}}>
    <Tag gold>Regulatory Architecture</Tag>
    <h1 style={{fontFamily:FS,fontSize:"clamp(40px,5vw,66px)",fontWeight:400,color:C.white,lineHeight:1.1,letterSpacing:"-0.025em",marginBottom:18,maxWidth:680}}>
      Compliance is<br/><em style={{color:C.goldLt}}>The Architecture.</em>
    </h1>
    <RegulatoryPipeline/>
    <p style={{fontSize:16,color:C.muted,fontWeight:300,maxWidth:500,lineHeight:1.85,marginBottom:40}}>Not bolted on after the fact. Every infrastructure decision at DotVests traces directly to a regulatory requirement.</p>
    <div style={{marginBottom:72}}>
      <div style={{fontSize:11,color:C.muted,letterSpacing:"0.08em",marginBottom:24,textTransform:"uppercase"}}>Four-Stage Regulatory Roadmap</div>
      {roadmap.map((r,i)=>(
        <div key={i} style={{display:"grid",gridTemplateColumns:"160px 1fr",gap:36,padding:"40px 0",borderTop:`0.5px solid ${r.active?C.goldBrd:C.brd}`,opacity:r.active?1:0.5}}>
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
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1,background:C.brd}}>
      {regs.map((f,i)=>(
        <div key={i} style={{background:C.bg1,padding:"32px 28px"}}>
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
function Company({go}){
  return <div style={{padding:"110px 48px 80px"}}>
    <Tag>About DotVests</Tag>
    <h1 style={{fontFamily:FS,fontSize:"clamp(40px,5vw,66px)",fontWeight:400,color:C.white,lineHeight:1.1,letterSpacing:"-0.025em",marginBottom:18,maxWidth:680}}>
      The Infrastructure for<br/><em style={{color:C.goldLt}}>African Capital Markets.</em>
    </h1>
    <CoinsOnBlocks/>
    <p style={{fontSize:16,color:C.muted,fontWeight:300,maxWidth:500,lineHeight:1.85,marginBottom:40}}>DotVests Technologies Limited. CAC registered. Founded 2024. Bankers and blockchain engineers who understand the opportunity and the regulatory landscape.</p>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:72,marginBottom:72}}>
      <div>
        <div style={{width:32,height:1,background:C.gold,marginBottom:22}}/>
        <h2 style={{fontFamily:FS,fontSize:28,fontWeight:400,color:C.white,marginBottom:18}}>Mission</h2>
        <p style={{fontSize:14.5,color:C.muted,lineHeight:1.95}}>Democratize access to African wealth. Make Nigerian company equity investable by anyone, anywhere, at any size — without geography restrictions, broker minimums, or settlement delays.</p>
      </div>
      <div>
        <div style={{width:32,height:1,background:C.gold,marginBottom:22}}/>
        <h2 style={{fontFamily:FS,fontSize:28,fontWeight:400,color:C.white,marginBottom:18}}>Fundamentals</h2>
        {[["Incorporated","2024"],["Registration","CAC — DotVests Technologies Limited"],["Share Capital","₦10,000,000"],["Headquarters","Uyo, Akwa Ibom State, Nigeria"],["Blockchain","Polymesh (Substrate — TypeScript SDK)"],["Payment Rails","Paystack (NGN) · Breet (Crypto)"],["Reg. Path","SEC Nigeria ARIP Sandbox"]].map(([k,v])=>(
          <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:`0.5px solid ${C.brd}`}}>
            <span style={{fontSize:13,color:C.muted}}>{k}</span><span style={{fontSize:13,color:C.white}}>{v}</span>
          </div>
        ))}
      </div>
    </div>
    <div style={{background:C.bg1,border:`0.5px solid ${C.brd}`,borderRadius:6,padding:"44px 44px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:52}}>
      <div>
        <div style={{fontSize:11,color:C.gold,letterSpacing:"0.1em",marginBottom:18}}>CONTACT</div>
        <h3 style={{fontFamily:FS,fontSize:28,fontWeight:400,color:C.white,marginBottom:14}}>Get in Touch</h3>
        <p style={{fontSize:13.5,color:C.muted,lineHeight:1.8}}>Partnership inquiries, investor relations, regulatory correspondence, or press.</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:0}}>
        {[["General","info@dotvests.com"],["Support","support@dotvests.com"],["Address","No. 23 Effiong Essien Street, Off Aka Road, Uyo, Akwa Ibom State"],["Phone","+234 906 681 8379"]].map(([k,v])=>(
          <div key={k} style={{padding:"16px 0",borderBottom:`0.5px solid ${C.brd}`}}>
            <div style={{fontSize:10,color:C.muted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:5}}>{k}</div>
            <div style={{fontSize:13.5,color:C.white}}>{v}</div>
          </div>
        ))}
      </div>
    </div>
    <div style={{marginTop:60}}><Footer go={go}/></div>
  </div>;
}


// ── ANIMATION: MOBILE PLATFORM DEMO (Platform page) ──────────────────────────
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
    <div style={{padding:"130px 52px 80px"}}>
      {/* HERO */}
      <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:48,alignItems:"center",marginBottom:80}}>
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
      <div style={{marginBottom:80}}>
        <div style={{fontSize:11.5,color:C.muted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:32}}>
          Get Started in Four Steps
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,background:C.brd}}>
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
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:C.brd,marginBottom:80}}>
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
        padding:"52px 52px",marginBottom:80,
        display:"grid",gridTemplateColumns:"1fr 1fr",gap:72}}>
        <div>
          <div style={{fontSize:11,color:C.gold,letterSpacing:"0.1em",marginBottom:16}}>BLOCKCHAIN INFRASTRUCTURE</div>
          <h2 style={{fontFamily:FS,fontSize:32,fontWeight:400,color:C.white,marginBottom:16,lineHeight:1.2}}>
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
        <h2 style={{fontFamily:FS,fontSize:40,fontWeight:400,color:C.white,
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

// ── ADMIN PAGE ────────────────────────────────────────────────────────────────
const ADMIN_PASS = "dotvests2026";

function AdminLogin({ onLogin }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const attempt = () => {
    if (pw === ADMIN_PASS) { onLogin(); setErr(false); }
    else { setErr(true); setTimeout(() => setErr(false), 2000); }
  };
  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:C.bg}}>
      <div style={{background:C.bg1,border:`0.5px solid ${err?C.red:C.goldBrd}`,borderRadius:8,padding:"52px 48px",width:380,textAlign:"center",transition:"border 0.3s"}}>
        <DotVestsLogo height={44}/>
        <div style={{fontFamily:FS,fontSize:26,fontWeight:400,color:C.white,marginBottom:6}}>Admin Portal</div>
        <div style={{fontSize:12,color:C.muted,marginBottom:32}}>DotVests Technologies Limited</div>
        <input type="password" placeholder="Enter admin password" value={pw}
          onChange={e=>setPw(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&attempt()}
          style={{width:"100%",background:C.bg2,border:`0.5px solid ${err?C.red:C.brd2}`,color:C.white,
            fontSize:14,padding:"12px 16px",borderRadius:3,outline:"none",marginBottom:14,
            fontFamily:FN,textAlign:"center",letterSpacing:"0.1em"}}/>
        {err && <div style={{fontSize:12,color:C.red,marginBottom:10}}>Incorrect password</div>}
        <button onClick={attempt} style={{width:"100%",background:C.gold,border:"none",color:"#000",
          fontFamily:FN,fontSize:13,fontWeight:600,padding:"12px",borderRadius:3,cursor:"pointer",
          letterSpacing:"0.05em"}}>Access Dashboard</button>
        <div style={{fontSize:11,color:C.dim,marginTop:20}}>Authorised personnel only</div>
      </div>
    </div>
  );
}

function AdminStat({ label, value, sub, color }) {
  return (
    <div style={{background:C.bg2,border:`0.5px solid ${C.brd}`,borderRadius:6,padding:"24px 28px"}}>
      <div style={{fontSize:11,color:C.muted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10}}>{label}</div>
      <div style={{fontFamily:FS,fontSize:40,fontWeight:400,color:color||C.white,letterSpacing:"-0.02em",lineHeight:1}}>{value}</div>
      {sub && <div style={{fontSize:12,color:C.muted,marginTop:6}}>{sub}</div>}
    </div>
  );
}


function AdminPage({ go, prices }) {
  const [auth, setAuth] = useState(false);
  const [tab, setTab] = useState("overview");
  const [waitlist, setWaitlist] = useState([
    {id:1, email:"ade@gmail.com",      date:"2026-05-01", source:"Home",    status:"Active"},
    {id:2, email:"chidi@outlook.com",  date:"2026-05-03", source:"Markets", status:"Active"},
    {id:3, email:"fatima@yahoo.com",   date:"2026-05-05", source:"Markets", status:"Active"},
    {id:4, email:"emeka@gmail.com",    date:"2026-05-07", source:"Home",    status:"Active"},
    {id:5, email:"ngozi@proton.me",    date:"2026-05-09", source:"Home",    status:"Active"},
  ]);
  const [assets, setAssets] = useState([...ASSETS]);
  const [editAsset, setEditAsset] = useState(null);
  const [newEmail, setNewEmail] = useState("");
  // Simulated analytics
  const analytics = {
    totalVisits: 1284, todayVisits: 47, avgTime: "3m 12s", topPage: "Markets",
    pageViews: [
      {page:"Home",       views:612, pct:48},
      {page:"Markets",    views:384, pct:30},
      {page:"Tokenize",   views:153, pct:12},
      {page:"Compliance", views:89,  pct:7},
      {page:"Company",    views:46,  pct:3},
    ],
    dailyVisits: [28,35,41,22,55,47,38,61,44,47],
    sources: [{s:"Direct",n:534},{s:"Twitter/X",n:312},{s:"LinkedIn",n:198},{s:"Google",n:154},{s:"Referral",n:86}],
  };

  const TABS = ["overview","waitlist","assets","analytics","settings"];

  const exportCSV = () => {
    const rows = ["Email,Date,Source,Status",...waitlist.map(w=>`${w.email},${w.date},${w.source},${w.status}`)];
    const blob = new Blob([rows.join("\n")], {type:"text/csv"});
    const a = document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="dotvests_waitlist.csv"; a.click();
  };

  const removeWaitlist = (id) => setWaitlist(w => w.filter(x => x.id !== id));
  const addWaitlist = () => {
    if (!newEmail || !newEmail.includes("@")) return;
    setWaitlist(w => [...w, {id:Date.now(), email:newEmail, date:new Date().toISOString().split("T")[0], source:"Admin", status:"Active"}]);
    setNewEmail("");
  };

  const saveAsset = (updated) => {
    setAssets(a => a.map(x => x.id === updated.id ? updated : x));
    setEditAsset(null);
  };

  if (!auth) return <AdminLogin onLogin={() => setAuth(true)}/>;

  return (
    <div style={{minHeight:"100vh", background:C.bg}}>
      {/* Admin Header */}
      <div style={{background:C.bg1, borderBottom:`0.5px solid ${C.goldBrd}`, padding:"0 52px",
        display:"flex", alignItems:"center", justifyContent:"space-between", height:52,
        position:"sticky", top:0, left:0, right:0, zIndex:100}}>
        <div style={{display:"flex", alignItems:"center", gap:32}}>
          <div style={{fontSize:11, color:C.goldLt, letterSpacing:"0.1em", textTransform:"uppercase", marginRight:16}}>
            Admin Dashboard
          </div>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              background:"none", border:"none", cursor:"pointer", fontFamily:FN,
              fontSize:12.5, color: tab===t ? C.white : C.muted,
              borderBottom: tab===t ? `1px solid ${C.gold}` : "1px solid transparent",
              padding:"4px 0", letterSpacing:"0.04em", textTransform:"capitalize",
              transition:"all 0.2s",
            }}>{t}</button>
          ))}
        </div>
        <div style={{display:"flex", alignItems:"center", gap:16}}>
          <div style={{fontSize:12, color:C.muted}}>
            <span style={{color:C.green}}>●</span> Live
          </div>
          <button onClick={() => go("home")} style={{
            background:"none", border:`0.5px solid ${C.brd}`, color:C.muted,
            fontFamily:FN, fontSize:12, padding:"5px 14px", borderRadius:3, cursor:"pointer",
          }}>← Exit Admin</button>
          <button onClick={() => setAuth(false)} style={{
            background:"none", border:`0.5px solid ${C.brd}`, color:C.muted,
            fontFamily:FN, fontSize:12, padding:"5px 14px", borderRadius:3, cursor:"pointer",
          }}>Log Out</button>
        </div>
      </div>

      <div style={{padding:"32px 52px 80px"}}>

        {/* ── OVERVIEW TAB ── */}
        {tab === "overview" && (
          <div>
            <div style={{marginBottom:40}}>
              <div style={{fontFamily:FS, fontSize:36, fontWeight:400, color:C.white, marginBottom:6}}>
                Good {new Date().getHours()<12?"morning":new Date().getHours()<17?"afternoon":"evening"}, Precious.
              </div>
              <div style={{fontSize:14, color:C.muted}}>Here's what's happening with DotVests today.</div>
            </div>

            <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:40}}>
              <AdminStat label="Waitlist Signups" value={waitlist.length} sub="Total registered" color={C.goldLt}/>
              <AdminStat label="Today's Visits" value={analytics.todayVisits} sub="Unique sessions" color={C.green}/>
              <AdminStat label="Total Visits" value={analytics.totalVisits.toLocaleString()} sub="All time"/>
              <AdminStat label="Avg. Session" value={analytics.avgTime} sub="Time on site"/>
            </div>

            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:40}}>
              {/* Recent waitlist */}
              <div style={{background:C.bg1, border:`0.5px solid ${C.brd}`, borderRadius:6, padding:"28px 28px"}}>
                <div style={{fontSize:11, color:C.muted, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:18}}>Recent Signups</div>
                {waitlist.slice(-4).reverse().map(w => (
                  <div key={w.id} style={{display:"flex", justifyContent:"space-between", alignItems:"center",
                    padding:"10px 0", borderBottom:`0.5px solid ${C.brd}`}}>
                    <span style={{fontSize:13, color:C.white}}>{w.email}</span>
                    <span style={{fontSize:11, color:C.muted}}>{w.date}</span>
                  </div>
                ))}
                <button onClick={() => setTab("waitlist")} style={{marginTop:16, background:"none", border:"none",
                  color:C.goldLt, fontSize:12, cursor:"pointer", fontFamily:FN}}>View all →</button>
              </div>

              {/* Top pages */}
              <div style={{background:C.bg1, border:`0.5px solid ${C.brd}`, borderRadius:6, padding:"28px 28px"}}>
                <div style={{fontSize:11, color:C.muted, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:18}}>Page Performance</div>
                {analytics.pageViews.map(p => (
                  <div key={p.page} style={{marginBottom:14}}>
                    <div style={{display:"flex", justifyContent:"space-between", marginBottom:6}}>
                      <span style={{fontSize:13, color:C.white}}>{p.page}</span>
                      <span style={{fontSize:12, color:C.muted}}>{p.views} views</span>
                    </div>
                    <div style={{height:3, background:C.bg3, borderRadius:2}}>
                      <div style={{height:"100%", width:`${p.pct}%`, background:C.gold, borderRadius:2}}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Asset prices overview */}
            <div style={{background:C.bg1, border:`0.5px solid ${C.brd}`, borderRadius:6, padding:"28px 28px"}}>
              <div style={{fontSize:11, color:C.muted, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:18}}>Live Asset Prices</div>
              <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12}}>
                {ASSETS.map(a => {
                  const p = prices[a.id]; const up = p.chg >= 0;
                  return (
                    <div key={a.id} style={{background:C.bg2, border:`0.5px solid ${C.brd}`, borderRadius:4, padding:"14px 16px"}}>
                      <div style={{fontSize:11, color:C.muted, marginBottom:4}}>{a.id} · {a.sector}</div>
                      <div style={{fontSize:17, fontWeight:600, color:C.white}}>₦{Math.round(p.price).toLocaleString()}</div>
                      <div style={{fontSize:11, color:up?C.green:C.red, marginTop:2}}>{up?"+":""}{p.chg.toFixed(2)}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── WAITLIST TAB ── */}
        {tab === "waitlist" && (
          <div>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:32}}>
              <div>
                <div style={{fontFamily:FS, fontSize:32, fontWeight:400, color:C.white, marginBottom:4}}>Waitlist</div>
                <div style={{fontSize:13, color:C.muted}}>{waitlist.length} total signups</div>
              </div>
              <div style={{display:"flex", gap:10}}>
                <button onClick={exportCSV} style={{background:"none", border:`0.5px solid ${C.brd}`,
                  color:C.muted, fontFamily:FN, fontSize:12.5, padding:"9px 18px", borderRadius:3, cursor:"pointer"}}>
                  Export CSV ↓
                </button>
              </div>
            </div>

            {/* Add email manually */}
            <div style={{display:"flex", gap:10, marginBottom:28}}>
              <input type="email" placeholder="Add email manually..." value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                onKeyDown={e => e.key==="Enter" && addWaitlist()}
                style={{flex:1, background:C.bg2, border:`0.5px solid ${C.brd2}`, color:C.white,
                  fontSize:13, padding:"10px 16px", borderRadius:3, outline:"none", fontFamily:FN}}/>
              <button onClick={addWaitlist} style={{background:C.gold, border:"none", color:"#000",
                fontFamily:FN, fontSize:12.5, fontWeight:600, padding:"10px 20px", borderRadius:3, cursor:"pointer"}}>Add</button>
            </div>

            <div style={{border:`0.5px solid ${C.brd}`, borderRadius:6, overflow:"hidden"}}>
              <div style={{display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 80px",
                padding:"10px 24px", background:C.bg2, borderBottom:`0.5px solid ${C.brd}`,
                fontSize:10.5, color:C.muted, letterSpacing:"0.1em", textTransform:"uppercase"}}>
                <span>Email</span><span>Date</span><span>Source</span><span>Status</span><span></span>
              </div>
              {waitlist.map((w, i) => (
                <div key={w.id} style={{display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 80px",
                  padding:"14px 24px", borderBottom:i<waitlist.length-1?`0.5px solid ${C.brd}`:"none",
                  alignItems:"center", background:"transparent"}}>
                  <span style={{fontSize:13.5, color:C.white}}>{w.email}</span>
                  <span style={{fontSize:12, color:C.muted}}>{w.date}</span>
                  <span style={{fontSize:12, color:C.muted}}>{w.source}</span>
                  <span style={{fontSize:11, color:C.green, background:"rgba(34,197,94,0.1)",
                    padding:"2px 10px", borderRadius:20, display:"inline-block"}}>{w.status}</span>
                  <button onClick={() => removeWaitlist(w.id)} style={{background:"none",
                    border:`0.5px solid ${C.brd}`, color:C.red, fontFamily:FN,
                    fontSize:11, padding:"4px 10px", borderRadius:2, cursor:"pointer"}}>Remove</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ASSETS TAB ── */}
        {tab === "assets" && (
          <div>
            <div style={{fontFamily:FS, fontSize:32, fontWeight:400, color:C.white, marginBottom:4}}>Asset Management</div>
            <div style={{fontSize:13, color:C.muted, marginBottom:32}}>Edit tokenized asset details and stage classification</div>

            {editAsset ? (
              <div style={{background:C.bg1, border:`0.5px solid ${C.goldBrd}`, borderRadius:6, padding:"36px 36px", maxWidth:540}}>
                <div style={{fontSize:14, fontWeight:500, color:C.white, marginBottom:24}}>Editing: {editAsset.name}</div>
                {[["name","Asset Name"],["sector","Sector"],["price","Base Price (₦)"],["chg","24h Change (%)"]].map(([field,label]) => (
                  <div key={field} style={{marginBottom:18}}>
                    <div style={{fontSize:11, color:C.muted, letterSpacing:"0.06em", marginBottom:6, textTransform:"uppercase"}}>{label}</div>
                    <input type={field==="price"||field==="chg"?"number":"text"}
                      value={editAsset[field]}
                      onChange={e => setEditAsset(a => ({...a, [field]: field==="price"||field==="chg" ? parseFloat(e.target.value)||0 : e.target.value}))}
                      style={{width:"100%", background:C.bg2, border:`0.5px solid ${C.brd2}`, color:C.white,
                        fontSize:14, padding:"10px 14px", borderRadius:3, outline:"none", fontFamily:FN}}/>
                  </div>
                ))}
                <div style={{marginBottom:24}}>
                  <div style={{fontSize:11, color:C.muted, letterSpacing:"0.06em", marginBottom:6, textTransform:"uppercase"}}>Stage</div>
                  <div style={{display:"flex", gap:10}}>
                    {[1,3].map(s => (
                      <button key={s} onClick={() => setEditAsset(a => ({...a, stage:s}))}
                        style={{flex:1, padding:"10px", border:`0.5px solid ${editAsset.stage===s?C.gold:C.brd}`,
                          background: editAsset.stage===s ? C.goldDim : "none",
                          color: editAsset.stage===s ? C.goldLt : C.muted,
                          fontFamily:FN, fontSize:13, borderRadius:3, cursor:"pointer"}}>Stage {s}</button>
                    ))}
                  </div>
                </div>
                <div style={{marginBottom:24}}>
                  <div style={{fontSize:11, color:C.muted, letterSpacing:"0.06em", marginBottom:6, textTransform:"uppercase"}}>Asset Status</div>
                  <div style={{display:"flex", gap:10}}>
                    {[["Active","active",C.green],["Paused","paused",C.gold],["Frozen","frozen",C.red]].map(([label,val,col]) => (
                      <button key={val} onClick={() => setEditAsset(a => ({...a, status:val}))}
                        style={{flex:1, padding:"10px",
                          border:`0.5px solid ${(editAsset.status||"active")===val?col:C.brd}`,
                          background: (editAsset.status||"active")===val ? `${col}18` : "none",
                          color: (editAsset.status||"active")===val ? col : C.muted,
                          fontFamily:FN, fontSize:12.5, borderRadius:3, cursor:"pointer"}}>{label}</button>
                    ))}
                  </div>
                  <div style={{fontSize:11,color:C.dim,marginTop:8}}>Frozen assets are hidden from marketplace. Paused assets show but block purchases.</div>
                </div>
                <div style={{display:"flex", gap:10}}>
                  <button onClick={() => saveAsset(editAsset)} style={{flex:1, background:C.gold, border:"none",
                    color:"#000", fontFamily:FN, fontSize:13, fontWeight:600, padding:"11px", borderRadius:3, cursor:"pointer"}}>Save Changes</button>
                  <button onClick={() => setEditAsset(null)} style={{flex:1, background:"none",
                    border:`0.5px solid ${C.brd}`, color:C.muted, fontFamily:FN, fontSize:13, padding:"11px", borderRadius:3, cursor:"pointer"}}>Cancel</button>
                </div>
              </div>
            ) : (
              <div style={{border:`0.5px solid ${C.brd}`, borderRadius:6, overflow:"hidden"}}>
                <div style={{display:"grid", gridTemplateColumns:"60px 1fr 1fr 120px 100px 70px 1fr",
                  padding:"10px 24px", background:C.bg2, borderBottom:`0.5px solid ${C.brd}`,
                  fontSize:10.5, color:C.muted, letterSpacing:"0.1em", textTransform:"uppercase"}}>
                  <span>ID</span><span>Name</span><span>Sector</span><span style={{textAlign:"right"}}>Price</span>
                  <span style={{textAlign:"right"}}>24h %</span><span style={{textAlign:"center"}}>Stage</span><span></span>
                </div>
                {assets.map((a, i) => {
                  const p = prices[a.id]; const up = p.chg >= 0;
                  return (
                    <div key={a.id} style={{display:"grid", gridTemplateColumns:"60px 1fr 1fr 120px 100px 70px 1fr",
                      padding:"14px 24px", borderBottom:i<assets.length-1?`0.5px solid ${C.brd}`:"none", alignItems:"center"}}>
                      <span style={{fontSize:11, color:C.gold}}>{a.id}</span>
                      <span style={{fontSize:13.5, color:C.white, fontWeight:500}}>{a.name}</span>
                      <span style={{fontSize:12, color:C.muted}}>{a.sector}</span>
                      <span style={{fontSize:14, color:C.white, textAlign:"right", fontWeight:500}}>₦{Math.round(p.price).toLocaleString()}</span>
                      <span style={{textAlign:"right", fontSize:12, color:up?C.green:C.red}}>{up?"+":""}{p.chg.toFixed(2)}%</span>
                      <span style={{textAlign:"center"}}>
                        <span style={{fontSize:10, color:a.stage===1?C.goldLt:C.muted,
                          border:`0.5px solid ${a.stage===1?C.goldBrd:C.brd}`,
                          padding:"2px 8px", borderRadius:2}}>S{a.stage}</span>
                      </span>
                      <div style={{display:"flex",gap:6,alignItems:"center"}}>
                        <span style={{fontSize:10,padding:"2px 8px",borderRadius:20,
                          color: a.status==="frozen"?C.red:a.status==="paused"?C.gold:C.green,
                          background: a.status==="frozen"?"rgba(239,68,68,0.1)":a.status==="paused"?"rgba(201,150,12,0.1)":"rgba(34,197,94,0.08)",
                          border:`0.5px solid ${a.status==="frozen"?C.red:a.status==="paused"?C.goldBrd:"rgba(34,197,94,0.3)"}`,
                        }}>{a.status||"Active"}</span>
                        <button onClick={() => setEditAsset({...a})}
                          style={{background:"none", border:`0.5px solid ${C.brd}`, color:C.goldLt,
                            fontFamily:FN, fontSize:11.5, padding:"5px 12px", borderRadius:2, cursor:"pointer"}}>Edit</button>
                        <button onClick={() => setAssets(prev => prev.map(x => x.id===a.id?{...x,status:x.status==="frozen"?"active":"frozen"}:x))}
                          style={{background:"none", border:`0.5px solid ${a.status==="frozen"?C.red:C.brd}`,
                            color:a.status==="frozen"?C.red:C.muted,
                            fontFamily:FN, fontSize:11.5, padding:"5px 12px", borderRadius:2, cursor:"pointer"}}>
                          {a.status==="frozen"?"Unfreeze":"Freeze"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── ANALYTICS TAB ── */}
        {tab === "analytics" && (
          <div>
            <div style={{fontFamily:FS, fontSize:32, fontWeight:400, color:C.white, marginBottom:4}}>Analytics</div>
            <div style={{fontSize:13, color:C.muted, marginBottom:20}}>Live data powered by Google Analytics 4</div>
            <div style={{display:"flex",gap:12,marginBottom:32}}>
              <a href="https://analytics.google.com/analytics/web/#/p{G-RB7D67YTN8}/reports/intelligenthome"
                target="_blank" rel="noopener noreferrer"
                style={{background:C.gold,color:"#000",fontFamily:"'Sora',sans-serif",
                  fontSize:13,fontWeight:600,padding:"10px 22px",borderRadius:3,
                  textDecoration:"none",display:"inline-flex",alignItems:"center",gap:8}}>
                Open GA4 Dashboard →
              </a>
              <a href="https://analytics.google.com/analytics/web/#/p/G-RB7D67YTN8/reports/explorer"
                target="_blank" rel="noopener noreferrer"
                style={{background:"none",border:`0.5px solid ${C.brd2}`,color:C.muted,
                  fontFamily:"'Sora',sans-serif",fontSize:13,padding:"10px 22px",borderRadius:3,
                  textDecoration:"none",display:"inline-flex",alignItems:"center",gap:8}}>
                View Full Reports
              </a>
            </div>

            <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:32}}>
              <AdminStat label="Total Visits" value={analytics.totalVisits.toLocaleString()} sub="All time" color={C.goldLt}/>
              <AdminStat label="Today" value={analytics.todayVisits} sub="Sessions today" color={C.green}/>
              <AdminStat label="Avg Session" value={analytics.avgTime} sub="Time on site"/>
              <AdminStat label="Top Page" value={analytics.topPage} sub="Most visited"/>
            </div>

            {/* Daily visits bar chart */}
            <div style={{background:C.bg1, border:`0.5px solid ${C.brd}`, borderRadius:6, padding:"28px 28px", marginBottom:24}}>
              <div style={{fontSize:11, color:C.muted, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:20}}>Daily Visits (Last 10 Days)</div>
              <div style={{display:"flex", alignItems:"flex-end", gap:8, height:100}}>
                {analytics.dailyVisits.map((v, i) => {
                  const max = Math.max(...analytics.dailyVisits);
                  return (
                    <div key={i} style={{flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:6}}>
                      <span style={{fontSize:10, color:C.muted}}>{v}</span>
                      <div style={{width:"100%", height:`${(v/max)*80}px`, background:i===analytics.dailyVisits.length-1?C.gold:C.goldBrd, borderRadius:"2px 2px 0 0", minHeight:4}}/>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16}}>
              {/* Traffic sources */}
              <div style={{background:C.bg1, border:`0.5px solid ${C.brd}`, borderRadius:6, padding:"28px 28px"}}>
                <div style={{fontSize:11, color:C.muted, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:20}}>Traffic Sources</div>
                {analytics.sources.map(s => {
                  const total = analytics.sources.reduce((a,x)=>a+x.n,0);
                  const pct = Math.round((s.n/total)*100);
                  return (
                    <div key={s.s} style={{marginBottom:14}}>
                      <div style={{display:"flex", justifyContent:"space-between", marginBottom:5}}>
                        <span style={{fontSize:13, color:C.white}}>{s.s}</span>
                        <span style={{fontSize:12, color:C.muted}}>{s.n} · {pct}%</span>
                      </div>
                      <div style={{height:3, background:C.bg3, borderRadius:2}}>
                        <div style={{height:"100%", width:`${pct}%`, background:C.gold, borderRadius:2}}/>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Page views */}
              <div style={{background:C.bg1, border:`0.5px solid ${C.brd}`, borderRadius:6, padding:"28px 28px"}}>
                <div style={{fontSize:11, color:C.muted, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:20}}>Page Views Breakdown</div>
                {analytics.pageViews.map(p => (
                  <div key={p.page} style={{marginBottom:14}}>
                    <div style={{display:"flex", justifyContent:"space-between", marginBottom:5}}>
                      <span style={{fontSize:13, color:C.white}}>{p.page}</span>
                      <span style={{fontSize:12, color:C.muted}}>{p.views} · {p.pct}%</span>
                    </div>
                    <div style={{height:3, background:C.bg3, borderRadius:2}}>
                      <div style={{height:"100%", width:`${p.pct}%`, background:C.goldLt, borderRadius:2}}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SETTINGS TAB ── */}
        {tab === "settings" && (
          <div style={{maxWidth:560}}>
            <div style={{fontFamily:FS, fontSize:32, fontWeight:400, color:C.white, marginBottom:4}}>Settings</div>
            <div style={{fontSize:13, color:C.muted, marginBottom:32}}>Platform configuration and company details</div>

            {[
              {section:"Company Info", fields:[
                {label:"Company Name",   val:"DotVests Technologies Limited"},
                {label:"Tagline",        val:"Redefining Access To African Wealth"},
                {label:"Email",         val:"info@dotvests.com"},
                {label:"Phone",         val:"+234 906 681 8379"},
                {label:"Address",       val:"No. 23 Effiong Essien Street, Off Aka Road, Uyo, Akwa Ibom State"},
              ]},
              {section:"Platform Status", fields:[
                {label:"Launch Status",  val:"Pre-Launch"},
                {label:"Regulatory",    val:"SEC Nigeria ARIP — Pending"},
                {label:"Blockchain",    val:"Polymesh (Testnet)"},
                {label:"Payment Rails", val:"Paystack · Breet"},
              ]},
            ].map(group => (
              <div key={group.section} style={{marginBottom:36}}>
                <div style={{fontSize:11, color:C.gold, letterSpacing:"0.1em", textTransform:"uppercase",
                  marginBottom:16, paddingBottom:10, borderBottom:`0.5px solid ${C.brd}`}}>{group.section}</div>
                {group.fields.map(f => (
                  <div key={f.label} style={{marginBottom:14}}>
                    <div style={{fontSize:10.5, color:C.muted, letterSpacing:"0.06em", marginBottom:6, textTransform:"uppercase"}}>{f.label}</div>
                    <input type="text" defaultValue={f.val}
                      style={{width:"100%", background:C.bg2, border:`0.5px solid ${C.brd}`, color:C.white,
                        fontSize:13.5, padding:"10px 14px", borderRadius:3, outline:"none", fontFamily:FN}}/>
                  </div>
                ))}
              </div>
            ))}

            <div style={{display:"flex", gap:10, marginTop:8}}>
              <button style={{background:C.gold, border:"none", color:"#000", fontFamily:FN,
                fontSize:13, fontWeight:600, padding:"11px 28px", borderRadius:3, cursor:"pointer"}}>Save Settings</button>
              <button style={{background:"none", border:`0.5px solid ${C.brd}`, color:C.muted,
                fontFamily:FN, fontSize:13, padding:"11px 28px", borderRadius:3, cursor:"pointer"}}>Reset</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}


// ── FAQ ───────────────────────────────────────────────────────────────────────
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
    <section style={{padding:"80px 48px",borderBottom:`0.5px solid ${C.brd}`}}>
      <div style={{maxWidth:780,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:52}}>
          <Tag>FAQ</Tag>
          <h2 style={{fontFamily:FS,fontSize:40,fontWeight:400,color:C.white,letterSpacing:"-0.02em"}}>
            Frequently Asked Questions
          </h2>
        </div>
        {FAQS.map((f,i)=><FAQItem key={i} faq={f} idx={i}/>)}
        <div style={{borderTop:`0.5px solid ${C.brd}`,paddingTop:28,marginTop:8,textAlign:"center"}}>
          <span style={{fontSize:13,color:C.muted}}>Still have questions? </span>
          <span style={{fontSize:13,color:C.goldLt,cursor:"pointer"}}>info@dotvests.com</span>
        </div>
      </div>
    </section>
  );
}

// ── PARTNER PIPELINE ──────────────────────────────────────────────────────────
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
    <section style={{padding:"80px 48px",borderBottom:`0.5px solid ${C.brd}`,background:C.bg1}}>
      <div style={{textAlign:"center",marginBottom:48}}>
        <Tag gold>Asset & Partner Pipeline</Tag>
        <h2 style={{fontFamily:FS,fontSize:38,fontWeight:400,color:C.white,letterSpacing:"-0.02em"}}>
          In Conversation With<br/><em style={{color:C.goldLt}}>Nigeria's Best.</em>
        </h2>
        <p style={{fontSize:14,color:C.muted,marginTop:12,maxWidth:480,margin:"12px auto 0",lineHeight:1.8}}>
          Stage 1 asset targets and strategic partners driving DotVests to launch.
        </p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1,background:C.brd,maxWidth:900,margin:"0 auto"}}>
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

// ── MOBILE APP SECTION ────────────────────────────────────────────────────────
function MobileAppSection(){
  return(
    <section style={{padding:"80px 48px",borderBottom:`0.5px solid ${C.brd}`}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"center",maxWidth:1000,margin:"0 auto"}}>
        <div>
          <Tag gold>Mobile App</Tag>
          <h2 style={{fontFamily:FS,fontSize:40,fontWeight:400,color:C.white,lineHeight:1.15,marginBottom:18}}>
            Your Portfolio,<br/><em style={{color:C.goldLt}}>In Your Pocket.</em>
          </h2>
          <p style={{fontSize:14.5,color:C.muted,lineHeight:1.9,marginBottom:32}}>
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

// ── PRESS SECTION ─────────────────────────────────────────────────────────────
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

// ── COOKIE BANNER ─────────────────────────────────────────────────────────────
function CookieBanner(){
  const [show,setShow]=useState(()=>!localStorage.getItem("dv_cookie_ok"));
  if(!show)return null;
  const accept=()=>{try{localStorage.setItem("dv_cookie_ok","1");}catch(e){}setShow(false);};
  return(
    <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:500,
      background:"rgba(10,10,10,0.98)",borderTop:`0.5px solid ${C.goldBrd}`,
      backdropFilter:"blur(12px)",padding:"18px 48px",
      display:"flex",alignItems:"center",justifyContent:"space-between",gap:24,flexWrap:"wrap"}}>
      <div style={{flex:1,minWidth:280}}>
        <div style={{fontSize:13.5,color:C.white,fontWeight:500,marginBottom:4}}>We use cookies</div>
        <div style={{fontSize:12,color:C.muted,lineHeight:1.7}}>
          DotVests uses cookies to improve your experience and comply with the Nigeria Data Protection Act 2023 (NDPA). 
          No personal data is sold or shared with third parties.
        </div>
      </div>
      <div style={{display:"flex",gap:10,flexShrink:0}}>
        <button onClick={()=>setShow(false)} style={{background:"none",border:`0.5px solid ${C.brd}`,
          color:C.muted,fontFamily:"'Sora',sans-serif",fontSize:12,padding:"9px 18px",borderRadius:3,cursor:"pointer"}}>
          Decline
        </button>
        <button onClick={accept} style={{background:C.gold,border:"none",color:"#000",
          fontFamily:"'Sora',sans-serif",fontSize:12,fontWeight:600,padding:"9px 18px",borderRadius:3,cursor:"pointer"}}>
          Accept All
        </button>
      </div>
    </div>
  );
}

// ── 404 ───────────────────────────────────────────────────────────────────────
function NotFound({go}){
  return(
    <div style={{minHeight:"80vh",display:"flex",flexDirection:"column",alignItems:"center",
      justifyContent:"center",textAlign:"center",padding:"60px 48px"}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:120,fontWeight:400,
        color:C.goldBrd,lineHeight:1,marginBottom:24,letterSpacing:"-0.04em"}}>404</div>
      <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:32,fontWeight:400,
        color:C.white,marginBottom:14}}>Page Not Found</h2>
      <p style={{fontSize:14,color:C.muted,maxWidth:380,lineHeight:1.8,marginBottom:36}}>
        This page doesn't exist or has been moved. Use the navigation above to find what you're looking for.
      </p>
      <Btn v="gold" onClick={()=>go("home")}>← Back to Home</Btn>
    </div>
  );
}

// ── LEGAL DISCLAIMER BANNER ───────────────────────────────────────────────────
function DisclaimerBanner(){
  const [expanded, setExpanded] = useState(false);
  return(
    <div style={{
      position:"fixed", bottom: 0, left:0, right:0, zIndex:490,
      background:"rgba(4,4,4,0.98)",
      borderTop:`1px solid rgba(201,150,12,0.35)`,
      backdropFilter:"blur(16px)",
      fontFamily:"'Sora',sans-serif",
      transition:"all 0.3s ease",
    }}>
      {/* Collapsed bar */}
      {!expanded && (
        <div style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"10px 48px", gap:24,
        }}>
          <div style={{display:"flex",alignItems:"center",gap:12,flex:1}}>
            <span style={{
              fontSize:10, fontWeight:600, color:"#000",
              background:"#C9960C", padding:"2px 8px",
              borderRadius:2, letterSpacing:"0.08em", flexShrink:0,
            }}>LEGAL NOTICE</span>
            <span style={{fontSize:11.5, color:"#7A7870", lineHeight:1.5}}>
              DotVests is in pre-launch phase. No investment services are offered. All company names, brands, and trademarks referenced are property of their respective owners and do not imply partnership, endorsement, or affiliation.
            </span>
          </div>
          <button onClick={()=>setExpanded(true)} style={{
            background:"none", border:"0.5px solid rgba(255,255,255,0.1)",
            color:"#7A7870", fontFamily:"'Sora',sans-serif",
            fontSize:11, padding:"5px 14px", borderRadius:2,
            cursor:"pointer", flexShrink:0, whiteSpace:"nowrap",
          }}>Full Disclaimer ↑</button>
        </div>
      )}

      {/* Expanded panel */}
      {expanded && (
        <div style={{padding:"28px 48px 24px", maxHeight:"60vh", overflowY:"auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:10,fontWeight:600,color:"#000",background:"#C9960C",padding:"2px 8px",borderRadius:2,letterSpacing:"0.08em"}}>LEGAL NOTICE & DISCLAIMER</span>
            </div>
            <button onClick={()=>setExpanded(false)} style={{background:"none",border:"0.5px solid rgba(255,255,255,0.1)",color:"#7A7870",fontFamily:"'Sora',sans-serif",fontSize:11,padding:"5px 14px",borderRadius:2,cursor:"pointer"}}>Close ↓</button>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:32}}>
            <div>
              <div style={{fontSize:11,color:"#C9960C",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10}}>Pre-Launch & Regulatory Status</div>
              <p style={{fontSize:12,color:"#7A7870",lineHeight:1.85,marginBottom:16}}>
                DotVests Technologies Limited is a company incorporated in Nigeria under the Companies and Allied Matters Act (CAMA) with the Corporate Affairs Commission (CAC). DotVests is currently in <strong style={{color:"#F2F0E8"}}>pre-launch phase</strong> and does not offer, solicit, or facilitate any form of investment, securities trading, or financial services of any kind at this time.
              </p>
              <p style={{fontSize:12,color:"#7A7870",lineHeight:1.85,marginBottom:16}}>
                DotVests is actively pursuing registration and approval under the <strong style={{color:"#F2F0E8"}}>Securities and Exchange Commission (SEC) Nigeria Advanced Regulatory Incubation Programme (ARIP)</strong>. Until such approval is granted, DotVests operates strictly as an information and waitlist platform. Nothing on this website constitutes a prospectus, an offer to sell securities, or an invitation to invest.
              </p>
              <p style={{fontSize:12,color:"#7A7870",lineHeight:1.85}}>
                All content on this platform is for <strong style={{color:"#F2F0E8"}}>informational and educational purposes only</strong>. Simulated asset prices, portfolio figures, and market data displayed on this website are entirely fictional and do not represent actual market values, investment performance, or guaranteed returns.
              </p>
            </div>

            <div>
              <div style={{fontSize:11,color:"#C9960C",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10}}>Third-Party Names, Brands & Trademarks</div>
              <p style={{fontSize:12,color:"#7A7870",lineHeight:1.85,marginBottom:16}}>
                This website references the names, brands, logos, and trademarks of third-party companies including but not limited to <strong style={{color:"#F2F0E8"}}>MTN Nigeria Communications Plc, Guaranty Trust Holding Company Plc (GTCO), PiggyVest, Chowdeck, Erisco Foods Limited, Carbon (One Finance), Dangote Cement Plc, and Zenith Bank Plc</strong>.
              </p>
              <p style={{fontSize:12,color:"#7A7870",lineHeight:1.85,marginBottom:16}}>
                All such references are made solely for the purpose of <strong style={{color:"#F2F0E8"}}>illustrating DotVests' intended business model and tokenization pipeline</strong>. The mention of any company name does not imply, represent, or constitute: (a) any existing partnership, commercial agreement, or endorsement with or by that company; (b) any authority or licence to tokenize, sell, or distribute securities of that company; or (c) any affiliation, association, or approval by that company or its affiliates.
              </p>
              <p style={{fontSize:12,color:"#7A7870",lineHeight:1.85}}>
                DotVests will only tokenize the equity of any company following the execution of a formal, legally binding partnership agreement and all requisite regulatory approvals. All company names and marks remain the exclusive property of their respective owners.
              </p>

              <div style={{fontSize:11,color:"#C9960C",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10,marginTop:24}}>No Investment Advice · No Liability</div>
              <p style={{fontSize:12,color:"#7A7870",lineHeight:1.85}}>
                Nothing on this website constitutes financial, investment, legal, or tax advice. DotVests, its directors, employees, and affiliates accept no liability for any loss or damage arising from reliance on information contained herein. Prospective investors should conduct independent due diligence and seek independent professional advice before making any investment decision. Investment in securities involves risk, including the possible loss of principal.
              </p>
            </div>
          </div>

          <div style={{
            marginTop:20, paddingTop:16,
            borderTop:"0.5px solid rgba(255,255,255,0.06)",
            display:"flex", justifyContent:"space-between", alignItems:"center",
          }}>
            <span style={{fontSize:11,color:"rgba(122,120,112,0.6)"}}>
              © 2026 DotVests Technologies Limited · RC Number: [CAC Registration] · Uyo, Akwa Ibom State, Nigeria
            </span>
            <span style={{fontSize:11,color:"rgba(122,120,112,0.6)"}}>
              Last updated: May 2026
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function App(){
  const [page,setPage]=useState("home");
  useEffect(()=>{
    // GA4 — DotVests Analytics
    const s=document.createElement('script');
    s.async=true;
    s.src='https://www.googletagmanager.com/gtag/js?id=G-RB7D67YTN8';
    document.head.appendChild(s);
    window.dataLayer=window.dataLayer||[];
    function gtag(){window.dataLayer.push(arguments);}
    window.gtag=gtag;
    gtag('js',new Date());
    gtag('config','G-RB7D67YTN8');
  },[]);
  const prices=useLivePrices();
  const go=(p)=>{
    setPage(p);
    const el=document.getElementById("rs");
    if(el)el.scrollTop=0;
    // Track page view in GA4
    if(window.gtag){
      window.gtag('event','page_view',{page_title:p,page_location:window.location.href+'#'+p});
    }
  };
  const pages={home:Home,markets:Markets,tokenize:Tokenize,compliance:Compliance,company:Company,platform:Platform,admin:AdminPage};
  const Page=pages[page]||NotFound;
  return <>
    <style>{GF}</style>
    <div id="rs" style={{height:"100vh",overflowY:"auto",overflowX:"hidden",background:C.bg,width:"100%",position:"relative",paddingBottom:48}}>
      <Ticker prices={prices}/>
      <Nav page={page} go={go}/>
      <div key={page} style={{animation:"fadeUp 0.3s ease both"}}>
        <Page go={go} prices={prices}/>
      </div>
      <DisclaimerBanner/>
      <CookieBanner/>
    </div>
  </>;
}
