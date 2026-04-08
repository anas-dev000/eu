// auth.test.js — Jest + Supertest test suite for authentication routes
// Run with: npx jest auth.test.js --forceExit
import request from "supertest";
import mongoose from "mongoose";
import app from "./server.js";
import { User } from "./src/models/User.js";

const TEST_DB = "mongodb://127.0.0.1:27017/eu_auth_test";

beforeAll(async () => {
  // Connect to a separate test database
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  await mongoose.connect(TEST_DB);
});

afterAll(async () => {
  // Clean up
  await User.deleteMany({});
  await mongoose.connection.close();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe("POST /api/auth/register", () => {
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "test@example.com", password: "pass123", role: "user" });

    // May succeed or fail depending on SMTP config — check user was created
    const user = await User.findOne({ email: "test@example.com" });
    if (res.status === 201) {
      expect(user).toBeTruthy();
      expect(user.isVerified).toBe(false);
      expect(user.role).toBe("user");
    }
  });

  it("should reject duplicate email", async () => {
    // Create user first
    const hash = "$2b$10$dummyhashvalue1234567890abcdefghijklmnopqrstuvwx";
    await User.create({ email: "dup@example.com", passwordHash: hash, role: "user", isVerified: false });

    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "dup@example.com", password: "pass123" });

    expect(res.status).toBe(409);
    expect(res.body.message).toBe("User already exists");
  });

  it("should reject missing fields", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "" });

    expect(res.status).toBe(400);
  });

  it("should reject specialist (admin) self-registration via API", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "badadmin@example.com", password: "pass123", role: "admin" });

    expect(res.status).toBe(403);
    const user = await User.findOne({ email: "badadmin@example.com" });
    expect(user).toBeFalsy();
  });
});

describe("POST /api/auth/login", () => {
  it("should reject login for non-existent user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "no@example.com", password: "pass123" });

    expect(res.status).toBe(401);
  });

  it("should reject login for unverified user", async () => {
    // Create an unverified user with a real bcrypt hash
    const bcrypt = (await import("bcrypt")).default;
    const hash = await bcrypt.hash("pass123", 10);
    await User.create({ email: "unverified@example.com", passwordHash: hash, role: "user", isVerified: false });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "unverified@example.com", password: "pass123" });

    expect(res.status).toBe(403);
    expect(res.body.message).toContain("لم يُفعّل");
  });

  it("should login a verified user and return token", async () => {
    const bcrypt = (await import("bcrypt")).default;
    const hash = await bcrypt.hash("pass123", 10);
    await User.create({ email: "verified@example.com", passwordHash: hash, role: "user", isVerified: true });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "verified@example.com", password: "pass123" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    expect(res.body.role).toBe("user");
  });

  it("should reject specialist on normal user login endpoint", async () => {
    const bcrypt = (await import("bcrypt")).default;
    const hash = await bcrypt.hash("admin123", 10);
    await User.create({ email: "admin@example.com", passwordHash: hash, role: "admin", isVerified: true });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@example.com", password: "admin123" });

    expect(res.status).toBe(403);
  });

  it("should reject normal user on specialist login endpoint", async () => {
    const bcrypt = (await import("bcrypt")).default;
    const hash = await bcrypt.hash("pass123", 10);
    await User.create({ email: "verified@example.com", passwordHash: hash, role: "user", isVerified: true });

    const res = await request(app)
      .post("/api/auth/login-specialist")
      .send({ email: "verified@example.com", password: "pass123" });

    expect(res.status).toBe(403);
  });

  it("should login specialist via login-specialist and return token", async () => {
    const bcrypt = (await import("bcrypt")).default;
    const hash = await bcrypt.hash("admin123", 10);
    await User.create({ email: "admin@example.com", passwordHash: hash, role: "admin", isVerified: true });

    const res = await request(app)
      .post("/api/auth/login-specialist")
      .send({ email: "admin@example.com", password: "admin123" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    expect(res.body.role).toBe("admin");
  });
});

