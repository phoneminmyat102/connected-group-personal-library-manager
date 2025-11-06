import authRepository from "../repositories/authRepository.js";
import ApiResponser from "../utils/apiResponser.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
dotenv.config();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES_IN || "5m";
const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

function signAccessToken(user) {
    return jwt.sign({ email: user.email }, ACCESS_SECRET, {
        subject: String(user._id),
        expiresIn: ACCESS_EXPIRES,
    });
}

function signRefreshToken(user) {
    return jwt.sign({ email: user.email }, REFRESH_SECRET, {
        subject: String(user._id),
        expiresIn: REFRESH_EXPIRES,
    });
}

export const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return ApiResponser().errorResponse(res, "Email and password required", 400);

        const exists = await authRepository.findByEmail(email);
        if (exists)
            return ApiResponser().errorResponse(res, "Email already in use", 409);

        const user = await authRepository.createUser(email, password);
        const accessToken = signAccessToken(user);
        const refreshToken = signRefreshToken(user);
        await authRepository.saveRefreshToken(user, refreshToken);

        return ApiResponser().successResponse(res, { accessToken, refreshToken }, "Registered successfully");
    } catch (err) {
        console.error(err);
        return ApiResponser().errorResponse(res);
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return ApiResponser().errorResponse(res, "Email and password required", 400);

        const user = await authRepository.findByEmail(email);
        if (!user)
            return ApiResponser().errorResponse(res, "Invalid credentials", 401);

        const valid = await bcrypt.compare(password, user.password);
        if (!valid)
            return ApiResponser().errorResponse(res, "Invalid credentials", 401);

        const accessToken = signAccessToken(user);
        const refreshToken = signRefreshToken(user);
        await authRepository.saveRefreshToken(user, refreshToken);

        return ApiResponser().successResponse(res, { accessToken, refreshToken, user }, "Logged in successfully");
    } catch (err) {
        console.error(err);
        return ApiResponser().errorResponse(res);
    }
};

export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken)
            return ApiResponser().errorResponse(res, "Refresh token required", 400);

        jwt.verify(refreshToken, REFRESH_SECRET, async (err, payload) => {
            if (err)
                return ApiResponser().errorResponse(res, "Invalid refresh token", 401);

            const user = await authRepository.findById(payload.sub);
            if (!user || user.refreshToken !== refreshToken)
                return ApiResponser().errorResponse(res, "Refresh token invalidated", 401);

            const accessToken = signAccessToken(user);
            const newRefreshToken = signRefreshToken(user);
            await authRepository.saveRefreshToken(user, newRefreshToken);

            return ApiResponser().successResponse(
                res,
                { accessToken, refreshToken: newRefreshToken },
                "Token refreshed"
            );
        });
    } catch (err) {
        console.error(err);
        return ApiResponser().errorResponse(res);
    }
};

export const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken)
            return ApiResponser().errorResponse(res, "Refresh token required", 400);

        try {
            const payload = jwt.verify(refreshToken, REFRESH_SECRET);
            const user = await authRepository.findById(payload.sub);

            if (!user) {
                return ApiResponser().errorResponse(res, "User not found", 404);
            }

            if (user.refreshToken !== refreshToken) {
                return ApiResponser().errorResponse(res, "Invalid refresh token for user", 401);
            }

            await authRepository.clearRefreshToken(user);

            return ApiResponser().successResponse(res, null, "Logged out successfully");
        } catch (e) {
            console.error(e);
            return ApiResponser().errorResponse(res, "Invalid refresh token", 401);
        }
    } catch (err) {
        console.error(err);
        return ApiResponser().errorResponse(res);
    }
};

