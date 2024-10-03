import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getApplication, approveApplication } from "../services/admin.service";
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

const Button = styled.button`
    background: linear-gradient(
        135deg,
        rgba(255, 0, 127, 0.6),
        rgba(26, 0, 255, 0.6)
    );
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 3px;
    cursor: pointer;
    margin-top: 10px;

    &:hover {
        background: linear-gradient(
            135deg,
            rgba(255, 0, 127, 0.8),
            rgba(26, 0, 255, 0.8)
        );
    }
`;

const InfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    padding: 15px;
    border-radius: 3px;
    background-color: #1c1c1e;
    border: 1px solid #333;
`;

const InfoTitle = styled.h2`
    font-size: 20px;
    margin-bottom: 10px;
    border-bottom: 1px solid #333;
    padding-bottom: 5px;
`;

const InfoText = styled.p`
    font-size: 16px;
    margin: 5px 0;
`;

const ErrorMessage = styled.p`
    color: red;
`;

const SuccessMessage = styled.p`
    color: green;
`;

export const AdminApplicationDetailPage = () => {
    const { appId } = useParams();
    const { data, error, isLoading, refetch } = useQuery({
        queryKey: ["application", appId],
        queryFn: () => getApplication(appId),
    });

    const mutation = useMutation({
        mutationFn: () => approveApplication(appId),
        onSuccess: refetch,
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <ErrorMessage>Error: {error.message}</ErrorMessage>;

    const application = data?.data;

    return (
        <>
            <Header />
            <Container>
                <Title>Application 상세 정보</Title>
                <InfoContainer>
                    <InfoTitle>Application 정보</InfoTitle>
                    <InfoText>
                        <strong>ID:</strong> {application.id}
                    </InfoText>
                    <InfoText>
                        <strong>이름:</strong> {application.name}
                    </InfoText>
                    <InfoText>
                        <strong>Git URL:</strong> {application.git_url}
                    </InfoText>
                    <InfoText>
                        <strong>브랜치:</strong> {application.branch}
                    </InfoText>
                    <InfoText>
                        <strong>포트:</strong> {application.port}
                    </InfoText>
                    <InfoText>
                        <strong>설명:</strong> {application.description}
                    </InfoText>
                    <InfoText>
                        <strong>소유자 ID:</strong> {application.owner_id}
                    </InfoText>
                    <InfoText>
                        <strong>상태:</strong> {application.status}
                    </InfoText>
                </InfoContainer>
                {application.status === "Pending" && (
                    <Button onClick={() => mutation.mutate()}>승인하기</Button>
                )}
                {mutation.isLoading && <p>승인 중...</p>}
                {mutation.isError && (
                    <ErrorMessage>오류: {mutation.error.message}</ErrorMessage>
                )}
                {mutation.isSuccess && (
                    <SuccessMessage>
                        application이 성공적으로 승인되었습니다!
                    </SuccessMessage>
                )}
            </Container>
            <Footer />
        </>
    );
};
