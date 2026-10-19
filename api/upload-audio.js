import { issueSignedToken } from "@vercel/blob";
import { handleUploadPresigned } from "@vercel/blob/client";
import { checkPassword, hasBlob, blobToken } from "./_auth.js";

// Isot äänitiedostot ladataan selaimesta suoraan Vercel Blobiin.
// Tämä reitti vain tarkistaa salasanan ja antaa lyhytaikaisen latausluvan.

const MAX_BYTES = 300 * 1024 * 1024; // 300 Mt
const AUDIO_TYPES = [
  "audio/*", "audio/mpeg", "audio/mp3", "audio/mp4", "audio/x-m4a", "audio/m4a", "audio/aac",
  "audio/wav", "audio/x-wav", "audio/wave", "audio/ogg", "audio/webm", "audio/flac", "audio/x-flac",
];

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = null; } }
  if (!body || typeof body !== "object") return res.status(400).json({ error: "Virheellinen pyyntö" });

  if (body.type !== "blob.generate-presigned-url") return res.status(400).json({ error: "Tuntematon pyyntö" });

  const auth = checkPassword(req);
  if (!auth.ok) return res.status(auth.status).json({ error: auth.error });
  if (!hasBlob()) return res.status(500).json({ error: "Vercel Blob -tallennustilaa ei ole yhdistetty projektiin" });

  try {
    const result = await handleUploadPresigned({
      body,
      request: req,
      webhookPublicKey: process.env.BLOB_WEBHOOK_PUBLIC_KEY || "unused",
      getSignedToken: async pathname => {
        if (!/^audio\/[\w.\-]+$/.test(pathname)) throw new Error("Virheellinen tiedostonimi");
        const token = await issueSignedToken({
          pathname,
          operations: ["put"],
          allowedContentTypes: AUDIO_TYPES,
          maximumSizeInBytes: MAX_BYTES,
          validUntil: Date.now() + 2 * 60 * 60 * 1000,
          ...(blobToken() ? { token: blobToken() } : {}),
        });
        return {
          token,
          urlOptions: {
            allowedContentTypes: AUDIO_TYPES,
            maximumSizeInBytes: MAX_BYTES,
            addRandomSuffix: true,
          },
        };
      },
    });
    return res.status(200).json(result);
  } catch (e) {
    return res.status(400).json({ error: String(e?.message || e) });
  }
}
