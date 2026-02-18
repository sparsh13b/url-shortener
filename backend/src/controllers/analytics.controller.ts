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

        const [totalClicks, byDevice, byBrowser, byOs] = await Promise.all([
            prisma.click.count({
                where: { urlId: url.id },
            }),
            prisma.click.groupBy({
                by: ["device"],
                where: { urlId: url.id },
                _count: { device: true },
            }),
            prisma.click.groupBy({
                by: ["browser"],
                where: { urlId: url.id },
                _count: { browser: true },
            }),
            prisma.click.groupBy({
                by: ["os"],
                where: { urlId: url.id },
                _count: { os: true },
            }),
        ]);

        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");

        return res.json({
            slug,
            totalClicks,
            byDevice: byDevice.map((d) => ({ name: d.device || "Unknown", value: d._count.device })),
            byBrowser: byBrowser.map((b) => ({ name: b.browser || "Unknown", value: b._count.browser })),
            byOs: byOs.map((o) => ({ name: o.os || "Unknown", value: o._count.os })),
        });

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}