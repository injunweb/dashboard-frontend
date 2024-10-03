import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getUser, updateUser } from "../services/user.service";
import { getApplications } from "../services/application.service";
import { Link } from "react-router-dom";
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

const Subtitle = styled.h2`
    font-size: 20px;
    margin-bottom: 20px;
    color: #1e90ff;
`;

const Section = styled.div`
    margin-bottom: 20px;
    padding: 15px;
    background-color: #1c1c1e;
    border-radius: 3px;
    border: 1px solid #333;
`;

const Input = styled.input`
    display: block;
    margin: 10px 0;
    padding: 10px;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 3px;
    background-color: #2c2c2e;
    color: white;

    &:focus {
        outline: none;
        border-color: #1e90ff;
    }
`;

const Button = styled.button`
    padding: 2px 4px;
    margin-top: 10px;
    margin-right: 10px;
    background: linear-gradient(
        135deg,
        rgba(255, 0, 127, 0.6),
        rgba(26, 0, 255, 0.6)
    );
    color: white;
    border: none;
    border-radius: 2px;
    font-size: 12px;
    cursor: pointer;

    &:hover {
        background: linear-gradient(
            135deg,
            rgba(255, 0, 127, 0.8),
            rgba(26, 0, 255, 0.8)
        );
    }
`;

const ApplicationList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 20px 0;
`;

const ApplicationItem = styled.li`
    margin: 10px 0;
    padding: 10px;
    background-color: #3a3a3c;
    border-radius: 3px;
    border: 1px solid #333;
    cursor: pointer;

    &:hover {
        background-color: #444;
    }
`;

export const HomePage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const {
        data: user,
        isLoading: isUserLoading,
        refetch,
    } = useQuery({
        queryKey: ["user"],
        queryFn: getUser,
    });
    const {
        data: applications,
        error: appError,
        isLoading: isAppLoading,
    } = useQuery({
        queryKey: ["userApplications"],
        queryFn: getApplications,
        enabled: !!user,
    });

    const updateUserMutation = useMutation({
        mutationFn: updateUser,
        onSuccess: refetch,
    });

    const handleUpdate = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedInfo = Object.fromEntries(formData.entries());
        updateUserMutation.mutate(updatedInfo);
        setIsEditing(false);
    };

    if (isUserLoading || isAppLoading) return <div>Loading...</div>;
    if (appError)
        return <div>Error loading applications: {appError.message}</div>;

    return (
        <>
            <Header />
            <Container>
                <Section>
                    <Title>홈페이지에 오신 것을 환영합니다!</Title>
                    <Subtitle>
                        인준웹에서 당신의 애플리케이션을 관리하세요.
                    </Subtitle>
                    <p>
                        현재 사용자: {user?.data?.username} -{" "}
                        {user?.data?.email}
                    </p>
                    {isEditing ? (
                        <form onSubmit={handleUpdate}>
                            <Input
                                name="username"
                                defaultValue={user?.data?.username}
                                required
                            />
                            <Input
                                name="email"
                                defaultValue={user?.data?.email}
                                required
                            />
                            <Button type="submit">정보 수정</Button>
                            <Button
                                type="button"
                                onClick={() => setIsEditing(false)}
                            >
                                취소
                            </Button>
                        </form>
                    ) : (
                        <Button onClick={() => setIsEditing(true)}>
                            내 정보 수정
                        </Button>
                    )}
                </Section>

                <Section>
                    <h2>내 애플리케이션</h2>
                    <Link to="/applications" style={{ color: "#1e90ff" }}>
                        새로운 애플리케이션 신청하기
                    </Link>
                    {!applications?.data?.applications?.length ? (
                        <p>등록된 애플리케이션이 없습니다.</p>
                    ) : (
                        <ApplicationList>
                            {applications?.data?.applications?.map((app) => (
                                <ApplicationItem
                                    key={app.id}
                                    onClick={() => {
                                        if (app.status === "Approved") {
                                            window.location.href = `/applications/${app.id}`;
                                        }
                                    }}
                                >
                                    {app.name} - {app.status}
                                </ApplicationItem>
                            ))}
                        </ApplicationList>
                    )}
                </Section>
            </Container>
            <Footer />
        </>
    );
};
