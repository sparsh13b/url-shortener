import { Router } from "express";
import { createShortUrl } from "../controllers/url.controller";
import { rateLimiter } from "../middleware/rateLimiter";
const router = Router();

router.post("/shorten", rateLimiter, createShortUrl);
export default router;