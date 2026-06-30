import { Routes, Route, Navigate } from "react-router-dom";
import ReviewQueue from "./pages/ReviewQueue";
import Login from "./pages/Login";
import Applications from "./pages/Applications";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
    return (
        <Routes>
            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Applications />
                    </ProtectedRoute>
                }
            />

            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />

            <Route
                path="/review"

                element={

                <ProtectedRoute>

                <ReviewQueue/>

                </ProtectedRoute>

                }

              />
        </Routes>
    );
}