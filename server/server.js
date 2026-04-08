import mongoose from "mongoose";
import app from "./src/app.js";

// Default 5050: port 5000 is often reserved on Windows (Hyper-V / WinNAT).
const PORT = Number(process.env.PORT) || 5050;
const HOST = process.env.HOST || "127.0.0.1";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/eu_auth";

async function start() {
  if (process.env.NODE_ENV === "test") {
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log("MongoDB connected");
    try {
      const { ensureDefaultAdmin } = await import("./src/services/ensureDefaultAdmin.js");
      await ensureDefaultAdmin();
    } catch (authSeedErr) {
      console.error("[auth] Default admin seed error:", authSeedErr.message);
    }
    try {
      const { ensureSessionSettingsSeed, repairWorkDaysFromLegacyAdminDefault } = await import(
        "./src/services/sessionSeed.js"
      );
      await ensureSessionSettingsSeed();
      await repairWorkDaysFromLegacyAdminDefault();
    } catch (seedErr) {
      console.error("[sessions] Seed error:", seedErr.message);
    }
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    console.error(`
Fix: start MongoDB on 127.0.0.1:27017, or set MONGODB_URI in server/.env (e.g. Atlas).
  • Windows: install/start "MongoDB Community Server", or:
  • Docker: docker run -d -p 27017:27017 --name mongo mongo:latest
`);
    process.exit(1);
  }

  const server = app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
  });
  server.on("error", (err) => {
    if (err.code === "EACCES") {
      console.error(
        `Cannot listen on ${HOST}:${PORT} (permission denied). On Windows, avoid port 5000 or pick another PORT in .env.`
      );
    } else if (err.code === "EADDRINUSE") {
      console.error(`Port ${PORT} is already in use. Set a different PORT in .env.`);
    }
    throw err;
  });
}

start();

export default app;
