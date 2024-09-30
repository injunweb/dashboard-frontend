import axios from "axios";
import { Cookie } from "../utils/cookie";

export const api = axios.create({
    baseURL: "https://api.injunweb.com",
});

api.interceptors.request.use(
    (config) => {
        const token = Cookie.get("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
