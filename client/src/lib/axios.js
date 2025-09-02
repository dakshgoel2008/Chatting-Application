import axios from "axios";

// export const axiosInstance = axios.create({
//     baseURL: import.meta.env.MODE == "development" ? "http://localhost:4444/api" : "/api",
//     withCredentials: true,
// });

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:4444/api",
    withCredentials: true,
});
