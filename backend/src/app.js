import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import bookRoutes from "./routes/books.js";
import dotenv from "dotenv";
import { apiLimiter } from "./middleware/rateLimiter.js";

dotenv.config();
const app = express();

app.use(helmet());
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api", apiLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

app.get("/", (req, res) => res.send("Personal Library API"));

export default app;
