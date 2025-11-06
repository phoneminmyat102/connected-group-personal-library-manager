import { body, param, query, validationResult } from "express-validator";
import ApiResponser from "../utils/apiResponser.js";

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return ApiResponser().errorResponse(res, "Validation errors", 400, errors.array());
    }
    next();
};

export const createBookValidation = [
    body("title").isString().notEmpty().withMessage("Title is required"),
    body("author").isString().notEmpty().withMessage("Author is required"),
    body("status")
        .optional()
        .isIn(["reading", "completed", "wishlist"])
        .withMessage("Status must be reading, completed, or wishlist"),
    body("rating").optional(),
    body("review").optional().isString().withMessage("Review must be a string"),
    validate
];

export const updateBookValidation = [
    param("id").isMongoId().withMessage("Invalid book ID"),
    body("title").isString().notEmpty().withMessage("Title is required"),
    body("author").isString().notEmpty().withMessage("Author is required"),
    body("status")
        .optional()
        .isIn(["reading", "completed", "wishlist"])
        .withMessage("Status must be reading, completed, or wishlist"),
    body("rating").optional(),
    body("review").optional().isString().withMessage("Review must be a string"),
    validate
];

export const deleteBookValidation = [
    param("id").isMongoId().withMessage("Invalid book ID"),
    validate
];

export const getSingleBookValidation = [
    param("id").isMongoId().withMessage("Invalid book ID"),
    validate
];

export const listBooksValidation = [
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    query("limit").optional().isInt({ min: 1 }).withMessage("Limit must be a positive integer"),
    query("status")
        .optional()
        .isIn(["reading", "completed", "wishlist"])
        .withMessage("Invalid status filter"),
    query("sort").optional().isString(),
    validate
];
