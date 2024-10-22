import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import {
    getNotifications,
    markAllAsRead,
    deleteNotification,
} from "../services/notification";
import Loading from "../components/Loading";
import { Bell, Trash2, CheckSquare, Clock, Loader } from "lucide-react";

const NotificationsPage = () => {
    const queryClient = useQueryClient();

    const {
        data: notifications,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["notifications"],
        queryFn: getNotifications,
    });

    const markAllAsReadMutation = useMutation({
        mutationFn: markAllAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries(["notifications"]);
        },
    });

    const deleteNotificationMutation = useMutation({
        mutationFn: deleteNotification,
        onSuccess: () => {
            queryClient.invalidateQueries(["notifications"]);
        },
    });

    if (isLoading) return <Loading />;
    if (error) return <ErrorMessage>Error: {error.message}</ErrorMessage>;

    return (
        <Container>
            <ContentWrapper>
                <Header>
                    <Title>
                        <Bell size={24} /> 알림
                    </Title>
                    <MarkAllButton
                        onClick={() => markAllAsReadMutation.mutate()}
                        disabled={markAllAsReadMutation.isPending}
                    >
                        {markAllAsReadMutation.isPending ? (
                            <>
                                <Loader size={16} className="animate-spin" />
                                처리 중...
                            </>
                        ) : (
                            <>
                                <CheckSquare size={16} /> 모두 읽음 표시
                            </>
                        )}
                    </MarkAllButton>
                </Header>
                {notifications && notifications?.notifications?.length > 0 ? (
                    <NotificationList>
                        {notifications.notifications.map((notification) => (
                            <NotificationItem key={notification.id}>
                                <NotificationIcon>
                                    <Bell size={24} />
                                </NotificationIcon>
                                <NotificationContent>
                                    <NotificationMessage>
                                        {notification.message}
                                    </NotificationMessage>
                                    <NotificationTime>
                                        <Clock size={14} />
                                        {new Date(
                                            notification.created_at
                                        ).toLocaleString()}
                                    </NotificationTime>
                                </NotificationContent>
                                <DeleteButton
                                    onClick={() =>
                                        deleteNotificationMutation.mutate(
                                            notification.id
                                        )
                                    }
                                    disabled={
                                        deleteNotificationMutation.isPending
                                    }
                                >
                                    {deleteNotificationMutation.isPending ? (
                                        <Loader
                                            size={16}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <Trash2 size={16} />
                                    )}
                                </DeleteButton>
                            </NotificationItem>
                        ))}
                    </NotificationList>
                ) : (
                    <EmptyState>알림이 없습니다</EmptyState>
                )}
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
`;

const ContentWrapper = styled.div`
    background-color: #1a1a1a;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 800px;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
`;

const Title = styled.h1`
    font-size: 28px;
    color: #f0f0f0;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
`;

const MarkAllButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: #3a86ff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
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

const NotificationList = styled.ul`
    list-style-type: none;
    padding: 0;
`;

const NotificationItem = styled.li`
    display: flex;
    align-items: flex-start;
    margin-bottom: 16px;
    padding: 16px;
    background-color: #222222;
    border-radius: 10px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }
`;

const NotificationIcon = styled.div`
    width: 40px;
    height: 40px;
    background-color: #333333;
    color: #ffffff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
`;

const NotificationContent = styled.div`
    flex-grow: 1;
`;

const NotificationMessage = styled.p`
    margin: 0 0 8px 0;
    font-size: 14px;
    line-height: 1.5;
    color: #ffffff;
`;

const NotificationTime = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    color: #6b7280;
    font-size: 12px;
`;

const DeleteButton = styled.button`
    background-color: transparent;
    color: #ff4444;
    border: none;
    cursor: pointer;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s ease;

    &:hover {
        color: #ff6666;
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;

const EmptyState = styled.p`
    text-align: center;
    font-size: 18px;
    color: #888;
    margin-top: 50px;
`;

const ErrorMessage = styled.div`
    color: #ff6b6b;
    background-color: rgba(239, 68, 68, 0.1);
    border: 1px solid #ff6b6b;
    border-radius: 8px;
    padding: 16px;
    margin-top: 16px;
    text-align: center;
`;

export default NotificationsPage;
