import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { getUser, getUserApplications } from "../services/admin";
import Loading from "../components/Loading";
import {
    User,
    Mail,
    Shield,
    ArrowLeft,
    ExternalLink,
    Globe,
    Clock,
} from "lucide-react";

const AdminUserDetailPage = () => {
    const { userId } = useParams();

    const {
        data: user,
        isLoading: isUserLoading,
        isError: isUserError,
        error: userError,
    } = useQuery({
        queryKey: ["adminUser", userId],
        queryFn: () => getUser(userId),
    });

    const {
        data: applications,
        isLoading: isAppsLoading,
        isError: isAppsError,
        error: appsError,
    } = useQuery({
        queryKey: ["adminUserApplications", userId],
        queryFn: () => getUserApplications(userId),
    });

    if (isUserLoading || isAppsLoading) return <Loading />;
    if (isUserError) return <ErrorDisplay message={userError.message} />;
    if (isAppsError) return <ErrorDisplay message={appsError.message} />;

    return (
        <Container>
            <Header>
                <Title>사용자 상세</Title>
                <BackLink to="/admin/users">
                    <ArrowLeft size={16} />
                    사용자 목록으로 돌아가기
                </BackLink>
            </Header>
            <ContentWrapper>
                <Card>
                    <AppNameRow>
                        <AppName>{user.username}</AppName>
                        <AdminBadge isAdmin={user.is_admin}>
                            {user.is_admin ? "관리자" : "일반 사용자"}
                        </AdminBadge>
                    </AppNameRow>
                    <DetailGrid>
                        <DetailItem>
                            <DetailLabel>ID</DetailLabel>
                            <DetailValue>{user.id}</DetailValue>
                        </DetailItem>
                        <DetailItem>
                            <DetailLabel>이메일</DetailLabel>
                            <DetailValue>{user.email}</DetailValue>
                        </DetailItem>
                        <DetailItem>
                            <DetailLabel>가입일</DetailLabel>
                            <DetailValue>
                                {new Date(user.created_at).toLocaleDateString()}
                            </DetailValue>
                        </DetailItem>
                    </DetailGrid>
                </Card>

                <Card>
                    <CardTitle>애플리케이션 목록</CardTitle>
                    {!applications.applications ||
                    applications.applications.length === 0 ? (
                        <EmptyState>
                            이 사용자의 애플리케이션이 없습니다.
                        </EmptyState>
                    ) : (
                        <ApplicationList>
                            {applications.applications.map((app) => (
                                <ApplicationItem key={app.id}>
                                    <AppInfo>
                                        <AppTitleRow>
                                            <AppTitle>{app.name}</AppTitle>
                                            <AppStatus status={app.status}>
                                                {app.status}
                                            </AppStatus>
                                        </AppTitleRow>
                                        <AppDetails>
                                            <AppDetail>
                                                <Globe size={14} />
                                                {app.primary_hostname}
                                            </AppDetail>
                                            <AppDetail>
                                                <Clock size={14} />
                                                {new Date(
                                                    app.created_at
                                                ).toLocaleDateString()}
                                            </AppDetail>
                                        </AppDetails>
                                        {app.description && (
                                            <AppDescription>
                                                {app.description}
                                            </AppDescription>
                                        )}
                                    </AppInfo>
                                    <AppActions>
                                        <ViewButton
                                            to={`/admin/applications/${app.id}`}
                                        >
                                            <ExternalLink size={14} />
                                            상세 보기
                                        </ViewButton>
                                    </AppActions>
                                </ApplicationItem>
                            ))}
                        </ApplicationList>
                    )}
                </Card>
            </ContentWrapper>
        </Container>
    );
};

const Container = styled.div`
    max-width: 1000px;
    margin: 0 auto;
    padding: 40px 20px;
    color: #ffffff;
    min-height: 100vh;
    font-family: "Arial", sans-serif;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
`;

const Title = styled.h1`
    font-size: 28px;
    color: #ffffff;
    font-weight: 600;
`;

const BackLink = styled(Link)`
    display: flex;
    align-items: center;
    gap: 8px;
    color: #3a86ff;
    text-decoration: none;
    font-size: 14px;
    &:hover {
        text-decoration: underline;
    }
`;

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

const Card = styled.div`
    background-color: #1a1a1a;
    border-radius: 10px;
    padding: 24px;
    border: 1px solid #2a2a2a;
    transition: all 0.3s ease-in-out;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }
`;

const AppNameRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
`;

const AppName = styled.h3`
    font-size: 24px;
    color: #f0f0f0;
    margin: 0;
`;

const AdminBadge = styled.span`
    padding: 4px 8px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    background-color: ${(props) =>
        props.isAdmin ? "rgba(16, 185, 129, 0.2)" : "rgba(107, 114, 128, 0.2)"};
    color: ${(props) => (props.isAdmin ? "#10b981" : "#6b7280")};
`;

const DetailGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 20px;
`;

const DetailItem = styled.div`
    display: flex;
    flex-direction: column;
`;

const DetailLabel = styled.span`
    color: #a0a0a0;
    font-size: 14px;
    margin-bottom: 4px;
`;

const DetailValue = styled.span`
    color: #ffffff;
    font-size: 16px;
    font-weight: 500;
`;

const CardTitle = styled.h2`
    font-size: 20px;
    color: #ffffff;
    font-weight: 600;
    margin-bottom: 20px;
`;

const EmptyState = styled.div`
    color: #a0a0a0;
    font-size: 14px;
    text-align: center;
    padding: 40px;
    background-color: #2a2a2a;
    border-radius: 8px;
`;

const ApplicationList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const ApplicationItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 16px;
    background-color: #2a2a2a;
    border-radius: 8px;
    transition: all 0.2s ease-in-out;

    &:hover {
        background-color: #333333;
    }
`;

const AppInfo = styled.div`
    flex: 1;
`;

const AppTitleRow = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
`;

const AppTitle = styled.h3`
    font-size: 18px;
    color: #ffffff;
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

const AppDetails = styled.div`
    display: flex;
    gap: 16px;
    margin-bottom: 8px;
`;

const AppDetail = styled.span`
    display: flex;
    align-items: center;
    gap: 6px;
    color: #a0a0a0;
    font-size: 14px;
`;

const AppDescription = styled.p`
    color: #a0a0a0;
    font-size: 14px;
    margin: 0;
    line-height: 1.5;
`;

const AppActions = styled.div`
    margin-left: 16px;
`;

const ViewButton = styled(Link)`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background-color: #3a3a3a;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    text-decoration: none;
    transition: all 0.2s ease-in-out;

    &:hover {
        background-color: #4a4a4a;
        transform: translateY(-2px);
    }
`;

const ErrorDisplay = styled.div`
    color: #ef4444;
    background-color: rgba(239, 68, 68, 0.1);
    border: 1px solid #ef4444;
    border-radius: 8px;
    padding: 16px;
    margin: 20px;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
`;

export default AdminUserDetailPage;
