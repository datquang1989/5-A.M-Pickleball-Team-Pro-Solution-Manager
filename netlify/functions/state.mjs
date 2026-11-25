import { getStore } from "@netlify/blobs";
import { createHash, timingSafeEqual } from "node:crypto";

const sha = (s) => createHash("sha256").update(String(s)).digest();
const same = (a, b) => timingSafeEqual(sha(a), sha(b));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
// Trình duyệt gửi mật khẩu đã encodeURIComponent (để hỗ trợ tiếng Việt có dấu trong header)
const dec = (s) => { try { return decodeURIComponent(s || ""); } catch { return s || ""; } };
const NS = { "cache-control": "no-store" };

export default async (req) => {
  const store = getStore("p5am");
  const pw = (Netlify.env.get("ADMIN_PASSWORD") || "").trim();
  const given = dec(req.headers.get("x-admin")).trim();
  const configured = pw.length > 0;
  const okPw = configured && given.length > 0 && same(given, pw);
  const url = new URL(req.url);
  // Tài khoản "Chủ kèo": HOST_PASSWORD, nhiều người ngăn cách bằng dấu phẩy -> h1, h2, ...
  const hosts = (Netlify.env.get("HOST_PASSWORD") || "").split(",").map((x) => x.trim()).filter(Boolean);
  const hidx = !okPw && given.length > 0 ? hosts.findIndex((p) => same(given, p)) : -1;
  const hid = hidx >= 0 ? "h" + (hidx + 1) : null;

  if (req.method === "GET") {
    // Kiểm tra mật khẩu khi đăng nhập
    if (url.searchParams.has("check")) {
      if (configured && !okPw) await wait(800); // làm chậm dò mật khẩu (kể cả khi là thủ quỹ, chỉ chậm thêm chút)
      const tp = (Netlify.env.get("TREASURER_PASSWORD") || "").trim();
      const okT = !okPw && tp.length > 0 && given.length > 0 && same(given, tp);
      const okH = !okPw && !okT && hid;
      return Response.json({ configured, ok: okPw || okT || !!okH, role: okPw ? "admin" : okT ? "treasurer" : okH ? "host" : null, hid: okH ? hid : undefined }, { headers: NS });
    }
    const d = await store.get("state", { type: "json" });
    return Response.json(d || null, { headers: NS });
  }

  if (req.method === "POST") {
    if (!okPw && !hid) {
      if (configured) await wait(800);
      return new Response("forbidden", { status: 403 });
    }
    const b = await req.json().catch(() => null);
    if (!okPw) {
      // Chủ kèo: chỉ được thêm/sửa/xoá Mini game, Giải đấu và Thách đấu do chính mình tạo; mọi dữ liệu khác giữ nguyên bản trên máy chủ
      if (!b || !Array.isArray(b.events)) return new Response("bad request", { status: 400 });
      const cur = await store.get("state", { type: "json" });
      if (!cur || !Array.isArray(cur.members)) return new Response("no base state", { status: 409 });
      const del = b.hdel || {};
      const merge = (curL, newL, dl, ok) => {
        curL = Array.isArray(curL) ? curL : [];
        newL = Array.isArray(newL) ? newL : [];
        const dset = new Set((Array.isArray(dl) ? dl : []).map(String));
        const byId = new Map(newL.map((x) => [String(x && x.id), x]));
        const ids = new Set(curL.map((x) => String(x.id)));
        const out = [];
        for (const x of curL) {
          if (x.own !== hid) { out.push(x); continue; }
          if (dset.has(String(x.id))) continue;
          const n = byId.get(String(x.id));
          out.push(n && ok(n, x) ? { ...n, id: x.id, own: hid } : x);
        }
        for (const n of newL) {
          if (n && n.id != null && !ids.has(String(n.id)) && n.own === hid && ok(n, null)) out.push({ ...n, own: hid });
        }
        return out;
      };
      const evOk = (n, old) => (n.kind === "mini" || n.kind === "giai") && (!old || old.kind === n.kind);
      const next = { ...cur, events: merge(cur.events, b.events, del.e, evOk), bets: merge(cur.bets, b.bets, del.b, () => true), _rev: ((cur && cur._rev) || 0) + 1 };
      if (JSON.stringify(next).length > 4_000_000) return new Response("too large", { status: 413 });
      await store.setJSON("state", next);
      return Response.json({ ok: true, rev: next._rev });
    }
    if (!b || !Array.isArray(b.members) || !Array.isArray(b.events)) return new Response("bad request", { status: 400 });
    // Giữ lại Mini game / Giải đấu / Thách đấu do Chủ kèo vừa tạo mà bản của quản trị (đang mở từ trước) chưa có, trừ khi quản trị chủ động xoá
    const { hdel, ...rest } = b;
    const cur = await store.get("state", { type: "json" });
    // Chống ghi đè bằng bản cũ: máy khách phải gửi đúng số phiên bản (_rev) đang lưu trên máy chủ
    const curRev = (cur && cur._rev) || 0;
    if (cur && cur._rev != null && Number(rest._rev) !== curRev) return Response.json({ conflict: true, rev: curRev }, { status: 409, headers: NS });
    rest._rev = curRev + 1;
    if (cur) {
      const keep = (curL, newL, dl) => {
        const ids = new Set((Array.isArray(newL) ? newL : []).map((x) => String(x && x.id)));
        const d = new Set((Array.isArray(dl) ? dl : []).map(String));
        return (Array.isArray(curL) ? curL : []).filter((x) => x && x.own && !ids.has(String(x.id)) && !d.has(String(x.id)));
      };
      const dl = hdel || {};
      rest.events = [...rest.events, ...keep(cur.events, rest.events, dl.e)];
      rest.bets = [...(Array.isArray(rest.bets) ? rest.bets : []), ...keep(cur.bets, rest.bets, dl.b)];
    }
    await store.setJSON("state", rest);
    return Response.json({ ok: true, rev: rest._rev });
  }
  return new Response("method not allowed", { status: 405 });
};
export const config = { path: "/api/state" };
