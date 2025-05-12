import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:4444/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});
