// Kielet
export const LANGS = [
  { code: "fi", label: "Suomi", short: "FI", locale: "fi-FI" },
  { code: "en", label: "English", short: "EN", locale: "en-GB" },
  { code: "vi", label: "Tiếng Việt", short: "VI", locale: "vi-VN" },
];

// Oletussisältö. Tekstit ovat muodossa { fi, en, vi }.
// Ylläpitosivulla (/admin) tehdyt muutokset tallentuvat Vercel Blobiin ja korvaavat nämä.
export const DEFAULT_CONTENT = {
  service: {
    weekday: 0, // 0 = sunnuntai
    time: "10:00",
    address: "Kulmakatu 8, 92100 Raahe",
  },
  hero: {
    title: {
      fi: "Koko Jeesus\nkoko maailmalle",
      en: "All of Jesus\nfor all the world",
      vi: "Trọn vẹn Chúa Giê-xu\ncho cả thế giới",
    },
    text: {
      fi: "Grace Montagnard Alliance Church Finland yhdistää ihmisiä uskossa, toivossa ja rakkaudessa Raahessa. Tervetuloa kotiseurakuntaamme.",
      en: "Grace Montagnard Alliance Church Finland brings people together in faith, hope and love in Raahe. Welcome to our church family.",
      vi: "Hội Thánh Grace Montagnard Alliance Phần Lan kết nối mọi người trong đức tin, hy vọng và tình yêu thương tại Raahe. Chào mừng bạn đến với đại gia đình Hội Thánh chúng tôi.",
    },
  },
  about: [
    {
      label: { fi: "KEITÄ OLEMME", en: "WHO WE ARE", vi: "CHÚNG TÔI LÀ AI" },
      title: { fi: "Tietoa meistä", en: "About us", vi: "Về chúng tôi" },
      text: {
        fi: "Olemme monikulttuurinen kristillinen seurakunta Raahessa. Yhdistämme eri taustoista tulevat ihmiset yhteiseen uskoon ja yhteyteen.",
        en: "We are a multicultural Christian church in Raahe. We bring people from different backgrounds together in shared faith and fellowship.",
        vi: "Chúng tôi là một Hội Thánh Cơ Đốc đa văn hóa tại Raahe, kết nối những người đến từ nhiều nền tảng khác nhau trong cùng một đức tin và sự thông công.",
      },
    },
    {
      label: { fi: "MIHIN USKOMME", en: "WHAT WE BELIEVE", vi: "NIỀM TIN CỦA CHÚNG TÔI" },
      title: { fi: "Uskomme perusteet", en: "Our beliefs", vi: "Nền tảng đức tin" },
      text: {
        fi: "Uskomme Raamattuun Jumalan sanana, Jeesuksen Kristuksen pelastavaan armoon ja Pyhän Hengen voimaan jokapäiväisessä elämässä.",
        en: "We believe in the Bible as God's Word, in the saving grace of Jesus Christ and in the power of the Holy Spirit in everyday life.",
        vi: "Chúng tôi tin Kinh Thánh là Lời Đức Chúa Trời, tin vào ân điển cứu rỗi của Chúa Giê-xu Christ và quyền năng của Đức Thánh Linh trong đời sống hằng ngày.",
      },
    },
    {
      label: { fi: "MITÄ TEEMME", en: "WHAT WE DO", vi: "CHÚNG TÔI LÀM GÌ" },
      title: { fi: "Toimintamme", en: "Our ministries", vi: "Các hoạt động" },
      text: {
        fi: "Järjestämme jumalanpalveluksia, raamattupiirejä, nuorteniltoja ja yhteisötapahtumia. Palvelemme lähimmäisiämme rakkaudella.",
        en: "We hold worship services, Bible studies, youth evenings and community events. We serve our neighbours with love.",
        vi: "Chúng tôi tổ chức các buổi thờ phượng, học Kinh Thánh, sinh hoạt thanh niên và các sự kiện cộng đồng. Chúng tôi phục vụ người lân cận bằng tình yêu thương.",
      },
    },
  ],
  news: {
    label: { fi: "JUMALANPALVELUS", en: "WORSHIP SERVICE", vi: "THỜ PHƯỢNG" },
    title: { fi: "Sunnuntain jumalanpalvelus", en: "Sunday worship service", vi: "Buổi thờ phượng Chủ nhật" },
    text: {
      fi: "Kokoonnumme joka sunnuntai klo 10:00 yhteiseen jumalanpalvelukseen osoitteessa Kulmakatu 8, Raahe. Saarna, rukous, ylistys ja ehtoollinen. Kaikki ovat tervetulleita!",
      en: "We gather every Sunday at 10:00 for worship at Kulmakatu 8, Raahe. Preaching, prayer, praise and Holy Communion. Everyone is welcome!",
      vi: "Chúng tôi nhóm lại thờ phượng mỗi Chủ nhật lúc 10:00 tại Kulmakatu 8, Raahe. Giảng Lời Chúa, cầu nguyện, ngợi khen và Tiệc Thánh. Mọi người đều được chào đón!",
    },
    image: "",
  },
  beliefs: [
    {
      cat: { fi: "OPETUS", en: "TEACHING", vi: "GIÁO LÝ" },
      title: { fi: "Jumala on rakkaus", en: "God is love", vi: "Đức Chúa Trời là tình yêu thương" },
      text: {
        fi: "Uskomme yhteen Jumalaan — Isä, Poika ja Pyhä Henki. Hän on rakastanut meitä jo ennen maailman luomista.",
        en: "We believe in one God — Father, Son and Holy Spirit. He loved us even before the creation of the world.",
        vi: "Chúng tôi tin một Đức Chúa Trời — Đức Chúa Cha, Đức Chúa Con và Đức Thánh Linh. Ngài đã yêu thương chúng ta từ trước khi sáng thế.",
      },
    },
    {
      cat: { fi: "PELASTUS", en: "SALVATION", vi: "SỰ CỨU RỖI" },
      title: { fi: "Armo riittää", en: "Grace is enough", vi: "Ân điển là đủ" },
      text: {
        fi: "Pelastus on Jumalan lahja, joka vastaanotetaan uskon kautta Jeesukseen Kristukseen. Ei kenenkään teoista, ettei kukaan kerskaisi.",
        en: "Salvation is God's gift, received through faith in Jesus Christ. It is not by works, so that no one can boast.",
        vi: "Sự cứu rỗi là món quà của Đức Chúa Trời, được nhận lãnh bởi đức tin nơi Chúa Giê-xu Christ. Chẳng phải bởi việc làm, hầu cho không ai khoe mình.",
      },
    },
    {
      cat: { fi: "SEURAKUNTA", en: "CHURCH", vi: "HỘI THÁNH" },
      title: { fi: "Yhdessä vahvempia", en: "Stronger together", vi: "Cùng nhau vững mạnh" },
      text: {
        fi: "Seurakunta on Kristuksen ruumis maan päällä. Yhdessä kasvamme uskossa, palvelemme toisiamme ja viemme evankeliumia eteenpäin.",
        en: "The church is the body of Christ on earth. Together we grow in faith, serve one another and carry the gospel forward.",
        vi: "Hội Thánh là thân thể của Đấng Christ trên đất. Cùng nhau chúng ta tăng trưởng trong đức tin, phục vụ lẫn nhau và rao truyền Phúc Âm.",
      },
    },
  ],
  activities: [
    {
      day: { fi: "Sunnuntai", en: "Sunday", vi: "Chủ nhật" }, time: "10:00–12:00",
      title: { fi: "Jumalanpalvelus", en: "Worship service", vi: "Thờ phượng" },
      desc: {
        fi: "Yhteinen jumalanpalvelus saarnalla, rukouksella ja ylistyksellä.",
        en: "Worship together with preaching, prayer and praise.",
        vi: "Cùng nhau thờ phượng với giảng Lời Chúa, cầu nguyện và ngợi khen.",
      },
      image: "", video: "",
    },
    {
      day: { fi: "Sunnuntai", en: "Sunday", vi: "Chủ nhật" }, time: "10:00–10:45",
      title: { fi: "Pyhäkoulu", en: "Sunday school", vi: "Trường Chúa nhật" },
      desc: {
        fi: "Lasten pyhäkoulu raamatunkertomuksin ja askarteluin.",
        en: "Sunday school for children with Bible stories and crafts.",
        vi: "Lớp học cho thiếu nhi với các câu chuyện Kinh Thánh và thủ công.",
      },
      image: "", video: "",
    },
    {
      day: { fi: "Keskiviikko", en: "Wednesday", vi: "Thứ Tư" }, time: "18:00–19:30",
      title: { fi: "Raamattupiiri", en: "Bible study", vi: "Học Kinh Thánh" },
      desc: {
        fi: "Raamatun opiskelua ja rukousta pienryhmässä.",
        en: "Studying the Bible and praying together in a small group.",
        vi: "Học Kinh Thánh và cầu nguyện trong nhóm nhỏ.",
      },
      image: "", video: "",
    },
    {
      day: { fi: "Perjantai", en: "Friday", vi: "Thứ Sáu" }, time: "18:00–20:00",
      title: { fi: "Nuortenilta", en: "Youth evening", vi: "Sinh hoạt thanh niên" },
      desc: {
        fi: "Musiikkia, pelejä, keskustelua ja hengellistä opetusta.",
        en: "Music, games, conversation and spiritual teaching.",
        vi: "Âm nhạc, trò chơi, chia sẻ và học hỏi Lời Chúa.",
      },
      image: "", video: "",
    },
  ],
  gallery: [
    { caption: { fi: "Jumalanpalvelus", en: "Worship service", vi: "Thờ phượng" }, image: "" },
    { caption: { fi: "Ylistys", en: "Praise", vi: "Ngợi khen" }, image: "" },
    { caption: { fi: "Pyhäkoulu", en: "Sunday school", vi: "Trường Chúa nhật" }, image: "" },
    { caption: { fi: "Raamattupiiri", en: "Bible study", vi: "Học Kinh Thánh" }, image: "" },
    { caption: { fi: "Nuoret", en: "Youth", vi: "Thanh niên" }, image: "" },
    { caption: { fi: "Yhteinen ateria", en: "Shared meal", vi: "Bữa ăn thông công" }, image: "" },
  ],
  // Saarnat ja äänitteet: { title, speaker, date, desc, url }
  audio: [],
  verse: {
    text: {
      fi: "Sillä niin on Jumala maailmaa rakastanut, että hän antoi ainokaisen Poikansa, ettei yksikään, joka häneen uskoo, hukkuisi, vaan hänellä olisi iankaikkinen elämä.",
      en: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
      vi: "Vì Đức Chúa Trời yêu thương thế gian, đến nỗi đã ban Con một của Ngài, hầu cho hễ ai tin Con ấy không bị hư mất mà được sự sống đời đời.",
    },
    ref: { fi: "Johannes 3:16", en: "John 3:16", vi: "Giăng 3:16" },
  },
  contact: {
    email: "gmcfi.raahe@gmail.com",
    phone: "",
  },
};

