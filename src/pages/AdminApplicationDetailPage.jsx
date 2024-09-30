import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getApplication, approveApplication } from "../services/admin.service";
import { Container, Title, Button } from "../components/styledComponents";

export const AdminApplicationDetailPage = () => {
    const { appId } = useParams();
    const { data, error, isLoading, refetch } = useQuery({
        queryKey: ["application", appId],
        queryFn: () => getApplication(appId),
    });

    const mutation = useMutation({
        mutationFn: () => approveApplication(appId),
        onSuccess: refetch,
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const application = data?.data;

    return (
        <Container>
            <Title>Application Details</Title>
            <p>ID: {application.id}</p>
            <p>Name: {application.name}</p>
            <p>Git URL: {application.git_url}</p>
            <p>Branch: {application.branch}</p>
            <p>Port: {application.port}</p>
            <p>Description: {application.description}</p>
            <p>Owner ID: {application.owner_id}</p>
            <p>Status: {application.status}</p>
            {application.status === "Pending" && (
                <Button onClick={() => mutation.mutate()}>Approve</Button>
            )}
            {mutation.isLoading && <p>Approving...</p>}
            {mutation.isError && <p>Error: {mutation.error.message}</p>}
            {mutation.isSuccess && <p>Application approved successfully!</p>}
        </Container>
    );
};
