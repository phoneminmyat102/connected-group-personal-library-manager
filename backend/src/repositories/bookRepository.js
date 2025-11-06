import Book from "../models/Book.js";
import { redisClient } from "../utils/redisClient.js";
import { getBooksCacheKey, getCachedBooks, setCachedBooks, invalidateBooksCache } from "../utils/cache.js";

const bookRepository = {
    async createBook(data) {
        const book = await Book.create(data);
        await invalidateBooksCache(redisClient, data.ownerId);
        return book;
    },

    async getBooks({ ownerId, page = 1, limit = 100, sort = "-createdAt", status }) {
        const cacheKey = getBooksCacheKey(ownerId, page, limit, sort + (status ? `:${status}` : ""));
        const cached = await getCachedBooks(redisClient, cacheKey);
        if (cached) return { source: "cache", ...cached };

        const query = { ownerId };
        if (status) query.status = status;

        const p = parseInt(page, 10);
        const l = Math.min(parseInt(limit, 10) || 100, 1000);

        const [data, total] = await Promise.all([
            Book.find(query).sort(sort).skip((p - 1) * l).limit(l).lean().exec(),
            Book.countDocuments(query),
        ]);

        const payload = { data, total, page: p, limit: l };
        await setCachedBooks(redisClient, cacheKey, payload, 60);

        return { source: "db", ...payload };
    },

    async getBookById(id) {
        return Book.findById(id);
    },

    async updateBook(book, updates) {
        Object.assign(book, updates);
        const updated = await book.save();
        await invalidateBooksCache(redisClient, book.ownerId);
        return updated;
    },

    async deleteBook(book) {
        await Book.deleteOne({ _id: book._id });
        await invalidateBooksCache(redisClient, book.ownerId);
    },
};

export default bookRepository;
