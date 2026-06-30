import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Button,
    Card,
    CardContent,
    Container,
    TextField,
    Typography,
    Box,
} from "@mui/material";

import api, { saveTokens } from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {

    const navigate = useNavigate();

    const { refreshUser } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        setLoading(true);
        setError("");

        try {

            const response = await api.post(
                "auth/login/",
                {
                    username,
                    password,
                }
            );

            saveTokens(
                response.data.access,
                response.data.refresh
            );

            await refreshUser();

            const me = await api.get("auth/me/");

            if (me.data.role === "REVIEWER") {

                navigate("/review");

            } else {

                navigate("/");

            }

        } catch (err) {

            console.error(err);

            setError(
                "Invalid username or password."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <Container maxWidth="sm">

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                }}
            >

                <Card sx={{ width: "100%", maxWidth: 450 }}>

                    <CardContent>

                        <Typography
                            variant="h4"
                            align="center"
                            gutterBottom
                        >
                            Submission Workflow
                        </Typography>

                        <Typography
                            variant="body2"
                            align="center"
                            color="text.secondary"
                            mb={3}
                        >
                            Sign in to continue
                        </Typography>

                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                        >

                            <TextField
                                fullWidth
                                label="Username"
                                margin="normal"
                                value={username}
                                onChange={(e) =>
                                    setUsername(e.target.value)
                                }
                            />

                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                margin="normal"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                            />

                            {error && (
                                <Typography
                                    color="error"
                                    mt={2}
                                >
                                    {error}
                                </Typography>
                            )}

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{ mt: 3 }}
                                disabled={loading}
                            >
                                {loading ? "Signing In..." : "Login"}
                            </Button>

                        </Box>

                    </CardContent>

                </Card>

            </Box>

        </Container>

    );

}