import React, { useState, useEffect, useRef } from "react";
import { C, FS } from "../constants";
import { Btn } from "../components/shared";

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

function DisclaimerBanner(){
  const [expanded, setExpanded] = useState(false);
  const [show, setShow] = useState(false);
  useEffect(()=>{
    // Show disclaimer only after cookie decision has been made
    const cookieDecided = (() => { try { return localStorage.getItem("dv_cookie_ok") !== null; } catch(e){ return false; }})();
    if(cookieDecided){ setShow(true); }
    else {
      const timer = setTimeout(()=>setShow(true), 8000); // Show after 8s regardless
      return ()=>clearTimeout(timer);
    }
  },[]);
  if(!show) return null;
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
          padding:"8px 16px", gap:12, flexWrap:"wrap"
        }}>
          <div style={{display:"flex",alignItems:"center",gap:8,flex:1,minWidth:0}}>
            <span style={{
              fontSize:9, fontWeight:600, color:"#000",
              background:"#C9960C", padding:"2px 7px",
              borderRadius:2, letterSpacing:"0.06em", flexShrink:0,
            }}>LEGAL</span>
            <span style={{fontSize:10.5, color:"#7A7870", lineHeight:1.4,
              overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
              Pre-launch · No investment services · All brand names belong to their owners
            </span>
          </div>
          <button onClick={()=>setExpanded(true)} style={{
            background:"none", border:"0.5px solid rgba(255,255,255,0.1)",
            color:"#7A7870", fontFamily:"'Sora',sans-serif",
            fontSize:10, padding:"4px 10px", borderRadius:2,
            cursor:"pointer", flexShrink:0, whiteSpace:"nowrap",
          }}>Full ↑</button>
        </div>
      )}

      {/* Expanded panel */}
      {expanded && (
        <div style={{padding:"20px clamp(16px,4vw,48px) 20px", maxHeight:"70vh", overflowY:"auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:10,fontWeight:600,color:"#000",background:"#C9960C",padding:"2px 8px",borderRadius:2,letterSpacing:"0.08em"}}>LEGAL NOTICE & DISCLAIMER</span>
            </div>
            <button onClick={()=>setExpanded(false)} style={{background:"none",border:"0.5px solid rgba(255,255,255,0.1)",color:"#7A7870",fontFamily:"'Sora',sans-serif",fontSize:11,padding:"5px 14px",borderRadius:2,cursor:"pointer"}}>Close ↓</button>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(260px,100%),1fr))",gap:32}}>
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

function useGoldCursor(){
  useEffect(()=>{
    const dots=[];const N=12;
    for(let i=0;i<N;i++){
      const d=document.createElement('div');
      d.style.cssText=`position:fixed;pointer-events:none;z-index:9999;border-radius:50%;transform:translate(-50%,-50%);transition:opacity 0.3s;opacity:0;background:rgba(201,150,12,${0.5-i*0.04});width:${8-i*0.5}px;height:${8-i*0.5}px;`;
      document.body.appendChild(d);dots.push({el:d,x:0,y:0});
    }
    let mx=0,my=0;
    const onMove=e=>{mx=e.clientX;my=e.clientY;dots[0].x=mx;dots[0].y=my;dots[0].el.style.opacity='1';};
    document.addEventListener('mousemove',onMove);
    let raf;
    function animate(){
      for(let i=1;i<N;i++){
        dots[i].x+=(dots[i-1].x-dots[i].x)*0.35;
        dots[i].y+=(dots[i-1].y-dots[i].y)*0.35;
        dots[i].el.style.left=dots[i].x+'px';
        dots[i].el.style.top=dots[i].y+'px';
        dots[i].el.style.opacity=`${0.6-i*0.05}`;
      }
      dots[0].el.style.left=dots[0].x+'px';
      dots[0].el.style.top=dots[0].y+'px';
      raf=requestAnimationFrame(animate);
    }
    animate();
    return()=>{
      document.removeEventListener('mousemove',onMove);
      cancelAnimationFrame(raf);
      dots.forEach(d=>d.el.remove());
    };
  },[]);
}

class ErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state={hasError:false,error:null}; }
  static getDerivedStateFromError(error){ return {hasError:true,error}; }
  componentDidCatch(error,info){ console.error("DotVests Error:",error,info); }
  render(){
    if(this.state.hasError){
      return(
        <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",
          justifyContent:"center",background:"#070707",padding:"48px",textAlign:"center"}}>
          <div style={{fontSize:40,marginBottom:20,color:"#C9960C"}}>◆</div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:400,
            color:"#F2F0E8",marginBottom:14}}>Something went wrong.</h2>
          <p style={{fontSize:14,color:"#7A7870",lineHeight:1.8,maxWidth:400,marginBottom:32}}>
            We encountered an unexpected error. Please refresh the page or contact support if the issue persists.
          </p>
          <div style={{display:"flex",gap:12}}>
            <button onClick={()=>window.location.reload()} style={{background:"#C9960C",border:"none",
              color:"#000",fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:600,
              padding:"11px 24px",borderRadius:3,cursor:"pointer"}}>
              Refresh Page
            </button>
            <a href="mailto:support@dotvests.com" style={{display:"inline-flex",alignItems:"center",
              background:"none",border:"0.5px solid rgba(255,255,255,0.1)",color:"#7A7870",
              fontFamily:"'Sora',sans-serif",fontSize:13,padding:"11px 24px",borderRadius:3,
              textDecoration:"none"}}>
              Contact Support
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}


export { CookieBanner, NotFound, DisclaimerBanner, useGoldCursor, ErrorBoundary };
