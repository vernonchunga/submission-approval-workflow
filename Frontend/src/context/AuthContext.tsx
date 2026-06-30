import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import type { ReactNode } from "react";

import api from "../api/axios";

import type { User } from "../types/auth";

interface AuthContextType {

    user: User | null;

    loading: boolean;

    refreshUser: () => Promise<void>;

    logout: () => void;

}

const AuthContext =
    createContext<AuthContextType | undefined>(undefined);

export function AuthProvider(
    { children }: { children: ReactNode }
) {

    const [user, setUser] =
        useState<User | null>(null);

    const [loading, setLoading] =
        useState(true);

    const refreshUser = async () => {

        try {

            const response =
                await api.get("auth/me/");

            setUser(response.data);

        } catch {

            setUser(null);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        refreshUser();

    }, []);

    const logout = () => {

        localStorage.clear();

        setUser(null);

    };

    return (

        <AuthContext.Provider
            value={{
                user,
                loading,
                refreshUser,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>

    );

}

export function useAuth() {

    const context = useContext(AuthContext);

    if (!context) {

        throw new Error(
            "useAuth must be used inside AuthProvider"
        );

    }

    return context;

}