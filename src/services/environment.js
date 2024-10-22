import api from "./api";

export const getEnvironments = async (appId) => {
    const response = await api.get(`/applications/${appId}/environments`);
    return response.data;
};

export const updateEnvironment = async (appId, environmentData) => {
    const response = await api.post(
        `/applications/${appId}/environments`,
        environmentData
    );
    return response.data;
};
