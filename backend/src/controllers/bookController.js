import { validationResult } from "express-validator";
import ApiResponser from "../utils/apiResponser.js";
import bookRepository from "../repositories/bookRepository.js";

export const createBook = async (req, res) => {
    try {
        const { title, author, status, rating, review } = req.body;
        const ownerId = req.user.id;

        const book = await bookRepository.createBook({ title, author, status, rating, review, ownerId });

        return ApiResponser().successResponse(res, book, "Book created successfully");
    } catch (err) {
        console.error(err);
        return ApiResponser().errorResponse(res);
    }
};

export const listBooks = async (req, res) => {
    try {
        const ownerId = req.user.id;
        const { page, limit, sort, status } = req.query;

        const books = await bookRepository.getBooks({ ownerId, page, limit, sort, status });

        return ApiResponser().successResponse(res, books, "Books fetched successfully");
    } catch (err) {
        console.error(err);
        return ApiResponser().errorResponse(res);
    }
};

export const updateBook = async (req, res) => {
    try {
        const ownerId = req.user.id;
        const { id } = req.params;

        const book = await bookRepository.getBookById(id);
        if (!book) return ApiResponser().errorResponse(res, "Book not found", 404);
        if (String(book.ownerId) !== String(ownerId))
            return ApiResponser().errorResponse(res, "Forbidden", 403);

        const updates = {};
        ["title", "author", "status", "rating", "review"].forEach((k) => {
            if (k in req.body) updates[k] = req.body[k];
        });

        const updated = await bookRepository.updateBook(book, updates);
        return ApiResponser().successResponse(res, updated, "Book updated successfully");
    } catch (err) {
        console.error(err);
        return ApiResponser().errorResponse(res);
    }
};

export const deleteBook = async (req, res) => {
    try {
        const ownerId = req.user.id;
        const { id } = req.params;

        const book = await bookRepository.getBookById(id);
        if (!book) return ApiResponser().errorResponse(res, "Book not found", 404);
        if (String(book.ownerId) !== String(ownerId))
            return ApiResponser().errorResponse(res, "Forbidden", 403);

        await bookRepository.deleteBook(book);
        return ApiResponser().successResponse(res, null, "Book deleted successfully");
    } catch (err) {
        console.error(err);
        return ApiResponser().errorResponse(res);
    }
};

export const getSingleBook = async (req, res) => {
    try {
        const ownerId = req.user.id;
        const { id } = req.params;

        const book = await bookRepository.getBookById(id);
        if (!book) return ApiResponser().errorResponse(res, "Book not found", 404);
        if (String(book.ownerId) !== String(ownerId))
            return ApiResponser().errorResponse(res, "Forbidden", 403);
        return ApiResponser().successResponse(res, book, "Book");
    } catch (err) {
        console.error(err);
        return ApiResponser().errorResponse(res);
    }
};