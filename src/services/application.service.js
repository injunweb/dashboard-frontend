import { api } from "./api";

export const submitApplication = async (appData) => {
    return await api.post("/applications", appData);
};

export const getApplications = async () => {
    return await api.get("/applications");
};

export const getApplication = async (appId) => {
    return await api.get(`/applications/${appId}`);
};
