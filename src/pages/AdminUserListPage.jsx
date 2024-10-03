import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getUsers } from "../services/admin.service";
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

const UserList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

const UserItem = styled.li`
    margin: 10px 0;
    padding: 10px;
    background-color: #2c2c2e;
    border-radius: 3px;
    border: 1px solid #333;
`;

const ErrorMessage = styled.p`
    color: red;
`;

export const AdminUserListPage = () => {
    const { data, error, isLoading } = useQuery({
        queryKey: ["adminUsers"],
        queryFn: getUsers,
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <ErrorMessage>Error: {error.message}</ErrorMessage>;

    return (
        <>
            <Header />
            <Container>
                <Title>USER 목록</Title>
                <Section>
                    <SectionTitle>users</SectionTitle>
                    <UserList>
                        {data?.data?.users?.length ? (
                            data.data.users.map((user) => (
                                <UserItem key={user.id}>
                                    <Link
                                        to={`/admin/users/${user.id}`}
                                        style={{ color: "#1e90ff" }}
                                    >
                                        {user.username} - {user.email}
                                    </Link>
                                </UserItem>
                            ))
                        ) : (
                            <UserItem>
                                <p>등록된 사용자가 없습니다.</p>
                            </UserItem>
                        )}
                    </UserList>
                </Section>
            </Container>
            <Footer />
        </>
    );
};
