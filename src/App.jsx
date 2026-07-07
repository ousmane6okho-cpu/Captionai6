import { useState, useEffect, useRef } from "react";

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #070709; --bg2: #0d0d12; --bg3: #12121a;
    --border: rgba(255,255,255,0.06); --border-h: rgba(255,255,255,0.12);
    --accent: #ff5c35; --accent2: #ff8c6b; --gold: #f5c842;
    --teal: #2df4e8; --text: #f0ede8; --muted: #5a5a6e; --muted2: #3a3a4e;
    --ff-d: 'Syne', sans-serif; --ff-b: 'DM Sans', sans-serif;
    --r: 14px; --r-sm: 8px;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--ff-b); -webkit-font-smoothing: antialiased; }
  ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--muted2); border-radius: 4px; }
  ::selection { background: rgba(255,92,53,0.25); }
  @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes spin { to { transform:rotate(360deg); } }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes glow { 0%,100%{box-shadow:0 0 20px rgba(255,92,53,0.2)} 50%{box-shadow:0 0 40px rgba(255,92,53,0.45)} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  @keyframes slideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  .fu { animation: fadeUp 0.5s ease both; }
  .fi { animation: fadeIn 0.4s ease both; }
  .float { animation: float 3s ease-in-out infinite; }
  .orb { position:fixed; border-radius:50%; filter:blur(90px); pointer-events:none; z-index:0; }
  .btn-p {
    display:inline-flex; align-items:center; justify-content:center; gap:8px;
    padding:13px 28px; background:linear-gradient(135deg,var(--accent),#e84522);
    color:#fff; font-family:var(--ff-d); font-weight:700; font-size:0.9rem;
    border:none; border-radius:var(--r); cursor:pointer; transition:all 0.2s;
    animation:glow 3s ease-in-out infinite; position:relative; overflow:hidden;
  }
  .btn-p::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,0.12),transparent); opacity:0; transition:opacity 0.2s; }
  .btn-p:hover::after { opacity:1; } .btn-p:hover { transform:translateY(-1px); }
  .btn-p:disabled { background:var(--bg3); color:var(--muted); cursor:not-allowed; box-shadow:none; animation:none; }
  .btn-g {
    display:inline-flex; align-items:center; justify-content:center; gap:6px;
    padding:11px 22px; background:transparent; color:var(--muted);
    font-family:var(--ff-b); font-weight:500; font-size:0.85rem;
    border:1px solid var(--border); border-radius:var(--r); cursor:pointer; transition:all 0.2s;
  }
  .btn-g:hover { border-color:var(--border-h); color:var(--text); background:rgba(255,255,255,0.03); }
  .card { background:var(--bg2); border:1px solid var(--border); border-radius:18px; padding:22px; transition:border-color 0.2s; }
  .card:hover { border-color:var(--border-h); }
  .chip {
    display:inline-flex; align-items:center; gap:5px;
    padding:7px 15px; border-radius:50px; font-size:0.78rem; font-weight:600;
    font-family:var(--ff-b); border:1.5px solid var(--border); background:transparent;
    color:var(--muted); cursor:pointer; transition:all 0.18s;
  }
  .chip:hover { border-color:var(--border-h); color:var(--text); }
  .chip.on { border-color:var(--accent); background:rgba(255,92,53,0.1); color:var(--accent); }
  .htag {
    display:inline-block; padding:5px 11px; border-radius:6px;
    font-size:0.76rem; font-weight:500; cursor:pointer; transition:all 0.15s; user-select:none;
  }
  .htag:hover { transform:translateY(-1px); }
  .cpbtn {
    display:inline-flex; align-items:center; gap:5px;
    background:var(--bg3); border:1px solid var(--border); color:var(--muted);
    font-size:0.72rem; font-family:var(--ff-b); padding:5px 12px;
    border-radius:6px; cursor:pointer; transition:all 0.15s;
  }
  .cpbtn:hover { border-color:var(--border-h); color:var(--text); }
  .cpbtn.ok { background:rgba(45,244,232,0.1); border-color:var(--teal); color:var(--teal); }
  .tab {
    padding:13px 20px; background:none; border:none; font-family:var(--ff-b);
    font-size:0.85rem; font-weight:500; color:var(--muted); cursor:pointer;
    border-bottom:2px solid transparent; transition:all 0.18s;
  }
  .tab.on { color:var(--accent); border-bottom-color:var(--accent); }
  .tab:hover:not(.on) { color:var(--text); }
  .pbar { height:3px; border-radius:3px; background:var(--bg3); overflow:hidden; }
  .pfill { height:100%; border-radius:3px; background:linear-gradient(90deg,var(--accent),var(--accent2)); transition:width 0.6s ease; }
  .res { animation:slideUp 0.4s ease both; }
  textarea,input { font-family:var(--ff-b); }
  .noise::before {
    content:''; position:fixed; inset:0; pointer-events:none; z-index:0; opacity:0.35;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  }
