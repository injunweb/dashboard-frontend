import api from "./api";

export const getNotifications = async () => {
    const response = await api.get("/notifications");
    return response.data;
};

export const markAllAsRead = async () => {
    const response = await api.post("/notifications/read");
    return response.data;
};

export const deleteNotification = async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
};

export const subscribeToNotifications = async (subscription) => {
    const response = await api.post("/notifications/subscribe", subscription);
    return response.data;
};

export const getVapidPublicKey = async () => {
    const response = await api.get("/notifications/vapid-public-key");
    return response.data;
};
