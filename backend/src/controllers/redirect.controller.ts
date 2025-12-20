import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function redirectToOriginalUrl(
    req: Request, 
    res: Response) 
    {
        try {
            const { slug } = req.params;

            const url = await prisma.url.findUnique({
                where: { slug },
            });

            if(!url) {
                return res.status(404).json({ error: " Short URL not found" });
            }

            if (url.expiresAt && url.expiresAt < new Date()) {
                return res.status(410).json({ error: "URL has expired" });
            }

            return res.redirect(url.originalUrl);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
       }
    }