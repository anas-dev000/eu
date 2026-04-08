import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import SessionBookingChat from "../components/SessionBookingChat";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Calendar, Clock, User, LogIn } from "lucide-react";
import axios from "axios";
import { titleVariants, itemVariants } from "../utils/animations";

const RELATION_OPTIONS = [
  { value: "ولي الأمر", label: "ولي الأمر" },
  { value: "الأم", label: "الأم" },
  { value: "الأب", label: "الأب" },
  { value: "وصي قانوني", label: "وصي قانوني" },
  { value: "مقدم رعاية", label: "مقدم رعاية" },
  { value: "آخر", label: "آخر" },
];

const STATUS_AR = {
  pending: "قيد المراجعة",
  confirmed: "مؤكد",
  rejected: "مرفوض",
  cancelled_by_user: "ألغيتَه أنت",
  cancelled_by_specialist: "ألغاه الأخصائي",
};

function countAvailableInGrid(grid, dateKey) {
  const row = grid?.[dateKey];
  if (!Array.isArray(row)) return 0;
  return row.filter((c) => c.available).length;
}

const Sessions = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, openLoginModal } = useAuth();
  const [settings, setSettings] = useState(null);
  /** شبكة الفترات لكل YYYY-MM-DD — كل الخلايا مع available */
  const [slotGrid, setSlotGrid] = useState({});
  /** ترتيب ثابت لستة أيام الاختيار من الخادم */
  const [bookingDays, setBookingDays] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loadErr, setLoadErr] = useState("");
  const [modalSlot, setModalSlot] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formErr, setFormErr] = useState("");
  const [expandedChatId, setExpandedChatId] = useState(null);
  /** يوم محدد لعرض الساعات فقط (YYYY-MM-DD) */
  const [selectedDayKey, setSelectedDayKey] = useState(null);

  const [form, setForm] = useState({
    patientFullName: "",
    patientAgeYears: "",
    patientDateOfBirth: "",
    relationshipToPatient: "ولي الأمر",
    contactPhone: "",
    contactPhoneAlt: "",
    cityOrRegion: "",
    concernsSummary: "",
    priorDiagnosisSummary: "",
    additionalNotes: "",
  });

  const token = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

  const refreshPublic = async () => {
    try {
      const [st, sl] = await Promise.all([
        axios.get("/api/sessions/public/settings"),
        axios.get("/api/sessions/public/slots"),
      ]);
      setSettings(st.data.settings);
      setBookingDays(Array.isArray(sl.data.days) ? sl.data.days : []);
      setSlotGrid(sl.data.grid && typeof sl.data.grid === "object" ? sl.data.grid : {});
      setLoadErr("");
    } catch {
      setLoadErr("تعذر تحميل المواعيد");
    }
  };

  const refreshMine = async () => {
    if (!user || user.role !== "user") return;
    try {
      const res = await axios.get("/api/sessions/my-bookings", token());
      setMyBookings(res.data.bookings || []);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    refreshPublic();
  }, []);

  useEffect(() => {
    if (user?.role === "user") refreshMine();
  }, [user]);

  const selectedDayMeta = useMemo(
    () => bookingDays.find((d) => d.dateKey === selectedDayKey) || null,
    [bookingDays, selectedDayKey]
  );

  const selectedDayCells = useMemo(() => {
    if (!selectedDayKey || !slotGrid[selectedDayKey]) return [];
    return slotGrid[selectedDayKey];
  }, [selectedDayKey, slotGrid]);

  useEffect(() => {
    if (bookingDays.length === 0) {
      setSelectedDayKey(null);
      return;
    }
    if (bookingDays.length === 1) {
      setSelectedDayKey(bookingDays[0].dateKey);
      return;
    }
    setSelectedDayKey((prev) =>
      prev && bookingDays.some((d) => d.dateKey === prev) ? prev : null
    );
  }, [bookingDays]);

  const openBook = (slot) => {
    setFormErr("");
    setModalSlot(slot);
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    setFormErr("");
    setSubmitting(true);
    try {
      await axios.post(
        "/api/sessions/bookings",
        {
          startAt: modalSlot.startAt,
          patientFullName: form.patientFullName,
          patientAgeYears: form.patientAgeYears ? Number(form.patientAgeYears) : undefined,
          patientDateOfBirth: form.patientDateOfBirth || undefined,
          relationshipToPatient: form.relationshipToPatient,
          contactPhone: form.contactPhone,
          contactPhoneAlt: form.contactPhoneAlt || undefined,
          cityOrRegion: form.cityOrRegion || undefined,
          concernsSummary: form.concernsSummary,
          priorDiagnosisSummary: form.priorDiagnosisSummary || undefined,
          additionalNotes: form.additionalNotes || undefined,
        },
        token()
      );
      setModalSlot(null);
      await refreshPublic();
      await refreshMine();
      navigate("/dashboard");
    } catch (err) {
      setFormErr(err.response?.data?.message || "تعذر إتمام الحجز");
    } finally {
      setSubmitting(false);
    }
  };

  const cancelBooking = async (id) => {
    if (!confirm("تأكيد إلغاء الحجز؟")) return;
    try {
      await axios.post(`/api/sessions/bookings/${id}/cancel`, {}, token());
      await refreshPublic();
      await refreshMine();
    } catch (err) {
      alert(err.response?.data?.message || "تعذر الإلغاء");
    }
  };

  const chatAllowed = (status) => status === "pending" || status === "confirmed";

  return (
    <Layout className="sess-sessions-layout">
      <section className="section-block sess-sessions-hero">
        <div className="container-content">
          <motion.h1
            className="section-heading text-gradient"
            variants={titleVariants}
            initial="hidden"
            animate="visible"
          >
            جلسات استشارية — طيف التوحد
          </motion.h1>
          <p className="text-[var(--color-ink-light)] max-w-2xl mt-2 sess-sessions-lead">
            احجز موعداً مع أخصائي بعد تسجيل الدخول. نطلب بيانات المستفيد من الجلسة (مثل الطفل أو المراجع)
            لتحضير لقاء مفيد وآمن.
          </p>
        </div>
      </section>

      {authLoading ? (
        <div className="container-content sess-loading">جاري التحميل…</div>
      ) : !user ? (
        <section className="section-block pt-0">
          <div className="container-content max-w-lg">
            <motion.div className="sess-guest-card" variants={itemVariants} initial="hidden" animate="visible">
              <LogIn className="sess-guest-card__icon" size={40} />
              <h2 className="sess-guest-card__title">تسجيل الدخول مطلوب للحجز</h2>
              <p className="sess-guest-card__text">
                يمكنك استعراض الموقع العام، أما حجز الجلسة فيتطلب حساباً مفعّلاً لتسجيل بيانات المراجع
                والتواصل مع الأخصائي.
              </p>
              <div className="sess-guest-card__actions">
                <button type="button" className="sess-btn sess-btn--primary" onClick={openLoginModal}>
                  تسجيل الدخول
                </button>
                <Link to="/register" className="sess-btn sess-btn--ghost">
                  إنشاء حساب
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      ) : user.role !== "user" ? (
        <section className="section-block pt-0">
          <div className="container-content">
            <p className="sess-note">حجز الجلسات للمراجعين فقط. كأخصائي، استخدم لوحة التحكم لإدارة الطلبات.</p>
            <Link to="/admin/dashboard" className="sess-btn sess-btn--primary inline-block mt-2">
              لوحة الأخصائي
            </Link>
          </div>
        </section>
      ) : (
        <>
          {loadErr && (
            <div className="container-content">
              <p className="sess-alert sess-alert--error">{loadErr}</p>
            </div>
          )}

          <section className="section-block pt-0">
            <div className="container-content">
              <h2 className="sess-section-title">
                <User size={22} className="inline ml-2" />
                جلساتي
              </h2>
              {myBookings.length === 0 ? (
                <p className="sess-muted">لا توجد حجوزات بعد.</p>
              ) : (
                <ul className="sess-booking-list">
                  {myBookings.map((b) => (
                    <li key={b._id} className="sess-booking-card">
                      <div className="sess-booking-card__head">
                        <span className={`sess-pill sess-pill--${b.status}`}>{STATUS_AR[b.status] || b.status}</span>
                        <time className="sess-booking-card__time" dateTime={b.startAt}>
                          {new Date(b.startAt).toLocaleString("ar-EG", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </time>
                      </div>
                      <p className="sess-booking-card__patient">
                        المستفيد: <strong>{b.patientFullName}</strong>
                      </p>
                      {(b.status === "pending" || b.status === "confirmed") && (
                        <button type="button" className="sess-btn sess-btn--ghost sess-btn--sm" onClick={() => cancelBooking(b._id)}>
                          إلغاء الحجز
                        </button>
                      )}
                      {chatAllowed(b.status) && (
                        <div className="sess-chat-wrap">
                          <button
                            type="button"
                            className="sess-btn sess-btn--ghost sess-btn--sm"
                            onClick={() => setExpandedChatId(expandedChatId === b._id ? null : b._id)}
                          >
                            {expandedChatId === b._id ? "إخفاء المحادثة" : "محادثة مع الأخصائي"}
                          </button>
                          {expandedChatId === b._id && <SessionBookingChat bookingId={b._id} viewerIsSpecialist={false} />}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section className="section-block pt-0 pb-16">
            <div className="container-content sess-booking-block">
              <h2 className="sess-section-title">
                <Calendar size={22} className="inline ml-2" />
                المواعيد المتاحة
              </h2>
              <p className="sess-slots-policy">
                <strong>اختر اليوم:</strong> حتى <strong>ستة أيام</strong> لكل منها موعد متاح؛ تظهر فقط الأيام التي يحددها الأخصائي
                لجدول العمل، و<strong>الجمعة</strong> غير متاحة دائماً. اليوم الذي انتهت فيه كل الفترات القابلة للحجز{" "}
                <strong>يُستبدل</strong> بيوم لاحق ضمن نافذة الحجز.
                <strong> اختر الساعة:</strong> الفترات من بداية اليوم إلى نهايته حسب الإعداد؛ الرمادي غير متاح (ماضٍ أو محجوز).
              </p>
              {!settings?.active ? (
                <p className="sess-muted">لا توجد فترات حجز مفعّلة حالياً.</p>
              ) : bookingDays.length === 0 ? (
                <p className="sess-muted">لا توجد مواعيد متاحة في نافذة الحجز الحالية.</p>
              ) : (
                <div className="sess-pick-flow">
                  <div className="sess-pick-steps" aria-hidden="true">
                    <span className={`sess-pick-step ${selectedDayKey ? "is-done" : "is-active"}`}>
                      <span className="sess-pick-step__num">١</span>
                      اختر اليوم
                    </span>
                    <span className="sess-pick-step__line" />
                    <span className={`sess-pick-step ${selectedDayKey ? "is-active" : ""}`}>
                      <span className="sess-pick-step__num">٢</span>
                      اختر الساعة
                    </span>
                  </div>

                  <div className="sess-pick-panel">
                    <h3 className="sess-pick-panel__label">
                      <Calendar size={20} className="sess-pick-panel__icon" />
                      الخطوة ١ — اليوم
                    </h3>
                    <p className="sess-pick-hint">
                      الأيام المعروضة كلها فيها موعد يمكن حجزه؛ اضغط يوماً ثم فترة خضراء/متاحة.
                    </p>
                    <div className="sess-day-strip" role="listbox" aria-label="أيام الحجز">
                      {bookingDays.map(({ dateKey, anchor }) => {
                        const d = new Date(anchor);
                        const isSelected = selectedDayKey === dateKey;
                        const nAvail = countAvailableInGrid(slotGrid, dateKey);
                        const badge = nAvail > 0 ? `${nAvail} متاح` : "مكتمل";
                        return (
                          <button
                            key={dateKey}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            className={`sess-day-card ${isSelected ? "is-selected" : ""}`}
                            onClick={() => setSelectedDayKey(dateKey)}
                          >
                            <span className="sess-day-card__dow">
                              {d.toLocaleDateString("ar-EG", { weekday: "long" })}
                            </span>
                            <span className="sess-day-card__num">{d.getDate()}</span>
                            <span className="sess-day-card__mon">
                              {d.toLocaleDateString("ar-EG", { month: "short" })}
                            </span>
                            <span className="sess-day-card__badge">{badge}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="sess-pick-panel sess-pick-panel--times">
                    <h3 className="sess-pick-panel__label">
                      <Clock size={20} className="sess-pick-panel__icon" />
                      الخطوة ٢ — الساعة
                    </h3>
                    {!selectedDayMeta ? (
                      <p className="sess-pick-placeholder">
                        اختر يوماً من الأعلى لعرض كل فترات هذا اليوم (المتاحة والغير متاحة).
                      </p>
                    ) : (
                      <motion.div
                        key={selectedDayKey}
                        className="sess-time-board"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="sess-time-board__head">
                          <p className="sess-time-board__date">
                            {new Date(selectedDayMeta.anchor).toLocaleDateString("ar-EG", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                          {bookingDays.length > 1 && (
                            <button
                              type="button"
                              className="sess-time-board__change-day"
                              onClick={() => setSelectedDayKey(null)}
                            >
                              تغيير اليوم
                            </button>
                          )}
                        </div>
                        <p className="sess-time-grid-hint">
                          من {settings.dailyStartTime} إلى {settings.dailyEndTime} — اضغط فقط على الفترة المتاحة للحجز.
                        </p>
                        {selectedDayCells.length === 0 ? (
                          <p className="sess-muted sess-time-board__empty">لا فترات محددة لهذا اليوم ضمن الإعدادات.</p>
                        ) : (
                          <div className="sess-time-grid">
                            {selectedDayCells.map((cell) => {
                              const t = new Date(cell.startAt).toLocaleTimeString("ar-EG", {
                                hour: "2-digit",
                                minute: "2-digit",
                              });
                              return (
                                <button
                                  key={cell.startAt}
                                  type="button"
                                  disabled={!cell.available}
                                  className={`sess-time-slot ${cell.available ? "" : "sess-time-slot--disabled"}`}
                                  aria-label={cell.available ? `حجز ${t}` : `${t} غير متاح`}
                                  onClick={() => openBook({ startAt: cell.startAt, endAt: cell.endAt })}
                                >
                                  <span className="sess-time-slot__clock">{t}</span>
                                  <span className="sess-time-slot__meta">
                                    {cell.available
                                      ? `مدة ${settings.sessionDurationMinutes} دقيقة`
                                      : "غير متاح"}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {modalSlot && (
        <div className="sess-modal-overlay sess-modal-overlay--center" role="dialog" aria-modal="true">
          <div className="sess-modal sess-modal--booking">
            <h3 className="sess-modal__title">بيانات الجلسة المطلوبة</h3>
            <p className="sess-modal__sub">
              الموعد:{" "}
              {new Date(modalSlot.startAt).toLocaleString("ar-EG", {
                weekday: "long",
                day: "numeric",
                month: "long",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <form onSubmit={submitBooking} className="sess-form sess-form--booking">
              {formErr && <p className="sess-alert sess-alert--error sess-booking-form-error">{formErr}</p>}
              <label className="sess-label sess-label--full">
                اسم المستفيد من الجلسة (الطفل/الشخص) *
                <input
                  className="sess-input"
                  value={form.patientFullName}
                  onChange={(e) => setForm({ ...form, patientFullName: e.target.value })}
                  required
                />
              </label>
              <div className="sess-form-row">
                <label className="sess-label">
                  العمر (تقريبي)
                  <input
                    type="number"
                    min={0}
                    max={120}
                    className="sess-input"
                    value={form.patientAgeYears}
                    onChange={(e) => setForm({ ...form, patientAgeYears: e.target.value })}
                  />
                </label>
                <label className="sess-label">
                  تاريخ الميلاد (اختياري)
                  <input
                    type="date"
                    className="sess-input"
                    value={form.patientDateOfBirth}
                    onChange={(e) => setForm({ ...form, patientDateOfBirth: e.target.value })}
                    dir="ltr"
                  />
                </label>
              </div>
              <div className="sess-form-row">
                <label className="sess-label">
                  صلتك بالمستفيد *
                  <select
                    className="sess-input"
                    value={form.relationshipToPatient}
                    onChange={(e) => setForm({ ...form, relationshipToPatient: e.target.value })}
                  >
                    {RELATION_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="sess-label">
                  المدينة / المنطقة
                  <input
                    className="sess-input"
                    value={form.cityOrRegion}
                    onChange={(e) => setForm({ ...form, cityOrRegion: e.target.value })}
                  />
                </label>
              </div>
              <div className="sess-form-row">
                <label className="sess-label">
                  رقم هاتف للتواصل *
                  <input
                    className="sess-input"
                    dir="ltr"
                    value={form.contactPhone}
                    onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                    required
                  />
                </label>
                <label className="sess-label">
                  رقم هاتف بديل
                  <input
                    className="sess-input"
                    dir="ltr"
                    value={form.contactPhoneAlt}
                    onChange={(e) => setForm({ ...form, contactPhoneAlt: e.target.value })}
                  />
                </label>
              </div>
              <label className="sess-label sess-label--full">
                سبب طلب الجلسة والمخاوف الرئيسية *
                <textarea
                  className="sess-textarea sess-textarea--compact"
                  rows={2}
                  value={form.concernsSummary}
                  onChange={(e) => setForm({ ...form, concernsSummary: e.target.value })}
                  required
                />
              </label>
              <label className="sess-label sess-label--full">
                تشخيص أو تقييم سابق (إن وجد)
                <textarea
                  className="sess-textarea sess-textarea--compact"
                  rows={2}
                  value={form.priorDiagnosisSummary}
                  onChange={(e) => setForm({ ...form, priorDiagnosisSummary: e.target.value })}
                />
              </label>
              <label className="sess-label sess-label--full">
                ملاحظات إضافية للأخصائي
                <textarea
                  className="sess-textarea sess-textarea--compact"
                  rows={2}
                  value={form.additionalNotes}
                  onChange={(e) => setForm({ ...form, additionalNotes: e.target.value })}
                />
              </label>
              <div className="sess-modal__actions">
                <button type="button" className="sess-btn sess-btn--ghost" onClick={() => setModalSlot(null)}>
                  إلغاء
                </button>
                <button type="submit" className="sess-btn sess-btn--primary" disabled={submitting}>
                  {submitting ? "جاري الإرسال…" : "تأكيد الحجز"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Sessions;
