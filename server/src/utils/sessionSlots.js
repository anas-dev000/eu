/**
 * توليد فترات الجلسات (توقيت محلي لخادم Node).
 * - شريط «اختر اليوم»: حتى ستة أيام لكل منها موعد متاح؛ الجمعة دائماً مستبعدة؛ أيام غير مفعّلة في workDays تُتخطى؛ الأيام بلا موعد متاح تُتخطى.
 * - الفترات: من dailyStart حتى dailyEnd بخطوة المدة؛ فقط أيام workDays (والجمعة دائماً بلا فترات).
 */

const FRIDAY = 5;
/** عدد أيام في شريط «اختر اليوم» */
const PICKABLE_DAY_COUNT = 6;
/** حد أمان لمسح التقويم عند البحث عن أيام فيها موعد */
const MAX_CALENDAR_SCAN_DAYS = 120;

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function dateKeyLocal(d) {
  const x = new Date(d);
  const y = x.getFullYear();
  const m = String(x.getMonth() + 1).padStart(2, "0");
  const day = String(x.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseHHMM(str) {
  const [h, m] = String(str).split(":").map((n) => parseInt(n, 10));
  if (Number.isNaN(h) || Number.isNaN(m)) return { h: 9, m: 0 };
  return { h, m };
}

function setTimeOnDate(day, hhmm) {
  const { h, m } = parseHHMM(hhmm);
  const x = new Date(day);
  x.setHours(h, m, 0, 0);
  return x;
}

function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function addMinutes(d, mins) {
  return new Date(d.getTime() + mins * 60_000);
}

function compareDayOnly(a, b) {
  return startOfDay(a).getTime() - startOfDay(b).getTime();
}

function workDaySet(settings) {
  const wd = settings.workDays?.length ? settings.workDays : [0, 1, 2, 3, 4, 6];
  return new Set(wd.filter((d) => d >= 0 && d <= 6 && d !== FRIDAY));
}

export function generateSlotCellsForDay(settings, occupied, dayStart, now = new Date()) {
  const dow = dayStart.getDay();
  if (dow === FRIDAY) return [];
  if (!workDaySet(settings).has(dow)) return [];

  const duration = settings.sessionDurationMinutes;
  const dayOpen = setTimeOnDate(dayStart, settings.dailyStartTime);
  const dayClose = setTimeOnDate(dayStart, settings.dailyEndTime);
  const cells = [];
  for (
    let slotStart = new Date(dayOpen);
    addMinutes(slotStart, duration) <= dayClose;
    slotStart = addMinutes(slotStart, duration)
  ) {
    const slotEnd = addMinutes(slotStart, duration);
    const inPast = slotStart.getTime() <= now.getTime();
    const clash = occupied.some((o) => o.startAt < slotEnd && o.endAt > slotStart);
    cells.push({
      startAt: new Date(slotStart),
      endAt: new Date(slotEnd),
      available: !inPast && !clash,
    });
  }
  return cells;
}

/**
 * أول `PICKABLE_DAY_COUNT` أيام (جمعة مستبعدة؛ workDays فقط) يوجد في كل منها موعد متاح، ضمن نافذة الحجز.
 */
export function getPickableCalendarDayStarts(settings, occupied, now = new Date()) {
  if (!settings?.active) return [];
  const winStart = startOfDay(settings.windowStartDate);
  const winEnd = startOfDay(settings.windowEndDate);
  const todayStart = startOfDay(now);
  const rangeStart = new Date(Math.max(winStart.getTime(), todayStart.getTime()));
  if (compareDayOnly(rangeStart, winEnd) > 0) return [];

  const wd = workDaySet(settings);
  const out = [];
  let d = new Date(rangeStart);
  for (let scanned = 0; scanned < MAX_CALENDAR_SCAN_DAYS && compareDayOnly(d, winEnd) <= 0; scanned++) {
    const dayDow = d.getDay();
    if (dayDow !== FRIDAY && wd.has(dayDow)) {
      const dayStart = startOfDay(d);
      const cells = generateSlotCellsForDay(settings, occupied, dayStart, now);
      if (cells.some((c) => c.available)) {
        out.push(dayStart);
        if (out.length >= PICKABLE_DAY_COUNT) break;
      }
    }
    d = addDays(d, 1);
  }
  return out;
}

/**
 * للواجهة: أيام الشريط + شبكة كل يوم (كل الفترات مع available).
 */
export function generateBookingGrid(settings, occupied, now = new Date()) {
  if (!settings?.active) {
    return { days: [], grid: {} };
  }
  const dayStarts = getPickableCalendarDayStarts(settings, occupied, now);
  const days = [];
  const grid = {};
  for (const dayStart of dayStarts) {
    const key = dateKeyLocal(dayStart);
    const cells = generateSlotCellsForDay(settings, occupied, dayStart, now);
    grid[key] = cells.map((c) => ({
      startAt: c.startAt.toISOString(),
      endAt: c.endAt.toISOString(),
      available: c.available,
    }));
    const anchor = new Date(dayStart);
    anchor.setHours(12, 0, 0, 0);
    days.push({ dateKey: key, anchor: anchor.toISOString() });
  }
  return { days, grid };
}

/**
 * @param {object} settings — من SessionSettings
 * @param {Array<{startAt:Date,endAt:Date}>} occupied — حجوزات نشطة
 */
export function generateAvailableSlots(settings, occupied, now = new Date()) {
  if (!settings?.active) return [];
  const dayStarts = getPickableCalendarDayStarts(settings, occupied, now);
  const slots = [];
  for (const dayStart of dayStarts) {
    const cells = generateSlotCellsForDay(settings, occupied, dayStart, now);
    for (const c of cells) {
      if (c.available) slots.push({ startAt: c.startAt, endAt: c.endAt });
    }
  }
  return slots;
}

export function slotEquals(a, b, toleranceMs = 60_000) {
  return Math.abs(new Date(a).getTime() - new Date(b).getTime()) <= toleranceMs;
}
