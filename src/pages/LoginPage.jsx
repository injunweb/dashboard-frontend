import React from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "../services/auth.service";
import { setAuthToken } from "../utils/auth";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: var(--dark, #0a0a0a);
    color: white;
    padding: 20px;
    position: relative;
    overflow: hidden;
`;

const FloatingElements = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
    z-index: 0;
`;

const FloatingElement = styled.div`
    position: absolute;
    background: linear-gradient(135deg, #1e90ff, #ff007f);
    border-radius: 50%;
    opacity: 0.1;
    animation: float 20s infinite;

    @keyframes float {
        0%,
        100% {
            transform: translate(0, 0);
        }
        25% {
            transform: translate(100px, 100px);
        }
        50% {
            transform: translate(0, 200px);
        }
        75% {
            transform: translate(-100px, 100px);
        }
    }
`;

const ContentWrapper = styled.div`
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 400px;
    animation: slideUp 1s ease-out;

    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

const Title = styled.h1`
    font-size: 2.5rem;
    margin-bottom: 10px;
    background: linear-gradient(135deg, #1e90ff, #ff007f);
    -webkit-background-clip: text;
    color: transparent;
    text-align: center;
`;

const Subtitle = styled.h2`
    font-size: 1.25rem;
    margin-bottom: 30px;
    color: #1e90ff;
    text-align: center;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 15px;
    margin-bottom: 20px;
`;

const Input = styled.input`
    padding: 15px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    background-color: rgba(28, 28, 30, 0.6);
    color: white;
    font-size: 16px;
    backdrop-filter: blur(10px);
    transition: border-color 0.3s, transform 0.3s;

    &:focus {
        outline: none;
        border-color: #1e90ff;
        transform: translateY(-2px);
    }
`;

const Button = styled.button`
    padding: 15px 20px;
    margin-top: 10px;
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

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;

const Message = styled.p`
    margin: 10px 0;
    text-align: center;
    color: ${(props) => (props.error ? "#ff4444" : "#1e90ff")};
    animation: slideUp 0.5s ease-out;
`;

const RegisterLink = styled.p`
    margin-top: 20px;
    text-align: center;

    a {
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
    }
`;

export const LoginPage = () => {
    const mutation = useMutation({
        mutationFn: login,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const credentials = Object.fromEntries(formData.entries());
        const response = await mutation.mutateAsync(credentials);
        setAuthToken(response.data.token);
        window.location.href = "/";
    };

    return (
        <>
            <Header />
            <Container>
                <FloatingElements>
                    <FloatingElement
                        style={{
                            width: "300px",
                            height: "300px",
                            top: "10%",
                            left: "10%",
                        }}
                    />
                    <FloatingElement
                        style={{
                            width: "200px",
                            height: "200px",
                            top: "60%",
                            left: "70%",
                        }}
                    />
                    <FloatingElement
                        style={{
                            width: "150px",
                            height: "150px",
                            top: "30%",
                            left: "80%",
                        }}
                    />
                </FloatingElements>
                <ContentWrapper>
                    <Title>인준웹에 로그인하세요</Title>
                    <Subtitle>당신의 애플리케이션 관리의 시작입니다!</Subtitle>
                    <Form onSubmit={handleSubmit}>
                        <Input
                            name="username"
                            type="text"
                            placeholder="아이디"
                            autoComplete="off"
                            required
                        />
                        <Input
                            name="password"
                            type="password"
                            placeholder="비밀번호"
                            required
                        />
                        <Button type="submit" disabled={mutation.isLoading}>
                            로그인
                        </Button>
                    </Form>
                    {mutation.isLoading && <Message>로그인 중...</Message>}
                    {mutation.isError && (
                        <Message error>오류: {mutation.error.message}</Message>
                    )}
                    <RegisterLink>
                        계정이 없으신가요? <Link to="/register">회원가입</Link>
                    </RegisterLink>
                </ContentWrapper>
            </Container>
            <Footer />
        </>
    );
};
