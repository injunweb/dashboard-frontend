import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { getUsers } from "../services/admin";
import Loading from "../components/Loading";
import { User, Mail, ExternalLink } from "lucide-react";

const AdminUserListPage = () => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["adminUsers"],
        queryFn: getUsers,
    });

    if (isLoading) return <Loading />;
    if (isError) return <ErrorMessage>에러: {error.message}</ErrorMessage>;

    const users = data?.users || [];

    return (
        <Container>
            <Header>
                <Title>사용자 관리</Title>
                <UserCount>{users.length} 사용자</UserCount>
            </Header>
            {users.length === 0 ? (
                <EmptyState>사용자가 없습니다.</EmptyState>
            ) : (
                <UserGrid>
                    {users.map((user) => (
                        <UserCard key={user.id}>
                            <UserAvatar>
                                {user.username[0].toUpperCase()}
                            </UserAvatar>
                            <UserInfo>
                                <Username>
                                    <User size={16} />
                                    {user.username}
                                </Username>
                                <UserEmail>
                                    <Mail size={16} />
                                    {user.email}
                                </UserEmail>
                            </UserInfo>
                            <DetailLink to={`/admin/users/${user.id}`}>
                                상세보기 <ExternalLink size={14} />
                            </DetailLink>
                        </UserCard>
                    ))}
                </UserGrid>
            )}
        </Container>
    );
};

const Container = styled.div`
    max-width: 1200px;
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
    color: #f0f0f0;
    font-weight: 600;
`;

const UserCount = styled.span`
    font-size: 14px;
    color: #ffffff;
    background-color: #333333;
    padding: 6px 12px;
    border-radius: 9999px;
`;

const UserGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
`;

const UserCard = styled.div`
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

const UserAvatar = styled.div`
    width: 64px;
    height: 64px;
    background-color: #333333;
    color: #ffffff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: bold;
    margin: 20px auto;
`;

const UserInfo = styled.div`
    padding: 0 20px 20px;
`;

const Username = styled.h2`
    font-size: 18px;
    color: #f0f0f0;
    margin: 0 0 10px;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const UserEmail = styled.p`
    font-size: 14px;
    color: #a0a0a0;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const DetailLink = styled(Link)`
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

const EmptyState = styled.div`
    text-align: center;
    padding: 48px;
    background-color: #111111;
    border-radius: 8px;
    color: #888888;
    font-size: 18px;
`;

const ErrorMessage = styled.div`
    color: #ff6b6b;
    background-color: rgba(239, 68, 68, 0.1);
    border: 1px solid #ff6b6b;
    border-radius: 8px;
    padding: 16px;
    margin-top: 16px;
    text-align: center;
`;

export default AdminUserListPage;
