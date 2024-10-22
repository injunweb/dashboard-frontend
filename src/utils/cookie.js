import { Cookies } from "react-cookie";

export const cookie = new Cookies();

export const setCookie = (name, value, options = {}) => {
    cookie.set(name, value, options);
};

export const getCookie = (name) => {
    return cookie.get(name);
};

export const removeCookie = (name) => {
    cookie.remove(name);
};
