/**
 * تحويل حقل تاريخ من واجهة <input type="date"> (YYYY-MM-DD) إلى منتصف ليل
 * **التقويم المحلي** لخادم Node — بدون new Date("YYYY-MM-DD) الذي يُفسَّر كـ UTC.
 */
export function parseYmdLocal(ymd) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(ymd).trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  const dt = new Date(y, mo - 1, d, 0, 0, 0, 0);
  if (Number.isNaN(dt.getTime())) return null;
  if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return null;
  return dt;
}

export function minutesFromHHMM(str) {
  const parts = String(str).trim().split(":");
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1] ?? "0", 10);
  if (Number.isNaN(h) || Number.isNaN(m)) return NaN;
  return h * 60 + m;
}
