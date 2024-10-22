import api from "./api";

export const getUser = async () => {
    const response = await api.get("/users");
    return response.data;
};

export const updateUser = async (userData) => {
    const response = await api.patch("/users", userData);
    return response.data;
};
