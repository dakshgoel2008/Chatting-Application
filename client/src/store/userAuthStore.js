import { create } from "zustand";
import { axiosInstance } from "./../lib/axios";
import toast from "react-hot-toast";

export const useUserAuthStore = create((set) => ({
    isLoggingIn: false,
    isSigningUp: false,
    isCheckingAuth: true,
    isUpdatingProfile: false,
    user: null,

    // Check if user is authenticated
    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ user: res.data });
        } catch (err) {
            console.error("Auth check failed:", err);
            set({ user: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    // Sign Up
    signUp: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ user: res.data });
        } catch (err) {
            console.error("Signup error:", err);
            toast.error(err?.response?.data?.message || err?.message || "Signup failed. Please try again.");
        } finally {
            set({ isSigningUp: false });
        }
    },

    // Login
    logIn: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ user: res.data });
            console.log(res);
        } catch (err) {
            console.log("Login error:", err);
            toast.error(err?.response?.data?.message || err?.message || "Login failed. Please try again.");
        } finally {
            set({ isLoggingIn: false });
        }
    },
}));
