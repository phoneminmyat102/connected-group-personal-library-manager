"use client";
import { createContext, useEffect, useState, useContext } from "react";
import Cookies from "js-cookie";
import api from "../lib/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        if (typeof window === "undefined") return null;
        const stored = localStorage.getItem("user");
        try {
            return stored ? JSON.parse(stored) : null;
        } catch {
            localStorage.removeItem("user");
            return null;
        }
    });

    const [loading, setLoading] = useState(true);

    const login = (userData, accessToken, refreshToken) => {
        if (!userData || !accessToken || !refreshToken) return;
        localStorage.setItem("user", JSON.stringify(userData));
        Cookies.set("accessToken", accessToken);
        Cookies.set("refreshToken", refreshToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("user");
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        setUser(null);
    };

    const refreshAccessToken = async () => {
        const storedRefresh = Cookies.get("refreshToken");
        if (!storedRefresh) {
            logout();
            return null;
        }

        try {
            const res = await api.post("/auth/refresh", { refreshToken: storedRefresh });
            const { accessToken, refreshToken } = res.data.data;

            Cookies.set("accessToken", accessToken);
            Cookies.set("refreshToken", refreshToken);

            return accessToken;
        } catch (err) {
            logout();
            return null;
        }
    };

    useEffect(() => {
        const interceptor = api.interceptors.response.use(
            res => res,
            async (error) => {
                const originalRequest = error.config;
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    const newToken = await refreshAccessToken();
                    if (newToken) {
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        return api(originalRequest);
                    }
                }
                return Promise.reject(error);
            }
        );

        setLoading(false);
        return () => api.interceptors.response.eject(interceptor);
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, refreshAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
