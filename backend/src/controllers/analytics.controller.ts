import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function getUrlAnalytics(
    req: Request, 
    res: Response
) {
    try {
        const { slug } = req.params;

        const url = await prisma.url.findUnique({
            where: { slug },
        });

        if (!url) {
            return res.status(404).json({ error: "Short URL not found" });
        }

        const totalClicks = await prisma.click.count({
            where: { urlId: url.id },
        });

        return res.json({
            slug,
            totalClicks,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}