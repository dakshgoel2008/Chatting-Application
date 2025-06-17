import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useUserAuthStore } from "./userAuthStore";

export const useUserChatStore = create((set, get) => ({
    message: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessageLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/message/users");
            set({ users: res.data.users });
        } catch (err) {
            console.error("Get users error:", err);
            toast.error(err?.response?.data?.message || err?.message || "Get users failed. Please try again.");
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessageLoading: true });
        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            set({ message: res.data.message });
        } catch (err) {
            console.error("Get messages error:", err);
            toast.error(err?.response?.data?.message || err?.message || "Get messages failed. Please try again.");
        } finally {
            set({ isMessageLoading: false });
        }
    },

    
    sendMessage: async (data) => {
        const { selectedUser, message } = get();
        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, data);
            set({ message: [...message, res.data.message] });
        } catch (error) {
            console.error("Send message error:", error);
            toast.error(error?.response?.data?.message || error?.message || "Send message failed. Please try again.");
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useUserAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {
            if (newMessage.senderId !== selectedUser._id) return;
            set({ message: [...get().message, newMessage] });
        });
    },

    unSubscribeToMessages: () => {
        const socket = useUserAuthStore.getState().socket;
        socket.off("newMessage");
    },

    setSelectedUser: (user) => set({ selectedUser: user }),
}));
