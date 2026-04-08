import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/requireAdmin.middleware.js";
import { SessionSettings } from "../models/SessionSettings.js";
import { SessionBooking } from "../models/SessionBooking.js";
import { SessionMessage } from "../models/SessionMessage.js";
import { generateAvailableSlots, generateBookingGrid, slotEquals } from "../utils/sessionSlots.js";
import { parseYmdLocal, minutesFromHHMM } from "../utils/localDate.js";

const router = express.Router();

const BLOCKING = ["pending", "confirmed"];

async function getActiveSettings() {
  return SessionSettings.findOne().sort({ updatedAt: -1 }).lean();
}

async function getOccupiedIntervals() {
  const list = await SessionBooking.find({ status: { $in: BLOCKING } })
    .select("startAt endAt")
    .lean();
  return list.map((b) => ({ startAt: new Date(b.startAt), endAt: new Date(b.endAt) }));
}

function canAccessBooking(booking, userId, role) {
  const uid = String(userId);
  if (role === "admin") return true;
  return String(booking.bookerUserId) === uid;
}

function chatAllowedForStatus(status) {
  return ["pending", "confirmed"].includes(status);
}

/** إعدادات العرض للعامة */
router.get("/public/settings", async (req, res) => {
  try {
    const s = await getActiveSettings();
    if (!s) return res.json({ settings: null });
    res.json({
      settings: {
        active: s.active,
        windowStartDate: s.windowStartDate,
        windowEndDate: s.windowEndDate,
        dailyStartTime: s.dailyStartTime,
        dailyEndTime: s.dailyEndTime,
        sessionDurationMinutes: s.sessionDurationMinutes,
        workDays: s.workDays,
      },
    });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/public/slots", async (req, res) => {
  try {
    const s = await getActiveSettings();
    if (!s || !s.active) return res.json({ slots: [], days: [], grid: {} });
    const occupied = await getOccupiedIntervals();
    const now = new Date();
    const slots = generateAvailableSlots(s, occupied, now);
    const { days, grid } = generateBookingGrid(s, occupied, now);
    res.json({
      slots: slots.map((x) => ({
        startAt: x.startAt.toISOString(),
        endAt: x.endAt.toISOString(),
      })),
      days,
      grid,
    });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/bookings", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({ message: "الحجز متاح للمستخدمين المسجلين كمراجعين فقط" });
    }
    const {
      startAt,
      patientFullName,
      patientAgeYears,
      patientDateOfBirth,
      relationshipToPatient,
      contactPhone,
      contactPhoneAlt,
      cityOrRegion,
      concernsSummary,
      priorDiagnosisSummary,
      additionalNotes,
    } = req.body;

    if (!startAt || !patientFullName || !relationshipToPatient || !contactPhone || !concernsSummary) {
      return res.status(400).json({ message: "أكمل بيانات المستفيد من الجلسة والموعد" });
    }

    const requestedStart = new Date(startAt);
    if (Number.isNaN(requestedStart.getTime())) {
      return res.status(400).json({ message: "موعد غير صالح" });
    }

    const s = await getActiveSettings();
    if (!s || !s.active) return res.status(400).json({ message: "الحجز غير متاح حالياً" });

    const occupied = await getOccupiedIntervals();
    const available = generateAvailableSlots(s, occupied);
    const match = available.find((sl) => slotEquals(sl.startAt, requestedStart));
    if (!match) {
      return res.status(400).json({ message: "هذا الموعد غير متاح" });
    }

    const booking = await SessionBooking.create({
      bookerUserId: req.user.id,
      startAt: match.startAt,
      endAt: match.endAt,
      status: "pending",
      patientFullName: String(patientFullName).trim(),
      patientAgeYears: patientAgeYears != null ? Number(patientAgeYears) : undefined,
      patientDateOfBirth: patientDateOfBirth ? new Date(patientDateOfBirth) : undefined,
      relationshipToPatient: String(relationshipToPatient).trim(),
      contactPhone: String(contactPhone).trim(),
      contactPhoneAlt: contactPhoneAlt ? String(contactPhoneAlt).trim() : undefined,
      cityOrRegion: cityOrRegion ? String(cityOrRegion).trim() : undefined,
      concernsSummary: String(concernsSummary).trim(),
      priorDiagnosisSummary: priorDiagnosisSummary ? String(priorDiagnosisSummary).trim() : undefined,
      additionalNotes: additionalNotes ? String(additionalNotes).trim() : undefined,
    });

    const populated = await SessionBooking.findById(booking._id).populate("bookerUserId", "email").lean();
    res.status(201).json({ booking: populated });
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: "تعارض في الحجز" });
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/my-bookings", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({ message: "غير مصرّح" });
    }
    const list = await SessionBooking.find({ bookerUserId: req.user.id })
      .sort({ startAt: -1 })
      .lean();
    res.json({ bookings: list });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/bookings/:id/cancel", authMiddleware, async (req, res) => {
  try {
    const booking = await SessionBooking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "غير موجود" });
    if (String(booking.bookerUserId) !== req.user.id) {
      return res.status(403).json({ message: "غير مصرّح" });
    }
    if (!["pending", "confirmed"].includes(booking.status)) {
      return res.status(400).json({ message: "لا يمكن إلغاء هذا الحجز" });
    }
    booking.status = "cancelled_by_user";
    await booking.save();
    res.json({ message: "تم الإلغاء", booking });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/bookings/:bookingId/messages", authMiddleware, async (req, res) => {
  try {
    const booking = await SessionBooking.findById(req.params.bookingId);
    if (!booking) return res.status(404).json({ message: "غير موجود" });
    if (!canAccessBooking(booking, req.user.id, req.user.role)) {
      return res.status(403).json({ message: "غير مصرّح" });
    }
    if (!chatAllowedForStatus(booking.status)) {
      return res.status(400).json({ message: "المحادثة غير متاحة لهذا الحجز" });
    }
    const messages = await SessionMessage.find({ bookingId: booking._id })
      .sort({ createdAt: 1 })
      .populate("senderUserId", "email role")
      .lean();
    res.json({ messages });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/bookings/:bookingId/messages", authMiddleware, async (req, res) => {
  try {
    const { body: text } = req.body;
    if (!text || !String(text).trim()) {
      return res.status(400).json({ message: "الرسالة فارغة" });
    }
    const booking = await SessionBooking.findById(req.params.bookingId);
    if (!booking) return res.status(404).json({ message: "غير موجود" });
    if (!canAccessBooking(booking, req.user.id, req.user.role)) {
      return res.status(403).json({ message: "غير مصرّح" });
    }
    if (!chatAllowedForStatus(booking.status)) {
      return res.status(400).json({ message: "المحادثة غير متاحة لهذا الحجز" });
    }
    const msg = await SessionMessage.create({
      bookingId: booking._id,
      senderUserId: req.user.id,
      body: String(text).trim().slice(0, 4000),
    });
    const populated = await SessionMessage.findById(msg._id).populate("senderUserId", "email role").lean();
    res.status(201).json({ message: populated });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ——— أخصائي ——— */

router.get("/admin/settings", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const s = await getActiveSettings();
    res.json({ settings: s });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/admin/settings", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const {
      active,
      windowStartDate,
      windowEndDate,
      dailyStartTime,
      dailyEndTime,
      sessionDurationMinutes,
      workDays,
    } = req.body;

    if (!windowStartDate || !windowEndDate || !dailyStartTime || !dailyEndTime) {
      return res.status(400).json({ message: "أكمل نافذة التواريخ والأوقات" });
    }

    const winStart = parseYmdLocal(windowStartDate);
    const winEnd = parseYmdLocal(windowEndDate);
    if (!winStart || !winEnd) {
      return res.status(400).json({ message: "صيغة التاريخ غير صالحة (استخدم YYYY-MM-DD)" });
    }
    if (winEnd.getTime() < winStart.getTime()) {
      return res.status(400).json({ message: "آخر يوم النافذة يجب أن يكون بعد أو يساوي أول يوم" });
    }

    const startM = minutesFromHHMM(dailyStartTime);
    const endM = minutesFromHHMM(dailyEndTime);
    if (Number.isNaN(startM) || Number.isNaN(endM)) {
      return res.status(400).json({ message: "صيغة الوقت غير صالحة" });
    }
    const dur = Math.min(180, Math.max(15, Number(sessionDurationMinutes) || 45));
    if (endM <= startM) {
      return res.status(400).json({ message: "نهاية نطاق الجلسات يجب أن تكون بعد بداية اليوم" });
    }
    if (endM - startM < dur) {
      return res.status(400).json({
        message: `الفرق بين بداية ونهاية اليوم يجب أن يسمح بجلسة واحدة على الأقل (${dur} دقيقة)`,
      });
    }

    const rawWd = Array.isArray(workDays) && workDays.length ? workDays.map(Number) : [0, 1, 2, 3, 4, 6];
    const workDaysClean = [...new Set(rawWd.filter((d) => d >= 0 && d <= 6 && d !== 5))];
    const workDaysFinal = workDaysClean.length ? workDaysClean : [0, 1, 2, 3, 4, 6];

    const doc = await SessionSettings.findOneAndUpdate(
      {},
      {
        $set: {
          active: active !== false,
          windowStartDate: winStart,
          windowEndDate: winEnd,
          dailyStartTime: String(dailyStartTime),
          dailyEndTime: String(dailyEndTime),
          sessionDurationMinutes: dur,
          workDays: workDaysFinal,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({ settings: doc });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/admin/bookings", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const list = await SessionBooking.find()
      .sort({ startAt: 1 })
      .populate("bookerUserId", "email")
      .lean();
    res.json({ bookings: list });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/admin/bookings/:id", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { status, specialistInternalNote } = req.body;
    const booking = await SessionBooking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "غير موجود" });

    if (status === "confirmed") {
      if (booking.status !== "pending") {
        return res.status(400).json({ message: "يمكن تأكيد الطلبات المعلّقة فقط" });
      }
      booking.status = "confirmed";
    } else if (status === "rejected") {
      if (!["pending", "confirmed"].includes(booking.status)) {
        return res.status(400).json({ message: "لا يمكن رفض هذا الحجز" });
      }
      booking.status = "rejected";
    } else if (status === "cancelled_by_specialist") {
      if (!["pending", "confirmed"].includes(booking.status)) {
        return res.status(400).json({ message: "لا يمكن إلغاء هذا الحجز" });
      }
      booking.status = "cancelled_by_specialist";
    } else if (status != null) {
      return res.status(400).json({ message: "حالة غير صالحة" });
    }

    if (specialistInternalNote !== undefined) {
      booking.specialistInternalNote = String(specialistInternalNote).trim();
    }

    await booking.save();
    const out = await SessionBooking.findById(booking._id).populate("bookerUserId", "email").lean();
    res.json({ booking: out });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
