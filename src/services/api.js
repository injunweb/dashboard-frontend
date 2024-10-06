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

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error("Response error:", error.response.data);
            console.error("Status code:", error.response.status);

            if (error.response.status === 401) {
                Cookie.remove("authToken");
            }
        } else if (error.request) {
            console.error("Request error:", error.request);
        } else {
            console.error("Error:", error.message);
        }

        return Promise.reject(error);
    }
);
