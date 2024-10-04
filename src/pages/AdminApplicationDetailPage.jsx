import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getApplication, approveApplication } from "../services/admin.service";
import styled from "styled-components";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

const Container = styled.div`
    padding: 40px 20px;
    background-color: var(--dark, #0a0a0a);
    color: #e0e0e0;
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

const Button = styled.button`
    background: linear-gradient(135deg, #1e90ff, #ff007f);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 30px;
    cursor: pointer;
    font-size: 1rem;
    transition: transform 0.3s, box-shadow 0.3s;
    margin-top: 20px;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 20px rgba(30, 144, 255, 0.3);
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;

const InfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 30px;
    padding: 30px;
    border-radius: 15px;
    background-color: rgba(28, 28, 30, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    transition: transform 0.3s, box-shadow 0.3s;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }
`;

const InfoTitle = styled.h2`
    font-size: 1.8rem;
    margin-bottom: 20px;
    color: #40a9ff;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 10px;
`;

const InfoText = styled.p`
    font-size: 1.1rem;
    margin: 10px 0;
    line-height: 1.6;

    strong {
        color: #40a9ff;
        margin-right: 10px;
    }
`;

const Message = styled.p`
    margin: 15px 0;
    padding: 15px;
    border-radius: 10px;
    font-size: 1.1rem;
    text-align: center;
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
    background-color: rgba(255, 68, 68, 0.1);
    color: #ff6b6b;
`;

const SuccessMessage = styled(Message)`
    background-color: rgba(0, 255, 0, 0.1);
    color: #00ff00;
`;

const LoadingMessage = styled.div`
    text-align: center;
    font-size: 1.2rem;
    color: #40a9ff;
    margin-top: 50px;
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

    if (isLoading) return <LoadingMessage>Loading...</LoadingMessage>;
    if (error) return <ErrorMessage>Error: {error.message}</ErrorMessage>;

    const application = data?.data;

    return (
        <>
            <Header />
            <Container>
                <ContentWrapper>
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
                        <Button
                            onClick={() => mutation.mutate()}
                            disabled={mutation.isLoading}
                        >
                            {mutation.isLoading ? "승인 중..." : "승인하기"}
                        </Button>
                    )}
                    {mutation.isError && (
                        <ErrorMessage>
                            오류: {mutation.error.message}
                        </ErrorMessage>
                    )}
                    {mutation.isSuccess && (
                        <SuccessMessage>
                            application이 성공적으로 승인되었습니다!
                        </SuccessMessage>
                    )}
                </ContentWrapper>
            </Container>
            <Footer />
        </>
    );
};
