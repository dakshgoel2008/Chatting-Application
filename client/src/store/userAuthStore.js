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
            // socket:
            get().connectSocket();
        } catch (err) {
            console.error("Auth check failed:", err);
            set({ user: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

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
            await axiosInstance.post("/auth/delete-account", data);
            set({ user: null, isLoggedIn: false });
            get().disconnectSocket();
            toast.success("Account deleted successfully");
            window.location.href = "/login";
        } catch (err) {
            console.log("Delete Account error:", err);
            let errorMessage = "Delete Account failed. Please try again.";
            if (err?.response?.status === 401) {
                errorMessage = "Incorrect password";
            }
            // ... (keep existing error handling) ...
            toast.error(errorMessage);
            throw err;
        } finally {
            set({ isDeletingAccount: false });
        }
    },

    connectSocket: () => {
        const { user, socket: currentSocket } = get(); // Get current user and socket state

        // 1. Check if user exists AND has an _id
        // 2. Check if a socket connection already exists and is connected
        if (!user || !user._id || currentSocket?.connected) {
            if (!user || !user._id) {
                console.log("connectSocket: No user or user._id found, skipping connection.");
            }
            if (currentSocket?.connected) {
                console.log("connectSocket: Socket already connected.");
            }
            return; // Don't connect if no user ID or already connected
        }

        console.log(`connectSocket: Attempting to connect for user ${user._id}`); // Log connection attempt

        // Use the socketUrl defined at the top
        const newSocket = io(socketUrl, {
            query: { userId: user._id }, // Pass the confirmed user._id
            transports: ["websocket"],
            // Add reconnection attempts for more robustness
            reconnectionAttempts: 5,
            reconnectionDelay: 3000,
        });

        newSocket.connect();

        // Update state with the new socket instance
        set({ socket: newSocket });

        // Move event listeners setup here, associated with the newSocket instance
        newSocket.on("getOnlineUsers", (users) => {
            console.log("Online Users:", users);
            set({ onlineUsers: users });
        });

        newSocket.on("connect_error", (err) => {
            console.error("Socket connection error:", err.message, err.cause);
            toast.error(`Socket connection failed: ${err.message}`);
            // Optional: You might want to disconnect or clear socket state here on persistent errors
            set({ socket: null }); // Clear socket state on connection error
        });

        newSocket.on("connect", () => {
            console.log("Socket connected:", newSocket.id);
            toast.success("Real-time connection established!");
        });

        newSocket.on("disconnect", (reason) => {
            console.log("Socket disconnected:", reason);
            toast.error("Real-time connection lost. Reconnecting...");
            // Clear socket state on disconnect, rely on checkAuth/login to reconnect
            set({ socket: null, onlineUsers: [] });
            // Let the built-in reconnection logic handle reconnection attempts
        });
    },

    // Keep disconnectSocket as is
    disconnectSocket: () => {
        const socket = get().socket;
        if (socket?.connected) {
            socket.disconnect();
            console.log("Socket disconnected manually.");
            set({ socket: null, onlineUsers: [] });
        }
    },
}));
