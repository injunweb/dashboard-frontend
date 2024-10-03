import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUser, getApplications } from "../services/admin.service";
import styled from "styled-components";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

const Container = styled.div`
    padding: 20px;
    background-color: #000;
    color: white;
    min-height: calc(100vh - 80px);
`;

const Title = styled.h1`
    font-size: 28px;
    margin-bottom: 20px;
`;

const Section = styled.div`
    margin-bottom: 20px;
    padding: 15px;
    background-color: #1c1c1e;
    border-radius: 3px;
    border: 1px solid #333;
`;

const SectionTitle = styled.h2`
    font-size: 24px;
    margin-bottom: 10px;
    border-bottom: 1px solid #333;
    padding-bottom: 5px;
`;

const ApplicationList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

const ApplicationItem = styled.li`
    margin: 10px 0;
    padding: 10px;
    background-color: #2c2c2e;
    border-radius: 3px;
    border: 1px solid #333;
`;

const ErrorMessage = styled.p`
    color: red;
`;

const NoApplicationsMessage = styled.p`
    color: #ccc;
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

    if (userLoading || appLoading) return <div>Loading...</div>;

    if (!user?.data) {
        return (
            <Container>
                <Title>User Not Found</Title>
                <ErrorMessage>해당 사용자를 찾을 수 없습니다.</ErrorMessage>
            </Container>
        );
    }

    return (
        <>
            <Header />
            <Container>
                <Title>USER 상세 정보</Title>
                <Section>
                    <SectionTitle>USER 정보</SectionTitle>
                    <p>USER ID: {user.data.id}</p>
                    <p>사용자 이름: {user.data.username}</p>
                    <p>이메일: {user.data.email}</p>
                    <p>어드민 여부: {user.data.is_admin ? "예" : "아니요"}</p>
                </Section>
                <Section>
                    <SectionTitle>어플리케이션 목록</SectionTitle>
                    {applications?.data?.applications?.length > 0 ? (
                        <ApplicationList>
                            {applications.data.applications.map((app) => (
                                <ApplicationItem key={app.id}>
                                    <Link
                                        to={`/admin/applications/${app.id}`}
                                        style={{ color: "#1e90ff" }}
                                    >
                                        {app.name}
                                    </Link>
                                </ApplicationItem>
                            ))}
                        </ApplicationList>
                    ) : (
                        <NoApplicationsMessage>
                            등록된 어플리케이션이 없습니다.
                        </NoApplicationsMessage>
                    )}
                </Section>
            </Container>
            <Footer />
        </>
    );
};
