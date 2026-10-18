import { timingSafeEqual, createHash, scryptSync } from "node:crypto";

// Oletussalasanan tiiviste (scrypt). Salasanan voi vaihtaa asettamalla
// Vercelissä ympäristömuuttujan ADMIN_PASSWORD, joka ohittaa tämän.
const DEFAULT_SALT = "f80440c410ca839b258c1bb8c755911e";
const DEFAULT_HASH = "c9b05ddb1f832929c41cb41b54daf5badcb797012894f69ee4dc46d76adaafed";

export function checkPassword(req) {
  const given = String(req.headers["x-admin-password"] || "");
  const expected = process.env.ADMIN_PASSWORD;
  let ok;
  if (expected) {
    const a = createHash("sha256").update(given).digest();
    const b = createHash("sha256").update(expected).digest();
    ok = timingSafeEqual(a, b);
  } else {
    const a = scryptSync(given, DEFAULT_SALT, 32);
    ok = timingSafeEqual(a, Buffer.from(DEFAULT_HASH, "hex"));
  }
  if (!ok) return { ok: false, status: 401, error: "Väärä salasana" };
  return { ok: true };
}

export function hasBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}
