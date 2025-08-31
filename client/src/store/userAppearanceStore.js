import { create } from "zustand";

const getInitialState = () => {
    if (typeof window !== "undefined") {
        const savedState = localStorage.getItem("chat-appearance");
        if (savedState) {
            return JSON.parse(savedState);
        }
    }
    return {
        chatBackground: "default",
        bubbleStyle: "rounded",
        fontSize: "medium",
        density: "comfortable",
        showTimestamps: true,
        showAvatars: true,
        animationsEnabled: true,
    };
};

export const useUserAppearanceStore = create((set) => ({
    ...getInitialState(),
    setAppearance: (settings) => {
        set((state) => {
            const newState = { ...state, ...settings };
            if (typeof window !== "undefined") {
                localStorage.setItem("chat-appearance", JSON.stringify(newState));
            }
            return newState;
        });
    },
    resetAppearance: () => {
        const defaultState = {
            chatBackground: "default",
            bubbleStyle: "rounded",
            fontSize: "medium",
            density: "comfortable",
            showTimestamps: true,
            showAvatars: true,
            animationsEnabled: true,
        };
        set(defaultState);
        if (typeof window !== "undefined") {
            localStorage.setItem("chat-appearance", JSON.stringify(defaultState));
        }
    },
}));
