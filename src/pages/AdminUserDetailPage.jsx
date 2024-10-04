import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUser, getApplications } from "../services/admin.service";
import styled from "styled-components";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Loading } from "../components/Loading";

const Container = styled.div`
    padding: 40px 20px;
    background-color: var(--dark, #0a0a0a);
    color: #e0e0e0;
    min-height: calc(100vh - 60px);
`;

const ContentWrapper = styled.div`
    max-width: 1000px;
    margin: 0 auto;
    animation: fadeIn 0.5s ease-out;

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;

const Title = styled.h1`
    font-size: 2.5rem;
    margin-bottom: 20px;
    background: linear-gradient(135deg, #1e90ff, #ff007f);
    -webkit-background-clip: text;
    color: transparent;
`;

const Section = styled.div`
    margin-bottom: 40px;
    padding: 30px;
    background-color: rgba(28, 28, 30, 0.6);
    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    transition: transform 0.3s, box-shadow 0.3s;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }
`;

const SectionTitle = styled.h2`
    font-size: 1.8rem;
    margin-bottom: 20px;
    color: #40a9ff;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 10px;
`;

const ApplicationList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

const ApplicationItem = styled.li`
    margin: 15px 0;
    padding: 15px;
    background-color: rgba(44, 44, 46, 0.6);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;

    &:hover {
        transform: translateX(5px);
        box-shadow: 0 5px 15px rgba(30, 144, 255, 0.1);
    }
`;

const ApplicationLink = styled(Link)`
    color: #40a9ff;
    text-decoration: none;
    font-size: 1.1rem;
    transition: color 0.3s;

    &:hover {
        color: #ff69b4;
    }
`;

const ErrorMessage = styled.p`
    color: #ff6b6b;
    background-color: rgba(255, 68, 68, 0.1);
    padding: 15px;
    border-radius: 10px;
    text-align: center;
    font-size: 1.1rem;
    margin-top: 20px;
`;

const NoApplicationsMessage = styled.p`
    color: #a0a0a0;
    font-style: italic;
`;

const UserInfo = styled.p`
    margin: 10px 0;
    font-size: 1.1rem;
`;

export const AdminUserDetailPage = () => {
    const { userId } = useParams();
    const { data: user, isLoading: userLoading } = useQuery({
        queryKey: ["user", userId],
        queryFn: () => getUser(userId),
    });
    const { data: applications, isLoading: appLoading } = useQuery({
        queryKey: ["userApplications", userId],
        queryFn: () => getApplications(userId),
        enabled: !!user,
    });

    if (userLoading || appLoading) return <Loading />;

    if (!user?.data) {
        return (
            <Container>
                <ContentWrapper>
                    <Title>User Not Found</Title>
                    <ErrorMessage>해당 사용자를 찾을 수 없습니다.</ErrorMessage>
                </ContentWrapper>
            </Container>
        );
    }

    return (
        <>
            <Header />
            <Container>
                <ContentWrapper>
                    <Title>USER 상세 정보</Title>
                    <Section>
                        <SectionTitle>USER 정보</SectionTitle>
                        <UserInfo>
                            <strong>USER ID:</strong> {user.data.id}
                        </UserInfo>
                        <UserInfo>
                            <strong>사용자 이름:</strong> {user.data.username}
                        </UserInfo>
                        <UserInfo>
                            <strong>이메일:</strong> {user.data.email}
                        </UserInfo>
                        <UserInfo>
                            <strong>어드민 여부:</strong>{" "}
                            {user.data.is_admin ? "예" : "아니요"}
                        </UserInfo>
                    </Section>
                    <Section>
                        <SectionTitle>어플리케이션 목록</SectionTitle>
                        {applications?.data?.applications?.length > 0 ? (
                            <ApplicationList>
                                {applications.data.applications.map((app) => (
                                    <ApplicationItem key={app.id}>
                                        <ApplicationLink
                                            to={`/admin/applications/${app.id}`}
                                        >
                                            {app.name}
                                        </ApplicationLink>
                                    </ApplicationItem>
                                ))}
                            </ApplicationList>
                        ) : (
                            <NoApplicationsMessage>
                                등록된 어플리케이션이 없습니다.
                            </NoApplicationsMessage>
                        )}
                    </Section>
                </ContentWrapper>
            </Container>
            <Footer />
        </>
    );
};
