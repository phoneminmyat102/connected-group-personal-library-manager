import app from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { connectRedis } from "./utils/redisClient.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function start() {
    try {
        await connectDB();
        await connectRedis();
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server listening on port ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to start server", err);
        process.exit(1);
    }
}
start();
