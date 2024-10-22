import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import { getUser, updateUser } from "../services/user";
import Loading from "../components/Loading";
import { Edit, Save, X, Loader } from "lucide-react";

const ProfilePage = () => {
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState(null);

    const {
        data: user,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["user"],
        queryFn: getUser,
    });

    const updateUserMutation = useMutation({
        mutationFn: updateUser,
        onSuccess: () => {
            queryClient.invalidateQueries(["user"]);
            setIsEditing(false);
            setMessage({
                type: "success",
                text: "Profile updated successfully!",
            });
            setTimeout(() => setMessage(null), 3000);
        },
        onError: (error) => {
            setMessage({
                type: "error",
                text: error.message || "Failed to update profile",
            });
            setTimeout(() => setMessage(null), 3000);
        },
    });

    if (isLoading) return <Loading />;
    if (error) return <ErrorMessage>Error: {error.message}</ErrorMessage>;

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateUserMutation.mutate(formData);
    };

    return (
        <Container>
            <ContentWrapper>
                <Title>내 프로필</Title>
                {message && (
                    <Message type={message.type}>{message.text}</Message>
                )}
                {isEditing ? (
                    <Form onSubmit={handleSubmit}>
                        <InputGroup>
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                defaultValue={user.username}
                                onChange={handleInputChange}
                            />
                        </InputGroup>
                        <InputGroup>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                defaultValue={user.email}
                                onChange={handleInputChange}
                            />
                        </InputGroup>
                        <ButtonGroup>
                            <Button
                                type="submit"
                                primary
                                disabled={updateUserMutation.isPending}
                            >
                                {updateUserMutation.isPending ? (
                                    <>
                                        <Loader
                                            size={16}
                                            className="animate-spin"
                                        />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} />
                                        Save
                                    </>
                                )}
                            </Button>
                            <Button
                                type="button"
                                onClick={() => setIsEditing(false)}
                            >
                                <X size={16} /> Cancel
                            </Button>
                        </ButtonGroup>
                    </Form>
                ) : (
                    <ProfileInfo>
                        <DetailItem>
                            <DetailLabel>Username:</DetailLabel>
                            <DetailValue>{user.username}</DetailValue>
                        </DetailItem>
                        <DetailItem>
                            <DetailLabel>Email:</DetailLabel>
                            <DetailValue>{user.email}</DetailValue>
                        </DetailItem>
                        <Button onClick={() => setIsEditing(true)}>
                            <Edit size={16} /> Edit Profile
                        </Button>
                    </ProfileInfo>
                )}
            </ContentWrapper>
        </Container>
    );
};

const Button = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: ${(props) => (props.primary ? "#3a86ff" : "#2a2a2a")};
    color: #ffffff;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: ${(props) => (props.primary ? "#2a76ef" : "#3a3a3a")};
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

const Container = styled.div`
    padding: 40px;
    color: #e0e0e0;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 100vh;
`;

const ContentWrapper = styled.div`
    background-color: #1a1a1a;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 480px;
`;

const Title = styled.h1`
    font-size: 24px;
    color: #ffffff;
    margin-bottom: 24px;
    text-align: center;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
`;

const Label = styled.label`
    font-size: 14px;
    color: #b0b0b0;
    margin-bottom: 8px;
`;

const Input = styled.input`
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #333;
    background-color: #2a2a2a;
    color: #ffffff;
    font-size: 16px;

    &:focus {
        outline: none;
        border-color: #3a86ff;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-start;
    gap: 12px;
    margin-top: 12px;
`;

const ProfileInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const DetailItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #2a2a2a;

    &:last-child {
        border-bottom: none;
    }
`;

const DetailLabel = styled.span`
    font-weight: bold;
    color: #b0b0b0;
`;

const DetailValue = styled.span`
    color: #ffffff;
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

const ErrorMessage = styled.div`
    color: #ff4444;
    padding: 20px;
    background-color: rgba(255, 0, 0, 0.1);
    border: 1px solid #ff4444;
    border-radius: 4px;
    margin-bottom: 20px;
    text-align: center;
`;

export default ProfilePage;
