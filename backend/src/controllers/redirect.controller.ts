import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { redis } from "../lib/redis";
import { parseUserAgent } from "../utils/parseUserAgent";

export async function redirectToOriginalUrl(req: Request, res: Response) {
  try {
    const { slug } = req.params;

    let originalUrl: string | null = null;
    let urlId: string | null = null;

    const cachedUrl = await redis.get(`slug:${slug}`);

    if (cachedUrl) {
      originalUrl = cachedUrl;

      const url = await prisma.url.findUnique({
        where: { slug },
        select: { id: true },
      });

      if (!url) {
        return res.status(404).json({ error: "Short URL not found" });
      }

      urlId = url.id;
    } else {
      const url = await prisma.url.findUnique({ where: { slug } });

      if (!url) {
        return res.status(404).json({ error: "Short URL not found" });
      }

      if (url.expiresAt && url.expiresAt < new Date()) {
        return res.status(410).json({ error: "URL has expired" });
      }

      originalUrl = url.originalUrl;
      urlId = url.id;

      await redis.set(`slug:${slug}`, originalUrl);
    }

    if (!originalUrl || !urlId) {
      return res.status(500).json({ error: "Invalid redirect state" });
    }

    const userAgent = req.headers["user-agent"];
    const referrer = req.headers["referer"] || null;
    const { device, browser, os } = parseUserAgent(userAgent);

    // MUST be awaited, no .catch()
    await prisma.click.create({
      data: {
        urlId,
        device,
        browser,
        os,
        referrer,
      },
    });

    // Disable all caching
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");

    return res.redirect(originalUrl);
  } catch (error) {
    console.error("Redirect error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
