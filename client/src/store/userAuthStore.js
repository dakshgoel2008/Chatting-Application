import { create } from "zustand";
import { axiosInstance } from "./../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:4444";

export const useUserAuthStore = create((set, get) => ({
    isLoggingIn: false,
    isSigningUp: false,
    isCheckingAuth: true,
    isUpdatingProfile: false,
    isUpdatingPassword: false,
    user: null,
    onlineUsers: [],
    socket: null,
    isLoggedIn: false,
    isDeletingAccount: false,
    // Check if user is authenticated
    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ user: res.data, isLoggedIn: !!res.data });
            // socket:
            get().connectSocket();
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
            set({ user: res.data, isLoggedIn: true });
            toast.success("Signed up sucessfully");
            window.location.href = "/login";
            // socket:
            get().connectSocket();
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
            set({ user: res.data, isLoggedIn: true });
            toast.success("Logged In sucessfully");

            // socket:
            get().connectSocket();
        } catch (err) {
            console.log("Login errcor:", err);
            toast.error(err?.response?.data?.message || err?.message || "Login failed. Please try again.");
        } finally {
            set({ isLoggingIn: false });
        }
    },

    // logout
    logOut: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ user: null, isLoggedIn: false });
            toast.success("Logged Out sucessfully");
            get().disconnectSocket();
            window.location.href = "/login";
        } catch (err) {
            console.log("Log error:", err);
            toast.error(err?.response?.data?.message || err?.message || "Logout failed");
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ user: res.data.user });
            toast.success("Profile updated sucessfully");
        } catch (err) {
            console.log("Update Profile error:", err);
            toast.error(err?.response?.data?.message || err?.message || "Update Profile failed. Please try again.");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    updatePassword: async (data) => {
        set({ isUpdatingPassword: true });
        try {
            const res = await axiosInstance.put("/auth/update-password", data);
            set({ user: res.data.user });
            toast.success("Password updated sucessfully");
        } catch (err) {
            console.log("Update Password error:", err);
            toast.error(err?.response?.data?.message || err?.message || "Update Password failed. Please try again.");
        } finally {
            set({ isUpdatingPassword: false });
        }
    },

    deleteAccount: async (data = {}) => {
        set({ isDeletingAccount: true });
        try {
            // Send password for verification if provided
            await axiosInstance.post("/auth/delete-account", data);

            // Clear all user data
            set({
                user: null,
                isLoggedIn: false,
            });

            // Disconnect socket
            get().disconnectSocket();

            toast.success("Account deleted successfully");
            window.location.href = "/login";
        } catch (err) {
            console.log("Delete Account error:", err);

            // Handling specific error cases -> used GPT for better error handling 😁😁
            let errorMessage = "Delete Account failed. Please try again.";

            if (err?.response?.status === 401) {
                errorMessage = "Incorrect password";
            } else if (err?.response?.status === 403) {
                errorMessage = "You don't have permission to delete this account";
            } else if (err?.response?.status === 404) {
                errorMessage = "Account not found";
            } else if (err?.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err?.message) {
                errorMessage = err.message;
            }

            toast.error(errorMessage);

            throw err;
        } finally {
            set({ isDeletingAccount: false });
        }
    },

    // socket connect:
    connectSocket: () => {
        const { user } = get();
        if (!user || get().socket?.connected) return;

        const socket = io(BASE_URL, { query: { userId: user._id }, transports: ["websocket"] });
        socket.connect();

        set({ socket: socket });

        socket.on("getOnlineUsers", (users) => {
            console.log(users);
            set({ onlineUsers: users });
        });
    },
    // bro disconnect also.
    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },
}));
