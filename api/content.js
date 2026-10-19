import { put, list, del } from "@vercel/blob";
import { checkPassword, hasBlob } from "./_auth.js";

const PREFIX = "content/site-";

async function latest() {
  const { blobs } = await list({ prefix: PREFIX, limit: 1000 });
  blobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
  return blobs;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "GET") {
    if (!hasBlob()) return res.status(200).json({ content: null, storage: false });
    try {
      const blobs = await latest();
      if (!blobs.length) return res.status(200).json({ content: null, storage: true });
      const r = await fetch(blobs[0].url, { cache: "no-store" });
      return res.status(200).json({ content: await r.json(), updatedAt: blobs[0].uploadedAt, storage: true });
    } catch (e) {
      return res.status(200).json({ content: null, storage: true, error: String(e.message || e) });
    }
  }

  if (req.method === "PUT") {
    const auth = checkPassword(req);
    if (!auth.ok) return res.status(auth.status).json({ error: auth.error });
    if (!hasBlob()) return res.status(500).json({ error: "Vercel Blob -tallennustilaa ei ole yhdistetty projektiin" });

    let body = req.body;
    if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = null; } }
    if (!body || typeof body !== "object" || !body.content) return res.status(400).json({ error: "Sisältö puuttuu" });

    const json = JSON.stringify(body.content);
    if (json.length > 500_000) return res.status(413).json({ error: "Sisältö on liian suuri" });

    const saved = await put(`${PREFIX}${Date.now()}.json`, json, {
      access: "public", contentType: "application/json", addRandomSuffix: true,
    });

    // Pidä 10 uusinta versiota varmuuskopioina, poista vanhemmat.
    try {
      const blobs = await latest();
      const old = blobs.slice(10).map(b => b.url);
      if (old.length) await del(old);
    } catch { /* ei kriittinen */ }

    return res.status(200).json({ ok: true, url: saved.url });
  }

  res.setHeader("Allow", "GET, PUT");
  return res.status(405).json({ error: "Method not allowed" });
}
