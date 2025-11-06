import User from "../models/User.js";
import bcrypt from "bcryptjs";

const authRepository = {
    async findByEmail(email) {
        return User.findOne({ email });
    },

    async findById(id) {
        return User.findById(id);
    },

    async createUser(email, password) {
        const hashed = await bcrypt.hash(password, 10);
        return User.create({ email, password: hashed });
    },

    async saveRefreshToken(user, token) {
        user.refreshToken = token;
        return user.save();
    },

    async clearRefreshToken(user) {
        user.refreshToken = null;
        return user.save();
    },
};

export default authRepository;
