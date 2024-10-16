import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getNotifications,
    readNotification,
    deleteNotification,
} from "../services/notification.service";
import styled from "styled-components";

const NotificationWrapper = styled.div`
    position: relative;
    margin-left: auto;
`;

const NotificationIcon = styled.div`
    cursor: pointer;
    padding: 10px;
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.1);
    }
`;

const NotificationDot = styled.div`
    position: absolute;
    top: 5px;
    right: 5px;
    width: 14px;
    height: 14px;
    background: linear-gradient(135deg, #ff4444, #ff007f);
    border-radius: 50%;
    display: ${(props) => (props.$hasUnread ? "flex" : "none")};
    justify-content: center;
    align-items: center;
    font-size: 12px;
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.5);
`;

const NotificationContainer = styled.div`
    position: absolute;
    top: 60px;
    right: 0;
    width: 300px;
    max-height: 400px;
    overflow-y: auto;
    background-color: rgba(28, 28, 30, 0.95);
    border-radius: 15px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    display: ${(props) => (props.$isOpen ? "block" : "none")};
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    animation: slideDown 0.3s ease-out;

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

const NotificationItem = styled.div`
    padding: 15px;
    margin: 10px;
    background-color: ${(props) =>
        props.$isRead ? "rgba(44, 44, 46, 0.6)" : "rgba(30, 144, 255, 0.2)"};
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:hover {
        background-color: rgba(30, 144, 255, 0.3);
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
`;

const NotificationTitle = styled.h3`
    color: #fff;
    padding: 15px;
    margin: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 1.2rem;
`;

const DeleteButton = styled.button`
    background: none;
    border: none;
    color: #ff4444;
    cursor: pointer;
    font-size: 16px;
    padding: 5px;
    transition: all 0.3s ease;

    &:hover {
        color: #ff0000;
        transform: scale(1.1);
    }
`;

export const Notifications = () => {
    const [isOpen, setIsOpen] = useState(false);
    const queryClient = useQueryClient();

    const { data: notifications, isLoading } = useQuery({
        queryKey: ["notifications"],
        queryFn: getNotifications,
    });

    const readAllNotificationsMutation = useMutation({
        mutationFn: readNotification,
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

    const handleNotificationClick = () => {
        readAllNotificationsMutation.mutate();
    };

    const handleDeleteNotification = (e, notificationId) => {
        e.stopPropagation();
        deleteNotificationMutation.mutate(notificationId);
    };

    const unreadCount = notifications?.data?.unread_count || 0;

    return (
        <NotificationWrapper>
            <NotificationIcon
                onClick={() => {
                    setIsOpen(!isOpen);
                    handleNotificationClick();
                }}
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z"
                        fill="white"
                    />
                </svg>
                {unreadCount > 0 && (
                    <NotificationDot $hasUnread>{unreadCount}</NotificationDot>
                )}
            </NotificationIcon>
            <NotificationContainer $isOpen={isOpen}>
                <NotificationTitle>알림</NotificationTitle>
                {isLoading ? (
                    <NotificationItem>로딩 중...</NotificationItem>
                ) : notifications?.data?.notifications?.length > 0 ? (
                    notifications?.data?.notifications.map((notification) => (
                        <NotificationItem
                            key={notification.id}
                            $isRead={notification.is_read}
                            onClick={() => {}}
                        >
                            <span>{notification.message}</span>
                            <DeleteButton
                                onClick={(e) =>
                                    handleDeleteNotification(e, notification.id)
                                }
                            >
                                &#x2715;
                            </DeleteButton>
                        </NotificationItem>
                    ))
                ) : (
                    <NotificationItem>새로운 알림이 없습니다.</NotificationItem>
                )}
            </NotificationContainer>
        </NotificationWrapper>
    );
};
