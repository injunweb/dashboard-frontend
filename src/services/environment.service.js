import { api } from "./api";

export const getEnvironments = async (appId) => {
    return await api.get(`/applications/${appId}/environments`);
};

export const uppdateEnvironment = async (appId, envData) => {
    return await api.post(`/applications/${appId}/environments`, envData);
};
