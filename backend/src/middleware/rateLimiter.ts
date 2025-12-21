import { Request, Response, NextFunction } from "express";
import { redis } from "../lib/redis";

const MAX_REQUESTS = 5;
const WINDOW_SECONDS = 60;

export async function rateLimiter(
  req: Request,
  res: Response,
  next: NextFunction
){
    try{
        const ip= req.ip;
        const key = `rate:shorten:${ip}`;

        const current = await redis.incr(key);

        if(current === 1){
            await redis.expire(key, WINDOW_SECONDS);
        }

        if(current > MAX_REQUESTS){
            return res.status(429).json({error: "Too many requests. Please try again later."});
        }

        next();
    }
    catch (error) {
        console.error("Rate limiter error:", error);
        next();
    }
}