`;

const PLANS = {
  free:    { name:"Gratuit",  price:0,  gen:3,    label:"3 / jour",  features:["3 générations par jour","TikTok & Instagram","15 hashtags","Hook accrocheur","Historique 7 jours"] },
  starter: { name:"Starter", price:9,  gen:50,   label:"50 / jour", features:["50 générations par jour","Toutes les plateformes","30 hashtags","Hook + Score viral","Historique 30 jours","Export 1 clic"] },
  pro:     { name:"Pro",     price:19, gen:9999, label:"Illimité ∞", features:["Générations illimitées","Toutes les plateformes","30 hashtags + analyse","Score viral IA","Historique illimité","Export 1 clic","Support prioritaire","Accès aux beta fonctions"], popular:true },
};

const PLATFORMS = [{id:"TikTok",e:"🎵"},{id:"Instagram",e:"📸"},{id:"YouTube Shorts",e:"▶️"},{id:"Twitter/X",e:"𝕏"},{id:"LinkedIn",e:"💼"}];
const NICHES    = [{id:"Mode & Beauté",e:"💄"},{id:"Food & Cuisine",e:"🍜"},{id:"Fitness",e:"💪"},{id:"Voyage",e:"✈️"},{id:"Humour",e:"😂"},{id:"Finance",e:"💰"},{id:"Tech",e:"⚡"},{id:"Motivation",e:"🔥"},{id:"Gaming",e:"🎮"},{id:"Lifestyle",e:"🌿"}];
const TONES     = [{id:"Viral & Accrocheur",e:"🚀"},{id:"Drôle & Décalé",e:"😎"},{id:"Inspirant",e:"✨"},{id:"Professionnel",e:"🎯"},{id:"Éducatif",e:"📚"},{id:"Mystérieux",e:"🌙"}];

function useLS(k,d){const[v,sv]=useState(()=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}});const s=(x)=>{sv(x);localStorage.setItem(k,JSON.stringify(x))};return[v,s]}

function CSS(){useEffect(()=>{if(document.getElementById("cai-css"))return;const e=document.createElement("style");e.id="cai-css";e.textContent=GLOBAL_CSS;document.head.appendChild(e);return()=>e.remove()},[]);return null}

export default function App(){
  const[page,setPage]=useLS("cai_pg","landing");
  const[plan,setPlan]=useLS("cai_pl","free");
  const[used,setUsed]=useLS("cai_used",0);
  const[reset,setReset]=useLS("cai_rst","");
  const[hist,setHist]=useLS("cai_hist",[]);
  useEffect(()=>{const t=new Date().toDateString();if(reset!==t){setUsed(0);setReset(t)}},[]);
  const limit=PLANS[plan].gen;
  const canGen=used<limit;
  function onGen(){setUsed(used+1)}
  function onSave(i){setHist([i,...hist].slice(0,60))}
  function onUpgrade(p){setPlan(p);setPage("success")}
  if(page==="landing") return <><CSS/><Landing onStart={()=>setPage("app")} onPricing={()=>setPage("pricing")}/></>
  if(page==="pricing") return <><CSS/><Pricing plan={plan} onUpgrade={onUpgrade} onBack={()=>setPage("app")}/></>
  if(page==="success") return <><CSS/><Success plan={plan} onContinue={()=>setPage("app")}/></>
  return <><CSS/><MainApp plan={plan} canGen={canGen} used={used} limit={limit} onGen={onGen} onSave={onSave} hist={hist} onPricing={()=>setPage("pricing")} onLanding={()=>setPage("landing")}/></>
}

/* ═══════════ LANDING ═══════════ */
function Landing({onStart,onPricing}){
  const STATS=[{v:"2 400+",l:"Créateurs actifs"},{v:"180K",l:"Captions générées"},{v:"4.9★",l:"Note moyenne"},{v:"10s",l:"Par génération"}];
  const TESTIS=[
    {n:"Léa M.",h:"@leacreates",t:"J'ai gagné 3h par semaine. Mes vues ont doublé en un mois.",a:"L"},
    {n:"Karim D.",h:"@kdcontent",t:"La meilleure app pour créateurs francophones, sans hésitation.",a:"K"},
    {n:"Sophie B.",h:"@sophiefitness",t:"Les hashtags générés sont vraiment ciblés. Résultats immédiats !",a:"S"},
  ];
  return(
    <div className="noise" style={{minHeight:"100vh",background:"var(--bg)",color:"var(--text)",fontFamily:"var(--ff-b)",overflowX:"hidden",position:"relative"}}>
      <div className="orb" style={{width:600,height:600,background:"radial-gradient(circle,rgba(255,92,53,0.1) 0%,transparent 70%)",top:-150,right:-150}}/>
      <div className="orb" style={{width:400,height:400,background:"radial-gradient(circle,rgba(45,244,232,0.05) 0%,transparent 70%)",bottom:100,left:-100}}/>
      {/* NAV */}
      <nav style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"18px 40px",borderBottom:"1px solid var(--border)",backdropFilter:"blur(20px)",position:"sticky",top:0,zIndex:100,background:"rgba(7,7,9,0.85)"}}>
        <div style={{fontFamily:"var(--ff-d)",fontWeight:900,fontSize:"1.25rem",background:"linear-gradient(135deg,var(--accent),var(--accent2))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>✦ CaptionAI</div>
        <div style={{display:"flex",gap:10}}>
          <button className="btn-g" onClick={onPricing}>Tarifs</button>
          <button className="btn-p" onClick={onStart}>Essayer gratuitement</button>
        </div>
      </nav>
      {/* HERO */}
      <div style={{textAlign:"center",padding:"90px 20px 70px",maxWidth:840,margin:"0 auto",position:"relative",zIndex:1}}>
        <div className="fu" style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,92,53,0.08)",border:"1px solid rgba(255,92,53,0.2)",borderRadius:50,padding:"7px 18px",fontSize:"0.74rem",color:"var(--accent)",marginBottom:28,fontWeight:600,letterSpacing:"0.5px"}}>
          <span style={{width:7,height:7,borderRadius:"50%",background:"var(--accent)",display:"inline-block",animation:"pulse 1.5s ease-in-out infinite"}}/>
          2 400 créateurs l'utilisent déjà
        </div>
        <h1 className="fu" style={{fontFamily:"var(--ff-d)",fontSize:"clamp(2.5rem,7vw,4.8rem)",fontWeight:900,lineHeight:1.05,letterSpacing:"-2px",marginBottom:22,animationDelay:"0.07s"}}>
          Des captions virales<br/>
          <span style={{background:"linear-gradient(135deg,var(--accent) 0%,var(--gold) 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>en 10 secondes</span>
        </h1>
        <p className="fu" style={{fontSize:"1.05rem",color:"var(--muted)",lineHeight:1.8,maxWidth:520,margin:"0 auto 38px",animationDelay:"0.14s"}}>
          L'IA génère ta caption parfaite + les meilleurs hashtags pour exploser sur TikTok, Instagram et YouTube Shorts. En français.
        </p>
        <div className="fu" style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",animationDelay:"0.21s"}}>
          <button className="btn-p" onClick={onStart} style={{fontSize:"1rem",padding:"15px 36px"}}>Commencer gratuitement →</button>
          <button className="btn-g" onClick={onPricing} style={{fontSize:"0.9rem",padding:"15px 24px"}}>Voir les tarifs</button>
        </div>
        <div className="fu" style={{marginTop:13,fontSize:"0.74rem",color:"var(--muted2)",animationDelay:"0.28s"}}>Sans carte bancaire · 3 générations offertes</div>
      </div>
      {/* STATS */}
      <div style={{maxWidth:780,margin:"0 auto 80px",padding:"0 20px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:14,position:"relative",zIndex:1}}>
        {STATS.map((s,i)=>(
          <div key={s.l} className="fu card" style={{textAlign:"center",padding:"22px 16px",animationDelay:`${i*0.07}s`}}>
            <div style={{fontFamily:"var(--ff-d)",fontSize:"2rem",fontWeight:900,color:"var(--accent)",marginBottom:4}}>{s.v}</div>
            <div style={{fontSize:"0.77rem",color:"var(--muted)"}}>{s.l}</div>
          </div>
        ))}
      </div>
      {/* FEATURES */}
      <div style={{maxWidth:880,margin:"0 auto 80px",padding:"0 20px",position:"relative",zIndex:1}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <h2 style={{fontFamily:"var(--ff-d)",fontSize:"clamp(1.6rem,4vw,2.5rem)",fontWeight:800,letterSpacing:"-0.5px",marginBottom:10}}>Tout ce dont tu as besoin</h2>
          <p style={{color:"var(--muted)",fontSize:"0.9rem"}}>Un outil pensé pour les créateurs francophones exigeants</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:14}}>
          {[
            {icon:"⚡",title:"Ultra rapide",desc:"Caption + hashtags en moins de 10 secondes grâce à l'IA",color:"var(--gold)"},
            {icon:"🎯",title:"30 hashtags ciblés",desc:"Triés en 3 catégories : tendance, niche et audience large",color:"var(--accent)"},
            {icon:"📱",title:"5 plateformes",desc:"TikTok, Instagram, YouTube Shorts, Twitter/X, LinkedIn",color:"var(--teal)"},
            {icon:"🪝",title:"Hook accrocheur",desc:"La phrase parfaite pour stopper le scroll en 3 secondes",color:"#c084fc"},
            {icon:"📊",title:"Score viral",desc:"L'IA note le potentiel viral de ta caption de 0 à 100",color:"var(--accent2)"},
            {icon:"🇫🇷",title:"100% français",desc:"Conçu pour les créateurs francophones, résultats en français",color:"var(--gold)"},
          ].map(f=>(
            <div key={f.title} className="card" style={{padding:"24px"}}>
              <div style={{width:44,height:44,borderRadius:12,background:`${f.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.4rem",marginBottom:14}}>{f.icon}</div>
              <div style={{fontFamily:"var(--ff-d)",fontWeight:700,fontSize:"0.95rem",marginBottom:6}}>{f.title}</div>
              <div style={{color:"var(--muted)",fontSize:"0.82rem",lineHeight:1.6}}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
      {/* TESTIMONIALS */}
      <div style={{maxWidth:840,margin:"0 auto 80px",padding:"0 20px",position:"relative",zIndex:1}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <h2 style={{fontFamily:"var(--ff-d)",fontSize:"clamp(1.5rem,3.5vw,2.2rem)",fontWeight:800,letterSpacing:"-0.5px",marginBottom:8}}>Ils adorent CaptionAI</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:14}}>
          {TESTIS.map(t=>(
            <div key={t.n} className="card" style={{padding:"22px"}}>
              <div style={{display:"flex",gap:4,marginBottom:12}}>{[...Array(5)].map((_,i)=><span key={i} style={{color:"var(--gold)",fontSize:"0.85rem"}}>★</span>)}</div>
              <p style={{color:"#c0bdb8",fontSize:"0.88rem",lineHeight:1.7,marginBottom:16,fontStyle:"italic"}}>"{t.t}"</p>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,var(--accent),var(--accent2))",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--ff-d)",fontWeight:700,fontSize:"0.85rem",color:"#fff"}}>{t.a}</div>
                <div>
                  <div style={{fontWeight:600,fontSize:"0.82rem"}}>{t.n}</div>
                  <div style={{color:"var(--muted)",fontSize:"0.72rem"}}>{t.h}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* FINAL CTA */}
      <div style={{textAlign:"center",padding:"60px 20px 80px",position:"relative",zIndex:1}}>
        <h2 style={{fontFamily:"var(--ff-d)",fontSize:"clamp(1.8rem,4vw,2.9rem)",fontWeight:900,letterSpacing:"-1px",marginBottom:16}}>Prêt à exploser<br/>sur les réseaux ?</h2>
        <p style={{color:"var(--muted)",marginBottom:28,fontSize:"0.92rem"}}>Rejoins 2 400 créateurs qui gagnent du temps chaque jour.</p>
        <button className="btn-p" onClick={onStart} style={{fontSize:"1rem",padding:"16px 40px"}}>Commencer gratuitement →</button>
        <div style={{marginTop:10,fontSize:"0.74rem",color:"var(--muted2)"}}>Sans carte · Sans engagement</div>
      </div>
      {/* FOOTER */}
      <div style={{borderTop:"1px solid var(--border)",padding:"20px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10,position:"relative",zIndex:1}}>
        <div style={{fontFamily:"var(--ff-d)",fontWeight:800,fontSize:"0.9rem",color:"var(--muted)"}}>✦ CaptionAI</div>
        <div style={{fontSize:"0.74rem",color:"var(--muted2)"}}>© 2025 CaptionAI · Fait avec ❤️ pour les créateurs francophones</div>
      </div>
    </div>
  );
}

