import api from "./api";

export const getUsers = async () => {
    const response = await api.get("/admin/users");
    return response.data;
};

export const getUser = async (userId) => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
};

export const getUserApplications = async (userId) => {
    const response = await api.get(`/admin/users/${userId}/applications`);
    return response.data;
};

export const getApplication = async (appId) => {
    const response = await api.get(`/admin/applications/${appId}`);
    return response.data;
};

export const getAllApplications = async () => {
    const response = await api.get("/admin/applications");
    return response.data;
};

export const approveApplication = async (appId) => {
    const response = await api.post(`/admin/applications/${appId}/approve`);
    return response.data;
};

export const cancelApproveApplication = async (appId) => {
    const response = await api.post(
        `/admin/applications/${appId}/cancel-approve`
    );
    return response.data;
};

export const updatePrimaryHostname = async (appId, hostname) => {
    const response = await api.post(
        `/admin/applications/${appId}/primary-hostname`,
        { hostname }
    );
    return response.data;
};
