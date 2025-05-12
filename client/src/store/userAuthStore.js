import { create } from "zustand";
import { axiosInstance } from "./../lib/axios";

export const useUserAuthStore = create((set) => ({
    isLoggedIn: false,
    user: null,
    isSignuUp: false,
    isUpdatingProfile: false,
    isCheckAuth: false,

    // function to check if we got the user so as to implement logic of spinner and now allow
    // the user to see the app before we check if he is logged in or not
    checkAuth: async () => {
        try {
            const data = await axiosInstance.get("/auth/check");
            set({ user: data.data });
        } catch (err) {
            console.log("Error:", err);
            set({ user: null });
        } finally {
            set({ isCheckAuth: true });
        }
    },
}));
