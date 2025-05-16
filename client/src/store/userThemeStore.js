import { create } from "zustand";

export const useUserThemeStore = create((set) => ({
    theme: localStorage.getItem("my-themes") || "dark", // state
    setThemes: (theme) => {
        localStorage.setItem("my-themes", theme);
        set({ theme });
    },
}));
