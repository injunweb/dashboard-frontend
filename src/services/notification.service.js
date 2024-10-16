import { api } from "./api";

export const getNotifications = async () => {
    return await api.get(`/notifications`);
};

export const readNotification = async () => {
    return await api.post(`/notifications/read`);
};

export const deleteNotification = async (notificationId) => {
    return await api.delete(`/notifications/${notificationId}`);
};

export const subscribeToNotifications = async (subscription) => {
    return await api.post(`/notifications/subscribe`, subscription);
};

export const getVapidPublicKey = async () => {
    return await api.get(`/notifications/vapid-public-key`);
};
