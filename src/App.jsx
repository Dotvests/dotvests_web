import React, { useState, useEffect } from "react";
import { ASSETS, GF, C } from "./constants";
import { useLivePrices } from "./components/shared";
import Ticker from "./components/TickerTape";
import Nav from "./components/Navbar";
import Home from "./pages/Home";
import Markets from "./pages/Markets";
import Tokenize from "./pages/Tokenize";
import Compliance from "./pages/Compliance";
import Company from "./pages/Company";
import Platform from "./pages/Platform";
import AdminPage from "./pages/Admin";
import Team from "./pages/Team";
import Roadmap from "./pages/Roadmap";
import TokenEconomics from "./pages/TokenEconomics";
import Legal from "./pages/Legal";
import { CookieBanner, NotFound, DisclaimerBanner, PreLaunchBanner, useGoldCursor, ErrorBoundary } from "./components/AppUtils";

export default function App(){
  const [page,setPage]=useState("home");
  const [siteAssets,setSiteAssets]=useState(ASSETS.map(a=>({...a,status:"active",chgOverride:null})));
  useGoldCursor();
  useEffect(()=>{
    // GA4 â€” DotVests Analytics
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
  const prices=useLivePrices(siteAssets);
  const go=(p)=>{
    setPage(p);
    const el=document.getElementById("rs");
    if(el)el.scrollTop=0;
    // Track page view in GA4
    if(window.gtag){
      window.gtag('event','page_view',{page_title:p,page_location:window.location.href+'#'+p});
    }
  };
  const pages={home:Home,markets:Markets,tokenize:Tokenize,compliance:Compliance,company:Company,platform:Platform,admin:AdminPage,team:Team,roadmap:Roadmap,"token-economics":TokenEconomics,legal:Legal};
  const Page=pages[page]||NotFound;
  return <ErrorBoundary>
    <style>{GF}</style>
    <div id="rs" style={{height:"100vh",overflowY:"auto",overflowX:"hidden",background:C.bg,width:"100%",position:"relative",paddingBottom:48}}>
      <PreLaunchBanner go={go}/>
      <Ticker prices={prices}/>
      <Nav page={page} go={go}/>
      <div key={page} style={{animation:"fadeUp 0.3s ease both"}}>
        <Page go={go} prices={prices} siteAssets={siteAssets} setSiteAssets={setSiteAssets}/>
      </div>
      <DisclaimerBanner/>
      <CookieBanner/>
    </div>
  </ErrorBoundary>;
}
