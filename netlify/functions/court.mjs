import { getStore } from "@netlify/blobs";
import { createHash, timingSafeEqual } from "node:crypto";

const sha = (s) => createHash("sha256").update(String(s)).digest();
const same = (a, b) => timingSafeEqual(sha(a), sha(b));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const dec = (s) => { try { return decodeURIComponent(s || ""); } catch { return s || ""; } };
const NS = { "cache-control": "no-store" };

// Các phiên bản tính toán đặt sân đã lưu: chỉ quản trị (ADMIN_PASSWORD) hoặc thủ quỹ (TREASURER_PASSWORD) xem/lưu được.
// Chỉ cộng thêm phiên bản mới (không ghi đè của nhau); chỉ quản trị mới xoá được.
const roleOf = (req) => {
  const given = dec(req.headers.get("x-admin")).trim();
  const ap = (Netlify.env.get("ADMIN_PASSWORD") || "").trim();
  const tp = (Netlify.env.get("TREASURER_PASSWORD") || "").trim();
  if (!given) return "";
  if (ap && same(given, ap)) return "admin";
  if (tp && same(given, tp)) return "treasurer";
  return "";
};

export default async (req) => {
  const role = roleOf(req);
  if (!role) { await wait(800); return new Response("forbidden", { status: 403 }); }
  const store = getStore({ name: "p5am", consistency: "strong" });
  const cur = (await store.get("court", { type: "json" })) || { versions: [] };
  if (!Array.isArray(cur.versions)) cur.versions = [];

  if (req.method === "GET") return Response.json({ versions: cur.versions, role }, { headers: NS });

  if (req.method === "POST") {
    const b = await req.json().catch(() => null);
    if (!b) return new Response("bad request", { status: 400 });
    if (b.action === "del") {
      if (role !== "admin") return new Response("forbidden", { status: 403 });
      cur.versions = cur.versions.filter((v) => String(v.id) !== String(b.id));
    } else if (b.action === "save") {
      const v = b.v;
      if (!v || typeof v !== "object" || JSON.stringify(v).length > 150000) return new Response("bad request", { status: 400 });
      const ts = Date.now();
      cur.versions.push({ ...v, note: String(v.note || "").slice(0, 200), id: ts + "-" + Math.random().toString(36).slice(2, 6), by: role, ts });
      if (cur.versions.length > 200) cur.versions = cur.versions.slice(-200);
    } else return new Response("bad request", { status: 400 });
    await store.setJSON("court", cur);
    return Response.json({ ok: true, versions: cur.versions, role });
  }
  return new Response("method not allowed", { status: 405 });
};
export const config = { path: "/api/court" };
