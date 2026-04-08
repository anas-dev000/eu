import mongoose from "mongoose";

const sessionSettingsSchema = new mongoose.Schema(
  {
    active: { type: Boolean, default: true },
    /** أول يوم يُسمح بالحجز فيه */
    windowStartDate: { type: Date, required: true },
    /** آخر يوم يُسمح بالحجز فيه */
    windowEndDate: { type: Date, required: true },
    /** بداية اليوم اليومي HH:mm */
    dailyStartTime: { type: String, required: true, default: "09:00" },
    /** نهاية اليوم اليومي HH:mm (آخر بداية جلسة + المدة يجب أن تكون ≤ هذا الوقت) */
    dailyEndTime: { type: String, required: true, default: "17:00" },
    sessionDurationMinutes: { type: Number, required: true, default: 45, min: 15, max: 180 },
    /** أيام العمل: 0=أحد … 6=سبت (لا يُعرض الجمعة 5 في المواعيد) */
    workDays: { type: [Number], default: [0, 1, 2, 3, 4, 6] },
  },
  { timestamps: true }
);

export const SessionSettings = mongoose.model("SessionSettings", sessionSettingsSchema);
