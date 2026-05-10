import { useState, useEffect, useRef } from "react";

/* ─── GLOBAL STYLES injected once ────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #070709;
    --bg2: #0d0d12;
    --bg3: #12121a;
    --border: rgba(255,255,255,0.06);
    --border-hover: rgba(255,255,255,0.12);
    --accent: #ff5c35;
    --accent2: #ff8c6b;
    --gold: #f5c842;
    --teal: #2df4e8;
    --text: #f0ede8;
    --muted: #5a5a6e;
    --muted2: #3a3a4e;
    --font-display: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    --radius: 14px;
    --radius-sm: 8px;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font-body); -webkit-font-smoothing: antialiased; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--muted2); border-radius: 4px; }

  ::selection { background: rgba(255,92,53,0.25); color: var(--text); }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; } to { opacity: 1; }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes pulse-ring {
    0%   { transform: scale(1); opacity: 0.6; }
    100% { transform: scale(1.5); opacity: 0; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-6px); }
  }
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 20px rgba(255,92,53,0.2); }
    50%       { box-shadow: 0 0 40px rgba(255,92,53,0.45); }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-12px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes countUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .fade-up  { animation: fadeUp 0.5s ease both; }
  .fade-in  { animation: fadeIn 0.4s ease both; }
  .float    { animation: float 3s ease-in-out infinite; }

  .btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 13px 28px;
    background: linear-gradient(135deg, var(--accent), #e84522);
    color: #fff; font-family: var(--font-display); font-weight: 700;
    font-size: 0.9rem; letter-spacing: 0.3px;
    border: none; border-radius: var(--radius); cursor: pointer;
    transition: all 0.2s; position: relative; overflow: hidden;
    animation: glow 3s ease-in-out infinite;
  }
  .btn-primary::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
    opacity: 0; transition: opacity 0.2s;
  }
  .btn-primary:hover::before { opacity: 1; }
  .btn-primary:hover { transform: translateY(-1px); }
  .btn-primary:active { transform: translateY(0); }
  .btn-primary:disabled {
    background: var(--bg3); color: var(--muted); cursor: not-allowed;
    box-shadow: none; animation: none;
  }

  .btn-ghost {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 11px 22px;
    background: transparent;
    color: var(--muted); font-family: var(--font-body); font-weight: 500;
    font-size: 0.85rem; border: 1px solid var(--border);
    border-radius: var(--radius); cursor: pointer;
    transition: all 0.2s;
  }
  .btn-ghost:hover { border-color: var(--border-hover); color: var(--text); background: rgba(255,255,255,0.03); }

  .card {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 22px;
    transition: border-color 0.2s;
  }
  .card:hover { border-color: var(--border-hover); }

  .chip {
    display: inline-flex; align-items: center;
    padding: 7px 15px; border-radius: 50px;
    font-size: 0.78rem; font-weight: 600; font-family: var(--font-body);
    border: 1.5px solid var(--border); background: transparent;
    color: var(--muted); cursor: pointer;
    transition: all 0.18s;
  }
  .chip:hover { border-color: var(--border-hover); color: var(--text); }
  .chip.active {
    border-color: var(--accent);
    background: rgba(255,92,53,0.1);
    color: var(--accent);
  }

  .hashtag {
    display: inline-block; padding: 5px 11px;
    border-radius: 6px; font-size: 0.76rem; font-weight: 500;
    cursor: pointer; transition: all 0.15s; user-select: none;
  }
  .hashtag:hover { transform: translateY(-1px); }

  .copy-btn {
    display: inline-flex; align-items: center; gap: 5px;
    background: var(--bg3); border: 1px solid var(--border);
    color: var(--muted); font-size: 0.72rem; font-family: var(--font-body);
    padding: 5px 12px; border-radius: 6px; cursor: pointer;
    transition: all 0.15s;
  }
  .copy-btn:hover { border-color: var(--border-hover); color: var(--text); }
  .copy-btn.copied { background: rgba(45,244,232,0.1); border-color: var(--teal); color: var(--teal); }

  .tab-btn {
    padding: 12px 20px; background: none; border: none;
    font-family: var(--font-body); font-size: 0.85rem; font-weight: 500;
    color: var(--muted); cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.18s;
  }
  .tab-btn.active { color: var(--accent); border-bottom-color: var(--accent); }
  .tab-btn:hover:not(.active) { color: var(--text); }

  .noise-bg {
    position: relative;
  }
  .noise-bg::before {
    content: '';
    position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none; z-index: 0; opacity: 0.4;
  }

  .gradient-orb {
    position: fixed; border-radius: 50%;
    filter: blur(80px); pointer-events: none; z-index: 0;
  }

  .result-section { animation: fadeUp 0.4s ease both; }

  .plan-card {
    background: var(--bg2); border: 1px solid var(--border);
    border-radius: 20px; padding: 30px 24px;
    transition: all 0.25s; position: relative; overflow: hidden;
  }
  .plan-card:hover { border-color: var(--border-hover); transform: translateY(-3px); }
  .plan-card.popular {
    border-color: var(--accent);
    background: linear-gradient(160deg, rgba(255,92,53,0.05), var(--bg2));
  }

  .stat-item { animation: countUp 0.5s ease both; }

  .progress-bar {
    height: 3px; border-radius: 3px;
    background: var(--bg3); overflow: hidden;
  }
  .progress-fill {
    height: 100%; border-radius: 3px;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    transition: width 0.6s ease;
  }

  input, textarea {
    font-family: var(--font-body);
  }
`;

/* ─── DATA ────────────────────────────────────────────────────────────────── */
const PLANS = {
  free:    { name: "Gratuit",  price: 0,  generations: 3,   label: "3 / jour",     features: ["3 générations par jour", "TikTok & Instagram", "15 hashtags", "Historique 7 jours"] },
  starter: { name: "Starter", price: 9,  generations: 50,  label: "50 / jour",    features: ["50 générations par jour", "Toutes les plateformes", "30 hashtags", "Historique 30 jours", "Export en 1 clic"] },
  pro:     { name: "Pro",     price: 19, generations: 9999, label: "Illimité ∞",   features: ["Générations illimitées", "Toutes les plateformes", "30 hashtags + analyse", "Historique illimité", "Export en 1 clic", "Support prioritaire", "Nouvelles fonctions en avant-première"], popular: true },
};

