import nodemailer from "nodemailer";

/** ظهور "من" في البريد — لـ Gmail يفضّل أن يطابق SMTP_USER */
export function getMailFromAddress() {
  const from = (process.env.SMTP_FROM || process.env.SMTP_USER || "").trim();
  return from || "no-reply@localhost";
}

export function createMailTransporter() {
  const host = (process.env.SMTP_HOST || "smtp.ethereal.email").trim();
  const port = Number(process.env.SMTP_PORT) || 587;
  const pass = (process.env.SMTP_PASS || "").replace(/\s/g, "");

  const options = {
    host,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER?.trim(),
      pass,
    },
    connectionTimeout: 25_000,
    greetingTimeout: 25_000,
    socketTimeout: 25_000,
  };

  if (host.includes("gmail.com")) {
    options.requireTLS = true;
  }

  return nodemailer.createTransport(options);
}

/**
 * Sends mail without crashing the process. SMTP/network failures are common in dev
 * (firewall, blocked 587, missing credentials).
 */
export async function sendMailSafe(transporter, mailOptions) {
  if (process.env.SMTP_DISABLED === "true" || process.env.SKIP_EMAIL === "true") {
    console.warn("[email] Skipped (set SMTP_DISABLED or SKIP_EMAIL in .env)");
    return false;
  }
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.warn("[email] Send failed:", err.message);
    return false;
  }
}
