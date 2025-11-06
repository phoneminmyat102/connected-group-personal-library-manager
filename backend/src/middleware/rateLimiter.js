import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
dotenv.config();

const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10);
const MAX = parseInt(process.env.RATE_LIMIT_MAX || "100", 10);

export const apiLimiter = rateLimit({
    windowMs: WINDOW_MS,
    max: MAX,
    message: { message: "Too many requests, please try again later." }
});
