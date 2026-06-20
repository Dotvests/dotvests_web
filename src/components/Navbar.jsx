import React, { useState, useEffect, useRef } from "react";
import { C, FS } from "../constants";
import { DotVestsLogo } from "./shared";

const SEARCH_INDEX = [
  {label:"Home",             page:"home",      keywords:"home overview hero landing"},
  {label:"Markets",          page:"markets",   keywords:"markets assets trade buy sell equity"},
  {label:"PiggyVest",        page:"markets",   keywords:"piggyvest fintech savings pgv"},
  {label:"Chowdeck",         page:"markets",   keywords:"chowdeck food delivery logistics chd"},
  {label:"Erisco Foods",     page:"markets",   keywords:"erisco foods consumer goods erf"},
  {label:"Carbon",           page:"markets",   keywords:"carbon digital banking cbt"},
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
  {label:"Team",               page:"team",      keywords:"team founders precious sherriff about people"},
  {label:"Roadmap",            page:"roadmap",   keywords:"roadmap timeline milestones q1 q2 launch arip"},
  {label:"Token Economics",    page:"token-economics", keywords:"token economics issuance dividend settlement ownership pgv chd"},


  {label:"Legal Notice",      page:"legal",     keywords:"legal notice disclaimer pre-launch arip regulatory trademark liability"},
  {label:"Paystack",         page:"platform",  keywords:"paystack payment rails ngn"},
  {label:"Breet",            page:"platform",  keywords:"breet crypto on ramp"},
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
  {l:"Explore Assets", p:"markets",        desc:"Start investing today"},
  {l:"Join Waitlist",  p:"waitlist",        desc:"Sign up for early access"},
  {l:"Team",           p:"team",            desc:"Meet the founders"},
  {l:"Roadmap",        p:"roadmap",         desc:"Our path to launch and beyond"},
  {l:"Token Economics",p:"token-economics", desc:"How DotVests tokens work"},
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
  const [open,setOpen]=useState(false);
  const ref=useRef();

  useEffect(()=>{
    const h=(e)=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);};
    document.addEventListener("mousedown",h);
    return()=>document.removeEventListener("mousedown",h);
  },[]);

  const pageLabel = {
    home:"Home",markets:"Markets",tokenize:"Tokenize",
    compliance:"Compliance",company:"Company",platform:"Platform",
    team:"Team",roadmap:"Roadmap","token-economics":"Token Economics",admin:"Admin"
  }[page]||"Menu";

  return(
    <nav ref={ref} style={{
      position:"relative",zIndex:200,height:56,
      display:"flex",alignItems:"center",justifyContent:"space-between",
      padding:"0 clamp(12px,3vw,48px)",
      background:"rgba(7,7,7,0.97)",
      borderBottom:`0.5px solid rgba(255,255,255,0.06)`,
      width:"100%",flexShrink:0,
    }}>

      {/* Logo */}
      <div onClick={()=>{go("home");setOpen(false);}}
        style={{cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center"}}>
        <DotVestsLogo height={36}/>
      </div>

      {/* Centre — nav button */}
      <div style={{position:"relative",flexShrink:0}}>
        <button onClick={(e)=>{e.stopPropagation();setOpen(o=>!o);}} style={{
          background:open?C.goldDim:"none",
          border:`0.5px solid ${open?C.gold:C.brd}`,
          color:open?C.goldLt:C.white,
          fontSize:13,fontWeight:500,
          padding:"7px 16px",borderRadius:3,
          display:"flex",alignItems:"center",gap:8,
          transition:"all 0.2s",cursor:"pointer",
          fontFamily:"'Sora',sans-serif",
          whiteSpace:"nowrap",
        }}>
          {pageLabel}
          <span style={{fontSize:8,transform:open?"rotate(180deg)":"rotate(0deg)",
            transition:"transform 0.25s",display:"inline-block",
            color:open?C.goldLt:C.muted}}>▼</span>
        </button>

        {/* Dropdown — always within viewport */}
        {open&&(
          <div style={{
            position:"absolute",
            top:"calc(100% + 8px)",
            left:"50%",
            transform:"translateX(-50%)",
            width:"min(540px,90vw)",
            background:"rgba(6,6,6,0.99)",
            border:`0.5px solid ${C.goldBrd}`,
            borderRadius:6,
            backdropFilter:"blur(20px)",
            boxShadow:"0 24px 48px rgba(0,0,0,0.95)",
            animation:"dropIn 0.18s ease both",
            overflow:"hidden",
            zIndex:500,
            maxHeight:"70vh",
            overflowY:"auto",
          }}>
            <div style={{padding:"10px 18px 9px",borderBottom:`0.5px solid ${C.brd}`,
              display:"flex",alignItems:"center",gap:10}}>
              <DotVestsLogo height={18}/>
              <span style={{fontSize:9.5,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase"}}>Navigate</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))"}}>
              {DROP_ITEMS.map(item=><DropItem key={item.l} item={item} go={go} close={()=>setOpen(false)}/>)}
            </div>
            <div style={{padding:"8px 18px",borderTop:`0.5px solid ${C.brd}`,
              display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6}}>
              <span style={{fontSize:9.5,color:C.dim}}>DotVests Technologies Limited</span>
              <span style={{fontSize:9.5,color:C.dim}}>Pre-launch · Pending SEC ARIP</span>
            </div>
          </div>
        )}
      </div>

      {/* Right — search + CTA */}
      <div className="nav-right" style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
        <div className="nav-search"><SearchBar go={go}/></div>
        <button onClick={()=>{
          setOpen(false);go("home");
          setTimeout(()=>{
            const el=document.getElementById("waitlist-section");
            if(el)el.scrollIntoView({behavior:"smooth",block:"start"});
          },80);
        }} style={{
          background:C.gold,border:"none",color:"#000",
          fontFamily:"'Sora',sans-serif",fontSize:12,fontWeight:600,
          padding:"8px 14px",borderRadius:3,cursor:"pointer",
          whiteSpace:"nowrap",flexShrink:0,
        }}>Join Waitlist</button>
      </div>
    </nav>
  );
}

export default Nav;