/* ═══════════ MAIN APP ═══════════ */
function MainApp({plan,canGen,used,limit,onGen,onSave,hist,onPricing,onLanding}){
  const[tab,setTab]=useState("generate");
  const[platform,setPlatform]=useState("TikTok");
  const[niche,setNiche]=useState("Lifestyle");
  const[tone,setTone]=useState("Viral & Accrocheur");
  const[desc,setDesc]=useState("");
  const[loading,setLoading]=useState(false);
  const[result,setResult]=useState(null);
  const[copied,setCopied]=useState("");
  const[error,setError]=useState("");
  const resRef=useRef(null);

  async function generate(){
    if(!desc.trim()||!canGen||loading)return;
    setLoading(true);setResult(null);setError("");
    const prompt=`Tu es un expert en marketing digital et contenu viral francophone.
Génère une caption + hashtags pour cette vidéo :
- Plateforme : ${platform}
- Niche : ${niche}
- Ton : ${tone}
- Description : ${desc}
Réponds UNIQUEMENT en JSON valide sans markdown :
{"caption_courte":"Caption 1-2 lignes ultra accrocheuse avec emojis (max 150 car)","caption_longue":"Caption complète avec storytelling et CTA (max 300 car)","hook":"Phrase d'accroche percutante pour les 3 premières secondes","hashtags_tendance":["h1","h2","h3","h4","h5"],"hashtags_niche":["h6","h7","h8","h9","h10"],"hashtags_large":["h11","h12","h13","h14","h15"],"meilleure_heure":"ex: 19h-21h","meilleur_jour":"ex: Mardi","score_viral":87,"conseil":"1 conseil court et actionnable pour maximiser la portée"}`;
    try{
      const res=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${import.meta.env.VITE_GROQ_KEY}`},body:JSON.stringify({model:"llama3-70b-8192",max_tokens:1000,messages:[{role:"user",content:prompt}]})});
      const data=await res.json();
      const text=data.choices[0].message.content;
      const parsed=JSON.parse(text.replace(/```json|```/g,"").trim());
      setResult(parsed);onGen();
      onSave({id:Date.now(),platform,niche,tone,desc,result:parsed,date:new Date().toLocaleDateString("fr-FR")});
      setTimeout(()=>resRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),100);
    }catch{setError("Erreur de génération. Réessaie !")}
    setLoading(false);
  }

  function copy(text,key){navigator.clipboard.writeText(text);setCopied(key);setTimeout(()=>setCopied(""),2200)}
  const allTags=result?[...(result.hashtags_tendance||[]),...(result.hashtags_niche||[]),...(result.hashtags_large||[])].map(h=>h.startsWith("#")?h:"#"+h).join(" "):"";
  const pct=limit>=9999?0:Math.min((used/limit)*100,100);

  return(
    <div className="noise" style={{minHeight:"100vh",background:"var(--bg)",color:"var(--text)",fontFamily:"var(--ff-b)"}}>
      <div className="orb" style={{width:450,height:450,background:"radial-gradient(circle,rgba(255,92,53,0.07) 0%,transparent 70%)",top:-80,right:-80}}/>
      {/* TOPBAR */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 24px",borderBottom:"1px solid var(--border)",backdropFilter:"blur(20px)",background:"rgba(7,7,9,0.88)",position:"sticky",top:0,zIndex:100}}>
        <button onClick={onLanding} style={{background:"none",border:"none",fontFamily:"var(--ff-d)",fontWeight:900,fontSize:"1.05rem",cursor:"pointer",backgroundImage:"linear-gradient(135deg,var(--accent),var(--accent2))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>✦ CaptionAI</button>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5}}>
            <div style={{fontSize:"0.67rem",color:"var(--muted)"}}>{used} / {limit>=9999?"∞":limit} générations</div>
            {limit<9999&&<div style={{width:80}}><div className="pbar"><div className="pfill" style={{width:`${pct}%`}}/></div></div>}
          </div>
          {plan!=="free"
            ?<div style={{background:"rgba(255,92,53,0.1)",border:"1px solid rgba(255,92,53,0.25)",borderRadius:50,padding:"5px 14px",fontSize:"0.72rem",fontWeight:700,color:"var(--accent)",fontFamily:"var(--ff-d)"}}>✦ {PLANS[plan].name}</div>
            :<button className="btn-p" onClick={onPricing} style={{padding:"8px 16px",fontSize:"0.78rem"}}>⚡ Passer Pro</button>
          }
        </div>
      </div>
      {/* TABS */}
      <div style={{borderBottom:"1px solid var(--border)",padding:"0 24px",display:"flex",gap:4}}>
        <button className={`tab${tab==="generate"?" on":""}`} onClick={()=>setTab("generate")}>✨ Générer</button>
        <button className={`tab${tab==="history"?" on":""}`} onClick={()=>setTab("history")}>📋 Historique{hist.length>0?` (${hist.length})`:""}</button>
      </div>

      <div style={{maxWidth:740,margin:"0 auto",padding:"28px 20px 70px",position:"relative",zIndex:1}}>
        {tab==="generate"&&(
          <>
            {/* PAYWALL */}
            {!canGen&&(
              <div className="fu" style={{background:"linear-gradient(135deg,rgba(255,92,53,0.07),rgba(255,92,53,0.02))",border:"1px solid rgba(255,92,53,0.22)",borderRadius:18,padding:"30px 24px",marginBottom:22,textAlign:"center"}}>
                <div style={{fontSize:"2.5rem",marginBottom:10}} className="float">⚡</div>
                <div style={{fontFamily:"var(--ff-d)",fontWeight:800,fontSize:"1.15rem",marginBottom:8}}>Limite quotidienne atteinte</div>
                <div style={{color:"var(--muted)",fontSize:"0.85rem",marginBottom:22,lineHeight:1.7}}>Tu as utilisé tes {PLANS[plan].gen} générations gratuites aujourd'hui.<br/>Passe à Pro pour des générations illimitées.</div>
                <button className="btn-p" onClick={onPricing}>Découvrir les offres →</button>
              </div>
            )}
            {/* FORM */}
            <div className="fu card" style={{padding:"26px",marginBottom:16}}>
              {/* Platform */}
              <div style={{marginBottom:22}}>
                <div style={{fontSize:"0.67rem",fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:"var(--muted)",marginBottom:10}}>📱 Plateforme</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  {PLATFORMS.map(p=><button key={p.id} className={`chip${platform===p.id?" on":""}`} onClick={()=>setPlatform(p.id)}>{p.e} {p.id}</button>)}
                </div>
              </div>
              {/* Niche */}
              <div style={{marginBottom:22}}>
                <div style={{fontSize:"0.67rem",fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:"var(--muted)",marginBottom:10}}>🎯 Ta niche</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  {NICHES.map(n=><button key={n.id} className={`chip${niche===n.id?" on":""}`} onClick={()=>setNiche(n.id)}>{n.e} {n.id}</button>)}
                </div>
              </div>
              {/* Tone */}
              <div style={{marginBottom:22}}>
                <div style={{fontSize:"0.67rem",fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:"var(--muted)",marginBottom:10}}>🎨 Ton & Style</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  {TONES.map(t=><button key={t.id} className={`chip${tone===t.id?" on":""}`} onClick={()=>setTone(t.id)}>{t.e} {t.id}</button>)}
                </div>
              </div>
              {/* Description */}
              <div style={{marginBottom:20}}>
                <div style={{fontSize:"0.67rem",fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:"var(--muted)",marginBottom:10}}>📝 Décris ta vidéo</div>
                <textarea
                  value={desc} onChange={e=>setDesc(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&e.metaKey&&generate()}
                  placeholder="Ex: Je montre mes 3 astuces pour économiser 500€/mois sans se priver..."
                  style={{width:"100%",minHeight:110,background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"var(--r-sm)",color:"var(--text)",padding:"13px 15px",fontSize:"0.9rem",resize:"vertical",outline:"none",lineHeight:1.6,transition:"border-color 0.2s",boxSizing:"border-box"}}
                  onFocus={e=>e.target.style.borderColor="rgba(255,92,53,0.4)"}
                  onBlur={e=>e.target.style.borderColor="var(--border)"}
                />
                <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
                  <span style={{fontSize:"0.67rem",color:"var(--muted2)"}}>{desc.length} car.</span>
                  <span style={{fontSize:"0.67rem",color:"var(--muted2)"}}>⌘+Entrée pour générer</span>
                </div>
              </div>
              {error&&<div style={{background:"rgba(255,60,80,0.07)",border:"1px solid rgba(255,60,80,0.22)",borderRadius:8,padding:"10px 14px",color:"#ff6070",fontSize:"0.82rem",marginBottom:16}}>⚠️ {error}</div>}
              <button className="btn-p" onClick={generate} disabled={loading||!desc.trim()||!canGen} style={{width:"100%",padding:"15px",fontSize:"0.95rem"}}>
                {loading?<><span style={{width:15,height:15,border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%",display:"inline-block",animation:"spin 0.8s linear infinite"}}/> Génération en cours...</>:"✨ Générer ma caption"}
              </button>
            </div>

            {/* RESULT */}
            {result&&(
              <div ref={resRef} style={{marginTop:20}}>
                {/* Score + Timing */}
                <div className="res" style={{display:"grid",gridTemplateColumns:"1fr auto",gap:12,marginBottom:12}}>
                  <div style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:14,padding:"16px 20px",display:"flex",alignItems:"center",gap:16}}>
                    <div>
                      <div style={{fontSize:"0.65rem",color:"var(--muted)",marginBottom:4,letterSpacing:"1px",textTransform:"uppercase"}}>Score viral</div>
                      <div style={{fontFamily:"var(--ff-d)",fontSize:"2rem",fontWeight:900,color:result.score_viral>=80?"var(--accent)":result.score_viral>=60?"var(--gold)":"var(--muted)"}}>{result.score_viral}<span style={{fontSize:"0.85rem",color:"var(--muted)"}}>/100</span></div>
                    </div>
                    <div style={{flex:1}}><div className="pbar" style={{height:6}}><div className="pfill" style={{width:`${result.score_viral}%`,background:result.score_viral>=80?"linear-gradient(90deg,var(--accent),var(--accent2))":"linear-gradient(90deg,var(--gold),#f0a030)"}}/></div></div>
                  </div>
                  <div style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:14,padding:"16px 18px",textAlign:"center",minWidth:105}}>
                    <div style={{fontSize:"0.65rem",color:"var(--muted)",marginBottom:4,letterSpacing:"1px",textTransform:"uppercase"}}>Poster le</div>
                    <div style={{fontFamily:"var(--ff-d)",fontWeight:700,fontSize:"0.88rem",marginBottom:2}}>{result.meilleur_jour}</div>
                    <div style={{color:"var(--accent)",fontWeight:700,fontSize:"0.88rem"}}>{result.meilleure_heure}</div>
                  </div>
                </div>
                {/* Hook */}
                <div className="res card" style={{borderLeft:"3px solid var(--accent)",marginBottom:12,animationDelay:"0.05s"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                    <div style={{fontSize:"0.65rem",fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:"var(--accent)"}}>🪝 Hook — 3 premières secondes</div>
                    <button className={`cpbtn${copied==="hook"?" ok":""}`} onClick={()=>copy(result.hook,"hook")}>{copied==="hook"?"✓ Copié":"Copier"}</button>
                  </div>
                  <div style={{fontSize:"1rem",lineHeight:1.65,color:"#ddd",fontStyle:"italic"}}>"{result.hook}"</div>
                </div>
                {/* Captions */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                  {[{k:"caption_courte",l:"⚡ Caption courte",c:"var(--teal)"},{k:"caption_longue",l:"📝 Caption longue",c:"#c084fc"}].map(({k,l,c})=>(
                    <div key={k} className="res card" style={{animationDelay:"0.1s"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                        <div style={{fontSize:"0.63rem",fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:c}}>{l}</div>
                        <button className={`cpbtn${copied===k?" ok":""}`} onClick={()=>copy(result[k],k)}>{copied===k?"✓":"Copier"}</button>
                      </div>
                      <div style={{fontSize:"0.87rem",lineHeight:1.65,color:"#ccc"}}>{result[k]}</div>
                    </div>
                  ))}
                </div>
                {/* Hashtags */}
                <div className="res card" style={{marginBottom:12,animationDelay:"0.15s"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                    <div style={{fontSize:"0.65rem",fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:"var(--muted)"}}>🏷️ Hashtags (15)</div>
                    <button className={`cpbtn${copied==="all"?" ok":""}`} onClick={()=>copy(allTags,"all")}>{copied==="all"?"✓ Tout copié !":"Copier tout"}</button>
                  </div>
                  {[{list:result.hashtags_tendance,l:"🔥 Tendance",t:"hot"},{list:result.hashtags_niche,l:"🎯 Niche",t:"niche"},{list:result.hashtags_large,l:"📢 Large",t:"lg"}].map(({list,l,t})=>(
                    <div key={l} style={{marginBottom:12}}>
                      <div style={{fontSize:"0.63rem",color:t==="hot"?"var(--accent)":t==="niche"?"var(--teal)":"var(--muted)",fontWeight:700,letterSpacing:"1px",marginBottom:7}}>{l}</div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                        {list?.map(h=>{const tag=h.startsWith("#")?h:"#"+h;return(
                          <span key={h} className="htag" onClick={()=>copy(tag,tag)} title="Cliquer pour copier" style={{background:t==="hot"?"rgba(255,92,53,0.1)":t==="niche"?"rgba(45,244,232,0.08)":"rgba(255,255,255,0.04)",color:t==="hot"?"var(--accent)":t==="niche"?"var(--teal)":"var(--muted)",border:`1px solid ${t==="hot"?"rgba(255,92,53,0.2)":t==="niche"?"rgba(45,244,232,0.15)":"var(--border)"}`,outline:copied===tag?"1.5px solid var(--teal)":"none"}}>{tag}</span>
                        )})}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Conseil */}
                <div className="res card" style={{borderLeft:"3px solid var(--gold)",marginBottom:14,animationDelay:"0.2s"}}>
                  <div style={{fontSize:"0.63rem",fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:"var(--gold)",marginBottom:8}}>💡 Conseil Pro</div>
                  <div style={{fontSize:"0.87rem",lineHeight:1.65,color:"#ccc"}}>{result.conseil}</div>
                </div>
                <button className="btn-g" onClick={generate} disabled={loading||!canGen} style={{width:"100%",justifyContent:"center"}}>🔄 Regénérer</button>
              </div>
            )}
          </>
        )}

        {tab==="history"&&(
          <div className="fi">
            {hist.length===0
              ?<div style={{textAlign:"center",padding:"70px 0",color:"var(--muted2)"}}>
                  <div style={{fontSize:"2.5rem",marginBottom:14}}>📋</div>
                  <div style={{fontFamily:"var(--ff-d)",fontWeight:700,marginBottom:8}}>Aucune génération</div>
                  <div style={{fontSize:"0.82rem"}}>Tes captions apparaîtront ici</div>
                </div>
              :hist.map((item,i)=>(
                <div key={item.id} className="card fu" style={{marginBottom:12,animationDelay:`${i*0.04}s`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                      <span style={{background:"rgba(255,92,53,0.1)",color:"var(--accent)",padding:"3px 10px",borderRadius:50,fontSize:"0.7rem",fontWeight:600}}>{item.platform}</span>
                      <span style={{background:"var(--bg3)",color:"var(--muted)",padding:"3px 10px",borderRadius:50,fontSize:"0.7rem"}}>{item.niche}</span>
                      {item.result?.score_viral&&<span style={{background:"rgba(245,200,66,0.1)",color:"var(--gold)",padding:"3px 10px",borderRadius:50,fontSize:"0.7rem",fontWeight:700}}>{item.result.score_viral}/100</span>}
                    </div>
                    <span style={{fontSize:"0.7rem",color:"var(--muted2)"}}>{item.date}</span>
                  </div>
                  <div style={{fontSize:"0.79rem",color:"var(--muted)",marginBottom:8,fontStyle:"italic"}}>"{item.desc}"</div>
                  <div style={{fontSize:"0.88rem",color:"#ccc",lineHeight:1.6,marginBottom:10}}>{item.result?.caption_courte}</div>
                  <button className={`cpbtn${copied===`h${item.id}`?" ok":""}`} onClick={()=>copy(item.result?.caption_courte,`h${item.id}`)}>
                    {copied===`h${item.id}`?"✓ Copié":"Copier la caption"}
                  </button>
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════ PRICING ═══════════ */
function Pricing({plan,onUpgrade,onBack}){
  const[billing,setBilling]=useState("month");
  return(
    <div className="noise" style={{minHeight:"100vh",background:"var(--bg)",color:"var(--text)",fontFamily:"var(--ff-b)",padding:"40px 20px"}}>
      <div className="orb" style={{width:500,height:500,background:"radial-gradient(circle,rgba(255,92,53,0.09) 0%,transparent 70%)",top:-100,left:"50%",transform:"translateX(-50%)"}}/>
      <div style={{maxWidth:840,margin:"0 auto",position:"relative",zIndex:1}}>
        <button className="btn-g" onClick={onBack} style={{marginBottom:30}}>← Retour</button>
        <div style={{textAlign:"center",marginBottom:46}}>
          <h2 className="fu" style={{fontFamily:"var(--ff-d)",fontSize:"clamp(1.8rem,5vw,3.2rem)",fontWeight:900,letterSpacing:"-1px",marginBottom:12}}>Choisis ton plan</h2>
          <p className="fu" style={{color:"var(--muted)",marginBottom:24,animationDelay:"0.07s"}}>Sans engagement · Résilie quand tu veux</p>
          <div className="fu" style={{display:"inline-flex",background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:50,padding:4,animationDelay:"0.12s"}}>
            {["month","year"].map(b=>(
              <button key={b} onClick={()=>setBilling(b)} style={{padding:"8px 22px",borderRadius:50,border:"none",background:billing===b?"var(--accent)":"transparent",color:billing===b?"#fff":"var(--muted)",fontWeight:600,fontSize:"0.82rem",cursor:"pointer",fontFamily:"var(--ff-b)",transition:"all 0.2s"}}>
                {b==="month"?"Mensuel":"Annuel"}{b==="year"&&<span style={{fontSize:"0.68rem",opacity:0.9}}> -20%</span>}
              </button>
            ))}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(235px,1fr))",gap:16}}>
          {Object.entries(PLANS).map(([key,p],i)=>{
            const price=billing==="year"&&p.price>0?Math.round(p.price*0.8):p.price;
            return(
              <div key={key} className={`fu plan-card${p.popular?" popular":""}`} style={{animationDelay:`${i*0.09}s`,background:p.popular?"linear-gradient(160deg,rgba(255,92,53,0.06),var(--bg2))":"var(--bg2)",border:p.popular?"1px solid rgba(255,92,53,0.35)":"1px solid var(--border)",borderRadius:20,padding:"30px 24px",transition:"all 0.25s",position:"relative",overflow:"hidden"}}>
                {p.popular&&<div style={{position:"absolute",top:-1,left:"50%",transform:"translateX(-50%)",background:"linear-gradient(90deg,var(--accent),var(--accent2))",color:"#fff",fontSize:"0.64rem",fontWeight:800,padding:"5px 18px",borderRadius:"0 0 10px 10px",letterSpacing:"1px"}}>⭐ POPULAIRE</div>}
                <div style={{fontFamily:"var(--ff-d)",fontWeight:800,fontSize:"1.1rem",marginBottom:8,marginTop:p.popular?12:0}}>{p.name}</div>
                <div style={{marginBottom:20}}>
                  <span style={{fontFamily:"var(--ff-d)",fontSize:"2.7rem",fontWeight:900,color:p.popular?"var(--accent)":"var(--text)"}}>{price===0?"Gratuit":`${price}€`}</span>
                  {price>0&&<span style={{color:"var(--muted)",fontSize:"0.82rem"}}> /mois</span>}
                  {billing==="year"&&price>0&&<div style={{fontSize:"0.7rem",color:"var(--teal)",marginTop:2}}>Facturé annuellement</div>}
                </div>
                <div style={{fontSize:"0.77rem",fontWeight:700,color:p.popular?"var(--accent)":"var(--muted)",marginBottom:20,background:p.popular?"rgba(255,92,53,0.1)":"var(--bg3)",padding:"6px 12px",borderRadius:8,display:"inline-block"}}>{p.label}</div>
                <div style={{marginBottom:24}}>
                  {p.features.map(f=>(
                    <div key={f} style={{display:"flex",alignItems:"flex-start",gap:9,marginBottom:9}}>
                      <span style={{color:p.popular?"var(--accent)":"var(--teal)",fontSize:"0.8rem",marginTop:1,flexShrink:0}}>✓</span>
                      <span style={{fontSize:"0.81rem",color:"#aaa",lineHeight:1.4}}>{f}</span>
                    </div>
                  ))}
                </div>
                <button className={plan===key?"btn-g":"btn-p"} onClick={()=>onUpgrade(key)} disabled={plan===key} style={{width:"100%",padding:"13px",opacity:plan===key?0.5:1}}>
                  {plan===key?"✓ Plan actuel":key==="free"?"Rester gratuit":`Choisir ${p.name}`}
                </button>
              </div>
            );
          })}
        </div>
        <div style={{textAlign:"center",marginTop:34}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:10,background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:12,padding:"12px 22px",fontSize:"0.79rem",color:"var(--muted)"}}>
            🛡️ Paiement sécurisé via Stripe · Remboursement garanti 7 jours
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════ SUCCESS ═══════════ */
function Success({plan,onContinue}){
  return(
    <div style={{minHeight:"100vh",background:"var(--bg)",color:"var(--text)",fontFamily:"var(--ff-b)",display:"flex",alignItems:"center",justifyContent:"center",textAlign:"center",padding:40}}>
      <div className="fu">
        <div style={{fontSize:"4rem",marginBottom:16}} className="float">🎉</div>
        <h2 style={{fontFamily:"var(--ff-d)",fontSize:"2.2rem",fontWeight:900,letterSpacing:"-1px",marginBottom:12}}>Bienvenue sur le plan {PLANS[plan].name} !</h2>
        <p style={{color:"var(--muted)",marginBottom:30,lineHeight:1.7}}>Tu as maintenant accès à <strong style={{color:"var(--accent)"}}>{PLANS[plan].label}</strong>.<br/>Place à la création ! 🚀</p>
        <button className="btn-p" onClick={onContinue} style={{fontSize:"1rem",padding:"15px 36px"}}>Commencer à générer →</button>
      </div>
    </div>
  );
}
