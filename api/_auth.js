import { timingSafeEqual, createHash } from "node:crypto";

export function checkPassword(req) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return { ok: false, status: 500, error: "ADMIN_PASSWORD puuttuu Vercelin asetuksista" };
  const given = String(req.headers["x-admin-password"] || "");
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(expected).digest();
  if (!timingSafeEqual(a, b)) return { ok: false, status: 401, error: "Väärä salasana" };
  return { ok: true };
}

export function hasBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}
