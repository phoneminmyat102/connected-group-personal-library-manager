"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import api from "../lib/api";
import Layout from "../components/Layout";
import Link from "next/link";
import GuestRoute from "../components/GuestRoute";

export default function Register() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await api.post("/auth/register", { email, password });
            alert("Registration successful. Login now.");
            router.push("/");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <GuestRoute>
            <Layout>
                <div style={{
                    maxWidth: "400px",
                    width: "90%",
                    margin: "60px auto",
                    padding: "40px",
                    borderRadius: "10px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    backgroundColor: "#fff",
                    fontFamily: "Arial, sans-serif",
                    boxSizing: "border-box",
                }}>
                    <h1 style={{ textAlign: "center", marginBottom: "24px", fontSize: "1.8rem", color: "#111" }}>Register</h1>

                    {error && (
                        <div style={{
                            background: "#ffe6e6",
                            color: "#cc0000",
                            padding: "12px",
                            borderRadius: "6px",
                            marginBottom: "16px",
                            textAlign: "center",
                            fontSize: "14px"
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            style={{
                                width: "100%",
                                padding: "12px",
                                borderRadius: "6px",
                                border: "1px solid #ccc",
                                fontSize: "14px",
                                boxSizing: "border-box",
                                outline: "none",
                                transition: "border 0.2s"
                            }}
                            onFocus={e => e.target.style.border = "1px solid #111"}
                            onBlur={e => e.target.style.border = "1px solid #ccc"}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            style={{
                                width: "100%",
                                padding: "12px",
                                borderRadius: "6px",
                                border: "1px solid #ccc",
                                fontSize: "14px",
                                boxSizing: "border-box",
                                outline: "none",
                                transition: "border 0.2s"
                            }}
                            onFocus={e => e.target.style.border = "1px solid #111"}
                            onBlur={e => e.target.style.border = "1px solid #ccc"}
                        />

                        <button
                            type="submit"
                            style={{
                                width: "100%",
                                padding: "12px",
                                borderRadius: "6px",
                                border: "none",
                                background: "#111",
                                color: "#fff",
                                fontWeight: "bold",
                                cursor: "pointer",
                                transition: "background 0.2s"
                            }}
                            onMouseEnter={e => e.target.style.background = "#333"}
                            onMouseLeave={e => e.target.style.background = "#111"}
                        >
                            Register
                        </button>
                    </form>

                    <p style={{ textAlign: "center", marginTop: "16px", fontSize: "14px", color: "#555" }}>
                        Already have an account?{" "}
                        <Link href="/" style={{ color: "#111", textDecoration: "underline", fontWeight: "500" }}>
                            Login
                        </Link>
                    </p>
                </div>
            </Layout>
        </GuestRoute>
    );
}

