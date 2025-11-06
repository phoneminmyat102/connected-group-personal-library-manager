import mongoose from "mongoose";
const { Schema, model } = mongoose;

const bookSchema = new Schema({
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    status: { type: String, enum: ["reading", "completed", "wishlist"], default: "wishlist" },
    rating: { type: Number, min: 1, max: 5, default: null },
    review: { type: String, default: null },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export default model("Book", bookSchema);
