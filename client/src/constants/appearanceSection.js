export const PREVIEW_MESSAGES = [
    { id: 1, content: "Hey! What's your current rating on codeforces and codechef?", isSent: false },
    { id: 2, content: "More than u can even imagine!", isSent: true },
    { id: 3, content: "Haha, let's see! Share your profile 😄", isSent: false },
];

export const BACKGROUND_OPTIONS = [
    // Solids
    { id: "default", name: "Default", type: "solid", value: "bg-base-100" },
    { id: "dark_solid", name: "Dark", type: "solid", value: "bg-neutral" },
    { id: "light_gray", name: "Light Gray", type: "solid", value: "bg-slate-100" },

    // Gradients
    {
        id: "ocean",
        name: "Ocean",
        type: "gradient",
        value: "bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-500",
    },
    {
        id: "sunset",
        name: "Sunset",
        type: "gradient",
        value: "bg-gradient-to-br from-orange-400 via-red-500 to-pink-500",
    },
    {
        id: "forest",
        name: "Forest",
        type: "gradient",
        value: "bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500",
    },
    {
        id: "royal",
        name: "Royal",
        type: "gradient",
        value: "bg-gradient-to-br from-purple-400 via-violet-500 to-indigo-500",
    },
    {
        id: "midnight",
        name: "Midnight",
        type: "gradient",
        value: "bg-gradient-to-br from-gray-800 via-gray-900 to-black",
    },
    {
        id: "candy",
        name: "Candy",
        type: "gradient",
        value: "bg-gradient-to-br from-pink-300 via-orange-300 to-yellow-300",
    },

    // Patterns
    {
        id: "dots",
        name: "Dots",
        type: "pattern",
        value: "bg-base-100",
        pattern: "radial-gradient(circle, #00000010 1px, transparent 1px)",
        patternSize: "16px 16px",
    },
    {
        id: "lines",
        name: "Lines",
        type: "pattern",
        value: "bg-base-100",
        pattern: "linear-gradient(45deg, transparent 40%, #00000008 50%, transparent 60%)",
        patternSize: "20px 20px",
    },
    {
        id: "checkered",
        name: "Checkered",
        type: "pattern",
        value: "bg-slate-100",
        pattern:
            "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
        patternSize: "20px 20px",
    },
    {
        id: "geometric",
        name: "Geometric",
        type: "pattern",
        value: "bg-base-200",
        pattern:
            "linear-gradient(60deg, #f2f2f2 1.2px, transparent 1.2px), linear-gradient(-60deg, #f2f2f2 1.2px, transparent 1.2px), linear-gradient(120deg, #f2f2f2 1.2px, transparent 1.2px), linear-gradient(-120deg, #f2f2f2 1.2px, transparent 1.2px)",
        patternSize: "20px 35px",
    },
    {
        id: "crosshatch",
        name: "Crosshatch",
        type: "pattern",
        value: "bg-base-100",
        pattern:
            "repeating-linear-gradient(45deg, rgba(0,0,0,0.05), rgba(0,0,0,0.05) 1px, transparent 1px, transparent 10px), repeating-linear-gradient(-45deg, rgba(0,0,0,0.05), rgba(0,0,0,0.05) 1px, transparent 1px, transparent 10px)",
        patternSize: "auto",
    },

    // Images
    {
        id: "image_light",
        name: "Doodles Light",
        type: "image",
        value: "bg-cover bg-center",
        imageUrl: "/ChatWindowLight.png",
    },
    {
        id: "image_dark",
        name: "Doodles Dark",
        type: "image",
        value: "bg-cover bg-center",
        imageUrl: "/ChatWindowDark.png",
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
