import express from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createMailTransporter, sendMailSafe, getMailFromAddress } from "../services/email.service.js";

const router = express.Router();
const transporter = createMailTransporter();

function generateVerifyCode() {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
}

router.post("/register", async (req, res) => {
  const { email: rawEmail, password, role } = req.body;
  if (!rawEmail || !password) return res.status(400).json({ message: "Missing fields" });
  const email = String(rawEmail).toLowerCase().trim();
  if (role && role !== "user") {
    return res.status(403).json({
      message:
        "يمكن التسجيل كمستخدم عادي فقط. حسابات الأخصائيين تُنشأ من قاعدة البيانات فقط.",
    });
  }
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: "User already exists" });
  const passwordHash = await bcrypt.hash(password, 10);
  const verifyCode = generateVerifyCode();
  const verifyCodeExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const user = new User({
    email,
    passwordHash,
    role: "user",
    isVerified: false,
    verifyToken: undefined,
    verifyCode,
    verifyCodeExpires,
  });
  await user.save();
  const emailSent = await sendMailSafe(transporter, {
    from: getMailFromAddress(),
    to: email,
    subject: "رمز تفعيل حسابك",
    html: `<p>مرحباً،</p><p>رمز التفعيل الخاص بك (صالح لمدة 24 ساعة):</p><p style="font-size:1.5rem;letter-spacing:0.25em;font-weight:bold">${verifyCode}</p><p>أدخل الرمز في صفحة «تفعيل الحساب» على الموقع.</p>`,
  });
  if (!emailSent) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[email] Dev — verification code for ${email}: ${verifyCode}`);
    }
    return res.status(201).json({
      message:
        "تم إنشاء الحساب، لكن تعذر إرسال البريد. تحقق من SMTP أو انظر رمز التفعيل في سجل الخادم (وضع التطوير).",
      emailSent: false,
    });
  }
  res.status(201).json({
    message: "تم التسجيل بنجاح! أدخل رمز التفعيل المرسل إلى بريدك في الصفحة التالية.",
    emailSent: true,
  });
});

router.post("/verify-code", async (req, res) => {
  const { email: rawEmail, code } = req.body;
  if (!rawEmail || code === undefined || code === null) {
    return res.status(400).json({ message: "أدخل البريد ورمز التفعيل" });
  }
  const email = String(rawEmail).toLowerCase().trim();
  const codeStr = String(code).replace(/\s/g, "");
  if (!/^\d{6}$/.test(codeStr)) {
    return res.status(400).json({ message: "الرمز يجب أن يكون 6 أرقام" });
  }
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "البريد أو الرمز غير صحيح" });
  if (user.role !== "user") {
    return res.status(403).json({ message: "استخدم صفحة تسجيل دخول الأخصائيين" });
  }
  if (user.isVerified) {
    return res.status(400).json({ message: "هذا الحساب مفعّل مسبقاً — سجّل الدخول من هنا" });
  }
  if (!user.verifyCode || user.verifyCode !== codeStr) {
    return res.status(400).json({ message: "الرمز غير صحيح" });
  }
  if (!user.verifyCodeExpires || user.verifyCodeExpires < new Date()) {
    return res.status(400).json({ message: "انتهت صلاحية الرمز — سجّل حساباً جديداً أو تواصل مع الدعم" });
  }
  user.isVerified = true;
  user.verifyCode = undefined;
  user.verifyCodeExpires = undefined;
  user.verifyToken = undefined;
  await user.save();
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({
    message: "تم تفعيل الحساب",
    token,
    role: user.role,
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  if (user.role !== "user") {
    return res.status(403).json({
      message: "يُرجى تسجيل الدخول من صفحة تسجيل دخول الأخصائيين.",
    });
  }
  if (!user.isVerified) {
    return res.status(403).json({
      message: "لم يُفعّل الحساب بعد — أدخل رمز التفعيل من صفحة «تفعيل الحساب»",
    });
  }
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ message: "Logged in", token, role: user.role });
});

router.post("/login-specialist", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  if (user.role !== "admin") {
    return res.status(403).json({
      message: "هذا الحساب ليس حساب أخصائي. استخدم صفحة تسجيل دخول المستخدمين.",
    });
  }
  if (!user.isVerified) return res.status(403).json({ message: "Email not verified" });
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ message: "Logged in", token, role: user.role });
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash -verifyToken -resetToken -verifyCode");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user: { id: user._id, email: user.email, role: user.role } });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/logout", (req, res) => {
  res.json({ message: "Logged out" });
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(200).json({ message: "If the email exists, a reset link is sent" });
  const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
  user.resetToken = resetToken;
  await user.save();
  const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  const emailSent = await sendMailSafe(transporter, {
    from: getMailFromAddress(),
    to: email,
    subject: "إعادة تعيين كلمة المرور",
    html: `<p>اضغط لإعادة التعيين:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
  });
  if (!emailSent && process.env.NODE_ENV !== "production") {
    console.info("[email] Dev — reset link:", resetLink);
  }
  res.json({ message: "If the email exists, a reset link is sent" });
});

router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: payload.email, resetToken: token });
    if (!user) return res.status(400).json({ message: "Invalid token" });
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    await user.save();
    res.json({ message: "Password reset successful" });
  } catch (e) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

router.get("/users", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  try {
    const users = await User.find()
      .select("-passwordHash -verifyToken -resetToken -verifyCode")
      .sort({ createdAt: -1 });
    res.json({ users });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
