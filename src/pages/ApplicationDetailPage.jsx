import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getApplication } from "../services/application.service";
import {
    getEnvironments,
    updateEnvironment,
} from "../services/environment.service";
import styled from "styled-components";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Loading } from "../components/Loading";

const Container = styled.div`
    padding: 40px 20px;
    background-color: var(--dark, #0a0a0a);
    color: white;
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
    color: #1e90ff;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 10px;
`;

const Message = styled.p`
    margin: 15px 0;
    padding: 10px 15px;
    border-radius: 10px;
    font-size: 16px;
    animation: slideUp 0.5s ease-out;

    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

const ErrorMessage = styled(Message)`
    background-color: rgba(255, 0, 0, 0.1);
    color: #ff4444;
`;

const SuccessMessage = styled(Message)`
    background-color: rgba(0, 255, 0, 0.1);
    color: #00ff00;
`;

const EnvironmentList = styled.ul`
    list-style: none;
    padding: 0;
`;

const EnvironmentItem = styled.li`
    display: flex;
    align-items: center;
    background-color: rgba(44, 44, 46, 0.6);
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 15px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: transform 0.3s;

    &:hover {
        transform: translateX(5px);
    }
`;

const Input = styled.input`
    padding: 10px 15px;
    margin-right: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    background-color: rgba(28, 28, 30, 0.8);
    color: white;
    font-size: 16px;
    transition: border-color 0.3s;

    &:focus {
        outline: none;
        border-color: #1e90ff;
    }
`;

const Button = styled.button`
    background: linear-gradient(135deg, #1e90ff, #ff007f);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 30px;
    cursor: pointer;
    font-size: 14px;
    transition: transform 0.3s, box-shadow 0.3s;
    margin-right: 10px;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 10px rgba(30, 144, 255, 0.3);
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;

const IconButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px;
    margin-left: 10px;
    color: #ffffff;
    transition: color 0.3s;

    &:hover {
        color: #1e90ff;
    }

    &:focus {
        outline: none;
    }
`;

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
        refetch,
    } = useQuery({
        queryKey: ["applicationEnvironments", appId],
        queryFn: () => getEnvironments(appId),
    });

    const [environments, setEnvironments] = useState([]);
    const [newEnvKey, setNewEnvKey] = useState("");
    const [newEnvValue, setNewEnvValue] = useState("");
    const [visibleFields, setVisibleFields] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const updateEnvironmentsMutation = useMutation({
        mutationFn: (updatedEnvs) => updateEnvironment(appId, updatedEnvs),
        onSuccess: () => {
            refetch();
            setNewEnvKey("");
            setNewEnvValue("");
            setSuccessMessage("환경 변수가 성공적으로 업데이트되었습니다.");
            setErrorMessage("");
            setTimeout(() => setSuccessMessage(""), 3000);
        },
        onError: (error) => {
            setErrorMessage(
                error.response?.data?.error || "환경 변수 업데이트 실패"
            );
            setSuccessMessage("");
            setTimeout(() => setErrorMessage(""), 3000);
        },
    });

    useEffect(() => {
        if (environmentsData?.data?.environments) {
            setEnvironments(environmentsData.data.environments);
        }
    }, [environmentsData]);

    if (appLoading || envLoading) return <Loading />;
    if (appError || envError || !applicationData?.data) {
        return (
            <Container>
                <Title>Application Not Found</Title>
            </Container>
        );
    }

    const application = applicationData.data;

    const handleInputChange = (key, value) => {
        setEnvironments((prev) =>
            prev.map((env) => (env.key === key ? { ...env, value } : env))
        );
    };

    const handleDeleteEnv = (key) => {
        setEnvironments((prev) => prev.filter((env) => env.key !== key));
    };

    const handleAddEnv = () => {
        if (newEnvKey && newEnvValue) {
            const existingEnv = environments.find(
                (env) => env.key === newEnvKey
            );
            if (existingEnv) {
                setErrorMessage("키가 이미 존재합니다. 다른 키를 선택하세요.");
                setTimeout(() => setErrorMessage(""), 3000);
                return;
            }
            setEnvironments((prev) => [
                ...prev,
                { key: newEnvKey, value: newEnvValue },
            ]);
            setNewEnvKey("");
            setNewEnvValue("");
            setErrorMessage("");
        }
    };

    const handleUpdate = () => {
        const updatedEnvs = {
            environments: environments.filter(({ value }) => value !== null),
        };

        if (newEnvKey && newEnvValue) {
            const existingEnv = environments.find(
                (env) => env.key === newEnvKey
            );
            if (!existingEnv) {
                updatedEnvs.environments.push({
                    key: newEnvKey,
                    value: newEnvValue,
                });
            }
        }

        updateEnvironmentsMutation.mutate(updatedEnvs);
        setNewEnvKey("");
        setNewEnvValue("");
    };

    const toggleVisibility = (key) => {
        setVisibleFields((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <>
            <Header />
            <Container>
                <ContentWrapper>
                    <Section>
                        <Title>{application.name}</Title>
                        <SectionTitle>Application Details</SectionTitle>
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
                            <strong>Description:</strong>{" "}
                            {application.description}
                        </p>
                    </Section>

                    <Section>
                        <SectionTitle>Environments</SectionTitle>
                        {errorMessage && (
                            <ErrorMessage>{errorMessage}</ErrorMessage>
                        )}
                        {successMessage && (
                            <SuccessMessage>{successMessage}</SuccessMessage>
                        )}
                        {environments.length > 0 ? (
                            <EnvironmentList>
                                {environments.map((env) => (
                                    <EnvironmentItem key={env.key}>
                                        <Input
                                            type="text"
                                            value={env.key}
                                            readOnly
                                            placeholder="환경 변수 키"
                                        />
                                        <Input
                                            type={
                                                visibleFields[env.key]
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={env.value}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    env.key,
                                                    e.target.value
                                                )
                                            }
                                            placeholder="환경 변수 값"
                                        />
                                        <IconButton
                                            onClick={() =>
                                                toggleVisibility(env.key)
                                            }
                                        >
                                            {visibleFields[env.key] ? (
                                                <svg
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                            )}
                                        </IconButton>
                                        <IconButton
                                            onClick={() =>
                                                handleDeleteEnv(env.key)
                                            }
                                        >
                                            <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                        </IconButton>
                                    </EnvironmentItem>
                                ))}
                            </EnvironmentList>
                        ) : (
                            <p>
                                이 애플리케이션에 사용할 환경 변수가 없습니다.
                            </p>
                        )}

                        <div
                            style={{ marginBottom: "20px", marginTop: "30px" }}
                        >
                            <Input
                                type="text"
                                placeholder="새 키 (예: API_KEY)"
                                value={newEnvKey}
                                onChange={(e) => setNewEnvKey(e.target.value)}
                            />
                            <Input
                                type="text"
                                placeholder="새 값 (예: 12345)"
                                value={newEnvValue}
                                onChange={(e) => setNewEnvValue(e.target.value)}
                            />
                            <Button onClick={handleAddEnv}>Add</Button>
                        </div>

                        <Button
                            onClick={handleUpdate}
                            disabled={updateEnvironmentsMutation.isLoading}
                        >
                            {updateEnvironmentsMutation.isLoading
                                ? "Updating..."
                                : "Save"}
                        </Button>
                        <Button
                            onClick={() =>
                                setEnvironments(
                                    environmentsData?.data?.environments || []
                                )
                            }
                        >
                            Cancel
                        </Button>
                    </Section>
                </ContentWrapper>
            </Container>
            <Footer />
        </>
    );
};
