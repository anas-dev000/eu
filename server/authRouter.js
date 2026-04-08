// server/authRouter.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { User } from "./userModel.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Helper to send email (using nodemailer, Ethereal if no real SMTP)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Register
router.post("/register", async (req, res) => {
  const { email, password, role = "user" } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Missing fields" });
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: "User already exists" });
  const passwordHash = await bcrypt.hash(password, 10);
  const verifyToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });
  const user = new User({ email, passwordHash, role, isVerified: false, verifyToken });
  await user.save();
  const verifyLink = `${process.env.CLIENT_URL}/verify-email/${verifyToken}`;
  await transporter.sendMail({
    from: "no-reply@example.com",
    to: email,
    subject: "Verify your email",
    html: `<p>Click <a href="${verifyLink}">here</a> to verify your account.</p>`,
  });
  res.status(201).json({ message: "Registered. Check email for verification." });
});

// Email verification
router.get("/verify-email/:token", async (req, res) => {
  const { token } = req.params;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: payload.email, verifyToken: token });
    if (!user) return res.status(400).json({ message: "Invalid token" });
    user.isVerified = true;
    user.verifyToken = undefined;
    await user.save();
    res.json({ message: "Email verified" });
  } catch (e) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

// Auth middleware — verifies JWT from Authorization header
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Login — returns token in response body
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  if (!user.isVerified) return res.status(403).json({ message: "Email not verified" });
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ message: "Logged in", token, role: user.role });
});

// Get current user info
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash -verifyToken -resetToken");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user: { id: user._id, email: user.email, role: user.role } });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

// Logout (client-side token removal, but we provide endpoint for consistency)
router.post("/logout", (req, res) => {
  res.json({ message: "Logged out" });
});

// Forgot password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(200).json({ message: "If the email exists, a reset link is sent" });
  const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
  user.resetToken = resetToken;
  await user.save();
  const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  await transporter.sendMail({
    from: "no-reply@example.com",
    to: email,
    subject: "Password reset",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });
  res.json({ message: "If the email exists, a reset link is sent" });
});

// Reset password
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

// Admin: list all users
router.get("/users", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  try {
    const users = await User.find()
      .select("-passwordHash -verifyToken -resetToken")
      .sort({ createdAt: -1 });
    res.json({ users });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
