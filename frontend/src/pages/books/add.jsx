"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import api from "../../lib/api";
import Layout from "../../components/Layout";
import { useQueryClient } from "@tanstack/react-query";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function AddBook() {
    const queryClient = useQueryClient();
    const router = useRouter();

    const [form, setForm] = useState({
        title: "",
        author: "",
        status: "reading",
        rating: "",
        review: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validate = () => {
        const newErrors = {};
        if (!form.title.trim()) newErrors.title = "Title is required";
        if (!form.author.trim()) newErrors.author = "Author is required";
        if (form.rating && (isNaN(form.rating) || form.rating < 0 || form.rating > 5)) {
            newErrors.rating = "Rating must be between 0 and 5";
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length) {
            setErrors(validationErrors);
            return;
        }

        await api.post("/books", form);
        alert("Book added successfully!");
        queryClient.invalidateQueries(["books"]);
        router.push("/dashboard");
    };

    return (
        <ProtectedRoute>
            <Layout>
                <form className="book-form" onSubmit={handleSubmit}>
                    <h1>Add Book</h1>

                    <div>
                        <input
                            name="title"
                            placeholder="Title"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />
                        {errors.title && <div className="form-error">{errors.title}</div>}
                    </div>

                    <div>
                        <input
                            name="author"
                            placeholder="Author"
                            value={form.author}
                            onChange={handleChange}
                            required
                        />
                        {errors.author && <div className="form-error">{errors.author}</div>}
                    </div>

                    <div>
                        <select name="status" value={form.status} onChange={handleChange}>
                            <option value="reading">Reading</option>
                            <option value="completed">Completed</option>
                            <option value="wishlist">Wishlist</option>
                        </select>
                    </div>

                    <div>
                        <input
                            name="rating"
                            placeholder="Rating (0–5, optional)"
                            value={form.rating}
                            onChange={handleChange}
                        />
                        {errors.rating && <div className="form-error">{errors.rating}</div>}
                    </div>

                    <div>
                        <textarea
                            name="review"
                            placeholder="Review (optional)"
                            value={form.review}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit">Add Book</button>
                </form>
            </Layout>
        </ProtectedRoute>
    );
}
