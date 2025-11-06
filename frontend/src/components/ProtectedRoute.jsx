"use client";
import { useEffect } from "react";
import { useRouter } from "next/router";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/");
        }
    }, [user, loading, router]);

    if (loading) return <p>Loading...</p>;

    return children;
}
