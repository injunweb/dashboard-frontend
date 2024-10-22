import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import { Bell, X, Clock } from "lucide-react";
import {
    getNotifications,
    markAllAsRead,
    deleteNotification,
} from "../services/notification";

const Notifications = () => {
    const [isOpen, setIsOpen] = useState(false);
    const notificationRef = useRef(null);
    const queryClient = useQueryClient();

    const {
        data: notifications,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["notifications"],
        queryFn: getNotifications,
    });

    const readAllNotificationsMutation = useMutation({
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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleNotificationClick = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            readAllNotificationsMutation.mutate();
        }
    };

    const handleDeleteNotification = (e, id) => {
        e.stopPropagation();
        deleteNotificationMutation.mutate(id);
    };

    const unreadCount = notifications?.unread_count || 0;

    return (
        <NotificationWrapper ref={notificationRef}>
            <NotificationIcon onClick={handleNotificationClick}>
                <Bell size={24} />
                {unreadCount > 0 && (
                    <NotificationBadge>
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </NotificationBadge>
                )}
            </NotificationIcon>
            {isOpen && (
                <NotificationContainer>
                    <NotificationTitle>알림</NotificationTitle>
                    <NotificationContent>
                        {isLoading ? (
                            <NotificationItem>로딩 중...</NotificationItem>
                        ) : isError ? (
                            <NotificationItem>
                                알림을 불러오는 중 오류가 발생했습니다.
                            </NotificationItem>
                        ) : notifications?.notifications?.length > 0 ? (
                            notifications.notifications.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    $isRead={notification.is_read}
                                >
                                    <NotificationIcon>
                                        <Bell size={20} />
                                    </NotificationIcon>
                                    <NotificationContent>
                                        <NotificationMessage>
                                            {notification.message}
                                        </NotificationMessage>
                                        <NotificationTime>
                                            <Clock size={12} />
                                            {new Date(
                                                notification.created_at
                                            ).toLocaleString()}
                                        </NotificationTime>
                                    </NotificationContent>
                                    <DeleteButton
                                        onClick={(e) =>
                                            handleDeleteNotification(
                                                e,
                                                notification.id
                                            )
                                        }
                                    >
                                        <X size={16} />
                                    </DeleteButton>
                                </NotificationItem>
                            ))
                        ) : (
                            <NotificationItem>
                                새로운 알림이 없습니다.
                            </NotificationItem>
                        )}
                    </NotificationContent>
                </NotificationContainer>
            )}
        </NotificationWrapper>
    );
};

const NotificationWrapper = styled.div`
    position: relative;
    margin-left: auto;
`;

const NotificationIcon = styled.div`
    cursor: pointer;
    padding: 10px;
    transition: transform 0.3s ease;
    color: #fff;

    &:hover {
        transform: scale(1.1);
    }
`;

const NotificationBadge = styled.span`
    position: absolute;
    top: 5px;
    right: 5px;
    min-width: 18px;
    height: 18px;
    background-color: #ff4444;
    border-radius: 9px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 10px;
    color: white;
    padding: 0 4px;
    border: 2px solid #000000;
`;

const NotificationContainer = styled.div`
    position: absolute;
    top: 60px;
    right: 0;
    width: 350px;
    max-height: 450px;
    background-color: #1a1a1a;
    border-radius: 10px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    border: 1px solid #2a2a2a;
    overflow: hidden;
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

const NotificationTitle = styled.h3`
    color: #f0f0f0;
    padding: 20px;
    margin: 0;
    border-bottom: 1px solid #2a2a2a;
    font-size: 18px;
    font-weight: 600;
`;

const NotificationContent = styled.div`
    max-height: 380px;
    overflow-y: auto;
`;

const NotificationItem = styled.div`
    padding: 15px;
    margin: 10px;
    background-color: ${(props) =>
        props.$isRead ? "#222222" : "rgba(58, 134, 255, 0.1)"};
    border-radius: 8px;
    transition: all 0.3s ease;
    display: flex;
    align-items: flex-start;

    &:hover {
        background-color: #2a2a2a;
        transform: translateY(-2px);
    }
`;

const NotificationMessage = styled.span`
    color: #f0f0f0;
    font-size: 14px;
    margin-bottom: 5px;
`;

const NotificationTime = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    color: #888888;
    font-size: 12px;
`;

const DeleteButton = styled.button`
    background: none;
    border: none;
    color: #ff6b6b;
    cursor: pointer;
    padding: 5px;
    transition: all 0.3s ease;
    margin-left: auto;

    &:hover {
        color: #ff4444;
        transform: scale(1.1);
    }
`;

export default Notifications;
