import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SessionBookingChat from "../components/SessionBookingChat";
import { Settings2, Inbox, Users } from "lucide-react";

const DAY_OPTS = [
  { v: 0, l: "الأحد" },
  { v: 1, l: "الإثنين" },
  { v: 2, l: "الثلاثاء" },
  { v: 3, l: "الأربعاء" },
  { v: 4, l: "الخميس" },
  { v: 6, l: "السبت" },
];

const STATUS_AR = {
  pending: "معلّق",
  confirmed: "مؤكد",
  rejected: "مرفوض",
  cancelled_by_user: "ألغاه المستخدم",
  cancelled_by_specialist: "ألغيتَه أنت",
};

const tokenCfg = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

/** عرض تاريخ القاعدة في حقل date حسب التقويم المحلي للمتصفح (بدون إزاحة UTC). */
function toDateInputValue(value) {
  if (!value) return "";
  const x = new Date(value);
  if (Number.isNaN(x.getTime())) return "";
  const y = x.getFullYear();
  const mo = String(x.getMonth() + 1).padStart(2, "0");
  const day = String(x.getDate()).padStart(2, "0");
  return `${y}-${mo}-${day}`;
}

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("bookings");

  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const [form, setForm] = useState({
    active: true,
    windowStartDate: "",
    windowEndDate: "",
    dailyStartTime: "09:00",
    dailyEndTime: "17:00",
    sessionDurationMinutes: 45,
    workDays: [0, 1, 2, 3, 4, 6],
  });

  const handleLogout = () => {
    logout();
    navigate("/specialist/login");
  };

  const loadBookings = async () => {
    const res = await axios.get("/api/sessions/admin/bookings", tokenCfg());
    setBookings(res.data.bookings || []);
  };

  const loadSettings = async () => {
    const res = await axios.get("/api/sessions/admin/settings", tokenCfg());
    const s = res.data.settings;
    if (s) {
      setForm({
        active: s.active !== false,
        windowStartDate: toDateInputValue(s.windowStartDate),
        windowEndDate: toDateInputValue(s.windowEndDate),
        dailyStartTime: s.dailyStartTime || "09:00",
        dailyEndTime: s.dailyEndTime || "17:00",
        sessionDurationMinutes: s.sessionDurationMinutes || 45,
        workDays: (s.workDays?.length ? s.workDays : [0, 1, 2, 3, 4, 6]).filter((d) => d !== 5),
      });
    }
  };

  const loadUsers = async () => {
    try {
      const res = await axios.get("/api/auth/users", tokenCfg());
      setUsers(res.data.users || []);
    } catch {
      setUsers([]);
    }
  };

  useEffect(() => {
    loadBookings().catch(() => {});
    loadSettings().catch(() => {});
    loadUsers();
  }, []);

  const saveSettings = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/api/sessions/admin/settings", { ...form }, tokenCfg());
      await loadSettings();
      alert("تم حفظ إعدادات الجدولة");
    } catch (err) {
      alert(err.response?.data?.message || "تعذر حفظ الإعدادات");
    }
  };

  const patchBooking = async (id, payload) => {
    await axios.patch(`/api/sessions/admin/bookings/${id}`, payload, tokenCfg());
    await loadBookings();
  };

  const toggleDay = (v) => {
    setForm((f) => ({
      ...f,
      workDays: f.workDays.includes(v) ? f.workDays.filter((x) => x !== v) : [...f.workDays, v].sort((a, b) => a - b),
    }));
  };

  return (
    <div className="page-shell sess-admin-shell">
      <Navbar />
      <main className="page-main">
        <header className="sess-admin-header">
          <div>
            <h1 className="sess-admin-header__title">لوحة الأخصائي — الجلسات</h1>
            <p className="sess-admin-header__email" dir="ltr">
              {user?.email}
            </p>
          </div>
          <div className="sess-admin-header__actions">
          </div>
        </header>

        <nav className="sess-admin-tabs" aria-label="أقسام اللوحة">
          <button
            type="button"
            className={`sess-admin-tab ${tab === "bookings" ? "is-active" : ""}`}
            onClick={() => setTab("bookings")}
          >
            <Inbox size={18} />
            طلبات الجلسات
          </button>
          <button
            type="button"
            className={`sess-admin-tab ${tab === "settings" ? "is-active" : ""}`}
            onClick={() => setTab("settings")}
          >
            <Settings2 size={18} />
            جدولة الحجز
          </button>
          <button
            type="button"
            className={`sess-admin-tab ${tab === "users" ? "is-active" : ""}`}
            onClick={() => setTab("users")}
          >
            <Users size={18} />
            المستخدمون
          </button>
        </nav>

        {tab === "bookings" && (
          <section className="sess-admin-panel">
            <p className="sess-admin-hint">
              راجع الطلبات، ووافق على الموعد أو ارفضه. بعد الطلب يمكنك فتح محادثة مع المراجع — الرسائل تُحفظ.
            </p>
            {bookings.length === 0 ? (
              <p className="sess-muted">لا توجد طلبات.</p>
            ) : (
              <ul className="sess-admin-bookings">
                {bookings.map((b) => (
                  <li key={b._id} className="sess-admin-booking">
                    <div className="sess-admin-booking__row">
                      <div>
                        <span className={`sess-pill sess-pill--${b.status}`}>{STATUS_AR[b.status]}</span>
                        <time className="sess-admin-booking__time" dateTime={b.startAt}>
                          {new Date(b.startAt).toLocaleString("ar-EG")}
                        </time>
                        <p className="sess-admin-booking__meta" dir="ltr">
                          المراجع: {b.bookerUserId?.email}
                        </p>
                        <p>
                          المستفيد: <strong>{b.patientFullName}</strong> — {b.relationshipToPatient} — {b.contactPhone}
                        </p>
                        <p className="sess-admin-booking__concerns">{b.concernsSummary}</p>
                      </div>
                      <div className="sess-admin-booking__actions">
                        {b.status === "pending" && (
                          <>
                            <button
                              type="button"
                              className="sess-btn sess-btn--primary sess-btn--sm"
                              onClick={() => patchBooking(b._id, { status: "confirmed" })}
                            >
                              قبول الموعد
                            </button>
                            <button
                              type="button"
                              className="sess-btn sess-btn--ghost sess-btn--sm"
                              onClick={() => patchBooking(b._id, { status: "rejected" })}
                            >
                              رفض
                            </button>
                          </>
                        )}
                        {b.status === "confirmed" && (
                          <button
                            type="button"
                            className="sess-btn sess-btn--ghost sess-btn--sm"
                            onClick={() => patchBooking(b._id, { status: "cancelled_by_specialist" })}
                          >
                            إلغاء الجلسة
                          </button>
                        )}
                        {(b.status === "pending" || b.status === "confirmed") && (
                          <button
                            type="button"
                            className="sess-btn sess-btn--ghost sess-btn--sm"
                            onClick={() => setExpandedId(expandedId === b._id ? null : b._id)}
                          >
                            {expandedId === b._id ? "إغلاق المحادثة" : "المحادثة"}
                          </button>
                        )}
                      </div>
                    </div>
                    {expandedId === b._id && (b.status === "pending" || b.status === "confirmed") && (
                      <SessionBookingChat bookingId={b._id} viewerIsSpecialist />
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {tab === "settings" && (
          <section className="sess-admin-panel">
            <form onSubmit={saveSettings} className="sess-settings-form">
              <label className="sess-label sess-label--inline">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                />
                تفعيل الحجز للمراجعين
              </label>
              <div className="sess-form-row">
                <label className="sess-label">
                  أول يوم في نافذة الحجز
                  <input
                    type="date"
                    className="sess-input"
                    dir="ltr"
                    required
                    value={form.windowStartDate}
                    onChange={(e) => setForm({ ...form, windowStartDate: e.target.value })}
                  />
                </label>
                <label className="sess-label">
                  آخر يوم
                  <input
                    type="date"
                    className="sess-input"
                    dir="ltr"
                    required
                    value={form.windowEndDate}
                    onChange={(e) => setForm({ ...form, windowEndDate: e.target.value })}
                  />
                </label>
              </div>
              <div className="sess-form-row">
                <label className="sess-label">
                  بداية اليوم (كل يوم عمل)
                  <input
                    type="time"
                    className="sess-input"
                    dir="ltr"
                    value={form.dailyStartTime}
                    onChange={(e) => setForm({ ...form, dailyStartTime: e.target.value })}
                  />
                </label>
                <label className="sess-label">
                  نهاية نطاق الجلسات
                  <input
                    type="time"
                    className="sess-input"
                    dir="ltr"
                    value={form.dailyEndTime}
                    onChange={(e) => setForm({ ...form, dailyEndTime: e.target.value })}
                  />
                </label>
              </div>
              <label className="sess-label">
                مدة الجلسة (دقائق)
                <input
                  type="number"
                  min={15}
                  max={180}
                  step={5}
                  className="sess-input"
                  style={{ maxWidth: "8rem" }}
                  value={form.sessionDurationMinutes}
                  onChange={(e) => setForm({ ...form, sessionDurationMinutes: Number(e.target.value) })}
                />
              </label>
              <fieldset className="sess-fieldset">
                <legend>أيام العمل ضمن النافذة</legend>
                <div className="sess-day-toggles">
                  {DAY_OPTS.map((d) => (
                    <label key={d.v} className="sess-day-toggle">
                      <input
                        type="checkbox"
                        checked={form.workDays.includes(d.v)}
                        onChange={() => toggleDay(d.v)}
                      />
                      {d.l}
                    </label>
                  ))}
                </div>
              </fieldset>
              <p className="sess-admin-hint">
                جدول غير متداخل. نافذة التواريخ وبداية/نهاية اليوم ومدة الجلسة تتحكم في المواعيد المعروضة.
                أيام العمل المحددة أعلاه هي التي يُقبل فيها الحجز (الجمعة دائماً غير متاحة). للمراجع: حتى ستة أيام فيها
                موعد متاح؛ الأيام بلا موعد متاح تُستبدل بأيام لاحقة ضمن النافذة.
              </p>
              <button type="submit" className="sess-btn sess-btn--primary">
                حفظ الإعدادات
              </button>
            </form>
          </section>
        )}

        {tab === "users" && (
          <section className="sess-admin-panel">
            <p className="sess-muted">{users.length} مستخدم مسجّل</p>
            <div className="sess-users-table-wrap">
              <table className="sess-users-table">
                <thead>
                  <tr>
                    <th>البريد</th>
                    <th>الدور</th>
                    <th>مفعّل</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td dir="ltr">{u.email}</td>
                      <td>{u.role === "admin" ? "أخصائي" : "مستخدم"}</td>
                      <td>{u.isVerified ? "نعم" : "لا"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
