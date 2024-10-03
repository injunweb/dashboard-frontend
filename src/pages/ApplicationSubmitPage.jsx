import React from "react";
import { useMutation } from "@tanstack/react-query";
import { submitApplication } from "../services/application.service";
import { useNavigate } from "react-router-dom";
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
    margin-bottom: 10px;
`;

const Subtitle = styled.h2`
    font-size: 20px;
    margin-bottom: 20px;
    color: #1e90ff;
`;

const Input = styled.input`
    display: block;
    margin: 10px 0;
    padding: 12px;
    width: 100%;
    max-width: 800px;
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

const Textarea = styled.textarea`
    display: block;
    margin: 10px 0;
    padding: 12px;
    width: 100%;
    max-width: 800px;
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
    margin-top: 10px;
    font-size: 16px;

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
    color: ${(props) => (props.success ? "green" : "red")};
`;

export const ApplicationSubmitPage = () => {
    const navigate = useNavigate();
    const mutation = useMutation({
        mutationFn: submitApplication,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const appData = Object.fromEntries(formData.entries());
        appData.port = parseInt(appData.port, 10);
        await mutation.mutateAsync(appData);
        navigate("/");
    };

    return (
        <>
            <Header />
            <Container>
                <Title>애플리케이션 제출하기</Title>
                <Subtitle>
                    새로운 애플리케이션을 등록하여 인준웹에 추가하세요!
                </Subtitle>
                <form onSubmit={handleSubmit}>
                    <Input
                        name="name"
                        type="text"
                        pattern="[a-z0-9\-]+"
                        placeholder="애플리케이션 이름 (영문 소문자, 숫자, - 사용가능)"
                        required
                    />
                    <Input
                        name="port"
                        type="number"
                        placeholder="애플리케이션 포트 (예: 3000)"
                        required
                    />
                    <Input
                        name="git_url"
                        type="url"
                        placeholder="Git URL (예: https://github.com/username/repo)"
                        required
                    />
                    <Input
                        name="branch"
                        type="text"
                        placeholder="Git 브랜치 (예: main, dev)"
                        required
                    />
                    <Textarea
                        name="description"
                        placeholder="설명 (애플리케이션에 대한 간단한 설명)"
                        required
                    />
                    <Button type="submit">제출</Button>
                </form>
                {mutation.isLoading && <Message>제출 중...</Message>}
                {mutation.isError && (
                    <Message>{`오류: ${mutation.error.message}`}</Message>
                )}
                {mutation.isSuccess && (
                    <Message success>
                        애플리케이션이 성공적으로 제출되었습니다!
                    </Message>
                )}
            </Container>
            <Footer />
        </>
    );
};
