"use client";

import { useRouter } from "next/router";
import api from "../lib/api";
import { formatDistanceToNow } from "date-fns";

export default function BookCard({ book, refetch }) {
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Delete this book?")) return;
        await api.delete(`/books/${book._id}`);
        alert("Book deleted successfully!");
        refetch();
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "1rem",
                borderRadius: "12px",
                backgroundColor: "#fff",
                border: "1px solid #e0e0e0",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                transition: "transform 0.2s, box-shadow 0.2s",
                minHeight: "260px",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.05)";
            }}
        >

            <div style={{ marginBottom: "1rem" }}>
                <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600, color: "#111" }}>
                    {book.title}
                </h3>
                <p style={{ margin: "0.25rem 0", fontSize: "0.95rem", color: "#555" }}>
                    <strong>Author:</strong> {book.author}
                </p>
                <p style={{ margin: "0.25rem 0", fontSize: "0.9rem", color: "#555" }}>
                    <strong>Status:</strong>{" "}
                    <span
                        style={{
                            padding: "0.15rem 0.5rem",
                            borderRadius: "4px",
                            backgroundColor:
                                book.status === "reading"
                                    ? "#3b82f6"
                                    : book.status === "completed"
                                        ? "#16a34a"
                                        : "#fbbf24",
                            color: "white",
                            fontWeight: "500",
                            fontSize: "0.8rem",
                        }}
                    >
                        {book.status}
                    </span>
                </p>
                {book.rating && (
                    <p style={{ margin: "0.25rem 0", fontSize: "0.9rem", color: "#555" }}>
                        <strong>Rating:</strong> {book.rating} ⭐
                    </p>
                )}
                {book.review && (
                    <p style={{ margin: "0.25rem 0", fontSize: "0.9rem", color: "#555" }}>
                        <strong>Review:</strong> {book.review}
                    </p>
                )}
                {book.updatedAt && (
                    <p style={{ margin: "0.25rem 0", fontSize: "0.8rem", color: "#888" }}>
                        Updated {formatDistanceToNow(new Date(book.updatedAt), { addSuffix: true })}
                    </p>
                )}
            </div>


            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <button
                    onClick={() => router.push(`/books/edit/${book._id}`)}
                    style={{
                        flex: 1,
                        padding: "0.5rem",
                        fontSize: "0.9rem",
                        borderRadius: "6px",
                        border: "none",
                        cursor: "pointer",
                        backgroundColor: "#0284c7",
                        color: "white",
                        transition: "0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0369a1")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0284c7")}
                >
                    Edit
                </button>
                <button
                    onClick={handleDelete}
                    style={{
                        flex: 1,
                        padding: "0.5rem",
                        fontSize: "0.9rem",
                        borderRadius: "6px",
                        border: "none",
                        cursor: "pointer",
                        backgroundColor: "#dc2626",
                        color: "white",
                        transition: "0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b91c1c")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}