// Sivun kiinteät tekstit
export const UI = {
  fi: {
    nextService: "Seuraava jumalanpalvelus", at: "klo",
    nav: { pray: "Rukous", serve: "Palvelu", give: "Lahjoitus", about: "Tietoa meistä", believe: "Usko", activities: "Toiminta", gallery: "Galleria", audio: "Saarnat", contact: "Yhteystiedot" },
    discover: "Tutustu seurakuntaan", readMore: "Lue lisää", moreInfo: "Lisätietoja",
    newsLabel: "AJANKOHTAISTA", newsTitle: "Mitä tapahtuu", church: "SEURAKUNTA",
    beliefsLabel: "USKO JA ELÄMÄ", beliefsTitle: "Uskon perusteet",
    psg: [
      { icon: "🙏", title: "Rukous", text: "Rukous on seurakuntamme sydän. Rukoilemme toistemme, kaupungin ja maailman puolesta.", link: "Liity rukoustiimiin" },
      { icon: "🤝", title: "Palvelu", text: "Palvelemme seurakunnassa ja yhteisössä monin tavoin. Jokaiselle löytyy oma paikka.", link: "Löydä palvelupaikka" },
      { icon: "💝", title: "Lahjoitus", text: "Lahjoituksesi tukee seurakunnan toimintaa ja mahdollistaa evankeliumin viemisen eteenpäin.", link: "Tue toimintaa" },
    ],
    actLabel: "KOKOONTUMISAJAT", actTitle: "Säännöllinen toiminta", watch: "Katso video", videoSoon: "Video tulossa pian.",
    galLabel: "KUVAGALLERIA", galTitle: "Kuvia toiminnastamme",
    audioLabel: "AUDIO", audioTitle: "Saarnat ja äänitteet", download: "Lataa", listen: "Kuuntele",
    contactLabel: "YHTEYSTIEDOT", contactTitle: "Ota yhteyttä",
    address: "OSOITE", email: "SÄHKÖPOSTI", phone: "PUHELIN", service: "JUMALANPALVELUS",
    weekly: (day, time) => `${cap(day)}${day.endsWith("i") ? "sin" : "isin"} klo ${time}`,
    weekdays: ["sunnuntai", "maanantai", "tiistai", "keskiviikko", "torstai", "perjantai", "lauantai"],
    site: "SIVUSTO", admin: "Ylläpito", close: "Sulje", language: "Kieli",
  },
  en: {
    nextService: "Next service", at: "at",
    nav: { pray: "Pray", serve: "Serve", give: "Give", about: "About us", believe: "Beliefs", activities: "Ministries", gallery: "Gallery", audio: "Sermons", contact: "Contact" },
    discover: "Discover who we are", readMore: "Keep reading", moreInfo: "Learn more",
    newsLabel: "WHAT'S HAPPENING", newsTitle: "What's happening", church: "CHURCH",
    beliefsLabel: "FAITH AND LIFE", beliefsTitle: "What we believe",
    psg: [
      { icon: "🙏", title: "Pray", text: "Prayer is the heart of our church. We pray for one another, for our city and for the world.", link: "Join the prayer team" },
      { icon: "🤝", title: "Serve", text: "We serve in the church and in the community in many ways. There is a place for everyone.", link: "Find a place to serve" },
      { icon: "💝", title: "Give", text: "Your gift supports the work of the church and helps carry the gospel forward.", link: "Support the ministry" },
    ],
    actLabel: "MEETING TIMES", actTitle: "Weekly ministries", watch: "Watch video", videoSoon: "Video coming soon.",
    galLabel: "PHOTO GALLERY", galTitle: "Photos from our church",
    audioLabel: "AUDIO", audioTitle: "Sermons and recordings", download: "Download", listen: "Listen",
    contactLabel: "CONTACT", contactTitle: "Get in touch",
    address: "ADDRESS", email: "EMAIL", phone: "PHONE", service: "WORSHIP SERVICE",
    weekly: (day, time) => `${cap(day)}s at ${time}`,
    weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    site: "SITE", admin: "Admin", close: "Close", language: "Language",
  },
  vi: {
    nextService: "Buổi thờ phượng tới", at: "lúc",
    nav: { pray: "Cầu nguyện", serve: "Phục vụ", give: "Dâng hiến", about: "Về chúng tôi", believe: "Niềm tin", activities: "Hoạt động", gallery: "Hình ảnh", audio: "Bài giảng", contact: "Liên hệ" },
    discover: "Tìm hiểu về Hội Thánh", readMore: "Đọc thêm", moreInfo: "Xem thêm",
    newsLabel: "TIN TỨC", newsTitle: "Sự kiện sắp tới", church: "HỘI THÁNH",
    beliefsLabel: "ĐỨC TIN VÀ ĐỜI SỐNG", beliefsTitle: "Nền tảng đức tin",
    psg: [
      { icon: "🙏", title: "Cầu nguyện", text: "Cầu nguyện là trái tim của Hội Thánh. Chúng tôi cầu nguyện cho nhau, cho thành phố và cho thế giới.", link: "Tham gia nhóm cầu nguyện" },
      { icon: "🤝", title: "Phục vụ", text: "Chúng tôi phục vụ trong Hội Thánh và cộng đồng bằng nhiều cách. Ai cũng có một chỗ để phục vụ.", link: "Tìm chỗ phục vụ" },
      { icon: "💝", title: "Dâng hiến", text: "Sự dâng hiến của bạn hỗ trợ công việc của Hội Thánh và giúp rao truyền Phúc Âm.", link: "Hỗ trợ mục vụ" },
    ],
    actLabel: "GIỜ NHÓM HỌP", actTitle: "Sinh hoạt hằng tuần", watch: "Xem video", videoSoon: "Video sẽ có sớm.",
    galLabel: "HÌNH ẢNH", galTitle: "Hình ảnh sinh hoạt",
    audioLabel: "ÂM THANH", audioTitle: "Bài giảng và thu âm", download: "Tải về", listen: "Nghe",
    contactLabel: "LIÊN HỆ", contactTitle: "Liên hệ với chúng tôi",
    address: "ĐỊA CHỈ", email: "EMAIL", phone: "ĐIỆN THOẠI", service: "THỜ PHƯỢNG",
    weekly: (day, time) => `Mỗi ${day} lúc ${time}`,
    weekdays: ["Chủ nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"],
    site: "TRANG", admin: "Quản trị", close: "Đóng", language: "Ngôn ngữ",
  },
};

