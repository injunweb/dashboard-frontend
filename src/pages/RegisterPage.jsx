import React from "react";
import { useMutation } from "@tanstack/react-query";
import { register } from "../services/auth.service";
import { Link, useNavigate } from "react-router-dom";
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

const LoginLink = styled.p`
    margin-top: 10px;
`;

export const RegisterPage = () => {
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: register,
        onSuccess: () => {
            navigate("/login");
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const userData = Object.fromEntries(formData.entries());

        mutation.mutate(userData);
    };

    return (
        <>
            <Header />
            <Container>
                <Title>회원가입</Title>
                <Subtitle>인준웹에 오신 것을 환영합니다!</Subtitle>
                <Form onSubmit={handleSubmit}>
                    <Input name="username" placeholder="이름" required />
                    <Input name="email" placeholder="이메일" required />
                    <Input
                        name="password"
                        type="password"
                        placeholder="비밀번호"
                        required
                    />
                    <Button type="submit" disabled={mutation.isLoading}>
                        회원가입
                    </Button>
                </Form>
                {mutation.isLoading && <Message>등록 중...</Message>}
                {mutation.isError && (
                    <Message error>오류: {mutation.error.message}</Message>
                )}
                {mutation.isSuccess && <Message>회원가입 성공!</Message>}
                <LoginLink>
                    이미 계정이 있으신가요?{" "}
                    <Link to="/login" style={{ color: "#1e90ff" }}>
                        로그인
                    </Link>
                </LoginLink>
            </Container>
            <Footer />
        </>
    );
};
