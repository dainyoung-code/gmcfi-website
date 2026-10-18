import { useState, useEffect } from "react";

const LOGO_SRC = "data:image/jpeg;base64,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";

const MONTHS_FI = ["Tammikuu","Helmikuu","Maaliskuu","Huhtikuu","Toukokuu","Kesäkuu","Heinäkuu","Elokuu","Syyskuu","Lokakuu","Marraskuu","Joulukuu"];

const IconArrow = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8h10M9 4l4 4-4 4"/></svg>;
const IconMap = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>;
const IconClock = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
const IconMail = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 6l10 7 10-7"/></svg>;
const IconPhone = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>;
const IconHeart = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>;
const IconBook = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>;
const IconUsers = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>;
const IconMenu = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const IconClose = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

function getNextSunday() {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? 0 : 7 - day;
  const next = new Date(now);
  next.setDate(now.getDate() + diff);
  return next;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nextSunday = getNextSunday();
  const nextSundayStr = nextSunday.toLocaleDateString("fi-FI", { weekday: "long", day: "numeric", month: "long" });

  function scrollTo(id) {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#1a1a2e", background: "#faf9f6" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{overflow-x:hidden}
        ::selection{background:#6B2737;color:white}
        @keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp .8s ease-out both}
        .fade-up-d1{animation-delay:.15s}
        .fade-up-d2{animation-delay:.3s}
        .fade-up-d3{animation-delay:.45s}
      `}</style>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? "rgba(255,255,255,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,0,0,0.06)" : "none",
        transition: "all 0.4s ease",
        padding: "0 24px"
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => scrollTo("hero")}>
            <img src={LOGO_SRC} alt="GMCFI" style={{ width: 44, height: 44, borderRadius: "50%", boxShadow: "0 2px 12px rgba(107,39,55,0.3)" }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 2, color: scrolled ? "#6B2737" : "#fff", textTransform: "uppercase", textShadow: scrolled ? "none" : "0 1px 3px rgba(0,0,0,0.3)" }}>GMCFI</div>
              <div style={{ fontSize: 10, color: scrolled ? "#888" : "rgba(255,255,255,0.8)", letterSpacing: 1, textShadow: scrolled ? "none" : "0 1px 2px rgba(0,0,0,0.3)" }}>Raahe, Finland</div>
            </div>
          </div>

          {/* Desktop nav */}
          <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="desktop-nav">
            <style>{`
              @media(max-width:768px){.desktop-nav{display:none!important}}
              @media(min-width:769px){.mobile-menu-btn{display:none!important}}
            `}</style>
            {[["Etusivu","hero"],["Tietoa meistä","about"],["Jumalanpalvelukset","services"],["Yhteystiedot","contact"]].map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id)} style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 600, letterSpacing: 0.5,
                color: scrolled ? "#333" : "rgba(255,255,255,0.9)",
                textShadow: scrolled ? "none" : "0 1px 2px rgba(0,0,0,0.3)",
                transition: "color 0.3s"
              }}>{label}</button>
            ))}
          </div>

          {/* Mobile menu button */}
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} style={{
            background: "none", border: "none", cursor: "pointer",
            color: scrolled ? "#333" : "#fff", padding: 8
          }}>
            {menuOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{
            position: "absolute", top: 72, left: 0, right: 0,
            background: "rgba(255,255,255,0.98)", backdropFilter: "blur(12px)",
            padding: "16px 24px 24px", borderBottom: "1px solid rgba(0,0,0,0.06)"
          }}>
            {[["Etusivu","hero"],["Tietoa meistä","about"],["Jumalanpalvelukset","services"],["Yhteystiedot","contact"]].map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id)} style={{
                display: "block", width: "100%", textAlign: "left",
                background: "none", border: "none", cursor: "pointer",
                fontSize: 15, fontWeight: 600, color: "#333",
                padding: "12px 0", borderBottom: "1px solid rgba(0,0,0,0.04)"
              }}>{label}</button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="hero" style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(160deg, #1a0a10 0%, #6B2737 40%, #8B3A4A 70%, #4a1520 100%)",
        position: "relative", overflow: "hidden", padding: "100px 24px 80px"
      }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />
        <div style={{ position: "absolute", bottom: -150, left: -50, width: 500, height: 500, borderRadius: "50%", background: "rgba(255,255,255,0.02)" }} />

        <div style={{ textAlign: "center", maxWidth: 700, position: "relative", zIndex: 1 }}>
          <img src={LOGO_SRC} alt="GMCFI" className="fade-up" style={{
            width: 110, height: 110, borderRadius: "50%",
            boxShadow: "0 8px 40px rgba(0,0,0,0.4), 0 0 0 4px rgba(255,255,255,0.15)",
            marginBottom: 32
          }} />
          <h1 className="fade-up fade-up-d1" style={{
            fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px, 5vw, 52px)",
            color: "#fff", lineHeight: 1.2, marginBottom: 16,
            textShadow: "0 2px 20px rgba(0,0,0,0.3)"
          }}>
            Grace Montagnard<br />Alliance Church Finland
          </h1>
          <p className="fade-up fade-up-d2" style={{
            fontSize: "clamp(15px, 2.5vw, 18px)", color: "rgba(255,255,255,0.75)",
            lineHeight: 1.7, marginBottom: 36, maxWidth: 500, margin: "0 auto 36px"
          }}>
            Tervetuloa kotiseurakuntaamme Raahessa.<br />
            Yhdessä uskomme, rukoilemme ja palvelemme.
          </p>
          <div className="fade-up fade-up-d3" style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => scrollTo("services")} style={{
              padding: "14px 32px", borderRadius: 50, border: "none",
              background: "#fff", color: "#6B2737", fontSize: 14, fontWeight: 700,
              cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              display: "flex", alignItems: "center", gap: 8,
              transition: "transform 0.2s", fontFamily: "'DM Sans', sans-serif"
            }}>
              Jumalanpalvelukset <IconArrow />
            </button>
            <button onClick={() => scrollTo("contact")} style={{
              padding: "14px 32px", borderRadius: 50,
              border: "2px solid rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.08)", color: "#fff",
              fontSize: 14, fontWeight: 600, cursor: "pointer",
              backdropFilter: "blur(4px)", fontFamily: "'DM Sans', sans-serif"
            }}>
              Yhteystiedot
            </button>
          </div>
        </div>
      </section>

      {/* NEXT SERVICE BANNER */}
      <section style={{
        background: "#fff", borderBottom: "1px solid rgba(0,0,0,0.06)",
        padding: "20px 24px"
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
          <IconClock />
          <span style={{ fontSize: 14, color: "#555" }}>Seuraava jumalanpalvelus:</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#6B2737", textTransform: "capitalize" }}>{nextSundayStr} klo 11:00</span>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding: "100px 24px", background: "#faf9f6" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#6B2737", marginBottom: 12 }}>Tietoa meistä</div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(26px, 4vw, 40px)", color: "#1a1a2e", marginBottom: 20 }}>Tervetuloa GMCFI-seurakuntaan</h2>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: "#555", maxWidth: 650, margin: "0 auto" }}>
              Grace Montagnard Alliance Church Finland on kristillinen seurakunta Raahessa.
              Olemme yhteisö, joka kokoontuu yhdessä rukoilemaan, oppimaan Jumalan sanaa
              ja palvelemaan toisiamme sekä lähimmäisiämme rakkaudessa.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 24 }}>
            {[
              { icon: <IconBook />, title: "Raamatun opetus", desc: "Opiskelemme Raamattua yhdessä ja kasvatamme uskoamme Jumalan sanan kautta." },
              { icon: <IconHeart />, title: "Yhteys ja rakkaus", desc: "Rakennamme yhteisöä, jossa jokainen on tervetullut ja rakastettu sellaisena kuin on." },
              { icon: <IconUsers />, title: "Palveleminen", desc: "Palvelemme toisiamme ja lähimmäisiämme Kristuksen rakkaudella arjessa ja juhlassa." },
            ].map((item, i) => (
              <div key={i} style={{
                background: "#fff", borderRadius: 16, padding: "36px 28px",
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
                transition: "transform 0.3s, box-shadow 0.3s"
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: "rgba(107,39,55,0.08)", color: "#6B2737",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 20
                }}>{item.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, color: "#1a1a2e" }}>{item.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "#666" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{
        padding: "100px 24px",
        background: "linear-gradient(160deg, #1a0a10 0%, #6B2737 50%, #4a1520 100%)",
        color: "#fff"
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 12 }}>Jumalanpalvelukset</div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(26px, 4vw, 40px)", marginBottom: 20 }}>Kokoontumisajat</h2>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: "rgba(255,255,255,0.7)", maxWidth: 550, margin: "0 auto" }}>
              Kokoonnumme joka sunnuntai yhteiseen jumalanpalvelukseen. Kaikki ovat tervetulleita!
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {[
              { day: "Sunnuntai", time: "11:00 – 13:00", name: "Jumalanpalvelus", desc: "Yhteinen jumalanpalvelus saarnalla, rukouksella ja ylistyksellä." },
              { day: "Sunnuntai", time: "10:00 – 10:45", name: "Pyhäkoulu", desc: "Lasten pyhäkoulu jumalanpalveluksen yhteydessä." },
              { day: "Keskiviikko", time: "18:00 – 19:30", name: "Raamattupiiri", desc: "Raamatun opiskelu ja rukous pienryhmässä." },
            ].map((s, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.08)", borderRadius: 16,
                padding: "32px 28px", border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(8px)"
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>{s.day}</div>
                <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'DM Serif Display', serif", marginBottom: 4 }}>{s.time}</div>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: "rgba(255,255,255,0.9)" }}>{s.name}</div>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.6)" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: "100px 24px", background: "#faf9f6" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#6B2737", marginBottom: 12 }}>Yhteystiedot</div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(26px, 4vw, 40px)", color: "#1a1a2e", marginBottom: 20 }}>Ota yhteyttä</h2>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: "#555", maxWidth: 500, margin: "0 auto" }}>
              Tervetuloa käymään tai ota meihin yhteyttä — vastaamme mielellämme!
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {/* Contact info */}
            <div style={{
              background: "#fff", borderRadius: 16, padding: "36px 28px",
              border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 20px rgba(0,0,0,0.04)"
            }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 28, color: "#1a1a2e" }}>Yhteystiedot</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(107,39,55,0.08)", color: "#6B2737", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><IconMap /></div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 2 }}>Osoite</div>
                    <div style={{ fontSize: 14, color: "#666" }}>Kulmakatu 8<br />92100 Raahe</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(107,39,55,0.08)", color: "#6B2737", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><IconMail /></div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 2 }}>Sähköposti</div>
                    <a href="mailto:gmcfi.raahe@gmail.com" style={{ fontSize: 14, color: "#6B2737", textDecoration: "none" }}>gmcfi.raahe@gmail.com</a>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(107,39,55,0.08)", color: "#6B2737", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><IconClock /></div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 2 }}>Jumalanpalvelus</div>
                    <div style={{ fontSize: 14, color: "#666" }}>Sunnuntaisin klo 11:00</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div style={{
              background: "#fff", borderRadius: 16, overflow: "hidden",
              border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
              minHeight: 300
            }}>
              <iframe
                title="GMCFI sijainti"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1678.5!2d24.4711!3d64.6841!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNjTCsDQxJzAyLjgiTiAyNMKwMjgnMTYuMCJF!5e0!3m2!1sfi!2sfi!4v1"
                width="100%" height="100%" style={{ border: 0, minHeight: 300 }}
                allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* BIBLE VERSE */}
      <section style={{
        padding: "80px 24px",
        background: "linear-gradient(160deg, #1a0a10, #6B2737)",
        textAlign: "center", color: "#fff"
      }}>
        <div style={{ maxWidth: 650, margin: "0 auto" }}>
          <div style={{ fontSize: 48, color: "rgba(255,255,255,0.15)", fontFamily: "Georgia, serif", marginBottom: 8 }}>"</div>
          <p style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(18px, 3vw, 24px)", lineHeight: 1.7,
            color: "rgba(255,255,255,0.9)", fontStyle: "italic",
            marginBottom: 20
          }}>
            Sillä niin on Jumala maailmaa rakastanut, että hän antoi ainokaisen Poikansa,
            ettei yksikään, joka häneen uskoo, hukkuisi, vaan hänellä olisi iankaikkinen elämä.
          </p>
          <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: 1 }}>
            Johannes 3:16
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: "#0f0a0c", color: "rgba(255,255,255,0.5)",
        padding: "48px 24px 32px"
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 24 }}>
            <img src={LOGO_SRC} alt="GMCFI" style={{ width: 36, height: 36, borderRadius: "50%", opacity: 0.8 }} />
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>GMCFI</span>
          </div>
          <div style={{ textAlign: "center", fontSize: 13, lineHeight: 2 }}>
            <div>Grace Montagnard Alliance Church Finland</div>
            <div>Kulmakatu 8, 92100 Raahe</div>
          </div>
          <div style={{ textAlign: "center", marginTop: 32, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
            © {new Date().getFullYear()} GMCFI. Kaikki oikeudet pidätetään.
          </div>
        </div>
      </footer>
    </div>
  );
}
