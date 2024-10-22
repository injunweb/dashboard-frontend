import axios from "axios";
import { getAuthToken, removeAuthToken } from "../utils/auth";
import { QueryClient } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";

const api = axios.create({
    baseURL: "https://api.injunweb.com",
});

api.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
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
        if (error.response && error.response.status === 401) {
            removeAuthToken();
            QueryClient.clear();
            Navigate("/login");
        }
        return Promise.reject(error);
    }
);

export default api;
