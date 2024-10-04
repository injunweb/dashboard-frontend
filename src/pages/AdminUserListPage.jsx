import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getUsers } from "../services/admin.service";
import styled from "styled-components";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Loading } from "../components/Loading";

const Container = styled.div`
    padding: 40px 20px;
    background-color: var(--dark, #0a0a0a);
    color: #e0e0e0; // 밝은 회색으로 변경
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
    color: #40a9ff; // 더 밝은 파란색으로 변경
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 10px;
`;

const UserList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

const UserItem = styled.li`
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

const UserLink = styled(Link)`
    color: #40a9ff; // 더 밝은 파란색으로 변경
    text-decoration: none;
    font-size: 1.1rem;
    transition: color 0.3s;

    &:hover {
        color: #ff69b4; // 호버 시 밝은 분홍색으로 변경
    }
`;

const ErrorMessage = styled.p`
    color: #ff6b6b; // 더 밝은 빨간색으로 변경
    background-color: rgba(255, 68, 68, 0.1);
    padding: 15px;
    border-radius: 10px;
    text-align: center;
    font-size: 1.1rem;
    margin-top: 20px;
`;

export const AdminUserListPage = () => {
    const { data, error, isLoading } = useQuery({
        queryKey: ["adminUsers"],
        queryFn: getUsers,
    });

    if (isLoading) return <Loading />;
    if (error) return <ErrorMessage>Error: {error.message}</ErrorMessage>;

    return (
        <>
            <Header />
            <Container>
                <ContentWrapper>
                    <Title>USER 목록</Title>
                    <Section>
                        <SectionTitle>Users</SectionTitle>
                        <UserList>
                            {data?.data?.users?.length ? (
                                data.data.users.map((user) => (
                                    <UserItem key={user.id}>
                                        <UserLink
                                            to={`/admin/users/${user.id}`}
                                        >
                                            {user.username} - {user.email}
                                        </UserLink>
                                    </UserItem>
                                ))
                            ) : (
                                <UserItem>
                                    <p>등록된 사용자가 없습니다.</p>
                                </UserItem>
                            )}
                        </UserList>
                    </Section>
                </ContentWrapper>
            </Container>
            <Footer />
        </>
    );
};