const PLATFORMS = [
  { id: "TikTok",          emoji: "🎵" },
  { id: "Instagram",       emoji: "📸" },
  { id: "YouTube Shorts",  emoji: "▶️" },
  { id: "Twitter/X",       emoji: "𝕏" },
  { id: "LinkedIn",        emoji: "💼" },
];

const NICHES = [
  { id: "Mode & Beauté",  emoji: "💄" },
  { id: "Food & Cuisine", emoji: "🍜" },
  { id: "Fitness",        emoji: "💪" },
  { id: "Voyage",         emoji: "✈️" },
  { id: "Humour",         emoji: "😂" },
  { id: "Finance",        emoji: "💰" },
  { id: "Tech",           emoji: "⚡" },
  { id: "Motivation",     emoji: "🔥" },
  { id: "Gaming",         emoji: "🎮" },
  { id: "Lifestyle",      emoji: "🌿" },
];

const TONES = [
  { id: "Viral & Accrocheur", emoji: "🚀" },
  { id: "Drôle & Décalé",     emoji: "😎" },
  { id: "Inspirant",          emoji: "✨" },
  { id: "Professionnel",      emoji: "🎯" },
  { id: "Éducatif",           emoji: "📚" },
  { id: "Mystérieux",         emoji: "🌙" },
];

/* ─── HELPERS ─────────────────────────────────────────────────────────────── */
function useLS(key, def) {
  const [val, setVal] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? def; } catch { return def; }
  });
  const set = (v) => { setVal(v); localStorage.setItem(key, JSON.stringify(v)); };
  return [val, set];
}