function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

const isI18n = v => v && typeof v === "object" && !Array.isArray(v) && typeof v.fi === "string";

// Palauttaa tekstin valitulla kielellä; puuttuva käännös → suomi.
export function tr(v, lang) {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (isI18n(v)) return (v[lang] && v[lang].trim()) ? v[lang] : v.fi;
  return "";
}

// Päivittää yhden kielen tekstin.
export function setTr(v, lang, text) {
  const base = isI18n(v) ? v : { fi: typeof v === "string" ? v : "" };
  return { ...base, [lang]: text };
}

// Yhdistää tallennetun sisällön oletuksiin ja muuntaa vanhat yksikieliset tekstit.
function upgrade(saved, def) {
  if (saved === undefined || saved === null) return def;
  if (isI18n(def)) {
    if (typeof saved === "string") return saved === def.fi ? def : { fi: saved };
    if (isI18n(saved)) return saved;
    return def;
  }
  if (Array.isArray(def)) {
    if (!Array.isArray(saved)) return def;
    return saved.map((item, i) => (def[i] !== undefined ? upgrade(item, def[i]) : upgradeLoose(item, def[0])));
  }
  if (def && typeof def === "object") {
    if (typeof saved !== "object" || Array.isArray(saved)) return def;
    const out = { ...saved };
    for (const k of Object.keys(def)) out[k] = upgrade(saved[k], def[k]);
    return out;
  }
  return saved;
}

// Uusille listan kohteille: muunna merkkijonot kielimuotoon oletuskohteen mallin mukaan.
function upgradeLoose(item, shape) {
  if (!item || typeof item !== "object" || !shape) return item;
  const out = { ...item };
  for (const k of Object.keys(shape)) if (isI18n(shape[k]) && typeof out[k] === "string") out[k] = { fi: out[k] };
  return out;
}

export function mergeContent(saved) {
  if (!saved || typeof saved !== "object") return DEFAULT_CONTENT;
  return upgrade(saved, DEFAULT_CONTENT);
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

// Kielen tunnistus: tallennettu valinta → selaimen kieli → suomi.
export function initialLang() {
  try {
    const q = new URLSearchParams(window.location.search).get("lang");
    if (LANGS.some(l => l.code === q)) return q;
    const s = localStorage.getItem("gmcfi-lang");
    if (LANGS.some(l => l.code === s)) return s;
  } catch { /* ignore */ }
  const nav = (navigator.language || "fi").slice(0, 2).toLowerCase();
  return LANGS.some(l => l.code === nav) ? nav : "fi";
}

export const WEEKDAYS = UI.fi.weekdays;
