import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUser, updateUser } from "../services/user.service";
import {
    getApplications,
    deleteApplication,
} from "../services/application.service";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Header } from "../components/Header";
import { SubscriptionPrompt } from "../components/SubscriptionPrompt";
import { Footer } from "../components/Footer";
import { Loading } from "../components/Loading";
import { toast } from "react-toastify";

const Container = styled.div`
    padding: 40px 20px;
    background-color: var(--dark, #0a0a0a);
    color: white;
    min-height: calc(100vh - 60px);
`;

const ContentWrapper = styled.div`
    max-width: 1200px;
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

const Subtitle = styled.h2`
    font-size: 1.5rem;
    margin-bottom: 30px;
    color: #1e90ff;
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

const Input = styled.input`
    display: block;
    margin: 15px 0;
    padding: 15px;
    width: 100%;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    background-color: rgba(44, 44, 46, 0.8);
    color: white;
    font-size: 16px;
    transition: border-color 0.3s, transform 0.3s;

    &:focus {
        outline: none;
        border-color: #1e90ff;
        transform: translateY(-2px);
    }
`;

const Button = styled.button`
    padding: 10px 20px;
    margin-top: 15px;
    margin-right: 15px;
    background: linear-gradient(135deg, #1e90ff, #ff007f);
    color: white;
    border: none;
    border-radius: 30px;
    font-size: 16px;
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 20px rgba(30, 144, 255, 0.3);
    }
`;

const ApplicationList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 20px 0;
`;

const ApplicationItem = styled.li`
    margin: 15px 0;
    padding: 20px;
    background-color: rgba(58, 58, 60, 0.6);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    cursor: pointer;
    transition: background-color 0.3s, transform 0.3s;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:hover {
        background-color: rgba(68, 68, 70, 0.8);
        transform: translateY(-3px);
    }
`;

const StyledLink = styled(Link)`
    color: #1e90ff;
    text-decoration: none;
    position: relative;

    &:after {
        content: "";
        position: absolute;
        width: 100%;
        height: 1px;
        bottom: -2px;
        left: 0;
        background: linear-gradient(135deg, #1e90ff, #ff007f);
        transform: scaleX(0);
        transition: transform 0.3s;
    }

    &:hover:after {
        transform: scaleX(1);
    }
`;

const MoreButton = styled.button`
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    padding: 5px 10px;
    border-radius: 5px;
    transition: background-color 0.3s;

    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }
`;

const DropdownMenu = styled.div`
    position: absolute;
    right: 0;
    top: 100%;
    background-color: rgba(51, 51, 51, 0.9);
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    display: ${(props) => (props.$isOpen ? "flex" : "none")};
    z-index: 10;
`;

const DropdownItem = styled.div`
    padding: 10px 20px;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }
`;

const DropdownContainer = styled.div`
    position: relative;
`;

const LoadingOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(5px);
`;

const LoadingSpinner = styled.div`
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid #1e90ff;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`;

export const HomePage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const queryClient = useQueryClient();

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

    const deleteApplicationMutation = useMutation({
        mutationFn: deleteApplication,
        onMutate: async (appId) => {
            await queryClient.cancelQueries(["userApplications"]);
            const previousApps = queryClient.getQueryData(["userApplications"]);
            queryClient.setQueryData(["userApplications"], (old) => ({
                ...old,
                data: {
                    ...old.data,
                    applications: old.data.applications.filter(
                        (app) => app.id !== appId
                    ),
                },
            }));
            return { previousApps };
        },
        onError: (err, appId, context) => {
            queryClient.setQueryData(
                ["userApplications"],
                context.previousApps
            );
            toast.error("애플리케이션 삭제에 실패했습니다. 다시 시도해주세요.");
        },
        onSettled: () => {
            queryClient.invalidateQueries(["userApplications"]);
            setIsDeleting(false);
        },
    });

    const handleUpdate = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedInfo = Object.fromEntries(formData.entries());
        updateUserMutation.mutate(updatedInfo);
        setIsEditing(false);
    };

    const handleDelete = async (appId) => {
        if (
            window.confirm(
                "정말로 이 애플리케이션을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
            )
        ) {
            setIsDeleting(true);
            deleteApplicationMutation.mutate(appId);
        }
        setOpenMenuId(null);
    };

    const toggleMenu = (id) => {
        setOpenMenuId(openMenuId === id ? null : id);
    };

    if (isUserLoading || isAppLoading) return <Loading />;
    if (appError)
        return (
            <div>
                애플리케이션을 불러오는 중 오류가 발생했습니다:{" "}
                {appError.message}
            </div>
        );

    return (
        <>
            <Header />
            <SubscriptionPrompt />
            <Container>
                <ContentWrapper>
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
                                    autoComplete="off"
                                    required
                                />
                                <Input
                                    name="email"
                                    defaultValue={user?.data?.email}
                                    autoComplete="off"
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
                        <StyledLink to="/applications">
                            새로운 애플리케이션 신청하기
                        </StyledLink>
                        {!applications?.data?.applications?.length ? (
                            <p>등록된 애플리케이션이 없습니다.</p>
                        ) : (
                            <ApplicationList>
                                {applications?.data?.applications?.map(
                                    (app) => (
                                        <ApplicationItem key={app.id}>
                                            <span
                                                onClick={() => {
                                                    if (
                                                        app.status ===
                                                        "Approved"
                                                    ) {
                                                        window.location.href = `/applications/${app.id}`;
                                                    }
                                                }}
                                            >
                                                {app.name} - {app.status}
                                            </span>
                                            <DropdownContainer>
                                                <MoreButton
                                                    onClick={() =>
                                                        toggleMenu(app.id)
                                                    }
                                                >
                                                    ⋮
                                                </MoreButton>
                                                <DropdownMenu
                                                    $isOpen={
                                                        openMenuId === app.id
                                                    }
                                                >
                                                    <DropdownItem
                                                        onClick={() =>
                                                            handleDelete(app.id)
                                                        }
                                                    >
                                                        삭제
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </DropdownContainer>
                                        </ApplicationItem>
                                    )
                                )}
                            </ApplicationList>
                        )}
                    </Section>
                </ContentWrapper>
            </Container>
            <Footer />
            {isDeleting && (
                <LoadingOverlay>
                    <LoadingSpinner />
                </LoadingOverlay>
            )}
        </>
    );
};
