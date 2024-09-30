import { api } from "./api";

export const getUsers = async () => {
    return await api.get("admin/users");
};

export const getUser = async (userId) => {
    return await api.get(`admin/users/${userId}`);
};

export const getApplications = async (userId) => {
    return await api.get(`admin/users/${userId}/applications`);
};

export const approveApplication = async (appId) => {
    return await api.post(`admin/applications/${appId}/approve`);
};

export const getApplication = async (appId) => {
    return await api.get(`admin/applications/${appId}`);
};
