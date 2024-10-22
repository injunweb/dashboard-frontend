import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import styled, { keyframes } from "styled-components";
import {
    subscribeToNotifications,
    getVapidPublicKey,
} from "../services/notification";

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
                const vapidPublicKey = vapidPublicKeyResponse.vapidPublicKey;
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

    return (
        <PromptContainer $isVisible={isVisible}>
            <PromptContent>
                <PromptText>실시간 알림을 받고 싶으신가요?</PromptText>
                <SubscribeButton onClick={handleSubscribe}>
                    알림 구독하기
                </SubscribeButton>
            </PromptContent>
        </PromptContainer>
    );
};

const slideIn = keyframes`
    from {
        transform: translateY(100%);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
`;

const pulse = keyframes`
    0% {
        box-shadow: 0 0 0 0 rgba(30, 144, 255, 0.4);
    }
    70% {
        box-shadow: 0 0 0 15px rgba(30, 144, 255, 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(30, 144, 255, 0);
    }
`;

const PromptContainer = styled.div`
    position: fixed;
    bottom: 25px;
    right: 25px;
    background-color: rgba(20, 20, 22, 0.95);
    color: white;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    display: ${(props) => (props.$isVisible ? "block" : "none")};
    animation: ${slideIn} 0.5s ease-out;
    border: 1px solid rgba(30, 144, 255, 0.3);
    backdrop-filter: blur(8px);
    max-width: 350px;
    overflow: hidden;
`;

const PromptContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const PromptText = styled.p`
    font-size: 1.1rem;
    margin-bottom: 25px;
    text-align: center;
    font-weight: 500;
    line-height: 1.4;
`;

const SubscribeButton = styled.button`
    display: inline-block;
    padding: 14px 28px;
    font-size: 1.1rem;
    font-weight: bold;
    background: linear-gradient(135deg, #1e90ff, #4169e1);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    animation: ${pulse} 2s infinite;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 20px rgba(30, 144, 255, 0.4);
        background: linear-gradient(135deg, #4169e1, #1e90ff);
    }

    &:active {
        transform: translateY(-1px);
    }
`;

export default SubscriptionPrompt;
