import api from "./api";

export const submitApplication = async (applicationData) => {
    const response = await api.post("/applications", applicationData);
    return response.data;
};

export const getApplications = async () => {
    const response = await api.get("/applications");
    return response.data;
};

export const getApplication = async (appId) => {
    const response = await api.get(`/applications/${appId}`);
    return response.data;
};

export const deleteApplication = async (appId) => {
    const response = await api.delete(`/applications/${appId}`);
    return response.data;
};

export const addExtraHostname = async (appId, hostname) => {
    const response = await api.post(`/applications/${appId}/extra-hostnames`, {
        hostname,
    });
    return response.data;
};

export const deleteExtraHostname = async (appId, hostname) => {
    const response = await api.delete(
        `/applications/${appId}/extra-hostnames`,
        { data: { hostname } }
    );
    return response.data;
};
