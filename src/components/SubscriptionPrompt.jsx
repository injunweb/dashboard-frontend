import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import {
    subscribeToNotifications,
    getVapidPublicKey,
} from "../services/notification.service";
import styled from "styled-components";

const PromptContainer = styled.div`
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: rgba(28, 28, 30, 0.6);
    color: white;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    display: ${(props) => (props.$isVisible ? "block" : "none")};
    animation: slideIn 0.5s ease-out;
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    max-width: 300px;

    @keyframes slideIn {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
`;

const PromptText = styled.p`
    font-size: 1rem;
    margin-bottom: 15px;
`;

const SubscribeButton = styled.button`
    display: inline-block;
    padding: 10px 20px;
    font-size: 1rem;
    background: linear-gradient(135deg, #1e90ff, #ff007f);
    color: white;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 20px rgba(30, 144, 255, 0.3);
    }
`;

const CloseButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
        color: #1e90ff;
    }
`;

export const SubscriptionPrompt = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [swRegistration, setSwRegistration] = useState(null);

    const subscribeToNotificationsMutation = useMutation({
        mutationFn: subscribeToNotifications,
        onSuccess: () => {
            console.log("Successfully subscribed to notifications");
            setIsVisible(false);
        },
        onError: (error) => {
            console.error("Failed to subscribe to notifications:", error);
        },
    });

    useEffect(() => {
        const registerServiceWorker = async () => {
            if ("serviceWorker" in navigator && "PushManager" in window) {
                try {
                    const registration = await navigator.serviceWorker.register(
                        "/sw.js"
                    );
                    console.log(
                        "Service Worker registered successfully:",
                        registration
                    );
                    setSwRegistration(registration);
                    checkSubscription(registration);
                } catch (error) {
                    console.error("Service Worker registration failed:", error);
                }
            } else {
                console.log("Service workers or Push API not supported");
            }
        };

        registerServiceWorker();
    }, []);

    const checkSubscription = async (registration) => {
        const subscription = await registration.pushManager.getSubscription();
        if (!subscription && Notification.permission !== "denied") {
            setIsVisible(true);
        }
    };

    const handleSubscribe = async () => {
        if (!swRegistration) {
            console.error("Service Worker not registered");
            return;
        }

        try {
            const permission = await Notification.requestPermission();
            console.log("Notification permission:", permission);

            if (permission === "granted") {
                const vapidPublicKeyResponse = await getVapidPublicKey();
                const vapidPublicKey =
                    vapidPublicKeyResponse.data.vapidPublicKey;
                console.log("VAPID public key:", vapidPublicKey);

                const subscription = await swRegistration.pushManager.subscribe(
                    {
                        userVisibleOnly: true,
                        applicationServerKey:
                            urlBase64ToUint8Array(vapidPublicKey),
                    }
                );
                console.log("Push subscription created:", subscription);

                await subscribeToNotificationsMutation.mutateAsync(
                    subscription
                );
            } else {
                console.log("Notification permission not granted");
                setIsVisible(false);
            }
        } catch (error) {
            console.error("Error during subscription process:", error);
        }
    };

    const urlBase64ToUint8Array = (base64String) => {
        const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, "+")
            .replace(/_/g, "/");
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    return (
        <PromptContainer $isVisible={isVisible}>
            <CloseButton onClick={handleClose}>&times;</CloseButton>
            <PromptText>실시간 알림을 받고 싶으신가요?</PromptText>
            <SubscribeButton onClick={handleSubscribe}>
                알림 구독하기
            </SubscribeButton>
        </PromptContainer>
    );
};
