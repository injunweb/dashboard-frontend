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
    height: 100vh;
    background-color: #000;
    color: white;
    padding: 20px;
`;

const Title = styled.h1`
    font-size: 32px;
    margin-bottom: 10px;
`;

const Subtitle = styled.h2`
    font-size: 20px;
    margin-bottom: 30px;
    color: #1e90ff;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 400px;
    margin-bottom: 20px;
`;

const Input = styled.input`
    padding: 15px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #2c2c2e;
    color: white;
    font-size: 16px;

    &:focus {
        outline: none;
        border-color: #1e90ff;
    }
`;

const Button = styled.button`
    padding: 10px 20px;
    margin-top: 10px;
    background: linear-gradient(
        135deg,
        rgba(255, 0, 127, 0.6),
        rgba(26, 0, 255, 0.6)
    );
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;

    &:hover {
        background: linear-gradient(
            135deg,
            rgba(255, 0, 127, 0.8),
            rgba(26, 0, 255, 0.8)
        );
    }
`;

const Message = styled.p`
    margin: 10px 0;
    color: ${(props) => (props.error ? "red" : "green")};
`;

const RegisterLink = styled.p`
    margin-top: 10px;
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
                <Title>인준웹에 로그인하세요</Title>
                <Subtitle>당신의 애플리케이션 관리의 시작입니다!</Subtitle>
                <Form onSubmit={handleSubmit}>
                    <Input
                        name="username"
                        type="text"
                        placeholder="아이디"
                        required
                    />
                    <Input
                        name="password"
                        type="password"
                        placeholder="비밀번호"
                        required
                    />
                    <Button type="submit">로그인</Button>
                </Form>
                {mutation.isLoading && <Message>로그인 중...</Message>}
                {mutation.isError && (
                    <Message error>오류: {mutation.error.message}</Message>
                )}
                <RegisterLink>
                    계정이 없으신가요?{" "}
                    <Link to="/register" style={{ color: "#1e90ff" }}>
                        회원가입
                    </Link>
                </RegisterLink>
            </Container>
            <Footer />
        </>
    );
};
