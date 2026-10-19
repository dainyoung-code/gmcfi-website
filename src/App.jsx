import { useState, useEffect, useRef } from "react";
import { DEFAULT_CONTENT, mergeContent, toEmbedUrl, tr, UI, LANGS, initialLang } from "./content.js";

const LOGO_SRC = "/logo.png";

/* ── Helpers ── */
function getNextService(weekday = 0, time = "10:00") {
  const now = new Date();
  const [h, m] = String(time).split(":").map(Number);
  const d = new Date(now);
  d.setDate(d.getDate() + ((weekday - d.getDay() + 7) % 7));
  d.setHours(h || 0, m || 0, 0, 0);
  // Jos tämän päivän tilaisuus on jo päättynyt (2 h), näytä seuraava viikko
  if (d.getTime() + 2 * 3600 * 1000 < now.getTime()) d.setDate(d.getDate() + 7);
  return d;
}

function useFadeIn(threshold = 0.15) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

function Fade({ children, delay = 0, style = {} }) {
  const [ref, vis] = useFadeIn();
  return <div ref={ref} style={{ ...style, opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(24px)", transition: `opacity .6s ease ${delay}s, transform .6s ease ${delay}s` }}>{children}</div>;
}

/* ── Tiny SVG icons ── */
const Ic = ({ d, s = 20 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>;
const IcMenu = () => <Ic d="M3 6h18M3 12h18M3 18h18" s={26} />;
const IcX = () => <Ic d="M18 6L6 18M6 6l12 12" s={26} />;
const IcChev = () => <Ic d="M9 18l6-6-6-6" s={14} />;
const IcMap = () => <Ic d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z" />;
const IcClock = () => <Ic d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 4v6l4 2" />;
const IcMail = () => <Ic d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm18 2l-10 7L2 6" />;
const IcHeart = () => <Ic d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />;
const IcBook = () => <Ic d="M4 19.5A2.5 2.5 0 016.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />;
const IcGlobe = () => <Ic d="M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10A15.3 15.3 0 0112 2z" />;
const IcPhone = () => <Ic d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z" />;
const IcPlay = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>;

/* ── Link with arrow ── */
function ArrowLink({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: "none", border: "none", cursor: "pointer", padding: 0,
      fontSize: 14, fontWeight: 600, color: "#6B2737",
      display: "inline-flex", alignItems: "center", gap: 6,
      fontFamily: "inherit", transition: "gap .2s", textAlign: "left"
    }}
      onMouseEnter={e => e.currentTarget.style.gap = "10px"}
      onMouseLeave={e => e.currentTarget.style.gap = "6px"}
    >{children} <IcChev /></button>
  );
}

const VISUALS = [
  { icon: "✝", grad: "linear-gradient(135deg,#6B2737,#9b4a5c)" },
  { icon: "☀", grad: "linear-gradient(135deg,#c98b5a,#e3b47c)" },
  { icon: "✦", grad: "linear-gradient(135deg,#3a4a6b,#5d7096)" },
  { icon: "♪", grad: "linear-gradient(135deg,#4f6b4a,#7c9a6f)" },
  { icon: "★", grad: "linear-gradient(135deg,#8a3b4c,#b5677a)" },
  { icon: "♥", grad: "linear-gradient(135deg,#7a5a3a,#a8835c)" },
];
const vis = i => VISUALS[i % VISUALS.length];
const ABOUT_ICONS = [<IcGlobe key="g" />, <IcBook key="b" />, <IcHeart key="h" />];

function MediaBox({ image, label, grad, icon, height, caption }) {
  return (
    <div style={{ position: "relative", height, background: image ? "#ddd" : grad, overflow: "hidden" }}>
      {image
        ? <img src={image} alt={label} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        : <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 54, color: "rgba(255,255,255,0.35)" }}>{icon}</div>}
      {caption && <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "28px 14px 12px", background: "linear-gradient(transparent, rgba(0,0,0,0.55))", color: "#fff", fontSize: 14, fontWeight: 600 }}>{label}</div>}
    </div>
  );
}

/* ── Language switcher ── */
function LangSwitch({ lang, setLang, label }) {
  return (
    <div role="group" aria-label={label} style={{ display: "inline-flex", border: "1px solid #e5e0da", borderRadius: 999, padding: 2, background: "#fff" }}>
      {LANGS.map(l => (
        <button key={l.code} onClick={() => setLang(l.code)} aria-pressed={lang === l.code} title={l.label} style={{
          border: "none", cursor: "pointer", borderRadius: 999, padding: "6px 10px", fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
          fontFamily: "inherit", background: lang === l.code ? "#6B2737" : "transparent", color: lang === l.code ? "#fff" : "#666",
        }}>{l.short}</button>
      ))}
    </div>
  );
}

