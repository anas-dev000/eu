import bcrypt from "bcrypt";
import { User } from "../models/User.js";

/**
 * عند أول تشغيل: إن لم يوجد أي مستخدم بدور admin يُنشأ حساب افتراضي.
 * إن وُجد admin واحد على الأقل لا يُعاد الإنشاء.
 */
export async function ensureDefaultAdmin() {
  const adminCount = await User.countDocuments({ role: "admin" });
  if (adminCount > 0) return;

  const email = String(process.env.DEFAULT_ADMIN_EMAIL || "admin@localhost")
    .toLowerCase()
    .trim();
  const password = process.env.DEFAULT_ADMIN_PASSWORD || "admin123";

  if (!email) {
    console.warn("[auth] DEFAULT_ADMIN_EMAIL empty; skipping default admin");
    return;
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({
      email,
      passwordHash,
      role: "admin",
      isVerified: true,
    });
    console.log(
      `[auth] Default admin created (no admin existed): ${email} — change password after login; override with DEFAULT_ADMIN_EMAIL / DEFAULT_ADMIN_PASSWORD in .env`
    );
  } catch (e) {
    if (e?.code === 11000) {
      console.error(
        `[auth] Email ${email} is already registered without admin role. Create an admin in the DB or set DEFAULT_ADMIN_EMAIL to a free address.`
      );
      return;
    }
    throw e;
  }
}
