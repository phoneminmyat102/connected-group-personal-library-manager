"use client";
import { useEffect } from "react";
import { useRouter } from "next/router";
import useAuth from "../hooks/useAuth";

export default function GuestRoute({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.replace("/dashboard");
        }
    }, [user, loading, router]);

    if (loading || user) {
        return <p style={{ textAlign: "center", marginTop: "50px" }}>Redirecting...</p>;
    }

    return children;
}
