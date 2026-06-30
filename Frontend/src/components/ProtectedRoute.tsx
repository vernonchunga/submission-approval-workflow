import type { ReactNode } from "react";

import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

interface Props {
    children: ReactNode;
}

export default function ProtectedRoute({
    children,
}: Props) {

    const { user, loading } = useAuth();

    const location = useLocation();

    if (loading) {

        return <h2>Loading...</h2>;

    }

    if (!user) {

        return <Navigate to="/login" replace />;

    }

    if (
        location.pathname === "/review" &&
        user.role !== "REVIEWER"
    ) {

        return <Navigate to="/" replace />;

    }

    return <>{children}</>;

}