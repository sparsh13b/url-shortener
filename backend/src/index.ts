import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import urlRoutes from "./routes/url.routes";
import analyticsRoutes from "./routes/analytics.routes";
import redirectRoutes from "./routes/redirect.routes";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server, curl, Postman
      if (!origin) return callback(null, true);

      // allow localhost
      if (origin === "http://localhost:5173") {
        return callback(null, true);
      }

      // allow ALL vercel deployments
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Preflight
app.options("*", cors());

app.use(express.json());

app.use("/api", urlRoutes);
app.use("/api", analyticsRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/", redirectRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