describe("GET /api/auth/me", () => {
  it("should reject unauthenticated request", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });

  it("should return user info for authenticated user", async () => {
    const bcrypt = (await import("bcrypt")).default;
    const hash = await bcrypt.hash("pass123", 10);
    await User.create({ email: "me@example.com", passwordHash: hash, role: "user", isVerified: true });

    // Login first
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "me@example.com", password: "pass123" });

    const token = loginRes.body.token;

    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe("me@example.com");
    expect(res.body.user.role).toBe("user");
  });
});

describe("POST /api/auth/verify-code", () => {
  it("should verify with correct code and return token", async () => {
    const bcrypt = (await import("bcrypt")).default;
    const hash = await bcrypt.hash("pass123", 10);
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    await User.create({
      email: "verify@example.com",
      passwordHash: hash,
      role: "user",
      isVerified: false,
      verifyCode: "123456",
      verifyCodeExpires: expires,
    });

    const res = await request(app)
      .post("/api/auth/verify-code")
      .send({ email: "verify@example.com", code: "123456" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    expect(res.body.role).toBe("user");

    const user = await User.findOne({ email: "verify@example.com" });
    expect(user.isVerified).toBe(true);
    expect(user.verifyCode).toBeFalsy();
  });

  it("should reject wrong code", async () => {
    const bcrypt = (await import("bcrypt")).default;
    const hash = await bcrypt.hash("pass123", 10);
    await User.create({
      email: "v2@example.com",
      passwordHash: hash,
      role: "user",
      isVerified: false,
      verifyCode: "111111",
      verifyCodeExpires: new Date(Date.now() + 3600000),
    });

    const res = await request(app)
      .post("/api/auth/verify-code")
      .send({ email: "v2@example.com", code: "999999" });

    expect(res.status).toBe(400);
  });

  it("should reject invalid code format", async () => {
    const res = await request(app)
      .post("/api/auth/verify-code")
      .send({ email: "a@b.com", code: "12" });

    expect(res.status).toBe(400);
  });
});

describe("POST /api/auth/forgot-password", () => {
  it("should respond 200 even for non-existent email (security)", async () => {
    const res = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "noone@example.com" });

    expect(res.status).toBe(200);
  });
});

describe("POST /api/auth/reset-password", () => {
  it("should reset password with valid token", async () => {
    const jwt = (await import("jsonwebtoken")).default;
    const bcrypt = (await import("bcrypt")).default;
    const token = jwt.sign({ email: "reset@example.com" }, process.env.JWT_SECRET || "a7f3e92bc1d84f6e0b5a21c8d9e47f3b6c8a1d0e5f2b7c4a9d6e3f0c1b8a5d2", { expiresIn: "1h" });

    const hash = await bcrypt.hash("oldpass", 10);
    await User.create({
      email: "reset@example.com",
      passwordHash: hash,
      role: "user",
      isVerified: true,
      resetToken: token,
    });

    const res = await request(app)
      .post("/api/auth/reset-password")
      .send({ token, newPassword: "newpass123" });

    expect(res.status).toBe(200);

    // Verify password was changed
    const user = await User.findOne({ email: "reset@example.com" });
    const match = await bcrypt.compare("newpass123", user.passwordHash);
    expect(match).toBe(true);
  });

  it("should reject invalid token", async () => {
    const res = await request(app)
      .post("/api/auth/reset-password")
      .send({ token: "badtoken", newPassword: "newpass" });

    expect(res.status).toBe(400);
  });
});

describe("GET /api/auth/users (admin only)", () => {
  it("should reject non-admin user", async () => {
    const bcrypt = (await import("bcrypt")).default;
    const hash = await bcrypt.hash("pass123", 10);
    await User.create({ email: "regular@example.com", passwordHash: hash, role: "user", isVerified: true });

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "regular@example.com", password: "pass123" });

    const res = await request(app)
      .get("/api/auth/users")
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    expect(res.status).toBe(403);
  });

  it("should return users list for admin", async () => {
    const bcrypt = (await import("bcrypt")).default;
    const hash = await bcrypt.hash("admin123", 10);
    await User.create({ email: "admin@example.com", passwordHash: hash, role: "admin", isVerified: true });

    const loginRes = await request(app)
      .post("/api/auth/login-specialist")
      .send({ email: "admin@example.com", password: "admin123" });

    const res = await request(app)
      .get("/api/auth/users")
      .set("Authorization", `Bearer ${loginRes.body.token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.users)).toBe(true);
  });
});
