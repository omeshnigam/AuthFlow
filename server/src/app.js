import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const app = express();
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:9000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.json({
    name: "AuthFlow API",
    status: "running",
    health: "/api/health",
    auth: {
      signup: "POST /api/auth/signup",
      login: "POST /api/auth/login",
      refresh: "POST /api/auth/refresh",
      logout: "POST /api/auth/logout"
    },
    profile: {
      me: "GET /api/users/me",
      update: "PATCH /api/users/me"
    }
  });
});

app.use(
  "/api/auth",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
