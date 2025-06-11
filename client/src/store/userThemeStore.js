import { create } from "zustand";

export const useThemeStore = create((set) => ({
    theme: (() => {
        const initialTheme = localStorage.getItem("chat-theme") || "coffee";
        if (typeof document !== "undefined") {
            document.documentElement.setAttribute("data-theme", initialTheme);
        }
        return initialTheme;
    })(),

    setTheme: (newTheme) => {
        localStorage.setItem("chat-theme", newTheme);
        set({ theme: newTheme });
        if (typeof document !== "undefined") {
            document.documentElement.setAttribute("data-theme", newTheme);
        }
    },
}));
