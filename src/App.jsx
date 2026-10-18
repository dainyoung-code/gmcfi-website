import { useState, useEffect, useRef } from "react";
import { DEFAULT_CONTENT, mergeContent, toEmbedUrl, WEEKDAYS } from "./content.js";

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
const IcUsers = () => <Ic d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />;
const IcGlobe = () => <Ic d="M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10A15.3 15.3 0 0112 2z" />;
const IcPhone = () => <Ic d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z" />;
const IcSearch = () => <Ic d="M11 3a8 8 0 100 16 8 8 0 000-16zM21 21l-4.35-4.35" />;

const NAV = [
  { l: "Rukous", id: "pray" },
  { l: "Palvelu", id: "activities" },
  { l: "Lahjoitus", id: "contact" },
];

/* ── Link with arrow ── */
function ArrowLink({ children, onClick, dark }) {
  return (
    <button onClick={onClick} style={{
      background: "none", border: "none", cursor: "pointer", padding: 0,
      fontSize: 14, fontWeight: 600, color: dark ? "#fff" : "#6B2737",
      display: "inline-flex", alignItems: "center", gap: 6,
      fontFamily: "'DM Sans', sans-serif", transition: "gap .2s"
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

const IcPlay = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>;

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [video, setVideo] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [c, setC] = useState(DEFAULT_CONTENT);

  useEffect(() => {
    fetch("/api/content").then(r => r.ok ? r.json() : null).then(d => { if (d?.content) setC(mergeContent(d.content)); }).catch(() => {});
  }, []);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const scrollTo = id => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };

  const nextSun = getNextService(Number(c.service.weekday) || 0, c.service.time);
  const nextSunStr = nextSun.toLocaleDateString("fi-FI", { weekday: "long", day: "numeric", month: "long" });
  const serviceDay = WEEKDAYS[Number(c.service.weekday) || 0];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#222", background: "#fff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}html{scroll-behavior:smooth}body{overflow-x:hidden}
        ::selection{background:#6B2737;color:#fff}
        @media(max-width:840px){.dt{display:none!important}.mb{display:flex!important}}
        @media(min-width:841px){.mb{display:none!important}}
      `}</style>

      {/* ═══ TOPBAR ═══ */}
      <div style={{ background: "#6B2737", padding: "8px 24px", fontSize: 12, color: "rgba(255,255,255,0.85)", textAlign: "center", letterSpacing: 0.3 }}>
        Seuraava jumalanpalvelus: <strong>{nextSunStr.charAt(0).toUpperCase() + nextSunStr.slice(1)} klo {c.service.time}</strong> · {c.service.address}
      </div>

      {/* ═══ NAV ═══ */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 1000,
        background: scrolled ? "rgba(255,255,255,0.98)" : "#fff",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        boxShadow: scrolled ? "0 1px 0 rgba(0,0,0,0.06)" : "none",
        transition: "box-shadow .3s", borderBottom: "1px solid #eee"
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68, padding: "0 24px" }}>
          {/* Logo — CMA style */}
          <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => scrollTo("hero")}>
            <img src={LOGO_SRC} alt="GMCFI" style={{ height: 50, objectFit: "contain" }} />
          </div>

          {/* Desktop links */}
          <div className="dt" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {NAV.map(n => (
              <button key={n.id} onClick={() => scrollTo(n.id)} style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "8px 16px", fontSize: 13, fontWeight: 600, color: "#444",
                fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.3
              }}>{n.l}</button>
            ))}
            <div style={{ width: 1, height: 24, background: "#e5e5e5", margin: "0 8px" }} />
            {[["Tietoa meistä","about"],["Usko","believe"],["Toiminta","activities"],["Galleria","gallery"],["Yhteystiedot","contact"]].map(([l, id]) => (
              <button key={id} onClick={() => scrollTo(id)} style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "8px 14px", fontSize: 13, fontWeight: 500, color: "#666",
                fontFamily: "'DM Sans', sans-serif"
              }}>{l}</button>
            ))}
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 8, color: "#666" }}><IcSearch /></button>
          </div>

          <button className="mb" onClick={() => setMenuOpen(!menuOpen)} style={{
            background: "none", border: "none", cursor: "pointer", color: "#333", padding: 8, display: "none"
          }}>{menuOpen ? <IcX /> : <IcMenu />}</button>
        </div>
        {menuOpen && (
          <div style={{ background: "#fff", padding: "8px 24px 20px", borderTop: "1px solid #eee" }}>
            {[["Rukous","pray"],["Palvelu","activities"],["Lahjoitus","contact"],["Tietoa meistä","about"],["Usko","believe"],["Toiminta","activities"],["Galleria","gallery"],["Yhteystiedot","contact"]].map(([l, id], i) => (
              <button key={i} onClick={() => scrollTo(id)} style={{
                display: "block", width: "100%", textAlign: "left", background: "none", border: "none",
                cursor: "pointer", fontSize: 15, fontWeight: 600, color: "#333", padding: "13px 0",
                borderBottom: "1px solid #f5f5f5", fontFamily: "'DM Sans', sans-serif"
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
                fontFamily: "'Playfair Display', serif", fontSize: "clamp(38px, 6vw, 64px)",
                fontWeight: 800, color: "#1a1a2e", lineHeight: 1.08, marginBottom: 24, letterSpacing: -1
              }}>
                {c.hero.title.split("\n").map((l, i) => <span key={i}>{i > 0 && <br />}{l}</span>)}
              </h1>
            </Fade>
            <Fade delay={0.1}>
              <p style={{ fontSize: 18, lineHeight: 1.8, color: "#555", maxWidth: 460, marginBottom: 36 }}>
                {c.hero.text}
              </p>
            </Fade>
            <Fade delay={0.2}>
              <ArrowLink onClick={() => scrollTo("about")}>Tutustu seurakuntaan</ArrowLink>
            </Fade>
          </div>
          <Fade delay={0.15} style={{ flex: "0 1 380px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src="/symbols.png" alt="Risti, kruunu, malja, Raamattu" style={{
                width: "clamp(220px, 30vw, 380px)", objectFit: "contain",
                filter: "drop-shadow(0 8px 24px rgba(107,39,55,0.1))"
              }} />
            </div>
          </Fade>
        </div>
      </section>

      {/* ═══ THREE CARDS: Who / Believe / Do ═══ */}
      <section id="about" style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
          {c.about.map((card, i) => ({ ...card, icon: ABOUT_ICONS[i % 3], id: i === 2 ? "activities" : "believe" })).map((c, i) => (
            <Fade key={i} delay={i * 0.1}>
              <div style={{
                padding: "40px 32px", borderRadius: 4,
                border: "1px solid #eee", background: "#fff",
                transition: "box-shadow .3s, transform .3s", cursor: "pointer"
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
                onClick={() => scrollTo(c.id)}
              >
                <div style={{ color: "#6B2737", marginBottom: 20 }}>{c.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, color: "#6B2737", marginBottom: 14 }}>{c.label}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#1a1a2e", marginBottom: 14, lineHeight: 1.2 }}>{c.title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.8, color: "#666", marginBottom: 20 }}>{c.text}</p>
                <ArrowLink onClick={() => scrollTo(c.id)}>Lue lisää</ArrowLink>
              </div>
            </Fade>
          ))}
        </div>
      </section>

      {/* ═══ WHAT'S HAPPENING ═══ */}
      <section style={{ padding: "60px 24px 80px", background: "#f9f6f2" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Fade>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, color: "#6B2737", marginBottom: 10 }}>AJANKOHTAISTA</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, color: "#1a1a2e", marginBottom: 40 }}>Mitä tapahtuu</h2>
          </Fade>
          <Fade delay={0.1}>
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32,
              background: "#fff", borderRadius: 4, overflow: "hidden",
              border: "1px solid #eee"
            }}>
              {c.news.image ? <img src={c.news.image} alt={c.news.title} style={{ width: "100%", height: "100%", minHeight: 280, objectFit: "cover", display: "block" }} /> : <div style={{
                minHeight: 280,
                background: "linear-gradient(135deg, #6B2737 0%, #8B4555 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: 40
              }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 48, fontWeight: 800, color: "rgba(255,255,255,0.9)", fontFamily: "'Playfair Display', serif", letterSpacing: 2 }}>GMCFI</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", letterSpacing: 3, marginTop: 8 }}>SEURAKUNTA</div>
                </div>
              </div>}
              <div style={{ padding: "40px 36px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#6B2737", marginBottom: 12 }}>{c.news.label}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: "#1a1a2e", marginBottom: 14, lineHeight: 1.2 }}>
                  {c.news.title}
                </h3>
                <p style={{ fontSize: 15, lineHeight: 1.8, color: "#666", marginBottom: 24 }}>
                  {c.news.text}
                </p>
                <ArrowLink onClick={() => scrollTo("activities")}>Lisätietoja</ArrowLink>
              </div>
            </div>
          </Fade>
        </div>
      </section>

      {/* ═══ FEATURED STORIES ═══ */}
      <section id="believe" style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Fade>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, color: "#6B2737", marginBottom: 10 }}>USKO JA ELÄMÄ</div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, color: "#1a1a2e" }}>Uskon perusteet</h2>
              </div>
            </div>
          </Fade>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
            {c.beliefs.map((s, i) => (
              <Fade key={i} delay={i * 0.1}>
                <div style={{
                  border: "1px solid #eee", borderRadius: 4, overflow: "hidden",
                  transition: "box-shadow .3s, transform .3s", cursor: "pointer"
                }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
                >
                  <div style={{ height: 6, background: "#6B2737" }} />
                  <div style={{ padding: "32px 28px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#6B2737", marginBottom: 12 }}>{s.cat}</div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#1a1a2e", marginBottom: 12, lineHeight: 1.3 }}>{s.title}</h3>
                    <p style={{ fontSize: 15, lineHeight: 1.8, color: "#666", marginBottom: 20 }}>{s.text}</p>
                    <ArrowLink>Lue lisää</ArrowLink>
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
          {[
            { icon: "🙏", title: "Rukous", text: "Rukous on seurakuntamme sydän. Rukoilemme toistemme, kaupungin ja maailman puolesta.", link: "Liity rukoustiimiin" },
            { icon: "🤝", title: "Palvelu", text: "Palvelemme seurakunnassa ja yhteisössä monin tavoin. Jokaiselle löytyy oma paikka.", link: "Löydä palvelupaikka" },
            { icon: "💝", title: "Lahjoitus", text: "Lahjoituksesi tukee seurakunnan toimintaa ja mahdollistaa evankeliumin viemisen eteenpäin.", link: "Tue toimintaa" },
          ].map((item, i) => (
            <Fade key={i} delay={i * 0.1}>
              <div style={{
                textAlign: "center", padding: "48px 32px", background: "#fff",
                border: "1px solid #eee", borderRadius: 4,
                transition: "box-shadow .3s", cursor: "pointer"
              }}
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
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, color: "#6B2737", marginBottom: 10 }}>KOKOONTUMISAJAT</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, color: "#1a1a2e", marginBottom: 40 }}>Säännöllinen toiminta</h2>
          </Fade>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 28 }}>
            {c.activities.map((s, i) => (
              <Fade key={i} delay={i * 0.08}>
                <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 6, overflow: "hidden", height: "100%", display: "flex", flexDirection: "column", transition: "box-shadow .3s, transform .3s" }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
                >
                  <MediaBox image={s.image} label={s.title} grad={vis(i).grad} icon={vis(i).icon} height={180} />
                  <div style={{ padding: "22px 22px 24px", display: "flex", flexDirection: "column", flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#999", textTransform: "uppercase", marginBottom: 6 }}>{s.day}</div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#6B2737", marginBottom: 8 }}>{s.time}</div>
                    <h4 style={{ fontSize: 17, fontWeight: 700, color: "#1a1a2e", marginBottom: 8 }}>{s.title}</h4>
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: "#666", marginBottom: 20, flex: 1 }}>{s.desc}</p>
                    {toEmbedUrl(s.video) && <button onClick={() => setVideo(s)} style={{
                      alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 8,
                      background: "#6B2737", color: "#fff", border: "none", borderRadius: 999,
                      padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif"
                    }}><IcPlay /> Katso video</button>}
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
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, color: "#6B2737", marginBottom: 10 }}>KUVAGALLERIA</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, color: "#1a1a2e", marginBottom: 40 }}>Kuvia toiminnastamme</h2>
          </Fade>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
            {c.gallery.map((g, i) => (
              <Fade key={i} delay={i * 0.05}>
                <div onClick={() => g.image && setPhoto(g)} style={{ borderRadius: 6, overflow: "hidden", cursor: g.image ? "zoom-in" : "default" }}>
                  <MediaBox image={g.image} label={g.caption} grad={vis(i).grad} icon={vis(i).icon} height={200} caption />
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
            <button onClick={() => setVideo(null)} aria-label="Sulje" style={{ position: "absolute", top: 8, right: 8, zIndex: 2, background: "rgba(255,255,255,0.15)", color: "#fff", border: "none", borderRadius: "50%", width: 40, height: 40, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><IcX /></button>
            {toEmbedUrl(video.video) ? (
              <div style={{ position: "relative", paddingTop: "56.25%" }}>
                <iframe src={toEmbedUrl(video.video) + "?autoplay=1"} title={video.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} />
              </div>
            ) : (
              <div style={{ padding: "72px 32px", textAlign: "center", color: "#fff", background: "linear-gradient(135deg,#6B2737,#3a1520)" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, marginBottom: 10 }}>{video.title}</div>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)" }}>Video tulossa pian.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ PHOTO MODAL ═══ */}
      {photo && (
        <div onClick={() => setPhoto(null)} style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(10,10,20,0.9)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, cursor: "zoom-out" }}>
          <img src={photo.image} alt={photo.caption} style={{ maxWidth: "100%", maxHeight: "90vh", borderRadius: 6 }} />
        </div>
      )}

      {/* ═══ BIBLE VERSE ═══ */}
      <section style={{ padding: "80px 24px", background: "#6B2737", textAlign: "center" }}>
        <Fade>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <div style={{ fontSize: 64, color: "rgba(255,255,255,0.15)", fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>"</div>
            <p style={{
              fontFamily: "'Playfair Display', serif", fontSize: "clamp(18px, 3vw, 26px)",
              lineHeight: 1.8, color: "rgba(255,255,255,0.9)", fontStyle: "italic", marginTop: -12, marginBottom: 24
            }}>
              {c.verse.text}
            </p>
            <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: 2, textTransform: "uppercase" }}>{c.verse.ref}</div>
          </div>
        </Fade>
      </section>

      {/* ═══ CONTACT ═══ */}
      <section id="contact" style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Fade>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, color: "#6B2737", marginBottom: 10 }}>YHTEYSTIEDOT</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, color: "#1a1a2e", marginBottom: 40 }}>Ota yhteyttä</h2>
          </Fade>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 32 }}>
            <Fade delay={0.05}>
              <div>
                {[
                  { icon: <IcMap />, label: "OSOITE", val: c.service.address },
                  { icon: <IcMail />, label: "SÄHKÖPOSTI", val: c.contact.email, href: `mailto:${c.contact.email}` },
                  c.contact.phone && { icon: <IcPhone />, label: "PUHELIN", val: c.contact.phone, href: `tel:${c.contact.phone.replace(/\s/g, "")}` },
                  { icon: <IcClock />, label: "JUMALANPALVELUS", val: `${serviceDay.charAt(0).toUpperCase() + serviceDay.slice(1)}${serviceDay.endsWith("i") ? "sin" : "isin"} klo ${c.service.time}` },
                ].filter(Boolean).map((c, i) => (
                  <div key={i} style={{ display: "flex", gap: 18, alignItems: "flex-start", marginBottom: 32 }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#faf5f0", color: "#6B2737", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{c.icon}</div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#999", marginBottom: 4 }}>{c.label}</div>
                      {c.href
                        ? <a href={c.href} style={{ fontSize: 16, color: "#6B2737", fontWeight: 500, textDecoration: "none" }}>{c.val}</a>
                        : <div style={{ fontSize: 16, color: "#333" }}>{c.val}</div>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </Fade>
            <Fade delay={0.15}>
              <div style={{ borderRadius: 4, overflow: "hidden", border: "1px solid #eee", minHeight: 320 }}>
                <iframe title="Sijainti" src={`https://maps.google.com/maps?q=${encodeURIComponent(c.service.address)}&z=15&output=embed`}
                  width="100%" height="100%" style={{ border: 0, minHeight: 320 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
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
              <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>SIVUSTO</h4>
              {["Tietoa meistä","Usko","Toiminta","Tapahtumat","Yhteystiedot"].map((l, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <button onClick={() => scrollTo(["about","believe","activities","pray","contact"][i])} style={{
                    background: "none", border: "none", cursor: "pointer", padding: 0,
                    fontSize: 13, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif"
                  }}>{l}</button>
                </div>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>YHTEYSTIEDOT</h4>
              <p style={{ fontSize: 13, lineHeight: 2, color: "rgba(255,255,255,0.35)" }}>
                {c.service.address}<br />{c.contact.email}{c.contact.phone && <><br />{c.contact.phone}</>}
              </p>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
            <div>© {new Date().getFullYear()} Grace Montagnard Alliance Church Finland</div>
            <a href="/admin" style={{ color: "rgba(255,255,255,0.25)", textDecoration: "none" }}>Ylläpito</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
