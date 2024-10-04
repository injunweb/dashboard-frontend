import React from "react";
import { useMutation } from "@tanstack/react-query";
import { submitApplication } from "../services/application.service";
import { useNavigate } from "react-router-dom";
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
    max-width: 800px;
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
    margin-bottom: 10px;
    background: linear-gradient(135deg, #1e90ff, #ff007f);
    -webkit-background-clip: text;
    color: transparent;
`;

const Subtitle = styled.h2`
    font-size: 1.5rem;
    margin-bottom: 30px;
    color: #1e90ff;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const InputWrapper = styled.div`
    position: relative;
`;

const Input = styled.input`
    display: block;
    width: 100%;
    padding: 15px;
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

const Textarea = styled.textarea`
    display: block;
    width: 100%;
    padding: 15px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    background-color: rgba(44, 44, 46, 0.8);
    color: white;
    font-size: 16px;
    min-height: 150px;
    resize: vertical;
    transition: border-color 0.3s, transform 0.3s;

    &:focus {
        outline: none;
        border-color: #1e90ff;
        transform: translateY(-2px);
    }
`;

const Button = styled.button`
    background: linear-gradient(135deg, #1e90ff, #ff007f);
    color: white;
    border: none;
    padding: 15px 30px;
    border-radius: 30px;
    cursor: pointer;
    font-size: 18px;
    transition: transform 0.3s, box-shadow 0.3s;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 20px rgba(30, 144, 255, 0.3);
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;

const Message = styled.p`
    margin: 20px 0;
    padding: 15px;
    border-radius: 10px;
    text-align: center;
    font-size: 16px;
    background-color: ${(props) =>
        props.success ? "rgba(0, 255, 0, 0.1)" : "rgba(255, 0, 0, 0.1)"};
    color: ${(props) => (props.success ? "#00ff00" : "#ff4444")};
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

export const ApplicationSubmitPage = () => {
    const navigate = useNavigate();
    const mutation = useMutation({
        mutationFn: submitApplication,
        onSuccess: () => {
            setTimeout(() => navigate("/"), 2000);
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const appData = Object.fromEntries(formData.entries());
        appData.port = parseInt(appData.port, 10);
        await mutation.mutateAsync(appData);
    };

    return (
        <>
            <Header />
            <Container>
                <ContentWrapper>
                    <Title>애플리케이션 제출하기</Title>
                    <Subtitle>
                        새로운 애플리케이션을 등록하여 인준웹에 추가하세요!
                    </Subtitle>
                    <Form onSubmit={handleSubmit}>
                        <InputWrapper>
                            <Input
                                name="name"
                                type="text"
                                pattern="[a-z0-9\-]+"
                                placeholder="애플리케이션 이름 (영문 소문자, 숫자, - 사용가능)"
                                required
                            />
                        </InputWrapper>
                        <InputWrapper>
                            <Input
                                name="port"
                                type="number"
                                placeholder="애플리케이션 포트 (예: 3000)"
                                required
                            />
                        </InputWrapper>
                        <InputWrapper>
                            <Input
                                name="git_url"
                                type="url"
                                placeholder="Git URL (예: https://github.com/username/repo)"
                                required
                            />
                        </InputWrapper>
                        <InputWrapper>
                            <Input
                                name="branch"
                                type="text"
                                placeholder="Git 브랜치 (예: main, dev)"
                                required
                            />
                        </InputWrapper>
                        <InputWrapper>
                            <Textarea
                                name="description"
                                placeholder="설명 (애플리케이션에 대한 간단한 설명)"
                                required
                            />
                        </InputWrapper>
                        <Button type="submit" disabled={mutation.isLoading}>
                            {mutation.isLoading ? "제출 중..." : "제출"}
                        </Button>
                    </Form>
                    {mutation.isError && (
                        <Message>{`오류: ${mutation.error.message}`}</Message>
                    )}
                    {mutation.isSuccess && (
                        <Message success>
                            애플리케이션이 성공적으로 제출되었습니다! 홈페이지로
                            이동합니다.
                        </Message>
                    )}
                </ContentWrapper>
            </Container>
            <Footer />
        </>
    );
};
