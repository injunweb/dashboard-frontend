import React from "react";
import { useMutation } from "@tanstack/react-query";
import { register } from "../services/auth.service";
import { Link, useNavigate } from "react-router-dom";
import {
    Button,
    Container,
    Input,
    Title,
} from "../components/styledComponents";

export const RegisterPage = () => {
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: register,
        onSuccess: () => {
            navigate("/login");
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const userData = Object.fromEntries(formData.entries());

        mutation.mutate(userData);
    };

    return (
        <Container>
            <Title>Register</Title>
            <form onSubmit={handleSubmit}>
                <Input name="username" placeholder="Name" required />
                <Input name="email" placeholder="Email" required />
                <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                />
                <Button type="submit" disabled={mutation.isLoading}>
                    Register
                </Button>
            </form>
            {mutation.isLoading && <p>Registering...</p>}
            {mutation.isError && <p>Error: {mutation.error.message}</p>}
            {mutation.isSuccess && <p>Registered successfully!</p>}
            <Link to="/login">Login</Link>
        </Container>
    );
};
