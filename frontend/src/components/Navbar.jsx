import { useEffect, useState } from "react";
import Link from "next/link";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
    const { user, logout } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <nav className="navbar">
            <Link href="/dashboard" className="navbar-logo">
                Personal Library Manager
            </Link>

            <div className="navbar-actions">
                {user ? (
                    <>
                        <span className="navbar-user">{user.email}</span>
                        <button className="navbar-btn" onClick={logout}>
                            Logout
                        </button>
                    </>
                ) : ""}
            </div>
        </nav>
    );
}
