import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { redis } from "../lib/redis";
import { parseUserAgent } from "../utils/parseUserAgent";

export async function redirectToOriginalUrl(
  req: Request,
  res: Response
) {
  try {
    const { slug } = req.params;

    //to ensure we dont return before analytics is logged(after redis)
    let originalUrl: string | null = null;
    let urlId: string | null = null;

    // Check Redis cache FIRST (read optimization only)
    const cachedUrl = await redis.get(`slug:${slug}`);

    if (cachedUrl) {
      // updating originalUrl if found in redis
      originalUrl = cachedUrl;

      
      // We STILL need urlId for analytics
      // Redis does NOT store urlId
      const url = await prisma.url.findUnique({
        where: { slug },
        select: { id: true }, // minimal DB read
      });

      if (!url) {
        return res.status(404).json({ error: "Short URL not found" });
      }

      urlId = url.id;
    } else {
      //Redis MISS → full DB lookup
      const url = await prisma.url.findUnique({
        where: { slug },
      });

      if (!url) {
        return res.status(404).json({ error: "Short URL not found" });
      }

      if (url.expiresAt && url.expiresAt < new Date()) {
        return res.status(410).json({ error: "URL has expired" });
      }

      originalUrl = url.originalUrl;
      urlId = url.id;

      // CHANGE 3: Cache ONLY the redirect target
      // setting the new url never seen by redis
      await redis.set(`slug:${slug}`, originalUrl);
    }

    
    const userAgent = req.headers["user-agent"];
    const referrer = req.headers["referer"] || null;
    const { device, browser, os } = parseUserAgent(userAgent);

    
    prisma.click.create({
      data: {
        urlId: urlId!, 
        device,
        browser,
        os,
        referrer,
      },
    }).catch(console.error);

    // finally rediurecting to original url 
    return res.redirect(originalUrl);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
