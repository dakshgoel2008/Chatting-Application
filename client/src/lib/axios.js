import axios from "axios";
import toast from "react-hot-toast";

// Remove the /api suffix from the environment variable
const apiUrl =
    import.meta.env.VITE_API_BASE_URL || (import.meta.env.MODE === "development" ? "http://localhost:4444" : "");

export const axiosInstance = axios.create({
    baseURL: `${apiUrl}/api`, // Now it will be correct
    withCredentials: true,
});

// Request interceptor - add tokens to requests
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (refreshToken) {
            config.headers["x-refresh-token"] = refreshToken;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle token expiration
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 error and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Clear tokens
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            // Show error message
            toast.error("Session expired. Please login again.");

            // Redirect to login after a short delay
            setTimeout(() => {
                window.location.href = "/login";
            }, 1000);
        }

        return Promise.reject(error);
    }
);
