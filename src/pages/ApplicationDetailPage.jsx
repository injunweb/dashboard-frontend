import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getApplication } from "../services/application.service";
import { getEnvironments } from "../services/environment.service";
import { Container, Title } from "../components/styledComponents";

export const ApplicationDetailPage = () => {
    const { appId } = useParams();

    const {
        data: applicationData,
        error: appError,
        isLoading: appLoading,
    } = useQuery({
        queryKey: ["application", appId],
        queryFn: () => getApplication(appId),
    });

    const {
        data: environmentsData,
        error: envError,
        isLoading: envLoading,
    } = useQuery({
        queryKey: ["applicationEnvironments", appId],
        queryFn: () => getEnvironments(appId),
    });

    if (appLoading || envLoading) return <div>Loading...</div>;

    if (appError || envError || !applicationData?.data) {
        return (
            <Container>
                <Title>Application Not Found</Title>
            </Container>
        );
    }

    const application = applicationData.data;
    const environments = environmentsData?.data || [];

    return (
        <Container>
            <Title>{application.name}</Title>
            <h2>Application Details</h2>
            <p>
                <strong>Git URL:</strong> {application.git_url}
            </p>
            <p>
                <strong>Branch:</strong> {application.branch}
            </p>
            <p>
                <strong>Port:</strong> {application.port}
            </p>
            <p>
                <strong>Description:</strong> {application.description}
            </p>

            <h2>Environments</h2>
            {environments.length > 0 ? (
                <ul>
                    {environments.map((env) => (
                        <li key={env.id}>{env.name}</li>
                    ))}
                </ul>
            ) : (
                <p>No environments available for this application.</p>
            )}
        </Container>
    );
};
