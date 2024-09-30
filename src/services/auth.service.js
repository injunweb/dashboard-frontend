import { api } from "./api";

export const login = async (credentials) => {
    return await api.post("/auth/login", credentials);
};

export const register = async (userData) => {
    return await api.post("/auth/register", userData);
};
