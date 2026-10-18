import { useState, useEffect, useRef } from "react";

const LOGO_SRC = "data:image/jpeg;base64,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";

const NAV_LINKS = [
  { label: "Etusivu", id: "hero" },
  { label: "Tietoa meistä", id: "about" },
  { label: "Usko", id: "believe" },
  { label: "Toiminta", id: "activities" },
  { label: "Tapahtumat", id: "events" },
  { label: "Yhteystiedot", id: "contact" },
];

function getNextSunday() {
  const d = new Date();
  const diff = d.getDay() === 0 ? 0 : 7 - d.getDay();
  d.setDate(d.getDate() + diff);
  return d;
}

function formatDate(d) {
  return d.toLocaleDateString("fi-FI", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

/* ── Icons ── */
const Icon = ({ d, size = 22, stroke = "currentColor", fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);
const MapPin = () => <Icon d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />;
const Clock = () => <Icon d="M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v6l4 2" />;
const Mail = () => <Icon d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6" />;
const Phone = () => <Icon d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />;
const Heart = () => <Icon d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />;
const Book = () => <Icon d="M4 19.5A2.5 2.5 0 016.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />;
const Users = () => <Icon d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />;
const Music = () => <Icon d="M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zM21 16a3 3 0 11-6 0 3 3 0 016 0z" />;
const Sun = () => <Icon d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41M12 6a6 6 0 100 12 6 6 0 000-12z" />;
const ChevronRight = () => <Icon d="M9 18l6-6-6-6" size={16} />;
const Menu = () => <Icon d="M3 12h18M3 6h18M3 18h18" size={24} />;
const X = () => <Icon d="M18 6L6 18M6 6l12 12" size={24} />;
const Globe = () => <Icon d="M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10A15.3 15.3 0 0112 2z" />;
const Calendar = () => <Icon d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM16 2v4M8 2v4M3 10h18" />;

/* ── Intersection Observer for fade-in ── */
function useFadeIn() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function FadeIn({ children, delay = 0, className = "" }) {
  const [ref, visible] = useFadeIn();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)",
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`
    }}>{children}</div>
  );
}

/* ── Card component ── */
function Card({ icon, label, title, text, linkText = "Lue lisää", onClick, image }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 12, overflow: "hidden",
      boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)",
      transition: "transform 0.3s, box-shadow 0.3s", cursor: "pointer",
      display: "flex", flexDirection: "column"
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08), 0 16px 40px rgba(0,0,0,0.08)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)"; }}
    onClick={onClick}>
      {image && <div style={{ height: 200, background: image, backgroundSize: "cover", backgroundPosition: "center" }} />}
      <div style={{ padding: "28px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
        {label && <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#6B2737", marginBottom: 10 }}>{label}</div>}
        {icon && <div style={{ color: "#6B2737", marginBottom: 16 }}>{icon}</div>}
        <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a2e", marginBottom: 10, lineHeight: 1.3 }}>{title}</h3>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: "#555", flex: 1 }}>{text}</p>
        {linkText && (
          <div style={{ marginTop: 16, fontSize: 14, fontWeight: 600, color: "#6B2737", display: "flex", alignItems: "center", gap: 4 }}>
            {linkText} <ChevronRight />
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Section heading ── */
function SectionHead({ label, title, subtitle, light }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 56, maxWidth: 650, marginLeft: "auto", marginRight: "auto" }}>
      {label && <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: light ? "rgba(255,255,255,0.5)" : "#6B2737", marginBottom: 12 }}>{label}</div>}
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px, 4vw, 42px)", color: light ? "#fff" : "#1a1a2e", lineHeight: 1.2, marginBottom: subtitle ? 16 : 0 }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 16, lineHeight: 1.8, color: light ? "rgba(255,255,255,0.65)" : "#666" }}>{subtitle}</p>}
    </div>
  );
}

/* ── Main App ── */
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const nextSunday = getNextSunday();

  function scrollTo(id) {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#1a1a2e", background: "#faf9f6" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{overflow-x:hidden}
        ::selection{background:#6B2737;color:#fff}
        @media(max-width:768px){.hide-mobile{display:none!important}.show-mobile{display:flex!important}}
        @media(min-width:769px){.show-mobile{display:none!important}}
        a{text-decoration:none;color:inherit}
      `}</style>

      {/* ═══════ NAVBAR ═══════ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? "rgba(255,255,255,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        boxShadow: scrolled ? "0 1px 0 rgba(0,0,0,0.06)" : "none",
        transition: "all 0.4s"
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72, padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }} onClick={() => scrollTo("hero")}>
            <img src={LOGO_SRC} alt="GMCFI" style={{ width: 44, height: 44, borderRadius: "50%", boxShadow: "0 2px 8px rgba(107,39,55,0.25)", background: "#fff", objectFit: "cover" }} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: scrolled ? "#6B2737" : "#fff", transition: "color 0.3s", letterSpacing: 0.5 }}>GMCFI</div>
              <div style={{ fontSize: 10, color: scrolled ? "#999" : "rgba(255,255,255,0.7)", transition: "color 0.3s", letterSpacing: 0.5 }}>Raahe, Finland</div>
            </div>
          </div>

          <div className="hide-mobile" style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {NAV_LINKS.map(l => (
              <button key={l.id} onClick={() => scrollTo(l.id)} style={{
                background: "none", border: "none", cursor: "pointer", padding: "8px 14px", borderRadius: 6,
                fontSize: 13, fontWeight: 600, color: scrolled ? "#444" : "rgba(255,255,255,0.9)",
                transition: "all 0.3s", fontFamily: "'DM Sans', sans-serif"
              }}>{l.label}</button>
            ))}
            <button onClick={() => scrollTo("contact")} style={{
              marginLeft: 8, padding: "9px 20px", borderRadius: 8, border: "none",
              background: "#6B2737", color: "#fff", fontSize: 13, fontWeight: 600,
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
            }}>Ota yhteyttä</button>
          </div>

          <button className="show-mobile" onClick={() => setMenuOpen(!menuOpen)} style={{
            background: "none", border: "none", cursor: "pointer",
            color: scrolled ? "#333" : "#fff", padding: 8, display: "none"
          }}>{menuOpen ? <X /> : <Menu />}</button>
        </div>

        {menuOpen && (
          <div style={{ background: "#fff", padding: "8px 24px 24px", borderBottom: "1px solid #eee" }}>
            {NAV_LINKS.map(l => (
              <button key={l.id} onClick={() => scrollTo(l.id)} style={{
                display: "block", width: "100%", textAlign: "left", background: "none", border: "none",
                cursor: "pointer", fontSize: 15, fontWeight: 600, color: "#333", padding: "14px 0",
                borderBottom: "1px solid #f0f0f0", fontFamily: "'DM Sans', sans-serif"
              }}>{l.label}</button>
            ))}
          </div>
        )}
      </nav>

      {/* ═══════ HERO ═══════ */}
      <section id="hero" style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        background: "linear-gradient(165deg, #0d0509 0%, #6B2737 35%, #8B4555 65%, #3a0f1a 100%)",
        position: "relative", overflow: "hidden", padding: "120px 24px 100px"
      }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "radial-gradient(circle at 20% 50%, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div style={{ position: "absolute", top: "-20%", right: "-10%", width: "60%", height: "80%", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.04), transparent 70%)" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", gap: 60, position: "relative", zIndex: 1, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 500px", minWidth: 280 }}>
            <FadeIn>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>Tervetuloa seurakuntaamme</div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h1 style={{
                fontFamily: "'DM Serif Display', serif", fontSize: "clamp(36px, 6vw, 62px)",
                color: "#fff", lineHeight: 1.1, marginBottom: 24
              }}>
                Armoa ja toivoa<br />kaikille
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p style={{ fontSize: 18, lineHeight: 1.8, color: "rgba(255,255,255,0.7)", maxWidth: 480, marginBottom: 36 }}>
                Grace Montagnard Alliance Church Finland — kristillinen seurakunta Raahessa, 
                joka yhdistää ihmisiä uskossa, toivossa ja rakkaudessa.
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <button onClick={() => scrollTo("activities")} style={{
                  padding: "15px 32px", borderRadius: 10, border: "none",
                  background: "#fff", color: "#6B2737", fontSize: 15, fontWeight: 700,
                  cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                  display: "flex", alignItems: "center", gap: 8, fontFamily: "'DM Sans', sans-serif"
                }}>Tutustu toimintaan <ChevronRight /></button>
                <button onClick={() => scrollTo("about")} style={{
                  padding: "15px 32px", borderRadius: 10,
                  border: "2px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.06)", color: "#fff",
                  fontSize: 15, fontWeight: 600, cursor: "pointer",
                  backdropFilter: "blur(4px)", fontFamily: "'DM Sans', sans-serif"
                }}>Tietoa meistä</button>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.4}>
            <div style={{ flex: "0 0 auto", textAlign: "center" }}>
              <img src={LOGO_SRC} alt="GMCFI" style={{
                width: "clamp(140px, 20vw, 220px)", height: "clamp(140px, 20vw, 220px)",
                borderRadius: "50%", boxShadow: "0 12px 60px rgba(0,0,0,0.4), 0 0 0 6px rgba(255,255,255,0.15)",
                background: "#fff", objectFit: "cover"
              }} />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════ ANNOUNCEMENT BAR ═══════ */}
      <section style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "18px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#6B2737" }}><Calendar /></div>
          <span style={{ fontSize: 14, color: "#666" }}>Seuraava jumalanpalvelus:</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#6B2737", textTransform: "capitalize" }}>{formatDate(nextSunday)} klo 11:00</span>
          <button onClick={() => scrollTo("activities")} style={{
            padding: "7px 16px", borderRadius: 6, border: "1px solid #6B2737",
            background: "transparent", color: "#6B2737", fontSize: 12, fontWeight: 600,
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
          }}>Lisätietoja</button>
        </div>
      </section>

      {/* ═══════ ABOUT ═══════ */}
      <section id="about" style={{ padding: "100px 24px", background: "#faf9f6" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <FadeIn><SectionHead label="Tietoa meistä" title="Tervetuloa GMCFI-seurakuntaan" subtitle="Olemme yhteisö, joka rakentuu uskon, toivon ja rakkauden varaan. Jokainen on tervetullut — sellaisena kuin on." /></FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            <FadeIn delay={0.05}><Card icon={<Globe />} label="Keitä olemme" title="Monikulttuurinen seurakunta" text="Grace Montagnard Alliance Church Finland on monikulttuurinen kristillinen seurakunta, joka kokoontuu Raahessa. Yhdistämme eri taustoista tulevat ihmiset yhteiseen uskoon." /></FadeIn>
            <FadeIn delay={0.15}><Card icon={<Book />} label="Mihin uskomme" title="Raamatun sana ohjaa" text="Uskomme Jumalan sanaan ja Jeesuksen Kristuksen pelastavaan armoon. Raamattu on elämämme perusta ja opas jokapäiväisessä elämässä." /></FadeIn>
            <FadeIn delay={0.25}><Card icon={<Heart />} label="Mitä teemme" title="Palvelemme rakkaudella" text="Palvelemme toisiamme ja lähimmäisiämme. Järjestämme jumalanpalveluksia, raamattupiirejä, nuorteniltoja ja yhteisötapahtumia." /></FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════ BELIEVE ═══════ */}
      <section id="believe" style={{
        padding: "100px 24px",
        background: "linear-gradient(165deg, #0d0509, #6B2737 60%, #3a0f1a)",
        color: "#fff"
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <FadeIn><SectionHead light label="Uskontunnustus" title="Mihin me uskomme" /></FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {[
              { title: "Yksi Jumala", text: "Uskomme yhteen Jumalaan, joka on Isä, Poika ja Pyhä Henki — kolme persoonaa, yksi jumalalinen olemus." },
              { title: "Jeesus Kristus", text: "Jeesus Kristus on Jumalan Poika, joka syntyi ihmiseksi, kuoli ristillä meidän syntiemme tähden ja nousi kuolleista." },
              { title: "Pyhä Henki", text: "Pyhä Henki asuu uskovien sydämissä, ohjaa meitä totuuteen ja antaa voiman elää Jumalan tahdon mukaan." },
              { title: "Raamattu", text: "Raamattu on Jumalan inspiroima sana, joka on uskomme ja elämämme ylin auktoriteetti ja opas." },
              { title: "Pelastus", text: "Pelastus on Jumalan lahja, joka vastaanotetaan uskon kautta Jeesukseen Kristukseen — ei omien tekojen kautta." },
              { title: "Seurakunta", text: "Seurakunta on Kristuksen ruumis, jossa uskovat kasvavat yhdessä uskossa ja palvelevat toisiaan rakkaudessa." },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div style={{
                  background: "rgba(255,255,255,0.06)", borderRadius: 12,
                  padding: "28px 24px", border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(8px)"
                }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{item.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.6)" }}>{item.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ ACTIVITIES ═══════ */}
      <section id="activities" style={{ padding: "100px 24px", background: "#faf9f6" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <FadeIn><SectionHead label="Toiminta" title="Kokoontumisajat" subtitle="Kokoonnumme säännöllisesti yhteiseen jumalanpalvelukseen, rukoukseen ja Raamatun opiskeluun. Kaikki ovat tervetulleita!" /></FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {[
              { icon: <Sun />, day: "Sunnuntai", time: "11:00 – 13:00", title: "Jumalanpalvelus", desc: "Yhteinen jumalanpalvelus saarnalla, rukouksella, ylistyksellä ja ehtoollisella. Koko perheen tapahtuma." },
              { icon: <Book />, day: "Sunnuntai", time: "10:00 – 10:45", title: "Pyhäkoulu", desc: "Lasten pyhäkoulu jumalanpalveluksen yhteydessä. Raamatun kertomuksia, lauluja ja askartelua." },
              { icon: <Users />, day: "Keskiviikko", time: "18:00 – 19:30", title: "Raamattupiiri", desc: "Raamatun opiskelua ja rukousta pienryhmässä. Syvennytään Jumalan sanaan yhdessä keskustellen." },
              { icon: <Music />, day: "Perjantai", time: "18:00 – 20:00", title: "Nuortenilta", desc: "Nuorille suunnattu ilta musiikkia, pelejä, keskustelua ja hengellistä opetusta." },
            ].map((s, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div style={{
                  background: "#fff", borderRadius: 12, padding: "32px 28px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)",
                  borderLeft: "4px solid #6B2737"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{ color: "#6B2737" }}>{s.icon}</div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#999" }}>{s.day}</div>
                      <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'DM Serif Display', serif", color: "#6B2737" }}>{s.time}</div>
                    </div>
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1a1a2e", marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: "#666" }}>{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ BIBLE VERSE ═══════ */}
      <section style={{
        padding: "80px 24px",
        background: "#1a0a10", textAlign: "center", color: "#fff",
        position: "relative"
      }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.05, backgroundImage: "radial-gradient(circle at 50% 50%, #fff 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        <FadeIn>
          <div style={{ maxWidth: 700, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 72, color: "rgba(107,39,55,0.4)", fontFamily: "Georgia, serif", lineHeight: 1 }}>"</div>
            <p style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(18px, 3vw, 26px)", lineHeight: 1.7,
              color: "rgba(255,255,255,0.85)", fontStyle: "italic",
              marginTop: -20, marginBottom: 24
            }}>
              Sillä niin on Jumala maailmaa rakastanut, että hän antoi ainokaisen Poikansa, 
              ettei yksikään, joka häneen uskoo, hukkuisi, vaan hänellä olisi iankaikkinen elämä.
            </p>
            <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: 2, textTransform: "uppercase" }}>
              Johannes 3:16
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ═══════ EVENTS ═══════ */}
      <section id="events" style={{ padding: "100px 24px", background: "#f4f2ef" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <FadeIn><SectionHead label="Tapahtumat" title="Ajankohtaista" subtitle="Tule mukaan seurakuntamme tapahtumiin ja tilaisuuksiin." /></FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            <FadeIn delay={0.05}><Card label="Jumalanpalvelus" title="Sunnuntain jumalanpalvelus" text={`Seuraava jumalanpalvelus ${formatDate(nextSunday)} klo 11:00. Tervetuloa kuulemaan Jumalan sanaa ja ylistämään yhdessä!`} linkText="Katso sijainti" onClick={() => scrollTo("contact")} /></FadeIn>
            <FadeIn delay={0.15}><Card label="Yhteisö" title="Jouluateria ja juhla" text="Seurakunnan yhteinen jouluateria ja juhla joulukuussa. Ohjelma, ruoka ja yhdessäolo. Ilmoittaudu etukäteen!" linkText="Ota yhteyttä" onClick={() => scrollTo("contact")} /></FadeIn>
            <FadeIn delay={0.25}><Card label="Rukous" title="Rukousviikko" text="Kuukausittainen rukousviikko lähestyy. Tule rukoilemaan seurakunnan, kaupungin ja maailman puolesta yhdessä." linkText="Lisätietoja" onClick={() => scrollTo("contact")} /></FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════ CONTACT ═══════ */}
      <section id="contact" style={{ padding: "100px 24px", background: "#faf9f6" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <FadeIn><SectionHead label="Yhteystiedot" title="Tule käymään tai ota yhteyttä" subtitle="Ovemme ovat auki kaikille. Tervetuloa tutustumaan seurakuntaamme!" /></FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
            <FadeIn delay={0.05}>
              <div style={{
                background: "#fff", borderRadius: 12, padding: "40px 32px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)"
              }}>
                <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 32, color: "#1a1a2e" }}>Yhteystiedot</h3>
                {[
                  { icon: <MapPin />, label: "Osoite", value: "Kulmakatu 8\n92100 Raahe" },
                  { icon: <Mail />, label: "Sähköposti", value: "gmcfi.raahe@gmail.com", link: "mailto:gmcfi.raahe@gmail.com" },
                  { icon: <Clock />, label: "Jumalanpalvelus", value: "Sunnuntaisin klo 11:00" },
                ].map((c, i) => (
                  <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: i < 2 ? 28 : 0 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                      background: "rgba(107,39,55,0.06)", color: "#6B2737",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>{c.icon}</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#999", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{c.label}</div>
                      {c.link
                        ? <a href={c.link} style={{ fontSize: 15, color: "#6B2737", fontWeight: 500 }}>{c.value}</a>
                        : <div style={{ fontSize: 15, color: "#333", whiteSpace: "pre-line" }}>{c.value}</div>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div style={{
                borderRadius: 12, overflow: "hidden",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)",
                minHeight: 380
              }}>
                <iframe
                  title="GMCFI sijainti"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1678.5!2d24.4711!3d64.6841!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNjTCsDQxJzAyLjgiTiAyNMKwMjgnMTYuMCJF!5e0!3m2!1sfi!2sfi!4v1"
                  width="100%" height="100%" style={{ border: 0, minHeight: 380 }}
                  allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section style={{
        padding: "80px 24px",
        background: "linear-gradient(165deg, #6B2737, #8B4555)",
        textAlign: "center"
      }}>
        <FadeIn>
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(24px, 4vw, 36px)", color: "#fff", marginBottom: 16 }}>Tervetuloa joukkoomme</h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: 32 }}>
              Ovemme ovat auki jokaiselle. Tule sellaisena kuin olet — Jumalan rakkaus odottaa sinua.
            </p>
            <button onClick={() => scrollTo("contact")} style={{
              padding: "15px 36px", borderRadius: 10, border: "2px solid #fff",
              background: "transparent", color: "#fff", fontSize: 15, fontWeight: 700,
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
            }}>Ota yhteyttä</button>
          </div>
        </FadeIn>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer style={{ background: "#0d0509", color: "rgba(255,255,255,0.5)", padding: "60px 24px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40, marginBottom: 48 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <img src={LOGO_SRC} alt="GMCFI" style={{ width: 40, height: 40, borderRadius: "50%", opacity: 0.8, background: "#fff", objectFit: "cover" }} />
                <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: 1, color: "rgba(255,255,255,0.7)" }}>GMCFI</span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,0.4)" }}>
                Grace Montagnard Alliance Church Finland.<br />
                Kristillinen seurakunta Raahessa.
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>Sivusto</h4>
              {NAV_LINKS.map(l => (
                <div key={l.id} style={{ marginBottom: 8 }}>
                  <button onClick={() => scrollTo(l.id)} style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif",
                    padding: 0, transition: "color 0.2s"
                  }}>{l.label}</button>
                </div>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>Yhteystiedot</h4>
              <p style={{ fontSize: 13, lineHeight: 2, color: "rgba(255,255,255,0.4)" }}>
                Kulmakatu 8<br />92100 Raahe<br />gmcfi.raahe@gmail.com
              </p>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
            © {new Date().getFullYear()} Grace Montagnard Alliance Church Finland. Kaikki oikeudet pidätetään.
          </div>
        </div>
      </footer>
    </div>
  );
}