function StyleTag() {
  useEffect(() => {
    if (document.getElementById("caption-ai-styles")) return;
    const el = document.createElement("style");
    el.id = "caption-ai-styles";
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);
  return null;
}

/* ─── ROOT ────────────────────────────────────────────────────────────────── */
export default function App() {
  const [page, setPage]       = useLS("cai_page", "landing");
  const [plan, setPlan]       = useLS("cai_plan", "free");
  const [used, setUsed]       = useLS("cai_used", 0);
  const [reset, setReset]     = useLS("cai_reset", "");
  const [history, setHistory] = useLS("cai_history", []);

  useEffect(() => {
    const today = new Date().toDateString();
    if (reset !== today) { setUsed(0); setReset(today); }
  }, []);

  const limit      = PLANS[plan].generations;
  const canGen     = used < limit;
  const pct        = limit >= 9999 ? 0 : Math.min((used / limit) * 100, 100);

  function onGen()           { setUsed(used + 1); }
  function onSave(item)      { setHistory([item, ...history].slice(0, 60)); }
  function onUpgrade(p)      { setPlan(p); setPage("success"); }

  if (page === "landing")  return <><StyleTag /><Landing  onStart={() => setPage("app")} onPricing={() => setPage("pricing")} /></>;
  if (page === "pricing")  return <><StyleTag /><Pricing  plan={plan} onUpgrade={onUpgrade} onBack={() => setPage("app")} /></>;
  if (page === "success")  return <><StyleTag /><Success  plan={plan} onContinue={() => setPage("app")} /></>;
  return <><StyleTag /><MainApp plan={plan} canGen={canGen} used={used} limit={limit} pct={pct} onGen={onGen} onSave={onSave} history={history} onPricing={() => setPage("pricing")} onLanding={() => setPage("landing")} /></>;
}

/* ══════════════════════════════════════════════════════════════════════════
   LANDING
══════════════════════════════════════════════════════════════════════════ */
function Landing({ onStart, onPricing }) {
  const [hovered, setHovered] = useState(null);

  const STATS = [
    { value: "2 400+", label: "Créateurs actifs" },
    { value: "180K",   label: "Captions générées" },
    { value: "4.9★",   label: "Note moyenne" },
    { value: "10s",    label: "Temps de génération" },
  ];

  const TESTIMONIALS = [
    { name: "Léa M.", handle: "@leacreates", text: "J'ai gagné 3h par semaine. Mes vues ont doublé en un mois.", avatar: "L" },
    { name: "Karim D.", handle: "@kdcontent", text: "La meilleure app pour les créateurs francophones, sans hésitation.", avatar: "K" },
    { name: "Sophie B.", handle: "@sophiefitness", text: "Les hashtags générés sont vraiment ciblés. Top !", avatar: "S" },
  ];

  return (
    <div className="noise-bg" style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-body)", overflowX: "hidden", position: "relative" }}>
      {/* Orbs */}
      <div className="gradient-orb" style={{ width: 500, height: 500, background: "radial-gradient(circle, rgba(255,92,53,0.12) 0%, transparent 70%)", top: -100, right: -100 }} />
      <div className="gradient-orb" style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(45,244,232,0.06) 0%, transparent 70%)", bottom: 100, left: -100 }} />

      {/* NAV */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", borderBottom: "1px solid var(--border)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 100, background: "rgba(7,7,9,0.8)" }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.25rem", background: "linear-gradient(135deg, var(--accent), var(--accent2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          ✦ CaptionAI
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button className="btn-ghost" onClick={onPricing}>Tarifs</button>
          <button className="btn-primary" onClick={onStart}>Essayer gratuitement</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ textAlign: "center", padding: "90px 20px 70px", maxWidth: 820, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div className="fade-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,92,53,0.08)", border: "1px solid rgba(255,92,53,0.2)", borderRadius: 50, padding: "7px 18px", fontSize: "0.75rem", color: "var(--accent)", marginBottom: 28, letterSpacing: "0.5px", fontWeight: 600 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block", animation: "pulse-ring 1.5s ease-out infinite" }} />
          2 400 créateurs l'utilisent déjà
        </div>

        <h1 className="fade-up" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.4rem,7vw,4.5rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-2px", marginBottom: 22, animationDelay: "0.08s" }}>
          Des captions virales<br />
          <span style={{ background: "linear-gradient(135deg, var(--accent) 0%, var(--gold) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>en 10 secondes</span>
        </h1>

        <p className="fade-up" style={{ fontSize: "1.1rem", color: "var(--muted)", lineHeight: 1.75, maxWidth: 540, margin: "0 auto 38px", animationDelay: "0.16s" }}>
          L'IA génère ta caption parfaite + les meilleurs hashtags pour exploser sur TikTok, Instagram et YouTube Shorts. En français.
        </p>

        <div className="fade-up" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", animationDelay: "0.24s" }}>
          <button className="btn-primary" onClick={onStart} style={{ fontSize: "1rem", padding: "15px 34px" }}>
            Commencer gratuitement →
          </button>
          <button className="btn-ghost" onClick={onPricing} style={{ fontSize: "0.9rem", padding: "15px 24px" }}>
            Voir les tarifs
          </button>
        </div>
        <div className="fade-up" style={{ marginTop: 14, fontSize: "0.75rem", color: "var(--muted2)", animationDelay: "0.3s" }}>
          Sans carte bancaire · 3 générations offertes
        </div>
      </div>

      {/* STATS */}
      <div style={{ maxWidth: 760, margin: "0 auto 80px", padding: "0 20px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 16, position: "relative", zIndex: 1 }}>
        {STATS.map((s, i) => (
          <div key={s.label} className="stat-item card" style={{ textAlign: "center", padding: "22px 16px", animationDelay: `${i * 0.08}s` }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 900, color: "var(--accent)", marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: "0.78rem", color: "var(--muted)", fontWeight: 400 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <div style={{ maxWidth: 860, margin: "0 auto 80px", padding: "0 20px", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem,4vw,2.4rem)", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 10 }}>Tout ce dont tu as besoin</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>Un outil pensé pour les créateurs francophones exigeants</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 14 }}>
          {[
            { icon: "⚡", title: "Ultra rapide", desc: "Caption + hashtags générés en moins de 10 secondes grâce à Claude AI", color: "var(--gold)" },
            { icon: "🎯", title: "30 hashtags ciblés", desc: "Triés en 3 catégories : tendance, niche, et audience large", color: "var(--accent)" },
            { icon: "📱", title: "5 plateformes", desc: "TikTok, Instagram, YouTube Shorts, Twitter/X, LinkedIn", color: "var(--teal)" },
            { icon: "🪝", title: "Hook accrocheur", desc: "La phrase d'accroche parfaite pour stopper le scroll en 3 secondes", color: "#c084fc" },
            { icon: "🕐", title: "Meilleure heure", desc: "L'heure idéale pour poster selon ta plateforme et ta niche", color: "var(--accent2)" },
            { icon: "🇫🇷", title: "100% en français", desc: "Conçu pour les créateurs francophones, résultats en français", color: "var(--gold)" },
          ].map((f) => (
            <div key={f.title} className="card" style={{ padding: "24px" }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: `${f.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", marginBottom: 14 }}>{f.icon}</div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem", marginBottom: 6 }}>{f.title}</div>
              <div style={{ color: "var(--muted)", fontSize: "0.82rem", lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div style={{ maxWidth: 820, margin: "0 auto 80px", padding: "0 20px", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem,3.5vw,2.2rem)", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 8 }}>Ils adorent CaptionAI</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 14 }}>
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="card" style={{ padding: "22px" }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                {[...Array(5)].map((_, i) => <span key={i} style={{ color: "var(--gold)", fontSize: "0.85rem" }}>★</span>)}
              </div>
              <p style={{ color: "#c8c5c0", fontSize: "0.88rem", lineHeight: 1.65, marginBottom: 16, fontStyle: "italic" }}>"{t.text}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,var(--accent),var(--accent2))", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.85rem", color: "#fff" }}>{t.avatar}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.82rem" }}>{t.name}</div>
                  <div style={{ color: "var(--muted)", fontSize: "0.72rem" }}>{t.handle}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA FINAL */}
      <div style={{ textAlign: "center", padding: "60px 20px 80px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 900, letterSpacing: "-1px", marginBottom: 16 }}>
            Prêt à exploser<br />sur les réseaux ?
          </h2>
          <p style={{ color: "var(--muted)", marginBottom: 28, fontSize: "0.92rem" }}>Rejoins 2 400 créateurs qui gagnent du temps chaque jour.</p>
          <button className="btn-primary" onClick={onStart} style={{ fontSize: "1rem", padding: "16px 38px" }}>
            Commencer gratuitement →
          </button>
          <div style={{ marginTop: 10, fontSize: "0.75rem", color: "var(--muted2)" }}>Sans carte · Sans engagement</div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: "1px solid var(--border)", padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.9rem", color: "var(--muted)" }}>✦ CaptionAI</div>
        <div style={{ fontSize: "0.75rem", color: "var(--muted2)" }}>© 2025 CaptionAI · Fait avec ❤️ pour les créateurs francophones</div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════════════════════════════ */
function MainApp({ plan, canGen, used, limit, pct, onGen, onSave, history, onPricing, onLanding }) {
  const [tab,         setTab]         = useState("generate");
  const [platform,    setPlatform]    = useState("TikTok");
  const [niche,       setNiche]       = useState("Lifestyle");
  const [tone,        setTone]        = useState("Viral & Accrocheur");
  const [description, setDescription] = useState("");
  const [loading,     setLoading]     = useState(false);
  const [result,      setResult]      = useState(null);
  const [copied,      setCopied]      = useState("");
  const [error,       setError]       = useState("");
  const [step,        setStep]        = useState(1); // wizard step 1-3
  const resultRef = useRef(null);

  async function generate() {
    if (!description.trim() || !canGen || loading) return;
    setLoading(true); setResult(null); setError("");

    const prompt = `Tu es un expert en marketing digital et contenu viral francophone.

Génère une caption + hashtags optimisés pour cette vidéo :
- Plateforme : ${platform}
- Niche : ${niche}
- Ton souhaité : ${tone}
- Description : ${description}

Réponds UNIQUEMENT en JSON valide, sans markdown, sans explication :
{
  "caption_courte": "Caption 1-2 lignes ultra accrocheuse avec émojis (max 150 caractères)",
  "caption_longue": "Caption complète avec storytelling et appel à l'action (max 300 caractères)",
  "hook": "Phrase d'accroche pour les 3 premières secondes, percutante et directe",
  "hashtags_tendance": ["h1","h2","h3","h4","h5"],
  "hashtags_niche": ["h6","h7","h8","h9","h10"],
  "hashtags_large": ["h11","h12","h13","h14","h15"],
  "meilleure_heure": "ex: 19h-21h",
  "meilleur_jour": "ex: Mardi ou Jeudi",
  "score_viral": 87,
  "conseil": "1 conseil court et actionnable pour maximiser la portée"
}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const text = data.content.map(i => i.text || "").join("");
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
      onGen();
      onSave({ id: Date.now(), platform, niche, tone, description, result: parsed, date: new Date().toLocaleDateString("fr-FR") });
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch {
      setError("Erreur de génération. Vérifie ta connexion et réessaie.");
    }
    setLoading(false);
  }

  function copy(text, key) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2200);
  }

  const allTags = result
    ? [...(result.hashtags_tendance||[]), ...(result.hashtags_niche||[]), ...(result.hashtags_large||[])]
        .map(h => h.startsWith("#") ? h : "#" + h).join(" ")
    : "";

  const isLimitReached = !canGen;
  const limitPct = limit >= 9999 ? 0 : Math.min((used / limit) * 100, 100);

  return (
    <div className="noise-bg" style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-body)" }}>
      <div className="gradient-orb" style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(255,92,53,0.08) 0%, transparent 70%)", top: -80, right: -80 }} />

      {/* TOP BAR */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px", borderBottom: "1px solid var(--border)", backdropFilter: "blur(20px)", background: "rgba(7,7,9,0.85)", position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={onLanding} style={{ background: "none", border: "none", color: "transparent", fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.05rem", cursor: "pointer", backgroundImage: "linear-gradient(135deg,var(--accent),var(--accent2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          ✦ CaptionAI
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Usage indicator */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
            <div style={{ fontSize: "0.68rem", color: "var(--muted)", letterSpacing: "0.5px" }}>
              {used} / {limit >= 9999 ? "∞" : limit} générations
            </div>
            {limit < 9999 && (
              <div style={{ width: 80 }}>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${limitPct}%` }} />
                </div>
              </div>
            )}
          </div>

          {plan !== "free"
            ? <div style={{ background: "rgba(255,92,53,0.1)", border: "1px solid rgba(255,92,53,0.25)", borderRadius: 50, padding: "5px 14px", fontSize: "0.72rem", fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-display)" }}>✦ {PLANS[plan].name}</div>
            : <button className="btn-primary" onClick={onPricing} style={{ padding: "8px 16px", fontSize: "0.78rem" }}>⚡ Passer Pro</button>
          }
        </div>
      </div>

      {/* TABS */}
      <div style={{ borderBottom: "1px solid var(--border)", padding: "0 24px", display: "flex", gap: 4 }}>
        <button className={`tab-btn ${tab === "generate" ? "active" : ""}`} onClick={() => setTab("generate")}>✨ Générer</button>
        <button className={`tab-btn ${tab === "history"  ? "active" : ""}`} onClick={() => setTab("history")}>📋 Historique {history.length > 0 && `(${history.length})`}</button>
      </div>

      <div style={{ maxWidth: 740, margin: "0 auto", padding: "28px 20px 60px", position: "relative", zIndex: 1 }}>

        {/* ── GENERATE TAB ── */}
        {tab === "generate" && (
          <>
            {/* Paywall */}
            {isLimitReached && (
              <div className="fade-up" style={{ background: "linear-gradient(135deg,rgba(255,92,53,0.08),rgba(255,92,53,0.02))", border: "1px solid rgba(255,92,53,0.25)", borderRadius: 18, padding: "28px 24px", marginBottom: 24, textAlign: "center" }}>
                <div style={{ fontSize: "2.2rem", marginBottom: 10, animation: "float 3s ease-in-out infinite" }}>⚡</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.1rem", marginBottom: 8 }}>Limite quotidienne atteinte</div>
                <div style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: 20, lineHeight: 1.6 }}>Tu as utilisé tes {PLANS[plan].generations} générations gratuites aujourd'hui.<br />Passe à Pro pour des générations illimitées.</div>
                <button className="btn-primary" onClick={onPricing}>Découvrir les offres →</button>
              </div>
            )}

            {/* FORM */}
            <div className="card fade-up" style={{ padding: "26px", marginBottom: 16 }}>

              {/* Platform */}
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--muted)", marginBottom: 10 }}>📱 Plateforme</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {PLATFORMS.map(p => (
                    <button key={p.id} className={`chip ${platform === p.id ? "active" : ""}`} onClick={() => setPlatform(p.id)}>
                      {p.emoji} {p.id}
                    </button>
                  ))}
                </div>
              </div>

              {/* Niche */}
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--muted)", marginBottom: 10 }}>🎯 Ta niche</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {NICHES.map(n => (
                    <button key={n.id} className={`chip ${niche === n.id ? "active" : ""}`} onClick={() => setNiche(n.id)}>
                      {n.emoji} {n.id}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone */}
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--muted)", marginBottom: 10 }}>🎨 Ton & Style</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {TONES.map(t => (
                    <button key={t.id} className={`chip ${tone === t.id ? "active" : ""}`} onClick={() => setTone(t.id)}>
                      {t.emoji} {t.id}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--muted)", marginBottom: 10 }}>📝 Décris ta vidéo</div>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && e.metaKey && generate()}
                  placeholder="Ex: Je montre mes 3 astuces pour économiser 500€ par mois facilement et sans se priver..."
                  style={{ width: "100%", minHeight: 110, background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", color: "var(--text)", padding: "13px 15px", fontSize: "0.9rem", resize: "vertical", outline: "none", lineHeight: 1.6, transition: "border-color 0.2s", boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor = "rgba(255,92,53,0.4)"}
                  onBlur={e => e.target.style.borderColor = "var(--border)"}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  <span style={{ fontSize: "0.68rem", color: "var(--muted2)" }}>{description.length} car. · ~{Math.round(description.split(" ").filter(Boolean).length / 2.5)}s</span>
                  <span style={{ fontSize: "0.68rem", color: "var(--muted2)" }}>⌘+Entrée pour générer</span>
                </div>
              </div>

              {error && (
                <div style={{ background: "rgba(255,60,80,0.08)", border: "1px solid rgba(255,60,80,0.25)", borderRadius: 8, padding: "10px 14px", color: "#ff6070", fontSize: "0.82rem", marginBottom: 16 }}>
                  ⚠️ {error}
                </div>
              )}

              <button
                className="btn-primary"
                onClick={generate}
                disabled={loading || !description.trim() || isLimitReached}
                style={{ width: "100%", padding: "15px", fontSize: "0.95rem", justifyContent: "center" }}
              >
                {loading
                  ? <><span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} /> Génération en cours...</>
                  : "✨ Générer ma caption"
                }
              </button>
            </div>

            {/* RESULT */}
            {result && (
              <div ref={resultRef} style={{ marginTop: 20 }}>

                {/* Score viral */}
                <div className="result-section" style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                  <div style={{ flex: 1, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                    <div>
                      <div style={{ fontSize: "0.68rem", color: "var(--muted)", marginBottom: 4, letterSpacing: "1px", textTransform: "uppercase" }}>Score viral</div>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 900, color: result.score_viral >= 80 ? "var(--accent)" : result.score_viral >= 60 ? "var(--gold)" : "var(--muted)" }}>
                        {result.score_viral}<span style={{ fontSize: "0.9rem" }}>/100</span>
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="progress-bar" style={{ height: 6 }}>
                        <div className="progress-fill" style={{ width: `${result.score_viral}%`, background: result.score_viral >= 80 ? "linear-gradient(90deg,var(--accent),var(--accent2))" : "linear-gradient(90deg,var(--gold),#f0a030)" }} />
                      </div>
                    </div>
                  </div>
                  <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: "14px 18px", textAlign: "center", minWidth: 100 }}>
                    <div style={{ fontSize: "0.68rem", color: "var(--muted)", marginBottom: 4, letterSpacing: "1px", textTransform: "uppercase" }}>Poster le</div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9rem" }}>{result.meilleur_jour}</div>
                    <div style={{ color: "var(--accent)", fontWeight: 700, fontSize: "0.85rem" }}>{result.meilleure_heure}</div>
                  </div>
                </div>

                {/* Hook */}
                <div className="result-section card" style={{ borderLeft: "3px solid var(--accent)", marginBottom: 12, animationDelay: "0.05s" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--accent)" }}>🪝 Hook — 3 premières secondes</div>
                    <button className={`copy-btn ${copied === "hook" ? "copied" : ""}`} onClick={() => copy(result.hook, "hook")}>
                      {copied === "hook" ? "✓ Copié" : "Copier"}
                    </button>
                  </div>
                  <div style={{ fontSize: "1rem", lineHeight: 1.65, color: "#ddd", fontStyle: "italic" }}>"{result.hook}"</div>
                </div>

                {/* Captions */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  {[
                    { key: "caption_courte", label: "⚡ Caption courte", color: "var(--teal)" },
                    { key: "caption_longue",  label: "📝 Caption longue",  color: "#c084fc" },
                  ].map(({ key, label, color }) => (
                    <div key={key} className="result-section card" style={{ animationDelay: "0.1s" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color }}>{label}</div>
                        <button className={`copy-btn ${copied === key ? "copied" : ""}`} onClick={() => copy(result[key], key)}>
                          {copied === key ? "✓" : "Copier"}
                        </button>
                      </div>
                      <div style={{ fontSize: "0.87rem", lineHeight: 1.65, color: "#ccc" }}>{result[key]}</div>
                    </div>
                  ))}
                </div>

                {/* Hashtags */}
                <div className="result-section card" style={{ marginBottom: 12, animationDelay: "0.15s" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--muted)" }}>🏷️ Hashtags (15)</div>
                    <button className={`copy-btn ${copied === "all" ? "copied" : ""}`} onClick={() => copy(allTags, "all")}>
                      {copied === "all" ? "✓ Tout copié !" : "Copier tout"}
                    </button>
                  </div>
                  {[
                    { list: result.hashtags_tendance, label: "🔥 Tendance", cls: "hot" },
                    { list: result.hashtags_niche,    label: "🎯 Niche",    cls: "niche" },
                    { list: result.hashtags_large,    label: "📢 Large",    cls: "large" },
                  ].map(({ list, label, cls }) => (
                    <div key={label} style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: "0.65rem", color: cls === "hot" ? "var(--accent)" : cls === "niche" ? "var(--teal)" : "var(--muted)", fontWeight: 700, letterSpacing: "1px", marginBottom: 7 }}>{label}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {list?.map(h => {
                          const tag = h.startsWith("#") ? h : "#" + h;
                          return (
                            <span
                              key={h}
                              className="hashtag"
                              onClick={() => copy(tag, tag)}
                              title="Cliquer pour copier"
                              style={{
                                background: cls === "hot" ? "rgba(255,92,53,0.1)" : cls === "niche" ? "rgba(45,244,232,0.08)" : "rgba(255,255,255,0.04)",
                                color: cls === "hot" ? "var(--accent)" : cls === "niche" ? "var(--teal)" : "var(--muted)",
                                border: `1px solid ${cls === "hot" ? "rgba(255,92,53,0.2)" : cls === "niche" ? "rgba(45,244,232,0.15)" : "var(--border)"}`,
                                outline: copied === tag ? "1.5px solid var(--teal)" : "none",
                              }}
                            >
                              {tag}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Conseil */}
                <div className="result-section card" style={{ borderLeft: "3px solid var(--gold)", animationDelay: "0.2s" }}>
                  <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--gold)", marginBottom: 8 }}>💡 Conseil Pro</div>
                  <div style={{ fontSize: "0.87rem", lineHeight: 1.65, color: "#ccc" }}>{result.conseil}</div>
                </div>

                {/* Regenerate */}
                <button className="btn-ghost" onClick={generate} disabled={loading || isLimitReached} style={{ width: "100%", marginTop: 14, justifyContent: "center" }}>
                  🔄 Regénérer
                </button>
              </div>
            )}
          </>
        )}

        {/* ── HISTORY TAB ── */}
        {tab === "history" && (
          <div className="fade-in">
            {history.length === 0 ? (
              <div style={{ textAlign: "center", padding: "70px 0", color: "var(--muted2)" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: 14 }}>📋</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, marginBottom: 8 }}>Aucune génération</div>
                <div style={{ fontSize: "0.82rem" }}>Tes captions générées apparaîtront ici</div>
              </div>
            ) : history.map((item, i) => (
              <div key={item.id} className="card" style={{ marginBottom: 12, animationDelay: `${i * 0.04}s`, animation: "fadeUp 0.4s ease both" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                    <span style={{ background: "rgba(255,92,53,0.1)", color: "var(--accent)", padding: "3px 10px", borderRadius: 50, fontSize: "0.7rem", fontWeight: 600 }}>{item.platform}</span>
                    <span style={{ background: "var(--bg3)", color: "var(--muted)", padding: "3px 10px", borderRadius: 50, fontSize: "0.7rem" }}>{item.niche}</span>
                    {item.result?.score_viral && (
                      <span style={{ background: "rgba(245,200,66,0.1)", color: "var(--gold)", padding: "3px 10px", borderRadius: 50, fontSize: "0.7rem", fontWeight: 700 }}>
                        {item.result.score_viral}/100
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: "0.7rem", color: "var(--muted2)" }}>{item.date}</span>
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: 8, fontStyle: "italic" }}>"{item.description}"</div>
                <div style={{ fontSize: "0.88rem", color: "#ccc", lineHeight: 1.6 }}>{item.result?.caption_courte}</div>
                <button
                  className="copy-btn"
                  onClick={() => copy(item.result?.caption_courte, `h${item.id}`)}
                  style={{ marginTop: 10 }}
                >
                  {copied === `h${item.id}` ? "✓ Copié" : "Copier la caption"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PRICING
══════════════════════════════════════════════════════════════════════════ */
function Pricing({ plan, onUpgrade, onBack }) {
  const [billing, setBilling] = useState("month"); // month | year

  return (
    <div className="noise-bg" style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-body)", padding: "40px 20px" }}>
      <div className="gradient-orb" style={{ width: 500, height: 500, background: "radial-gradient(circle,rgba(255,92,53,0.1) 0%,transparent 70%)", top: -100, left: "50%", transform: "translateX(-50%)" }} />

      <div style={{ maxWidth: 820, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <button className="btn-ghost" onClick={onBack} style={{ marginBottom: 30 }}>← Retour</button>

        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 className="fade-up" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem,5vw,3rem)", fontWeight: 900, letterSpacing: "-1px", marginBottom: 12 }}>
            Choisis ton plan
          </h2>
          <p className="fade-up" style={{ color: "var(--muted)", marginBottom: 24, animationDelay: "0.08s" }}>Sans engagement · Résilie quand tu veux</p>

          {/* Billing toggle */}
          <div className="fade-up" style={{ display: "inline-flex", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 50, padding: 4, animationDelay: "0.12s" }}>
            {["month", "year"].map(b => (
              <button key={b} onClick={() => setBilling(b)} style={{ padding: "8px 22px", borderRadius: 50, border: "none", background: billing === b ? "var(--accent)" : "transparent", color: billing === b ? "#fff" : "var(--muted)", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer", fontFamily: "var(--font-body)", transition: "all 0.2s" }}>
                {b === "month" ? "Mensuel" : "Annuel"} {b === "year" && <span style={{ fontSize: "0.68rem", opacity: 0.9 }}>-20%</span>}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 16 }}>
          {Object.entries(PLANS).map(([key, p], i) => {
            const price = billing === "year" && p.price > 0 ? Math.round(p.price * 0.8) : p.price;
            return (
              <div key={key} className={`plan-card fade-up`} style={{ animationDelay: `${i * 0.1}s`, ...(p.popular ? { transform: "scale(1.02)" } : {}) }}>
                {p.popular && (
                  <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(90deg,var(--accent),var(--accent2))", color: "#fff", fontSize: "0.65rem", fontWeight: 800, padding: "5px 18px", borderRadius: "0 0 10px 10px", letterSpacing: "1px" }}>
                    ⭐ POPULAIRE
                  </div>
                )}

                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.1rem", marginBottom: 8, marginTop: p.popular ? 14 : 0 }}>{p.name}</div>

                <div style={{ marginBottom: 20 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "2.6rem", fontWeight: 900, color: p.popular ? "var(--accent)" : "var(--text)" }}>
                    {price === 0 ? "Gratuit" : `${price}€`}
                  </span>
                  {price > 0 && <span style={{ color: "var(--muted)", fontSize: "0.82rem" }}> /mois</span>}
                  {billing === "year" && price > 0 && <div style={{ fontSize: "0.7rem", color: "var(--teal)", marginTop: 2 }}>Facturé annuellement</div>}
                </div>

                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: p.popular ? "var(--accent)" : "var(--muted)", marginBottom: 18, background: p.popular ? "rgba(255,92,53,0.1)" : "var(--bg3)", padding: "6px 12px", borderRadius: 8, display: "inline-block" }}>
                  {p.label}
                </div>

                <div style={{ marginBottom: 22 }}>
                  {p.features.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 9, marginBottom: 9 }}>
                      <span style={{ color: p.popular ? "var(--accent)" : "var(--teal)", fontSize: "0.8rem", marginTop: 1, flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: "0.82rem", color: "#aaa", lineHeight: 1.4 }}>{f}</span>
                    </div>
                  ))}
                </div>

                <button
                  className={plan === key ? "btn-ghost" : "btn-primary"}
                  onClick={() => onUpgrade(key)}
                  disabled={plan === key}
                  style={{ width: "100%", justifyContent: "center", padding: "13px", opacity: plan === key ? 0.5 : 1 }}
                >
                  {plan === key ? "✓ Plan actuel" : key === "free" ? "Rester gratuit" : `Choisir ${p.name}`}
                </button>
              </div>
            );
          })}
        </div>

        {/* Guarantee */}
        <div style={{ textAlign: "center", marginTop: 36 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 20px", fontSize: "0.8rem", color: "var(--muted)" }}>
            <span style={{ fontSize: "1.1rem" }}>🛡️</span>
            Paiement sécurisé via Stripe · Remboursement garanti 7 jours
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   SUCCESS
══════════════════════════════════════════════════════════════════════════ */
function Success({ plan, onContinue }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-body)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 40 }}>
      <div className="fade-up">
        <div style={{ fontSize: "4rem", marginBottom: 16, animation: "float 3s ease-in-out infinite" }}>🎉</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2.2rem", fontWeight: 900, letterSpacing: "-1px", marginBottom: 12 }}>
          Bienvenue sur le plan {PLANS[plan].name} !
        </h2>
        <p style={{ color: "var(--muted)", marginBottom: 30, lineHeight: 1.7 }}>
          Tu as maintenant accès à <strong style={{ color: "var(--accent)" }}>{PLANS[plan].label}</strong>.<br />
          Place à la création ! 🚀
        </p>
        <button className="btn-primary" onClick={onContinue} style={{ fontSize: "1rem", padding: "15px 34px" }}>
          Commencer à générer →
        </button>
      </div>
    </div>
  );
}
