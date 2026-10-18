// Oletussisältö. Ylläpitosivulla (/admin) tehdyt muutokset tallentuvat
// Vercel Blobiin ja korvaavat nämä arvot.
export const DEFAULT_CONTENT = {
  service: {
    weekday: 0, // 0 = sunnuntai
    time: "10:00",
    address: "Kulmakatu 8, 92100 Raahe",
  },
  hero: {
    title: "Koko Jeesus\nkoko maailmalle",
    text: "Grace Montagnard Alliance Church Finland yhdistää ihmisiä uskossa, toivossa ja rakkaudessa Raahessa. Tervetuloa kotiseurakuntaamme.",
  },
  about: [
    { label: "KEITÄ OLEMME", title: "Tietoa meistä", text: "Olemme monikulttuurinen kristillinen seurakunta Raahessa. Yhdistämme eri taustoista tulevat ihmiset yhteiseen uskoon ja yhteyteen." },
    { label: "MIHIN USKOMME", title: "Uskomme perusteet", text: "Uskomme Raamattuun Jumalan sanana, Jeesuksen Kristuksen pelastavaan armoon ja Pyhän Hengen voimaan jokapäiväisessä elämässä." },
    { label: "MITÄ TEEMME", title: "Toimintamme", text: "Järjestämme jumalanpalveluksia, raamattupiirejä, nuorteniltoja ja yhteisötapahtumia. Palvelemme lähimmäisiämme rakkaudella." },
  ],
  news: {
    label: "JUMALANPALVELUS",
    title: "Sunnuntain jumalanpalvelus",
    text: "Kokoonnumme joka sunnuntai klo 10:00 yhteiseen jumalanpalvelukseen osoitteessa Kulmakatu 8, Raahe. Saarna, rukous, ylistys ja ehtoollinen. Kaikki ovat tervetulleita!",
    image: "",
  },
  beliefs: [
    { cat: "OPETUS", title: "Jumala on rakkaus", text: "Uskomme yhteen Jumalaan — Isä, Poika ja Pyhä Henki. Hän on rakastanut meitä jo ennen maailman luomista." },
    { cat: "PELASTUS", title: "Armo riittää", text: "Pelastus on Jumalan lahja, joka vastaanotetaan uskon kautta Jeesukseen Kristukseen. Ei kenenkään teoista, ettei kukaan kerskaisi." },
    { cat: "SEURAKUNTA", title: "Yhdessä vahvempia", text: "Seurakunta on Kristuksen ruumis maan päällä. Yhdessä kasvamme uskossa, palvelemme toisiamme ja viemme evankeliumia eteenpäin." },
  ],
  activities: [
    { day: "Sunnuntai", time: "10:00–12:00", title: "Jumalanpalvelus", desc: "Yhteinen jumalanpalvelus saarnalla, rukouksella ja ylistyksellä.", image: "", video: "" },
    { day: "Sunnuntai", time: "10:00–10:45", title: "Pyhäkoulu", desc: "Lasten pyhäkoulu raamatunkertomuksin ja askarteluin.", image: "", video: "" },
    { day: "Keskiviikko", time: "18:00–19:30", title: "Raamattupiiri", desc: "Raamatun opiskelua ja rukousta pienryhmässä.", image: "", video: "" },
    { day: "Perjantai", time: "18:00–20:00", title: "Nuortenilta", desc: "Musiikkia, pelejä, keskustelua ja hengellistä opetusta.", image: "", video: "" },
  ],
  gallery: [
    { caption: "Jumalanpalvelus", image: "" },
    { caption: "Ylistys", image: "" },
    { caption: "Pyhäkoulu", image: "" },
    { caption: "Raamattupiiri", image: "" },
    { caption: "Nuoret", image: "" },
    { caption: "Yhteinen ateria", image: "" },
  ],
  verse: {
    text: "Sillä niin on Jumala maailmaa rakastanut, että hän antoi ainokaisen Poikansa, ettei yksikään, joka häneen uskoo, hukkuisi, vaan hänellä olisi iankaikkinen elämä.",
    ref: "Johannes 3:16",
  },
  contact: {
    email: "gmcfi.raahe@gmail.com",
    phone: "",
  },
};

// Yhdistää tallennetun sisällön oletuksiin, jotta puuttuvat kentät eivät riko sivua.
export function mergeContent(saved) {
  if (!saved || typeof saved !== "object") return DEFAULT_CONTENT;
  const out = {};
  for (const k of Object.keys(DEFAULT_CONTENT)) {
    const d = DEFAULT_CONTENT[k];
    const s = saved[k];
    if (Array.isArray(d)) out[k] = Array.isArray(s) ? s : d;
    else if (d && typeof d === "object") out[k] = { ...d, ...(s && typeof s === "object" ? s : {}) };
    else out[k] = s ?? d;
  }
  return out;
}

// Muuntaa tavallisen YouTube-linkin upotettavaksi.
export function toEmbedUrl(url) {
  if (!url) return "";
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/);
  if (m) return `https://www.youtube.com/embed/${m[1]}`;
  if (/^https:\/\/(www\.)?(player\.)?vimeo\.com\//.test(url)) {
    const v = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (v) return `https://player.vimeo.com/video/${v[1]}`;
  }
  return "";
}

export const WEEKDAYS = ["sunnuntai", "maanantai", "tiistai", "keskiviikko", "torstai", "perjantai", "lauantai"];
