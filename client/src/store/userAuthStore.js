import { create } from "zustand";
import { axiosInstance } from "./../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const socketUrl =
    import.meta.env.VITE_API_BASE_URL || (import.meta.env.MODE === "development" ? "http://localhost:4444" : "/");

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

    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ user: res.data, isLoggedIn: !!res.data });
            // socket: Connect only after state is set
            setTimeout(() => get().connectSocket(), 100);
        } catch (err) {
            console.error("Auth check failed:", err);
            set({ user: null, isLoggedIn: false });
            // Clear tokens if auth check fails
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signUp: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            // Don't set user or connect socket - redirect to login
            toast.success("Signed up successfully! Please log in.");

            // Small delay before redirect to show toast
            setTimeout(() => {
                window.location.href = "/login";
            }, 500);
        } catch (err) {
            console.error("Signup error:", err);
            toast.error(err?.response?.data?.message || err?.message || "Signup failed. Please try again.");
        } finally {
            set({ isSigningUp: false });
        }
    },

    logIn: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);

            // Extract user and tokens from response
            const { user, accessToken, refreshToken } = res.data;

            // Store tokens in localStorage
            if (accessToken) {
                localStorage.setItem("accessToken", accessToken);
            }
            if (refreshToken) {
                localStorage.setItem("refreshToken", refreshToken);
            }

            // Update state with user data
            set({ user: user, isLoggedIn: true });

            toast.success("Logged in successfully");

            // Connect socket after state update
            setTimeout(() => get().connectSocket(), 100);
        } catch (err) {
            console.error("Login error:", err);
            toast.error(err?.response?.data?.message || err?.message || "Login failed. Please try again.");
            // Clear any partial data
            set({ user: null, isLoggedIn: false });
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logOut: async () => {
        try {
            // Disconnect socket first
            get().disconnectSocket();

            // Call logout endpoint
            await axiosInstance.post("/auth/logout");

            // Clear state
            set({ user: null, isLoggedIn: false, onlineUsers: [] });

            // Clear tokens from localStorage
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            toast.success("Logged out successfully");

            // Redirect after a small delay
            setTimeout(() => {
                window.location.href = "/login";
            }, 500);
        } catch (err) {
            console.error("Logout error:", err);

            // Even if logout fails, clear local state
            get().disconnectSocket();
            set({ user: null, isLoggedIn: false, onlineUsers: [] });
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            toast.error(err?.response?.data?.message || err?.message || "Logout failed");

            // Still redirect to login
            setTimeout(() => {
                window.location.href = "/login";
            }, 500);
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);

            // Extract updated user from response
            const updatedUser = res.data.user;

            set({ user: updatedUser });
            toast.success("Profile updated successfully");
        } catch (err) {
            console.error("Update Profile error:", err);
            toast.error(err?.response?.data?.message || err?.message || "Update Profile failed. Please try again.");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    updatePassword: async (data) => {
        set({ isUpdatingPassword: true });
        try {
            const res = await axiosInstance.put("/auth/update-password", data);

            // Password update requires re-login
            toast.success("Password updated successfully! Please log in again.");

            // Disconnect socket and clear state
            get().disconnectSocket();
            set({ user: null, isLoggedIn: false });

            // Clear tokens
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            // Redirect to login
            setTimeout(() => {
                window.location.href = "/login";
            }, 1000);
        } catch (err) {
            console.error("Update Password error:", err);
            toast.error(err?.response?.data?.message || err?.message || "Update Password failed. Please try again.");
        } finally {
            set({ isUpdatingPassword: false });
        }
    },

    deleteAccount: async (data = {}) => {
        set({ isDeletingAccount: true });
        try {
            // Disconnect socket first
            get().disconnectSocket();

            await axiosInstance.post("/auth/delete-account", data);

            // Clear state
            set({ user: null, isLoggedIn: false, onlineUsers: [] });

            // Clear tokens
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            toast.success("Account deleted successfully");

            setTimeout(() => {
                window.location.href = "/login";
            }, 500);
        } catch (err) {
            console.error("Delete Account error:", err);
            let errorMessage = "Delete Account failed. Please try again.";
            if (err?.response?.status === 401) {
                errorMessage = "Incorrect password";
            } else if (err?.response?.data?.message) {
                errorMessage = err.response.data.message;
            }
            toast.error(errorMessage);
            throw err;
        } finally {
            set({ isDeletingAccount: false });
        }
    },

    connectSocket: () => {
        const { user, socket: currentSocket } = get();

        // Check if user exists AND has an _id
        if (!user || !user._id) {
            console.log("connectSocket: No user or user._id found, skipping connection.");
            return;
        }

        // Check if a socket connection already exists and is connected
        if (currentSocket?.connected) {
            console.log("connectSocket: Socket already connected.");
            return;
        }

        // If there's a disconnected socket, clean it up first
        if (currentSocket && !currentSocket.connected) {
            console.log("connectSocket: Cleaning up old socket connection.");
            currentSocket.removeAllListeners();
            currentSocket.disconnect();
            set({ socket: null });
        }

        console.log(`connectSocket: Attempting to connect for user ${user._id}`);

        const newSocket = io(socketUrl, {
            query: { userId: user._id },
            transports: ["websocket", "polling"], // Add polling as fallback
            reconnectionAttempts: 5,
            reconnectionDelay: 3000,
            timeout: 10000, // Add timeout
        });

        // Set up event listeners BEFORE connecting
        newSocket.on("connect", () => {
            console.log("Socket connected:", newSocket.id);
            toast.success("Real-time connection established!");
        });

        newSocket.on("getOnlineUsers", (users) => {
            console.log("Online Users:", users);
            set({ onlineUsers: users });
        });

        newSocket.on("connect_error", (err) => {
            console.error("Socket connection error:", err.message);
            toast.error(`Connection failed: ${err.message}`);
        });

        newSocket.on("disconnect", (reason) => {
            console.log("Socket disconnected:", reason);

            // Only show toast for unexpected disconnections
            if (reason !== "io client disconnect") {
                toast.error("Connection lost. Reconnecting...");
            }

            // Clear online users but keep socket for reconnection
            set({ onlineUsers: [] });
        });

        // Update state with the new socket instance
        set({ socket: newSocket });

        // The socket will auto-connect after listeners are set up
    },

    disconnectSocket: () => {
        const socket = get().socket;
        if (socket) {
            console.log("Disconnecting socket...");
            socket.removeAllListeners(); // Remove all listeners to prevent memory leaks
            socket.disconnect();
            set({ socket: null, onlineUsers: [] });
        }
    },
}));
