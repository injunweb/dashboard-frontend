import React from "react";
import { useMutation } from "@tanstack/react-query";
import { submitApplication } from "../services/application.service";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Container,
    Input,
    Textarea,
    Title,
} from "../components/styledComponents";

export const ApplicationSubmitPage = () => {
    const navigate = useNavigate();
    const mutation = useMutation({
        mutationFn: submitApplication,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const appData = Object.fromEntries(formData.entries());
        appData.port = parseInt(appData.port, 10);
        await mutation.mutateAsync(appData);
        navigate("/");
    };

    return (
        <Container>
            <Title>Submit Application</Title>
            <form onSubmit={handleSubmit}>
                <Input
                    name="name"
                    type="text"
                    pattern="[a-z0-9\-]+"
                    placeholder="Application Name"
                    required
                />
                <Input
                    name="port"
                    type="number"
                    placeholder="Application Port"
                    required
                />
                <Input
                    name="git_url"
                    type="url"
                    placeholder="Git URL"
                    required
                />
                <Input
                    name="branch"
                    type="text"
                    placeholder="Git Branch"
                    required
                />
                <Textarea
                    name="description"
                    placeholder="Description"
                    required
                />
                <Button type="submit">Submit</Button>
            </form>
            {mutation.isLoading && <p>Submitting...</p>}
            {mutation.isError && <p>Error: {mutation.error.message}</p>}
            {mutation.isSuccess && <p>Application submitted successfully!</p>}
        </Container>
    );
};
