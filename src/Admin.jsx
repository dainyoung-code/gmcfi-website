import { useState, useEffect } from "react";
import { DEFAULT_CONTENT, mergeContent, toEmbedUrl, WEEKDAYS } from "./content.js";

const C = { brand: "#6B2737", ink: "#1a1a2e", muted: "#6b6b75", line: "#e7e2dc", bg: "#f6f3ef", ok: "#2f7a4a", err: "#b3261e" };
const font = "'DM Sans', system-ui, sans-serif";

const store = {
  get: k => { try { return sessionStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { sessionStorage.setItem(k, v); } catch { /* ignore */ } },
  del: k => { try { sessionStorage.removeItem(k); } catch { /* ignore */ } },
};

async function resizeImage(file, max = 1600) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((ok, fail) => { const i = new Image(); i.onload = () => ok(i); i.onerror = fail; i.src = url; });
    const scale = Math.min(1, max / Math.max(img.width, img.height));
    const cv = document.createElement("canvas");
    cv.width = Math.round(img.width * scale); cv.height = Math.round(img.height * scale);
    cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
    return cv.toDataURL("image/jpeg", 0.85);
  } finally { URL.revokeObjectURL(url); }
}

/* ── UI-palikat ── */
const inputStyle = { width: "100%", padding: "11px 12px", border: `1px solid ${C.line}`, borderRadius: 8, fontSize: 15, fontFamily: font, color: C.ink, background: "#fff" };

function Field({ label, value, onChange, multiline, placeholder, hint, type = "text" }) {
  return (
    <label style={{ display: "block", marginBottom: 14 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 6, letterSpacing: 0.3 }}>{label}</div>
      {multiline
        ? <textarea value={value ?? ""} placeholder={placeholder} onChange={e => onChange(e.target.value)} rows={4} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }} />
        : <input type={type} value={value ?? ""} placeholder={placeholder} onChange={e => onChange(e.target.value)} style={inputStyle} />}
      {hint && <div style={{ fontSize: 12, color: C.muted, marginTop: 5 }}>{hint}</div>}
    </label>
  );
}

function Btn({ children, onClick, kind = "ghost", disabled, small }) {
  const k = {
    primary: { background: C.brand, color: "#fff", border: `1px solid ${C.brand}` },
    ghost: { background: "#fff", color: C.ink, border: `1px solid ${C.line}` },
    danger: { background: "#fff", color: C.err, border: `1px solid #efc9c6` },
  }[kind];
  return (
    <button type="button" onClick={onClick} disabled={disabled} style={{
      ...k, borderRadius: 8, padding: small ? "7px 11px" : "11px 18px", fontSize: small ? 13 : 15, fontWeight: 600,
      fontFamily: font, cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.55 : 1, whiteSpace: "nowrap",
    }}>{children}</button>
  );
}

function ImageField({ label, value, onChange, upload }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const pick = async e => {
    const f = e.target.files?.[0]; e.target.value = "";
    if (!f) return;
    setBusy(true); setErr("");
    try { onChange(await upload(f)); } catch (x) { setErr(x.message); } finally { setBusy(false); }
  };
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 6 }}>{label}</div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ width: 96, height: 72, borderRadius: 8, background: value ? `center/cover url("${value}")` : C.bg, border: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, fontSize: 12 }}>{!value && "Ei kuvaa"}</div>
        <label style={{ display: "inline-block" }}>
          <input type="file" accept="image/*" onChange={pick} style={{ display: "none" }} />
          <span style={{ display: "inline-block", border: `1px solid ${C.line}`, borderRadius: 8, padding: "9px 14px", fontSize: 14, fontWeight: 600, cursor: "pointer", background: "#fff" }}>{busy ? "Ladataan…" : value ? "Vaihda kuva" : "Lisää kuva"}</span>
        </label>
        {value && !busy && <Btn small kind="danger" onClick={() => onChange("")}>Poista</Btn>}
      </div>
      {err && <div style={{ color: C.err, fontSize: 13, marginTop: 6 }}>{err}</div>}
    </div>
  );
}

