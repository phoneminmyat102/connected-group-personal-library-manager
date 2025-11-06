import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    refreshToken: { type: String, default: null }
}, { timestamps: true });

export default model("User", userSchema);
