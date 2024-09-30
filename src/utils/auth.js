import { Cookie } from "./cookie";
import { jwtDecode } from "jwt-decode";

export const isLoggedIn = () => {
    const token = Cookie.get("authToken");
    return !!token;
};

export const isAdmin = () => {
    const token = Cookie.get("authToken");
    if (token) {
        const decoded = jwtDecode(token);
        return decoded.is_admin;
    }
    return false;
};

export const setAuthToken = (token) => {
    const { exp } = jwtDecode(token);
    const expires = new Date(exp * 1000);

    Cookie.set("authToken", token, { expires });
};
