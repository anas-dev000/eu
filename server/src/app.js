import "./config/env.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import authRouter from "./routes/auth.routes.js";
import apiRouter from "./routes/api.routes.js";
import sessionRouter from "./routes/session.routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api", apiRouter);

app.use("/assets", express.static(path.join(__dirname, "..", "public")));

export default app;
