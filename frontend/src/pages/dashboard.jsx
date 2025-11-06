"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import api from "../lib/api";
import Layout from "../components/Layout";
import BookCard from "../components/BookCard";
import useAuth from "../hooks/useAuth";
import ProtectedRoute from "../components/ProtectedRoute";

export default function Dashboard() {
    const router = useRouter();
    const { user } = useAuth();
    const [statusFilter, setStatusFilter] = useState("");
    const [page, setPage] = useState(1);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);
    useEffect(() => {
        if (user) refetch();
    }, [user, router.asPath]);

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["books", statusFilter, page],
        queryFn: async () => {
            const res = await api.get("/books", {
                params: { status: statusFilter || undefined, page, limit: 6 },
            });
            return {
                books: Array.isArray(res.data?.data?.data) ? res.data.data.data : [],
                total: res.data?.data?.total || 0,
                limit: res.data?.data?.limit || 1,
            };
        },
        keepPreviousData: true,
        staleTime: 1000 * 60,
        enabled: !!user,
    });

    if (!mounted) return null;

    const books = data?.books || [];
    const totalPages = Math.ceil((data?.total || 0) / (data?.limit || 1));

    return (
        <ProtectedRoute>
            <Layout>
                <div style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: "2rem",
                    fontFamily: "Arial, sans-serif",
                    color: "#111"
                }}>
                    <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1.5rem", textAlign: "center" }}>
                        Dashboard
                    </h1>

                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
                        <button
                            style={{
                                padding: "0.6rem 1.2rem",
                                borderRadius: "6px",
                                border: "none",
                                background: "#111",
                                color: "#fff",
                                fontWeight: "bold",
                                cursor: "pointer",
                                transition: "0.2s"
                            }}
                            onMouseEnter={e => e.target.style.background = "#333"}
                            onMouseLeave={e => e.target.style.background = "#111"}
                            onClick={() => router.push("/books/add")}
                        >
                            Add Book
                        </button>
                    </div>

                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{
                                padding: "0.5rem",
                                borderRadius: "6px",
                                border: "1px solid #ccc",
                                fontSize: "14px",
                                outline: "none",
                            }}
                        >
                            <option value="">All</option>
                            <option value="reading">Reading</option>
                            <option value="completed">Completed</option>
                            <option value="wishlist">Wishlist</option>
                        </select>
                    </div>

                    {isLoading && <p style={{ textAlign: "center", color: "#666" }}>Loading books...</p>}
                    {error && <p style={{ textAlign: "center", color: "#cc0000" }}>Error loading books.</p>}
                    {!isLoading && books.length === 0 && (
                        <p style={{ textAlign: "center", color: "#666" }}>No books found.</p>
                    )}

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "1rem",
                        marginTop: "1rem"
                    }}>
                        {books.map((book) => (
                            <BookCard key={book._id} book={book} refetch={refetch} />
                        ))}
                    </div>

                    {(
                        <div style={{
                            marginTop: "2rem",
                            display: "flex",
                            justifyContent: "center",
                            gap: "1rem",
                            alignItems: "center"
                        }}>
                            <button
                                disabled={page <= 1}
                                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                style={{
                                    padding: "0.5rem 1rem",
                                    borderRadius: "6px",
                                    border: "none",
                                    background: "#111",
                                    color: "#fff",
                                    cursor: page <= 1 ? "not-allowed" : "pointer",
                                    opacity: page <= 1 ? 0.5 : 1,
                                    transition: "0.2s"
                                }}
                                onMouseEnter={e => { if (page > 1) e.target.style.background = "#333"; }}
                                onMouseLeave={e => { if (page > 1) e.target.style.background = "#111"; }}
                            >
                                Prev
                            </button>

                            <span>Page {page} of {totalPages}</span>

                            <button
                                disabled={page >= totalPages}
                                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                                style={{
                                    padding: "0.5rem 1rem",
                                    borderRadius: "6px",
                                    border: "none",
                                    background: "#111",
                                    color: "#fff",
                                    cursor: page >= totalPages ? "not-allowed" : "pointer",
                                    opacity: page >= totalPages ? 0.5 : 1,
                                    transition: "0.2s"
                                }}
                                onMouseEnter={e => { if (page < totalPages) e.target.style.background = "#333"; }}
                                onMouseLeave={e => { if (page < totalPages) e.target.style.background = "#111"; }}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </Layout>
        </ProtectedRoute>
    );
}