const H2 = { fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, color: "#1a1a2e", marginBottom: 40 };
const KICKER = { fontSize: 11, fontWeight: 700, letterSpacing: 2.5, color: "#6B2737", marginBottom: 10 };

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [video, setVideo] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [c, setC] = useState(DEFAULT_CONTENT);
  const [lang, setLangState] = useState(initialLang);

  const setLang = l => {
    setLangState(l); setMenuOpen(false);
    try { localStorage.setItem("gmcfi-lang", l); } catch { /* ignore */ }
  };
  const t = UI[lang];
  const T = v => tr(v, lang);
  const locale = LANGS.find(l => l.code === lang).locale;

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = { fi: "GMCFI – Grace Montagnard Alliance Church Finland", en: "GMCFI – Grace Montagnard Alliance Church Finland", vi: "GMCFI – Hội Thánh Grace Montagnard Alliance Phần Lan" }[lang];
  }, [lang]);

  useEffect(() => {
    fetch("/api/content").then(r => r.ok ? r.json() : null).then(d => { if (d?.content) setC(mergeContent(d.content)); }).catch(() => {});
  }, []);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    if (!video && !photo) return;
    const h = e => { if (e.key === "Escape") { setVideo(null); setPhoto(null); } };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [video, photo]);

  const scrollTo = id => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };

  const weekday = Number(c.service.weekday) || 0;
  const nextSun = getNextService(weekday, c.service.time);
  const nextStr = nextSun.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" });
  const nextSunStr = nextStr.charAt(0).toUpperCase() + nextStr.slice(1);

  const mainLinks = [[t.nav.pray, "pray"], [t.nav.serve, "activities"], [t.nav.give, "contact"]];
  const subLinks = [[t.nav.about, "about"], [t.nav.believe, "believe"], [t.nav.activities, "activities"], [t.nav.gallery, "gallery"], [t.nav.contact, "contact"]];
  const bodyFont = lang === "vi" ? "'Be Vietnam Pro', sans-serif" : "'DM Sans', sans-serif";

  return (
    <div style={{ fontFamily: bodyFont, color: "#222", background: "#fff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Be+Vietnam+Pro:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}html{scroll-behavior:smooth}body{overflow-x:hidden}
        ::selection{background:#6B2737;color:#fff}
        @media(max-width:960px){.dt{display:none!important}.mb{display:flex!important}}
        @media(min-width:961px){.mb{display:none!important}}
      `}</style>

      {/* ═══ TOPBAR ═══ */}
      <div style={{ background: "#6B2737", padding: "8px 24px", fontSize: 12, color: "rgba(255,255,255,0.85)", textAlign: "center", letterSpacing: 0.3 }}>
        {t.nextService}: <strong>{nextSunStr} {t.at} {c.service.time}</strong> · {c.service.address}
      </div>

      {/* ═══ NAV ═══ */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 1000,
        background: scrolled ? "rgba(255,255,255,0.98)" : "#fff",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        boxShadow: scrolled ? "0 1px 0 rgba(0,0,0,0.06)" : "none",
        transition: "box-shadow .3s", borderBottom: "1px solid #eee"
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68, padding: "0 24px", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => scrollTo("hero")}>
            <img src={LOGO_SRC} alt="GMCFI" style={{ height: 50, objectFit: "contain" }} />
          </div>

          <div className="dt" style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {mainLinks.map(([l, id]) => (
              <button key={l} onClick={() => scrollTo(id)} style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "8px 12px", fontSize: 13, fontWeight: 600, color: "#444", fontFamily: "inherit", letterSpacing: 0.3
              }}>{l}</button>
            ))}
            <div style={{ width: 1, height: 24, background: "#e5e5e5", margin: "0 8px" }} />
            {subLinks.map(([l, id]) => (
              <button key={l} onClick={() => scrollTo(id)} style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "8px 10px", fontSize: 13, fontWeight: 500, color: "#666", fontFamily: "inherit"
              }}>{l}</button>
            ))}
            <div style={{ marginLeft: 10 }}><LangSwitch lang={lang} setLang={setLang} label={t.language} /></div>
          </div>

          <div className="mb" style={{ display: "none", alignItems: "center", gap: 8 }}>
            <LangSwitch lang={lang} setLang={setLang} label={t.language} />
            <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu" style={{
              background: "none", border: "none", cursor: "pointer", color: "#333", padding: 8, display: "flex"
            }}>{menuOpen ? <IcX /> : <IcMenu />}</button>
          </div>
        </div>
        {menuOpen && (
          <div style={{ background: "#fff", padding: "8px 24px 20px", borderTop: "1px solid #eee" }}>
            {[...mainLinks, ...subLinks].map(([l, id], i) => (
              <button key={i} onClick={() => scrollTo(id)} style={{
                display: "block", width: "100%", textAlign: "left", background: "none", border: "none",
                cursor: "pointer", fontSize: 15, fontWeight: 600, color: "#333", padding: "13px 0",
                borderBottom: "1px solid #f5f5f5", fontFamily: "inherit"
              }}>{l}</button>
            ))}
          </div>
        )}
      </nav>

      {/* ═══ HERO ═══ */}
      <section id="hero" style={{
        position: "relative", overflow: "hidden",
        background: "linear-gradient(135deg, #faf5f0 0%, #f5ede5 50%, #efe4da 100%)",
        padding: "80px 24px 100px"
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 60, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 450px", minWidth: 280 }}>
            <Fade>
              <h1 style={{
                fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px, 6vw, 64px)",
                fontWeight: 800, color: "#1a1a2e", lineHeight: 1.12, marginBottom: 24, letterSpacing: -1
              }}>
                {T(c.hero.title).split("\n").map((l, i) => <span key={i}>{i > 0 && <br />}{l}</span>)}
              </h1>
            </Fade>
            <Fade delay={0.1}>
              <p style={{ fontSize: 18, lineHeight: 1.8, color: "#555", maxWidth: 480, marginBottom: 36 }}>{T(c.hero.text)}</p>
            </Fade>
            <Fade delay={0.2}>
              <ArrowLink onClick={() => scrollTo("about")}>{t.discover}</ArrowLink>
            </Fade>
          </div>
          <Fade delay={0.15} style={{ flex: "0 1 380px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src="/symbols.png" alt="" style={{
                width: "clamp(220px, 30vw, 380px)", objectFit: "contain",
                filter: "drop-shadow(0 8px 24px rgba(107,39,55,0.1))"
              }} />
            </div>
          </Fade>
        </div>
      </section>

      {/* ═══ THREE CARDS ═══ */}
      <section id="about" style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
          {c.about.map((card, i) => {
            const target = i === 2 ? "activities" : "believe";
            return (
              <Fade key={i} delay={i * 0.1}>
                <div style={{ padding: "40px 32px", borderRadius: 4, border: "1px solid #eee", background: "#fff", transition: "box-shadow .3s, transform .3s", cursor: "pointer", height: "100%" }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
                  onClick={() => scrollTo(target)}
                >
                  <div style={{ color: "#6B2737", marginBottom: 20 }}>{ABOUT_ICONS[i % 3]}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, color: "#6B2737", marginBottom: 14 }}>{T(card.label)}</div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#1a1a2e", marginBottom: 14, lineHeight: 1.25 }}>{T(card.title)}</h3>
                  <p style={{ fontSize: 15, lineHeight: 1.8, color: "#666", marginBottom: 20 }}>{T(card.text)}</p>
                  <ArrowLink onClick={() => scrollTo(target)}>{t.readMore}</ArrowLink>
                </div>
              </Fade>
            );
          })}
        </div>
      </section>

      {/* ═══ WHAT'S HAPPENING ═══ */}
      <section style={{ padding: "60px 24px 80px", background: "#f9f6f2" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Fade>
            <div style={KICKER}>{t.newsLabel}</div>
            <h2 style={H2}>{t.newsTitle}</h2>
          </Fade>
          <Fade delay={0.1}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32, background: "#fff", borderRadius: 4, overflow: "hidden", border: "1px solid #eee" }}>
              {c.news.image
                ? <img src={c.news.image} alt={T(c.news.title)} style={{ width: "100%", height: "100%", minHeight: 280, objectFit: "cover", display: "block" }} />
                : <div style={{ minHeight: 280, background: "linear-gradient(135deg, #6B2737 0%, #8B4555 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 48, fontWeight: 800, color: "rgba(255,255,255,0.9)", fontFamily: "'Playfair Display', serif", letterSpacing: 2 }}>GMCFI</div>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", letterSpacing: 3, marginTop: 8 }}>{t.church}</div>
                    </div>
                  </div>}
              <div style={{ padding: "40px 36px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#6B2737", marginBottom: 12 }}>{T(c.news.label)}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: "#1a1a2e", marginBottom: 14, lineHeight: 1.25 }}>{T(c.news.title)}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.8, color: "#666", marginBottom: 24, whiteSpace: "pre-line" }}>{T(c.news.text)}</p>
                <ArrowLink onClick={() => scrollTo("activities")}>{t.moreInfo}</ArrowLink>
              </div>
            </div>
          </Fade>
        </div>
      </section>

      {/* ═══ BELIEFS ═══ */}
      <section id="believe" style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Fade>
            <div style={KICKER}>{t.beliefsLabel}</div>
            <h2 style={H2}>{t.beliefsTitle}</h2>
          </Fade>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
            {c.beliefs.map((s, i) => (
              <Fade key={i} delay={i * 0.1}>
                <div style={{ border: "1px solid #eee", borderRadius: 4, overflow: "hidden", height: "100%" }}>
                  <div style={{ height: 6, background: "#6B2737" }} />
                  <div style={{ padding: "32px 28px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#6B2737", marginBottom: 12 }}>{T(s.cat)}</div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#1a1a2e", marginBottom: 12, lineHeight: 1.3 }}>{T(s.title)}</h3>
                    <p style={{ fontSize: 15, lineHeight: 1.8, color: "#666" }}>{T(s.text)}</p>
                  </div>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRAY / SERVE / GIVE ═══ */}
      <section id="pray" style={{ padding: "80px 24px", background: "#f9f6f2" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32 }}>
          {t.psg.map((item, i) => (
            <Fade key={i} delay={i * 0.1}>
              <div style={{ textAlign: "center", padding: "48px 32px", background: "#fff", border: "1px solid #eee", borderRadius: 4, transition: "box-shadow .3s", cursor: "pointer", height: "100%" }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.08)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
                onClick={() => scrollTo("contact")}
              >
                <div style={{ fontSize: 40, marginBottom: 20 }}>{item.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#1a1a2e", marginBottom: 12 }}>{item.title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: "#666", marginBottom: 20 }}>{item.text}</p>
                <ArrowLink onClick={() => scrollTo("contact")}>{item.link}</ArrowLink>
              </div>
            </Fade>
          ))}
        </div>
      </section>

      {/* ═══ ACTIVITIES ═══ */}
      <section id="activities" style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Fade>
            <div style={KICKER}>{t.actLabel}</div>
            <h2 style={H2}>{t.actTitle}</h2>
          </Fade>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 28 }}>
            {c.activities.map((s, i) => (
              <Fade key={i} delay={i * 0.08}>
                <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 6, overflow: "hidden", height: "100%", display: "flex", flexDirection: "column", transition: "box-shadow .3s, transform .3s" }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
                >
                  <MediaBox image={s.image} label={T(s.title)} grad={vis(i).grad} icon={vis(i).icon} height={180} />
                  <div style={{ padding: "22px 22px 24px", display: "flex", flexDirection: "column", flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#999", textTransform: "uppercase", marginBottom: 6 }}>{T(s.day)}</div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#6B2737", marginBottom: 8 }}>{s.time}</div>
                    <h4 style={{ fontSize: 17, fontWeight: 700, color: "#1a1a2e", marginBottom: 8 }}>{T(s.title)}</h4>
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: "#666", marginBottom: 20, flex: 1 }}>{T(s.desc)}</p>
                    {toEmbedUrl(s.video) && <button onClick={() => setVideo(s)} style={{
                      alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 8,
                      background: "#6B2737", color: "#fff", border: "none", borderRadius: 999,
                      padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit"
                    }}><IcPlay /> {t.watch}</button>}
                  </div>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ GALLERY ═══ */}
      <section id="gallery" style={{ padding: "80px 24px", background: "#f9f6f2" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Fade>
            <div style={KICKER}>{t.galLabel}</div>
            <h2 style={H2}>{t.galTitle}</h2>
          </Fade>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
            {c.gallery.map((g, i) => (
              <Fade key={i} delay={i * 0.05}>
                <div onClick={() => g.image && setPhoto(g)} style={{ borderRadius: 6, overflow: "hidden", cursor: g.image ? "zoom-in" : "default" }}>
                  <MediaBox image={g.image} label={T(g.caption)} grad={vis(i).grad} icon={vis(i).icon} height={200} caption />
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ VIDEO MODAL ═══ */}
      {video && (
        <div onClick={() => setVideo(null)} style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(10,10,20,0.85)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 860, background: "#000", borderRadius: 8, overflow: "hidden", position: "relative" }}>
            <button onClick={() => setVideo(null)} aria-label={t.close} style={{ position: "absolute", top: 8, right: 8, zIndex: 2, background: "rgba(255,255,255,0.15)", color: "#fff", border: "none", borderRadius: "50%", width: 40, height: 40, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><IcX /></button>
            {toEmbedUrl(video.video) ? (
              <div style={{ position: "relative", paddingTop: "56.25%" }}>
                <iframe src={toEmbedUrl(video.video) + "?autoplay=1"} title={T(video.title)} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} />
              </div>
            ) : (
              <div style={{ padding: "72px 32px", textAlign: "center", color: "#fff", background: "linear-gradient(135deg,#6B2737,#3a1520)" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, marginBottom: 10 }}>{T(video.title)}</div>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)" }}>{t.videoSoon}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ PHOTO MODAL ═══ */}
      {photo && (
        <div onClick={() => setPhoto(null)} style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(10,10,20,0.9)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, cursor: "zoom-out" }}>
          <img src={photo.image} alt={T(photo.caption)} style={{ maxWidth: "100%", maxHeight: "90vh", borderRadius: 6 }} />
        </div>
      )}

      {/* ═══ BIBLE VERSE ═══ */}
      <section style={{ padding: "80px 24px", background: "#6B2737", textAlign: "center" }}>
        <Fade>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <div style={{ fontSize: 64, color: "rgba(255,255,255,0.15)", fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>"</div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(18px, 3vw, 26px)", lineHeight: 1.8, color: "rgba(255,255,255,0.9)", fontStyle: "italic", marginTop: -12, marginBottom: 24 }}>
              {T(c.verse.text)}
            </p>
            <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.45)", letterSpacing: 2, textTransform: "uppercase" }}>{T(c.verse.ref)}</div>
          </div>
        </Fade>
      </section>

      {/* ═══ CONTACT ═══ */}
      <section id="contact" style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Fade>
            <div style={KICKER}>{t.contactLabel}</div>
            <h2 style={H2}>{t.contactTitle}</h2>
          </Fade>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))", gap: 32 }}>
            <Fade delay={0.05}>
              <div>
                {[
                  { icon: <IcMap />, label: t.address, val: c.service.address },
                  { icon: <IcMail />, label: t.email, val: c.contact.email, href: `mailto:${c.contact.email}` },
                  c.contact.phone && { icon: <IcPhone />, label: t.phone, val: c.contact.phone, href: `tel:${c.contact.phone.replace(/\s/g, "")}` },
                  { icon: <IcClock />, label: t.service, val: t.weekly(t.weekdays[weekday], c.service.time) },
                ].filter(Boolean).map((row, i) => (
                  <div key={i} style={{ display: "flex", gap: 18, alignItems: "flex-start", marginBottom: 32 }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#faf5f0", color: "#6B2737", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{row.icon}</div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#999", marginBottom: 4 }}>{row.label}</div>
                      {row.href
                        ? <a href={row.href} style={{ fontSize: 16, color: "#6B2737", fontWeight: 500, textDecoration: "none", wordBreak: "break-word" }}>{row.val}</a>
                        : <div style={{ fontSize: 16, color: "#333" }}>{row.val}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </Fade>
            <Fade delay={0.15}>
              <div style={{ borderRadius: 4, overflow: "hidden", border: "1px solid #eee", minHeight: 320 }}>
                <iframe title="Map" src={`https://maps.google.com/maps?q=${encodeURIComponent(c.service.address)}&z=15&hl=${lang}&output=embed`}
                  width="100%" height="100%" style={{ border: 0, minHeight: 320, display: "block" }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            </Fade>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ background: "#1a1a2e", color: "rgba(255,255,255,0.5)", padding: "60px 24px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 40, marginBottom: 48 }}>
            <div>
              <div style={{ marginBottom: 16 }}>
                <img src={LOGO_SRC} alt="GMCFI" style={{ height: 50, objectFit: "contain" }} />
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,0.35)" }}>
                Grace Montagnard Alliance<br />Church Finland
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>{t.site}</h4>
              {subLinks.map(([l, id]) => (
                <div key={l} style={{ marginBottom: 8 }}>
                  <button onClick={() => scrollTo(id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: 13, color: "rgba(255,255,255,0.35)", fontFamily: "inherit" }}>{l}</button>
                </div>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>{t.contactLabel}</h4>
              <p style={{ fontSize: 13, lineHeight: 2, color: "rgba(255,255,255,0.35)" }}>
                {c.service.address}<br />{c.contact.email}{c.contact.phone && <><br />{c.contact.phone}</>}
              </p>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
            <div>© {new Date().getFullYear()} Grace Montagnard Alliance Church Finland</div>
            <a href="/admin" style={{ color: "rgba(255,255,255,0.25)", textDecoration: "none" }}>{t.admin}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