function ListEditor({ items, onChange, render, blank, addLabel, titleOf }) {
  const set = (i, v) => onChange(items.map((x, j) => j === i ? v : x));
  const move = (i, d) => { const a = [...items]; const j = i + d; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; onChange(a); };
  return (
    <div>
      {items.map((it, i) => (
        <div key={i} style={{ border: `1px solid ${C.line}`, borderRadius: 10, padding: 16, marginBottom: 14, background: "#fff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            <div style={{ fontWeight: 700, color: C.ink }}>{i + 1}. {titleOf(it) || "(nimetön)"}</div>
            <div style={{ display: "flex", gap: 6 }}>
              <Btn small onClick={() => move(i, -1)} disabled={i === 0}>↑</Btn>
              <Btn small onClick={() => move(i, 1)} disabled={i === items.length - 1}>↓</Btn>
              <Btn small kind="danger" onClick={() => { if (confirm("Poistetaanko tämä?")) onChange(items.filter((_, j) => j !== i)); }}>Poista</Btn>
            </div>
          </div>
          {render(it, v => set(i, v))}
        </div>
      ))}
      <Btn onClick={() => onChange([...items, { ...blank }])}>+ {addLabel}</Btn>
    </div>
  );
}

function Section({ title, desc, children }) {
  return (
    <section style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 14, padding: "22px 20px", marginBottom: 20 }}>
      <h2 style={{ fontSize: 19, fontWeight: 700, color: C.ink, marginBottom: desc ? 4 : 16 }}>{title}</h2>
      {desc && <p style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>{desc}</p>}
      {children}
    </section>
  );
}

/* ── Kirjautuminen ── */
function Login({ onLogin }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async e => {
    e.preventDefault(); setBusy(true); setErr("");
    try {
      const r = await fetch("/api/login", { method: "POST", headers: { "x-admin-password": pw } });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || "Kirjautuminen epäonnistui");
      store.set("gmcfi-admin", pw); onLogin(pw, d.storage);
    } catch (x) { setErr(x.message); } finally { setBusy(false); }
  };
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, fontFamily: font }}>
      <form onSubmit={submit} style={{ width: "100%", maxWidth: 360, background: "#fff", borderRadius: 14, border: `1px solid ${C.line}`, padding: 28, textAlign: "center" }}>
        <img src="/logo.png" alt="" style={{ height: 64, marginBottom: 12 }} />
        <h1 style={{ fontSize: 22, color: C.ink, marginBottom: 4 }}>Ylläpito</h1>
        <p style={{ fontSize: 14, color: C.muted, marginBottom: 20 }}>GMCFI-verkkosivun muokkaus</p>
        <input type="password" autoFocus value={pw} onChange={e => setPw(e.target.value)} placeholder="Salasana" style={{ ...inputStyle, marginBottom: 12 }} />
        {err && <div style={{ color: C.err, fontSize: 14, marginBottom: 12 }}>{err}</div>}
        <button type="submit" disabled={busy || !pw} style={{ width: "100%", background: C.brand, color: "#fff", border: "none", borderRadius: 8, padding: 12, fontSize: 15, fontWeight: 700, fontFamily: font, cursor: "pointer", opacity: busy || !pw ? 0.6 : 1 }}>{busy ? "Kirjaudutaan…" : "Kirjaudu"}</button>
        <a href="/" style={{ display: "block", marginTop: 16, fontSize: 13, color: C.muted }}>← Takaisin sivulle</a>
      </form>
    </div>
  );
}

