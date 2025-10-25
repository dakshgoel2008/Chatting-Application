import axios from "axios";
import toast from "react-hot-toast";

// Remove the /api suffix from the environment variable
const apiUrl = import.meta.env.VITE_API_BASE_URL;

export const axiosInstance = axios.create({
    baseURL: `${apiUrl}/api`,
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

        // Don't redirect to login for certain endpoints
        const publicEndpoints = ["/auth/login", "/auth/signup", "/auth/check"];
        const isPublicEndpoint = publicEndpoints.some((endpoint) => originalRequest?.url?.includes(endpoint));

        // Only handle 401 for protected routes and avoid infinite loops
        if (error.response?.status === 401 && !originalRequest._retry && !isPublicEndpoint) {
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
