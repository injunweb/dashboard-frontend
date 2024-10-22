import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { getApplications } from "../services/application";
import Loading from "../components/Loading";
import { Plus, GitBranch, ExternalLink, Clock } from "lucide-react";

const ApplicationListPage = () => {
    const {
        data: response,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["applications"],
        queryFn: getApplications,
    });

    if (isLoading) return <Loading />;
    if (error) return <ErrorMessage>Error: {error.message}</ErrorMessage>;

    const applications = response?.applications || [];

    return (
        <Container>
            <Header>
                <Title>어플리케이션</Title>
                <NewAppButton to="/applications/new">
                    <Plus size={16} />새 어플리케이션
                </NewAppButton>
            </Header>
            <ApplicationGrid>
                {applications.map((app) => (
                    <ApplicationCard key={app.id}>
                        <CardContent>
                            <AppNameRow>
                                <AppName>{app.name}</AppName>
                                <AppStatus status={app.status}>
                                    {app.status}
                                </AppStatus>
                            </AppNameRow>
                            <AppDescription>
                                {app.description.length > 100
                                    ? `${app.description.substring(0, 100)}...`
                                    : app.description}
                            </AppDescription>
                            <CardFooter>
                                <RepoLink
                                    href={app.git_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <GitBranch size={14} />
                                    Repository
                                </RepoLink>
                                <CreatedAt>
                                    <Clock size={14} />
                                    {new Date(
                                        app.created_at
                                    ).toLocaleDateString()}
                                </CreatedAt>
                            </CardFooter>
                        </CardContent>
                        <ViewDetailsLink to={`/applications/${app.id}`}>
                            상세 보기 <ExternalLink size={14} />
                        </ViewDetailsLink>
                    </ApplicationCard>
                ))}
            </ApplicationGrid>
        </Container>
    );
};

const Container = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
`;

const Title = styled.h1`
    font-size: 28px;
    color: #f0f0f0;
    font-weight: 600;
`;

const NewAppButton = styled(Link)`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background-color: #3a86ff;
    color: #ffffff;
    border-radius: 6px;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease-in-out;

    &:hover {
        background-color: #2f74e0;
        transform: translateY(-2px);
    }
`;

const ApplicationGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
`;

const ApplicationCard = styled.div`
    background-color: #1a1a1a;
    border-radius: 10px;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
    border: 1px solid #2a2a2a;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }
`;

const CardContent = styled.div`
    padding: 20px;
`;

const AppNameRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
`;

const AppName = styled.h2`
    font-size: 18px;
    color: #f0f0f0;
    margin: 0;
`;

const AppStatus = styled.span`
    padding: 4px 8px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    background-color: ${(props) => {
        switch (props.status.toLowerCase()) {
            case "approved":
                return "rgba(16, 185, 129, 0.2)";
            case "pending":
                return "rgba(245, 158, 11, 0.2)";
            default:
                return "rgba(239, 68, 68, 0.2)";
        }
    }};
    color: ${(props) => {
        switch (props.status.toLowerCase()) {
            case "approved":
                return "#10b981";
            case "pending":
                return "#f59e0b";
            default:
                return "#ef4444";
        }
    }};
`;

const AppDescription = styled.p`
    font-size: 14px;
    color: #a0a0a0;
    margin: 0 0 16px 0;
    line-height: 1.6;
`;

const CardFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #2a2a2a;
`;

const RepoLink = styled.a`
    display: flex;
    align-items: center;
    gap: 5px;
    color: #3a86ff;
    text-decoration: none;
    font-size: 14px;
    transition: color 0.2s;

    &:hover {
        color: #2f74e0;
    }
`;

const CreatedAt = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    color: #6b7280;
    font-size: 12px;
`;

const ViewDetailsLink = styled(Link)`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 12px;
    background-color: #2a2a2a;
    color: #f0f0f0;
    text-decoration: none;
    font-size: 14px;
    transition: background-color 0.2s;

    &:hover {
        background-color: #3a3a3a;
    }
`;

const ErrorMessage = styled.div`
    color: #ef4444;
    background-color: rgba(239, 68, 68, 0.1);
    border: 1px solid #ef4444;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 24px;
    text-align: center;
`;

export default ApplicationListPage;
