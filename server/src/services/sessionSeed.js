import { SessionSettings } from "../models/SessionSettings.js";

/** إعدادات حُفظت بعد «حفظ» من لوحة الأخصائي قبل تصحيح workDays الافتراضي (كانت تصبح [1..4] فقط). */
export async function repairWorkDaysFromLegacyAdminDefault() {
  await SessionSettings.updateMany(
    { workDays: [1, 2, 3, 4] },
    { $set: { workDays: [0, 1, 2, 3, 4, 6] } }
  );
}

export async function ensureSessionSettingsSeed() {
  const n = await SessionSettings.countDocuments();
  if (n > 0) return;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 21);
  await SessionSettings.create({
    active: true,
    windowStartDate: start,
    windowEndDate: end,
    dailyStartTime: "09:00",
    dailyEndTime: "17:00",
    sessionDurationMinutes: 45,
    workDays: [0, 1, 2, 3, 4, 6],
  });
  console.log("[sessions] Seeded default SessionSettings");
}
