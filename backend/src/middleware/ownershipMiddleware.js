import bookRepository from "../repositories/bookRepository.js";
import ApiResponser from "../utils/apiResponser.js";

export const verifyBookOwnership = async (req, res, next) => {
    try {
        const { id } = req.params;
        const book = await bookRepository.getBookById(id);
        if (!book) return ApiResponser().errorResponse(res, "Book not found", 404);

        if (String(book.ownerId) !== String(req.user.id))
            return ApiResponser().errorResponse(res, "Forbidden", 403);

        req.book = book;
        next();
    } catch (err) {
        console.error(err);
        return ApiResponser().errorResponse(res);
    }
};
