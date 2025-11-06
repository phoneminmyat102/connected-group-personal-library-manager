import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
export const redisClient = createClient({
    url: redisUrl
});

redisClient.on("error", (err) => {
    console.error("Redis Client Error", err);
});

export async function connectRedis() {
    await redisClient.connect();
    console.log("Redis connected");
}
