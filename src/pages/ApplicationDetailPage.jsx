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

    if (appLoading || envLoading) return <div>Loading...</div>;
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
                                        <Button
                                            onClick={() =>
                                                toggleVisibility(env.key)
                                            }
                                        >
                                            {visibleFields[env.key]
                                                ? "Hide"
                                                : "Show"}
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                handleDeleteEnv(env.key)
                                            }
                                        >
                                            Delete
                                        </Button>
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