/* ── Ylläpitonäkymä ── */
export default function Admin() {
  const [pw, setPw] = useState(store.get("gmcfi-admin"));
  const [storage, setStorage] = useState(true);
  const [c, setC] = useState(null);
  const [saved, setSaved] = useState("");
  const [status, setStatus] = useState({ t: "", kind: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!pw) return;
    fetch("/api/login", { method: "POST", headers: { "x-admin-password": pw } })
      .then(r => r.json().then(d => ({ ok: r.ok, d })))
      .then(({ ok, d }) => { if (!ok) { store.del("gmcfi-admin"); setPw(null); } else setStorage(d.storage); })
      .catch(() => {});
    fetch("/api/content").then(r => r.json()).then(d => {
      const m = mergeContent(d?.content); setC(m); setSaved(JSON.stringify(m));
    }).catch(() => { setC(DEFAULT_CONTENT); setSaved(JSON.stringify(DEFAULT_CONTENT)); });
  }, [pw]);

  const dirty = c && JSON.stringify(c) !== saved;
  useEffect(() => {
    const h = e => { if (dirty) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  if (!pw) return <Login onLogin={(p, s) => { setPw(p); setStorage(s); }} />;
  if (!c) return <div style={{ fontFamily: font, padding: 40, textAlign: "center", color: C.muted }}>Ladataan…</div>;

  const upd = (k, v) => setC(p => ({ ...p, [k]: v }));
  const updObj = (k, field, v) => setC(p => ({ ...p, [k]: { ...p[k], [field]: v } }));

  const upload = async file => {
    const data = await resizeImage(file);
    const r = await fetch("/api/upload", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-password": pw }, body: JSON.stringify({ data }) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || "Kuvan lataus epäonnistui");
    return d.url;
  };

  const save = async () => {
    setSaving(true); setStatus({ t: "", kind: "" });
    try {
      const r = await fetch("/api/content", { method: "PUT", headers: { "Content-Type": "application/json", "x-admin-password": pw }, body: JSON.stringify({ content: c }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || "Tallennus epäonnistui");
      setSaved(JSON.stringify(c)); setStatus({ t: "Tallennettu! Muutokset näkyvät sivulla heti.", kind: "ok" });
    } catch (x) { setStatus({ t: x.message, kind: "err" }); } finally { setSaving(false); }
  };

  const logout = () => { if (dirty && !confirm("Tallentamattomat muutokset menetetään. Kirjaudutaanko ulos?")) return; store.del("gmcfi-admin"); setPw(null); setC(null); };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: font, color: C.ink }}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0} input:focus,textarea:focus,select:focus{outline:2px solid ${C.brand}33;border-color:${C.brand}}`}</style>

      <header style={{ position: "sticky", top: 0, zIndex: 10, background: "#fff", borderBottom: `1px solid ${C.line}` }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "10px 16px", display: "flex", alignItems: "center", gap: 12 }}>
          <img src="/logo.png" alt="" style={{ height: 36 }} />
          <div style={{ fontWeight: 700, flex: 1 }}>Ylläpito</div>
          <a href="/" target="_blank" rel="noreferrer" style={{ fontSize: 14, color: C.brand, fontWeight: 600, textDecoration: "none" }}>Näytä sivu ↗</a>
          <Btn small onClick={logout}>Kirjaudu ulos</Btn>
        </div>
      </header>

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "20px 16px 120px" }}>
        {!storage && (
          <div style={{ background: "#fff4e5", border: "1px solid #f3d29b", borderRadius: 10, padding: 14, marginBottom: 20, fontSize: 14, lineHeight: 1.5 }}>
            <strong>Tallennustila puuttuu.</strong> Muutoksia ei voi vielä tallentaa. Yhdistä Vercelissä Blob-tallennustila projektiin (Storage → Create → Blob) ja julkaise uudelleen.
          </div>
        )}

        <Section title="Jumalanpalvelus" desc="Näkyy sivun yläpalkissa ja yhteystiedoissa. Päivämäärä päivittyy automaattisesti.">
          <label style={{ display: "block", marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 6 }}>Viikonpäivä</div>
            <select value={c.service.weekday} onChange={e => updObj("service", "weekday", Number(e.target.value))} style={inputStyle}>
              {WEEKDAYS.map((d, i) => <option key={i} value={i}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
            </select>
          </label>
          <Field label="Kellonaika" type="time" value={c.service.time} onChange={v => updObj("service", "time", v)} />
          <Field label="Osoite" value={c.service.address} onChange={v => updObj("service", "address", v)} hint="Kartta päivittyy osoitteen mukaan." />
        </Section>

        <Section title="Etusivun otsikko">
          <Field label="Otsikko" multiline value={c.hero.title} onChange={v => updObj("hero", "title", v)} hint="Rivinvaihto tekee otsikkoon uuden rivin." />
          <Field label="Esittelyteksti" multiline value={c.hero.text} onChange={v => updObj("hero", "text", v)} />
        </Section>

        <Section title="Ajankohtaista" desc="Nosto etusivulla, esim. tuleva tapahtuma tai tiedote.">
          <Field label="Pieni otsikko" value={c.news.label} onChange={v => updObj("news", "label", v)} />
          <Field label="Otsikko" value={c.news.title} onChange={v => updObj("news", "title", v)} />
          <Field label="Teksti" multiline value={c.news.text} onChange={v => updObj("news", "text", v)} />
          <ImageField label="Kuva" value={c.news.image} onChange={v => updObj("news", "image", v)} upload={upload} />
        </Section>

        <Section title="Toiminnot" desc="Kokoontumisajat. Liitä video tavallisena YouTube-linkkinä.">
          <ListEditor items={c.activities} onChange={v => upd("activities", v)} addLabel="Lisää toiminto" titleOf={x => x.title}
            blank={{ day: "", time: "", title: "", desc: "", image: "", video: "" }}
            render={(it, set) => <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Field label="Päivä" value={it.day} onChange={v => set({ ...it, day: v })} placeholder="Sunnuntai" />
                <Field label="Aika" value={it.time} onChange={v => set({ ...it, time: v })} placeholder="10:00–12:00" />
              </div>
              <Field label="Nimi" value={it.title} onChange={v => set({ ...it, title: v })} />
              <Field label="Kuvaus" multiline value={it.desc} onChange={v => set({ ...it, desc: v })} />
              <ImageField label="Kuva" value={it.image} onChange={v => set({ ...it, image: v })} upload={upload} />
              <Field label="Video (YouTube-linkki)" value={it.video} onChange={v => set({ ...it, video: v })} placeholder="https://www.youtube.com/watch?v=…"
                hint={it.video ? (toEmbedUrl(it.video) ? "✓ Video löytyi — Katso video -painike näkyy." : "⚠ Linkkiä ei tunnistettu. Käytä YouTube- tai Vimeo-linkkiä.") : "Ilman videota painiketta ei näytetä."} />
            </>} />
        </Section>

        <Section title="Kuvagalleria">
          <ListEditor items={c.gallery} onChange={v => upd("gallery", v)} addLabel="Lisää kuva" titleOf={x => x.caption}
            blank={{ caption: "", image: "" }}
            render={(it, set) => <>
              <ImageField label="Kuva" value={it.image} onChange={v => set({ ...it, image: v })} upload={upload} />
              <Field label="Kuvateksti" value={it.caption} onChange={v => set({ ...it, caption: v })} />
            </>} />
        </Section>

        <Section title="Tietoa meistä" desc="Kolme korttia etusivun yläosassa.">
          {c.about.map((it, i) => (
            <div key={i} style={{ borderTop: i ? `1px solid ${C.line}` : "none", paddingTop: i ? 14 : 0 }}>
              <Field label={`Kortti ${i + 1}: pieni otsikko`} value={it.label} onChange={v => upd("about", c.about.map((x, j) => j === i ? { ...x, label: v } : x))} />
              <Field label="Otsikko" value={it.title} onChange={v => upd("about", c.about.map((x, j) => j === i ? { ...x, title: v } : x))} />
              <Field label="Teksti" multiline value={it.text} onChange={v => upd("about", c.about.map((x, j) => j === i ? { ...x, text: v } : x))} />
            </div>
          ))}
        </Section>

        <Section title="Uskon perusteet">
          <ListEditor items={c.beliefs} onChange={v => upd("beliefs", v)} addLabel="Lisää kohta" titleOf={x => x.title}
            blank={{ cat: "", title: "", text: "" }}
            render={(it, set) => <>
              <Field label="Kategoria" value={it.cat} onChange={v => set({ ...it, cat: v })} placeholder="OPETUS" />
              <Field label="Otsikko" value={it.title} onChange={v => set({ ...it, title: v })} />
              <Field label="Teksti" multiline value={it.text} onChange={v => set({ ...it, text: v })} />
            </>} />
        </Section>

        <Section title="Raamatunjae">
          <Field label="Jae" multiline value={c.verse.text} onChange={v => updObj("verse", "text", v)} />
          <Field label="Viite" value={c.verse.ref} onChange={v => updObj("verse", "ref", v)} placeholder="Johannes 3:16" />
        </Section>

        <Section title="Yhteystiedot">
          <Field label="Sähköposti" type="email" value={c.contact.email} onChange={v => updObj("contact", "email", v)} />
          <Field label="Puhelin" type="tel" value={c.contact.phone} onChange={v => updObj("contact", "phone", v)} hint="Jätä tyhjäksi, jos ei näytetä." />
        </Section>
      </main>

      <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, background: "#fff", borderTop: `1px solid ${C.line}`, boxShadow: "0 -4px 16px rgba(0,0,0,0.05)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, fontSize: 14, color: status.kind === "err" ? C.err : status.kind === "ok" && !dirty ? C.ok : C.muted }}>
            {dirty ? "Tallentamattomia muutoksia" : status.t || "Ei muutoksia"}
            {dirty && status.kind === "err" && <div style={{ color: C.err }}>{status.t}</div>}
          </div>
          {dirty && <Btn onClick={() => { if (confirm("Perutaanko kaikki tallentamattomat muutokset?")) setC(JSON.parse(saved)); }}>Peru</Btn>}
          <Btn kind="primary" onClick={save} disabled={!dirty || saving || !storage}>{saving ? "Tallennetaan…" : "Tallenna"}</Btn>
        </div>
      </div>
    </div>
  );
}
