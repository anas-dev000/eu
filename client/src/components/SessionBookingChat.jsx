import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const SessionBookingChat = ({ bookingId, viewerIsSpecialist = false }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [blocked, setBlocked] = useState(false);
  const messagesRef = useRef(null);

  const load = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/sessions/bookings/${bookingId}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data.messages || []);
      setBlocked(false);
      setError("");
    } catch (err) {
      if (err.response?.status === 400) {
        setBlocked(true);
        setError(err.response?.data?.message || "");
      }
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, [bookingId]);

  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    setError("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `/api/sessions/bookings/${bookingId}/messages`,
        { body: t },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setText("");
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "تعذر إرسال الرسالة");
    }
  };

  if (blocked) {
    return (
      <p className="sess-chat-blocked" dir="rtl">
        {error || "المحادثة غير متاحة"}
      </p>
    );
  }

  return (
    <div className="sess-chat" dir="rtl">
      <div className="sess-chat__messages" ref={messagesRef}>
        {messages.length === 0 && <p className="sess-chat__empty">لا رسائل بعد — ابدأ التواصل</p>}
        {messages.map((m) => {
          const isFromSpecialist = m.senderUserId?.role === "admin";
          const senderLabel = isFromSpecialist
            ? "أخصائي"
            : viewerIsSpecialist
              ? "المراجع"
              : "أنت";
          return (
            <div
              key={m._id}
              className={`sess-chat__bubble ${isFromSpecialist ? "sess-chat__bubble--spec" : "sess-chat__bubble--user"}`}
              dir="auto"
            >
              <span className="sess-chat__meta">
                {senderLabel} · {new Date(m.createdAt).toLocaleString("ar-EG")}
              </span>
              <p className="sess-chat__body">{m.body}</p>
            </div>
          );
        })}
      </div>
      <form onSubmit={send} className="sess-chat__form">
        <input
          type="text"
          className="sess-chat__input"
          placeholder="اكتب رسالة..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={4000}
          dir="auto"
        />
        <button type="submit" className="sess-chat__send">
          إرسال
        </button>
      </form>
      {error && <p className="sess-chat__err">{error}</p>}
    </div>
  );
};

export default SessionBookingChat;
