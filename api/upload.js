import { put } from "@vercel/blob";
import { checkPassword, hasBlob, blobToken } from "./_auth.js";

export const config = { api: { bodyParser: { sizeLimit: "4mb" } } };

const TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const auth = checkPassword(req);
  if (!auth.ok) return res.status(auth.status).json({ error: auth.error });
  if (!hasBlob()) return res.status(500).json({ error: "Vercel Blob -tallennustilaa ei ole yhdistetty projektiin" });

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = null; } }
  const m = String(body?.data || "").match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/);
  if (!m) return res.status(400).json({ error: "Kuva puuttuu tai muoto ei kelpaa" });

  const buf = Buffer.from(m[2], "base64");
  if (buf.length > 3_000_000) return res.status(413).json({ error: "Kuva on liian suuri" });

  const blob = await put(`images/kuva.${TYPES[m[1]]}`, buf, {
    access: "public", contentType: m[1], addRandomSuffix: true, token: blobToken(),
  });
  return res.status(200).json({ url: blob.url });
}
