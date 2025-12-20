import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { generateSlug } from "../utils/generateSlug";

export async function createShortUrl(req: Request, res: Response) {
    try {
        const { url } = req.body;

        if (!url) {
         return res.status(400).json({ error: "URL is required" });
    }

    const slug = generateSlug();

        const shortUrl = await prisma.url.create({
            data: {
                originalUrl: url,
                slug: slug,
            },
        });

        return res.status(201).json({
        id: shortUrl.id,
        originalUrl: shortUrl.originalUrl,
        slug: shortUrl.slug,
        shortUrl: `http://localhost:4000/${shortUrl.slug}`,
        });
        }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}