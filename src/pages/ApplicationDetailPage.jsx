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

const ErrorMessage = styled.p`
    color: red;
`;

const SuccessMessage = styled.p`
    color: green;
`;

const EnvironmentList = styled.ul`
    list-style: none;
    padding: 0;
`;

const EnvironmentItem = styled.li`
    display: flex;
    align-items: center;
    background-color: #2c2c2e;
    padding: 10px;
    border-radius: 3px;
    margin-bottom: 10px;
    border: 1px solid #333;
`;

const KeyInput = styled.input`
    margin-right: 10px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 3px;
    background-color: #1c1c1e;
    color: white;
`;

const ValueInput = styled.input`
    margin-right: 10px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 3px;
    background-color: #1c1c1e;
    color: white;
`;

const Button = styled.button`
    background: linear-gradient(
        135deg,
        rgba(255, 0, 127, 0.6),
        rgba(26, 0, 255, 0.6)
    );
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
    margin-right: 10px;

    &:hover {
        background: linear-gradient(
            135deg,
            rgba(255, 0, 127, 0.8),
            rgba(26, 0, 255, 0.8)
        );
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
                        <strong>Description:</strong> {application.description}
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
                                    <KeyInput
                                        type="text"
                                        value={env.key}
                                        readOnly
                                        placeholder="환경 변수 키"
                                    />
                                    <ValueInput
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
                                        onClick={() => handleDeleteEnv(env.key)}
                                    >
                                        Delete
                                    </Button>
                                </EnvironmentItem>
                            ))}
                        </EnvironmentList>
                    ) : (
                        <p>이 애플리케이션에 사용할 환경 변수가 없습니다.</p>
                    )}

                    <div style={{ marginBottom: "20px" }}>
                        <KeyInput
                            type="text"
                            placeholder="새 키 (예: API_KEY)"
                            value={newEnvKey}
                            onChange={(e) => setNewEnvKey(e.target.value)}
                        />
                        <ValueInput
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
            </Container>
            <Footer />
        </>
    );
};
