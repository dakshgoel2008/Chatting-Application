import { Palette, User, Bell, Shield, Info } from "lucide-react";

export const settingSections = [
    {
        id: "appearance",
        label: "Appearance",
        icon: Palette,
        requiresAuth: false,
        description: "Customize the look and feel of your chat interface",
    },
    {
        id: "notifications",
        label: "Notifications",
        icon: Bell,
        requiresAuth: true,
        description: "Control how and when you receive notifications",
    },
    {
        id: "privacy",
        label: "Privacy & Security",
        icon: Shield,
        requiresAuth: true,
        description: "Manage your privacy settings and security options",
    },
    {
        id: "profile",
        label: "Profile",
        icon: User,
        requiresAuth: true,
        description: "Manage your profile information and preferences",
    },
    {
        id: "about",
        label: "About",
        icon: Info,
        requiresAuth: false,
        description: "App information and support",
    },
];
