import { jwtDecode } from "jwt-decode";
import { setCookie, getCookie, removeCookie } from "./cookie";

const TOKEN_KEY = "auth_token";

export const setAuthToken = (token) => {
    setCookie(TOKEN_KEY, token, { path: "/", maxAge: 7 * 24 * 60 * 60 });
};

export const getAuthToken = () => {
    return getCookie(TOKEN_KEY);
};

export const removeAuthToken = () => {
    removeCookie(TOKEN_KEY, { path: "/" });
};

export const isTokenValid = () => {
    const token = getAuthToken();
    if (!token) return false;

    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decodedToken.exp > currentTime;
    } catch (error) {
        return false;
    }
};

export const isAdmin = () => {
    const token = getAuthToken();
    if (!token) return false;

    try {
        const decodedToken = jwtDecode(token);
        return decodedToken.is_admin;
    } catch (error) {
        return false;
    }
};
