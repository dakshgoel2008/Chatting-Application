export const PREVIEW_MESSAGES = [
    { id: 1, content: "Hey! What's your current rating on codeforces and codechef?", isSent: false },
    { id: 2, content: "More than u can even imagine!", isSent: true },
    { id: 3, content: "Haha, let's see! Share your profile 😄", isSent: false },
];

export const BACKGROUND_OPTIONS = [
    { id: "default", name: "Default", type: "solid", value: "bg-base-100" },
    { id: "dark", name: "Dark", type: "solid", value: "bg-neutral" },
    {
        id: "gradient1",
        name: "Ocean",
        type: "gradient",
        value: "bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-500",
    },
    {
        id: "gradient2",
        name: "Sunset",
        type: "gradient",
        value: "bg-gradient-to-br from-orange-400 via-red-500 to-pink-500",
    },
    {
        id: "gradient3",
        name: "Forest",
        type: "gradient",
        value: "bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500",
    },
    {
        id: "gradient4",
        name: "Purple",
        type: "gradient",
        value: "bg-gradient-to-br from-purple-400 via-violet-500 to-indigo-500",
    },
    {
        id: "pattern1",
        name: "Dots",
        type: "pattern",
        value: "bg-base-100",
        pattern: "radial-gradient(circle, #00000010 1px, transparent 1px)",
    },
    {
        id: "pattern2",
        name: "Lines",
        type: "pattern",
        value: "bg-base-100",
        pattern: "linear-gradient(45deg, transparent 40%, #00000008 50%, transparent 60%)",
    },
];

export const BUBBLE_STYLES = [
    { id: "rounded", name: "Rounded", class: "rounded-xl" },
    { id: "sharp", name: "Sharp", class: "rounded-none" },
    { id: "bubble", name: "Bubble", class: "rounded-3xl" },
    { id: "minimal", name: "Minimal", class: "rounded-md" },
];

export const FONT_SIZES = [
    { id: "small", name: "Small", class: "text-xs", value: "12px" },
    { id: "medium", name: "Medium", class: "text-sm", value: "14px" },
    { id: "large", name: "Large", class: "text-base", value: "16px" },
    { id: "xlarge", name: "Extra Large", class: "text-lg", value: "18px" },
];

export const DENSITY_OPTIONS = [
    { id: "compact", name: "Compact", spacing: "space-y-2", padding: "p-2" },
    { id: "comfortable", name: "Comfortable", spacing: "space-y-4", padding: "p-3" },
    { id: "spacious", name: "Spacious", spacing: "space-y-6", padding: "p-4" },
];
