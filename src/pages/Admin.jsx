import React, { useState, useEffect, useRef } from "react";
import { C, FS, ASSETS } from "../constants";
import { Tag, Btn, fmt } from "../components/shared";

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


function AdminPage({ go, prices, siteAssets, setSiteAssets }) {
  const [auth, setAuth] = useState(false);
  const [tab, setTab] = useState("overview");
  const [waitlist, setWaitlist] = useState([
    {id:1, email:"ade@gmail.com",      date:"2026-05-01", source:"Home",    status:"Active"},
    {id:2, email:"chidi@outlook.com",  date:"2026-05-03", source:"Markets", status:"Active"},
    {id:3, email:"fatima@yahoo.com",   date:"2026-05-05", source:"Markets", status:"Active"},
    {id:4, email:"emeka@gmail.com",    date:"2026-05-07", source:"Home",    status:"Active"},
    {id:5, email:"ngozi@proton.me",    date:"2026-05-09", source:"Home",    status:"Active"},
  ]);
  const [assets, setAssets] = useState(()=>(siteAssets||ASSETS).map(a=>({...a,status:a.status||"active",chgOverride:a.chgOverride||null})));
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
    const newAssets = assets.map(x => x.id === updated.id ? updated : x);
    setAssets(newAssets);
    if(setSiteAssets) setSiteAssets(newAssets);
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

      <div style={{padding:"clamp(16px,3vw,32px) clamp(14px,4vw,52px) 60px"}}>

        {/* ── OVERVIEW TAB ── */}
        {tab === "overview" && (
          <div>
            <div style={{marginBottom:40}}>
              <div style={{fontFamily:FS, fontSize:36, fontWeight:400, color:C.white, marginBottom:6}}>
                Good {new Date().getHours()<12?"morning":new Date().getHours()<17?"afternoon":"evening"}, Precious.
              </div>
              <div style={{fontSize:14, color:C.muted}}>Here's what's happening with DotVests today.</div>
            </div>

            <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(min(200px,100%),1fr))", gap:16, marginBottom:40}}>
              <AdminStat label="Waitlist Signups" value={waitlist.length} sub="Total registered" color={C.goldLt}/>
              <AdminStat label="Today's Visits" value={analytics.todayVisits} sub="Unique sessions" color={C.green}/>
              <AdminStat label="Total Visits" value={analytics.totalVisits.toLocaleString()} sub="All time"/>
              <AdminStat label="Avg. Session" value={analytics.avgTime} sub="Time on site"/>
            </div>

            <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(min(260px,100%),1fr))", gap:16, marginBottom:40}}>
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
              <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(min(230px,100%),1fr))", gap:12}}>
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
                {[["name","Asset Name"],["sector","Sector"],["price","Base Price (₦)"]].map(([field,label]) => (
                  <div key={field} style={{marginBottom:18}}>
                    <div style={{fontSize:11, color:C.muted, letterSpacing:"0.06em", marginBottom:6, textTransform:"uppercase"}}>{label}</div>
                    <input type={field==="price"||field==="chg"?"number":"text"}
                      value={editAsset[field]}
                      onChange={e => setEditAsset(a => ({...a, [field]: field==="price"||field==="chg" ? parseFloat(e.target.value)||0 : e.target.value}))}
                      style={{width:"100%", background:C.bg2, border:`0.5px solid ${C.brd2}`, color:C.white,
                        fontSize:14, padding:"10px 14px", borderRadius:3, outline:"none", fontFamily:FN}}/>
                  </div>
                ))}
                <div style={{marginBottom:18}}>
                  <div style={{fontSize:11, color:C.muted, letterSpacing:"0.06em", marginBottom:6, textTransform:"uppercase"}}>24h Change Override (%)</div>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <input type="number" step="0.01"
                      value={editAsset.chgOverride!=null?editAsset.chgOverride:editAsset.chg}
                      onChange={e=>setEditAsset(a=>({...a,chgOverride:parseFloat(e.target.value)||0}))}
                      style={{flex:1,background:C.bg2,border:`0.5px solid ${C.brd2}`,color:C.white,fontSize:14,padding:"10px 14px",borderRadius:3,outline:"none"}}/>
                    <button onClick={()=>setEditAsset(a=>({...a,chgOverride:null}))}
                      style={{background:"none",border:`0.5px solid ${C.brd}`,color:C.muted,fontFamily:"'Sora',sans-serif",fontSize:11,padding:"10px 12px",borderRadius:3,cursor:"pointer",whiteSpace:"nowrap"}}>
                      Reset to Live
                    </button>
                  </div>
                  <div style={{fontSize:10,color:C.dim,marginTop:6}}>Positive = profit (green), Negative = loss (red). Overrides live price movement.</div>
                </div>
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
                        <button onClick={() => { const na=assets.map(x=>x.id===a.id?{...x,status:x.status==="frozen"?"active":"frozen"}:x); setAssets(na); if(setSiteAssets)setSiteAssets(na); }}
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

            <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(min(200px,100%),1fr))", gap:16, marginBottom:32}}>
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

            <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(min(260px,100%),1fr))", gap:16}}>
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

export default AdminPage;
