import React from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "../services/auth.service";
import { setAuthToken } from "../utils/auth";
import { Link } from "react-router-dom";
import {
    Button,
    Container,
    Input,
    Title,
} from "../components/styledComponents";

export const LoginPage = () => {
    const mutation = useMutation({
        mutationFn: login,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const credentials = Object.fromEntries(formData.entries());
        const response = await mutation.mutateAsync(credentials);
        setAuthToken(response.data.token);
        window.location.href = "/";
    };

    return (
        <Container>
            <Title>Login</Title>
            <form onSubmit={handleSubmit}>
                <Input
                    name="username"
                    type="text"
                    placeholder="Username"
                    required
                />
                <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                />
                <Button type="submit">Login</Button>
            </form>
            {mutation.isLoading && <p>Logging in...</p>}
            {mutation.isError && <p>Error: {mutation.error.message}</p>}
            <p>
                Don't have an account? <Link to="/register">Register</Link>
            </p>
        </Container>
    );
};
