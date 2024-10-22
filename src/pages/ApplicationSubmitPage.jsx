import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { submitApplication } from "../services/application";
import { Loader, Save } from "lucide-react";

const ApplicationSubmitPage = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState(null);

    const submitMutation = useMutation({
        mutationFn: submitApplication,
        onSuccess: () => {
            setMessage({
                type: "success",
                text: "애플리케이션이 성공적으로 제출되었습니다.",
            });
            setTimeout(() => navigate("/"), 2000);
        },
        onError: (error) => {
            setMessage({
                type: "error",
                text: error.message || "애플리케이션 제출에 실패했습니다.",
            });
        },
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const applicationData = Object.fromEntries(formData.entries());
        submitMutation.mutate(applicationData);
    };

    return (
        <Container>
            <ContentWrapper>
                <Title>애플리케이션 제출하기</Title>
                {message && (
                    <Message type={message.type}>{message.text}</Message>
                )}
                <Form onSubmit={handleSubmit}>
                    <InputGroup>
                        <Label htmlFor="name">애플리케이션 이름</Label>
                        <Input
                            id="name"
                            name="name"
                            required
                            placeholder="영문 소문자, 숫자, - 사용가능"
                        />
                    </InputGroup>
                    <InputGroup>
                        <Label htmlFor="port">애플리케이션 포트</Label>
                        <Input
                            id="port"
                            name="port"
                            type="number"
                            required
                            placeholder="예: 3000"
                        />
                    </InputGroup>
                    <InputGroup>
                        <Label htmlFor="git_url">Git URL</Label>
                        <Input
                            id="git_url"
                            name="git_url"
                            required
                            placeholder="예: https://github.com/username/repo"
                        />
                    </InputGroup>
                    <InputGroup>
                        <Label htmlFor="branch">Git 브랜치</Label>
                        <Input
                            id="branch"
                            name="branch"
                            required
                            placeholder="예: main, dev"
                        />
                    </InputGroup>
                    <InputGroup>
                        <Label htmlFor="description">설명</Label>
                        <Textarea
                            id="description"
                            name="description"
                            required
                            placeholder="애플리케이션에 대한 간단한 설명"
                        />
                    </InputGroup>
                    <Button type="submit" disabled={submitMutation.isPending}>
                        {submitMutation.isPending ? (
                            <>
                                <Loader size={16} className="animate-spin" />
                                제출 중...
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                제출
                            </>
                        )}
                    </Button>
                </Form>
            </ContentWrapper>
        </Container>
    );
};

const Container = styled.div`
    padding: 40px;
    color: #e0e0e0;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 100vh;
    background-color: #000000;
`;

const ContentWrapper = styled.div`
    background-color: #1a1a1a;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 600px;
`;

const Title = styled.h1`
    font-size: 28px;
    color: #ffffff;
    font-weight: 600;
    margin-bottom: 24px;
    text-align: left;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Label = styled.label`
    font-size: 14px;
    color: #b0b0b0;
`;

const Input = styled.input`
    padding: 12px;
    font-size: 16px;
    border: 1px solid #333;
    border-radius: 4px;
    background-color: #2a2a2a;
    color: #ffffff;

    &:focus {
        outline: none;
        border-color: #3a86ff;
    }

    &::placeholder {
        color: #666666;
    }
`;

const Textarea = styled.textarea`
    padding: 12px;
    font-size: 16px;
    border: 1px solid #333;
    border-radius: 4px;
    background-color: #2a2a2a;
    color: #ffffff;
    resize: vertical;
    min-height: 120px;

    &:focus {
        outline: none;
        border-color: #3a86ff;
    }

    &::placeholder {
        color: #666666;
    }
`;

const Button = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px;
    font-size: 16px;
    font-weight: bold;
    color: white;
    background-color: #3a86ff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #2a76ef;
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .animate-spin {
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
`;

const Message = styled.div`
    padding: 12px;
    border-radius: 4px;
    margin-bottom: 20px;
    background-color: ${(props) =>
        props.type === "error"
            ? "rgba(255, 0, 0, 0.1)"
            : "rgba(0, 255, 0, 0.1)"};
    color: ${(props) => (props.type === "error" ? "#ff4444" : "#00ff00")};
    text-align: center;
`;

export default ApplicationSubmitPage;
