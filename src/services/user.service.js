import { api } from "./api";

export const getUser = async () => {
    return await api.get("/users");
};

export const updateUser = async (userData) => {
    return await api.patch("/users", userData);
};
