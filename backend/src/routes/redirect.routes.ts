import { Router } from "express";
import { redirectToOriginalUrl } from "../controllers/redirect.controller";

const router = Router();


router.get("/:slug", redirectToOriginalUrl);

export default router;
