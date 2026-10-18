import { useState, useEffect, useRef } from "react";

const LOGO_SRC = "/logo.jpg";

/* ── Helpers ── */
function getNextSunday() {
  const d = new Date();
  d.setDate(d.getDate() + ((7 - d.getDay()) % 7 || 7));
  if (d.getDay() !== 0) d.setDate(d.getDate() + (7 - d.getDay()));
  const now = new Date();
  if (now.getDay() === 0) return now;
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

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const scrollTo = id => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };

  const nextSun = getNextSunday();
  const nextSunStr = nextSun.toLocaleDateString("fi-FI", { weekday: "long", day: "numeric", month: "long" });

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
        Seuraava jumalanpalvelus: <strong style={{ textTransform: "capitalize" }}>{nextSunStr} klo 11:00</strong> · Kulmakatu 8, Raahe
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
            {[["Tietoa meistä","about"],["Usko","believe"],["Toiminta","activities"],["Yhteystiedot","contact"]].map(([l, id]) => (
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
            {[["Rukous","pray"],["Palvelu","activities"],["Lahjoitus","contact"],["Tietoa meistä","about"],["Usko","believe"],["Toiminta","activities"],["Yhteystiedot","contact"]].map(([l, id], i) => (
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
                Koko Jeesus<br />koko maailmalle
              </h1>
            </Fade>
            <Fade delay={0.1}>
              <p style={{ fontSize: 18, lineHeight: 1.8, color: "#555", maxWidth: 460, marginBottom: 36 }}>
                Grace Montagnard Alliance Church Finland yhdistää ihmisiä uskossa, 
                toivossa ja rakkaudessa Raahessa. Tervetuloa kotiseurakuntaamme.
              </p>
            </Fade>
            <Fade delay={0.2}>
              <ArrowLink onClick={() => scrollTo("about")}>Tutustu seurakuntaan</ArrowLink>
            </Fade>
          </div>
        </div>
      </section>

      {/* ═══ THREE CARDS: Who / Believe / Do ═══ */}
      <section id="about" style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
          {[
            { icon: <IcGlobe />, label: "KEITÄ OLEMME", title: "Tietoa meistä", text: "Olemme monikulttuurinen kristillinen seurakunta Raahessa. Yhdistämme eri taustoista tulevat ihmiset yhteiseen uskoon ja yhteyteen.", id: "believe" },
            { icon: <IcBook />, label: "MIHIN USKOMME", title: "Uskomme perusteet", text: "Uskomme Raamattuun Jumalan sanana, Jeesuksen Kristuksen pelastavaan armoon ja Pyhän Hengen voimaan jokapäiväisessä elämässä.", id: "believe" },
            { icon: <IcHeart />, label: "MITÄ TEEMME", title: "Toimintamme", text: "Järjestämme jumalanpalveluksia, raamattupiirejä, nuorteniltoja ja yhteisötapahtumia. Palvelemme lähimmäisiämme rakkaudella.", id: "activities" },
          ].map((c, i) => (
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
              <div style={{
                minHeight: 280,
                background: "linear-gradient(135deg, #6B2737 0%, #8B4555 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: 40
              }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 48, fontWeight: 800, color: "rgba(255,255,255,0.9)", fontFamily: "'Playfair Display', serif", letterSpacing: 2 }}>GMCFI</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", letterSpacing: 3, marginTop: 8 }}>SEURAKUNTA</div>
                </div>
              </div>
              <div style={{ padding: "40px 36px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#6B2737", marginBottom: 12 }}>JUMALANPALVELUS</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: "#1a1a2e", marginBottom: 14, lineHeight: 1.2 }}>
                  Sunnuntain jumalanpalvelus
                </h3>
                <p style={{ fontSize: 15, lineHeight: 1.8, color: "#666", marginBottom: 24 }}>
                  Kokoonnumme joka sunnuntai klo 11:00 yhteiseen jumalanpalvelukseen osoitteessa Kulmakatu 8, Raahe. 
                  Saarna, rukous, ylistys ja ehtoollinen. Kaikki ovat tervetulleita!
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
            {[
              { cat: "OPETUS", title: "Jumala on rakkaus", text: "Uskomme yhteen Jumalaan — Isä, Poika ja Pyhä Henki. Hän on rakastanut meitä jo ennen maailman luomista." },
              { cat: "PELASTUS", title: "Armo riittää", text: "Pelastus on Jumalan lahja, joka vastaanotetaan uskon kautta Jeesukseen Kristukseen. Ei kenenkään teoista, ettei kukaan kerskaisi." },
              { cat: "SEURAKUNTA", title: "Yhdessä vahvempia", text: "Seurakunta on Kristuksen ruumis maan päällä. Yhdessä kasvamme uskossa, palvelemme toisiamme ja viemme evankeliumia eteenpäin." },
            ].map((s, i) => (
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {[
              { day: "Sunnuntai", time: "11:00–13:00", title: "Jumalanpalvelus", desc: "Yhteinen jumalanpalvelus saarnalla, rukouksella ja ylistyksellä." },
              { day: "Sunnuntai", time: "10:00–10:45", title: "Pyhäkoulu", desc: "Lasten pyhäkoulu raamatunkertomuksin ja askarteluin." },
              { day: "Keskiviikko", time: "18:00–19:30", title: "Raamattupiiri", desc: "Raamatun opiskelua ja rukousta pienryhmässä." },
              { day: "Perjantai", time: "18:00–20:00", title: "Nuortenilta", desc: "Musiikkia, pelejä, keskustelua ja hengellistä opetusta." },
            ].map((s, i) => (
              <Fade key={i} delay={i * 0.08}>
                <div style={{ padding: "28px 24px", borderLeft: "3px solid #6B2737", background: "#faf8f5" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#999", textTransform: "uppercase", marginBottom: 6 }}>{s.day}</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#6B2737", marginBottom: 8 }}>{s.time}</div>
                  <h4 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e", marginBottom: 8 }}>{s.title}</h4>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: "#666" }}>{s.desc}</p>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BIBLE VERSE ═══ */}
      <section style={{ padding: "80px 24px", background: "#6B2737", textAlign: "center" }}>
        <Fade>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <div style={{ fontSize: 64, color: "rgba(255,255,255,0.15)", fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>"</div>
            <p style={{
              fontFamily: "'Playfair Display', serif", fontSize: "clamp(18px, 3vw, 26px)",
              lineHeight: 1.8, color: "rgba(255,255,255,0.9)", fontStyle: "italic", marginTop: -12, marginBottom: 24
            }}>
              Sillä niin on Jumala maailmaa rakastanut, että hän antoi ainokaisen Poikansa, 
              ettei yksikään, joka häneen uskoo, hukkuisi, vaan hänellä olisi iankaikkinen elämä.
            </p>
            <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: 2, textTransform: "uppercase" }}>Johannes 3:16</div>
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
                  { icon: <IcMap />, label: "OSOITE", val: "Kulmakatu 8, 92100 Raahe" },
                  { icon: <IcMail />, label: "SÄHKÖPOSTI", val: "gmcfi.raahe@gmail.com", href: "mailto:gmcfi.raahe@gmail.com" },
                  { icon: <IcClock />, label: "JUMALANPALVELUS", val: "Sunnuntaisin klo 11:00" },
                ].map((c, i) => (
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
                <iframe title="Sijainti" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1678.5!2d24.4711!3d64.6841!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNjTCsDQxJzAyLjgiTiAyNMKwMjgnMTYuMCJF!5e0!3m2!1sfi!2sfi!4v1"
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
                <img src={LOGO_SRC} alt="GMCFI" style={{ height: 40, objectFit: "contain", filter: "brightness(2)" }} />
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
                Kulmakatu 8<br />92100 Raahe, Finland<br />gmcfi.raahe@gmail.com
              </p>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
            <div>© {new Date().getFullYear()} Grace Montagnard Alliance Church Finland</div>
            <div>Kaikki oikeudet pidätetään</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
