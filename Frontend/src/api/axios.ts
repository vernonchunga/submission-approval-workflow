import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
});

export const saveTokens = (
    access: string,
    refresh: string
) => {

    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);

};

export const clearTokens = () => {

    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

};

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("access");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;

});

export default api;