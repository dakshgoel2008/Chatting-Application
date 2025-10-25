import axios from "axios";

const apiUrl = import.meta.env.VITE_API_BASE_URL || "/api";

export const axiosInstance = axios.create({
    // Construct the baseURL using the variable + /api
    baseURL: `${apiUrl}/api`,
    withCredentials: true,
});
