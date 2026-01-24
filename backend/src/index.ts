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
    origin: [
      "http://localhost:5173",
      "https://url-shortener-three-woad.vercel.app",
      "https://url-shortener-qh6dvi7ay-sparsh-birlas-projects.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Handle preflight
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
