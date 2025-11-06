import express from "express";
import {
    createBook,
    listBooks,
    updateBook,
    deleteBook,
    getSingleBook,
} from "../controllers/bookController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import {
    createBookValidation,
    updateBookValidation,
    deleteBookValidation,
    listBooksValidation,
    getSingleBookValidation
} from "../validators/bookValidator.js";
import { verifyBookOwnership } from "../middleware/ownershipMiddleware.js";

const router = express.Router();

router.use(authenticate);

router.post("/", createBookValidation, authenticate, createBook);
router.get("/", listBooksValidation, authenticate, listBooks);
router.put("/:id", updateBookValidation, authenticate, verifyBookOwnership, updateBook);
router.delete("/:id", deleteBookValidation, authenticate, verifyBookOwnership, deleteBook);
router.get("/:id", getSingleBookValidation, authenticate, getSingleBook);

export default router;
