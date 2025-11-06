import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import ApiResponser from "../utils/apiResponser.js";
import User from "../models/User.js";

dotenv.config();
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer "))
            return ApiResponser().errorResponse(res, "Unauthorized", 401);

        const token = authHeader.split(" ")[1];
        const payload = jwt.verify(token, ACCESS_SECRET);

        const user = await User.findById(payload.sub);
        if (!user) return ApiResponser().errorResponse(res, "Unauthorized", 401);

        req.user = { id: user._id, email: user.email };
        next();
    } catch (err) {
        console.error(err);
        return ApiResponser().errorResponse(res, "Unauthorized", 401);
    }
};
