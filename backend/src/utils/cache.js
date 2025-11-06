export const getBooksCacheKey = (userId, page = 1, limit = 100, sort = "createdAt") =>
    `books:${userId}:p${page}:l${limit}:s${sort}`;

export async function getCachedBooks(redisClient, key) {
    const data = await redisClient.get(key);
    if (!data) return null;
    try {
        return JSON.parse(data);
    } catch (e) {
        return null;
    }
}

export async function setCachedBooks(redisClient, key, payload, ttlSeconds = 60) {
    await redisClient.setEx(key, ttlSeconds, JSON.stringify(payload));
}

export async function invalidateBooksCache(redisClient, userId) {
    try {
        const pattern = `books:${userId}:*`;

        for await (const key of redisClient.scanIterator({ MATCH: pattern })) {
            await redisClient.del(key);
        }

        console.log(`Cache invalidated for user ${userId}`);
    } catch (err) {
        console.error("Error invalidating cache:", err);
    }
}

