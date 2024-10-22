import api from "./api";

export const login = async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
};

export const register = async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
};

export const logout = async () => {
    // 추후에 서버에서 로그아웃 처리를 위한 API를 호출합니다.
    return { success: true };
};
