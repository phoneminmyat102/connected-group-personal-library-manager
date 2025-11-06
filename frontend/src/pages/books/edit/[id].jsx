"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import api from "../../../lib/api";
import Layout from "../../../components/Layout";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { useQueryClient } from "@tanstack/react-query";

export default function EditBook() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { id } = router.query;

    const [form, setForm] = useState({
        title: "",
        author: "",
        status: "reading",
        rating: "",
        review: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchBook = async () => {
            try {
                const res = await api.get(`/books/${id}`);
                const data = res.data.data;

                setForm({
                    title: data.title || "",
                    author: data.author || "",
                    status: data.status || "reading",
                    rating: data.rating?.toString() || "",
                    review: data.review || "",
                });
            } catch (err) {
                console.error("Failed to fetch book:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [id]);

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

        await api.put(`/books/${id}`, form);
        alert("Book updated successfully!");
        queryClient.invalidateQueries(["books"]);
        router.push("/dashboard");
    };

    if (loading) {
        return (
            <Layout>
                <div className="loading-container">
                    <p className="loading-text">Loading book details...</p>
                </div>
            </Layout>
        );
    }

    return (
        <ProtectedRoute>
            <Layout>
                <form className="book-form" onSubmit={handleSubmit}>
                    <h1>Edit Book</h1>

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

                    <button type="submit">Update Book</button>
                </form>
            </Layout>
        </ProtectedRoute>
    );
}
