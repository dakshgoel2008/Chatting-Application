import { Link } from "react-router-dom";
import {
    LogOut,
    Settings,
    User,
    ArrowLeftRight,
    Search,
    Archive,
    Star,
    Moon,
    Sun,
    HelpCircle,
    Users,
} from "lucide-react";
import { useUserAuthStore } from "../store/userAuthStore";
import { useThemeStore } from "../store/userThemeStore";
import { THEMES } from "../constants";
import { useState, useEffect } from "react";
import ChatLogo from "./ChatLogo";

const NavBar = () => {
    const { user, logOut } = useUserAuthStore();
    const { theme, setTheme } = useThemeStore();
    const [isRightSide, setIsRightSide] = useState(false);
    const [notifications, setNotifications] = useState(3);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Simple theme categorization
    const isLightTheme = (themeName) => {
        const lightThemes = [
            "light",
            "cupcake",
            "bumblebee",
            "emerald",
            "corporate",
            "retro",
            "valentine",
            "garden",
            "lofi",
            "pastel",
            "fantasy",
            "wireframe",
            "cmyk",
            "autumn",
            "acid",
        ];
        return lightThemes.includes(themeName);
    };

    // Load user preferences from localStorage
    useEffect(() => {
        const savedPosition = localStorage.getItem("navbar-position");
        const savedCollapsed = localStorage.getItem("navbar-collapsed") === "true";

        if (savedPosition === "right") setIsRightSide(true);
        setIsCollapsed(savedCollapsed);
    }, []);

    // Toggle navbar position
    const togglePosition = () => {
        const newPosition = !isRightSide;
        setIsRightSide(newPosition);
        localStorage.setItem("navbar-position", newPosition ? "right" : "left");
        window.dispatchEvent(
            new CustomEvent("navbar-position-changed", {
                detail: { position: newPosition ? "right" : "left" },
            })
        );
    };

    // Simple theme toggle that reads directly from localStorage
    const toggleTheme = () => {
        // Get preferred themes from localStorage, with fallbacks
        const preferredLight = localStorage.getItem("preferred-light-theme") || "light";
        const preferredDark = localStorage.getItem("preferred-dark-theme") || "dark";

        // Ensure the themes exist in our THEMES array
        const lightTheme = THEMES.includes(preferredLight) ? preferredLight : "light";
        const darkTheme = THEMES.includes(preferredDark) ? preferredDark : "dark";

        if (isLightTheme(theme)) {
            // Currently light, switch to dark
            setTheme(darkTheme);
        } else {
            // Currently dark, switch to light
            setTheme(lightTheme);
        }
    };

    // Toggle navbar collapse
    const toggleCollapse = () => {
        const newCollapsed = !isCollapsed;
        setIsCollapsed(newCollapsed);
        localStorage.setItem("navbar-collapsed", newCollapsed.toString());
    };

    // Create new chat/conversation
    const handleNewChat = () => {
        console.log("Creating new chat...");
    };

    // Handle notifications
    const handleNotifications = () => {
        console.log("Opening notifications...");
    };

    // Handle search
    const handleSearch = () => {
        console.log("Opening search...");
    };

    const navWidth = isCollapsed ? "w-14" : "w-20";

    return (
        <nav
            className={`fixed top-0 h-full ${navWidth} z-40 border-base-300 backdrop-blur-lg transition-all duration-300
        ${isRightSide ? "right-0 border-l" : "left-0 border-r"}
        overflow-hidden
        ${isLightTheme(theme) ? "bg-blue-50 text-gray-900" : "bg-gray-900 text-white"} transition-colors duration-500
    `}
        >
            <div className="flex flex-col h-full bg-slate-500">
                {/* Fixed Logo */}
                <div className="flex-shrink-0 p-3 pb-0">
                    <Link to="/" className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity group">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                            <ChatLogo size="small" />
                        </div>
                        {!isCollapsed && <span className="text-xs font-bold text-center">WhatsUp</span>}
                    </Link>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-transparent p-3 pt-6">
                    {/* Quick Actions */}
                    <div className="flex flex-col gap-2 mb-4 pb-4 border-b border-base-300">
                        {user && (
                            <>
                                {/* Search */}
                                <button
                                    onClick={handleSearch}
                                    className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-base-200 transition-colors group"
                                    title="Search"
                                >
                                    <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    {!isCollapsed && <span className="text-xs">Search</span>}
                                </button>
                            </>
                        )}
                    </div>

                    {/* Navigation Items */}
                    <div className="flex flex-col gap-2 mb-4">
                        {user && (
                            <>
                                {/* Contacts */}
                                <Link
                                    to="/"
                                    className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-base-200 transition-colors group"
                                    title="Contacts"
                                >
                                    <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    {!isCollapsed && <span className="text-xs">Contacts</span>}
                                </Link>
                                <Link
                                    to="/starred"
                                    className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-base-200 transition-colors group"
                                    title="Starred"
                                >
                                    <Star className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    {!isCollapsed && <span className="text-xs">Starred</span>}
                                </Link>

                                {/* Archived Chats */}
                                <Link
                                    to="/archived"
                                    className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-base-200 transition-colors group"
                                    title="Archived"
                                >
                                    <Archive className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    {!isCollapsed && <span className="text-xs">Archive</span>}
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Theme Toggle - Simplified */}
                    <button
                        onClick={toggleTheme}
                        className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-base-200 transition-colors group w-full"
                        title={`Switch to ${isLightTheme(theme) ? "Dark" : "Light"} Mode`}
                    >
                        {isLightTheme(theme) ? (
                            <Moon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        ) : (
                            <Sun className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        )}
                        {!isCollapsed && <span className="text-xs">{isLightTheme(theme) ? "Dark" : "Light"}</span>}
                    </button>

                    {/* Help - only when user is not logged in */}
                    {!user && (
                        <Link
                            to="/support"
                            className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-base-200 transition-colors group"
                            title="Help & Support"
                        >
                            <HelpCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            {!isCollapsed && <span className="text-xs">Help</span>}
                        </Link>
                    )}

                    {/* Collapse Toggle */}
                    <button
                        onClick={toggleCollapse}
                        className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-base-200 transition-colors group w-full"
                        title={isCollapsed ? "Expand Navbar" : "Collapse Navbar"}
                    >
                        <ArrowLeftRight
                            className={`w-4 h-4 group-hover:scale-110 transition-transform ${
                                isCollapsed ? "rotate-90" : ""
                            }`}
                        />
                        {!isCollapsed && <span className="text-xs">Collapse</span>}
                    </button>

                    {/* Position Toggle */}
                    <button
                        onClick={togglePosition}
                        className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-base-200 transition-colors group w-full"
                        title={`Move to ${isRightSide ? "Left" : "Right"} Side`}
                    >
                        <ArrowLeftRight className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        {!isCollapsed && <span className="text-xs">{isRightSide ? "Left" : "Right"}</span>}
                    </button>
                </div>

                {/* Bottom Fixed Section */}
                <div className="flex-shrink-0 p-3 pt-0 space-y-2">
                    <div className="pt-3 border-t border-base-300 space-y-2">
                        {/* Settings */}
                        <Link
                            to="/settings"
                            className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-base-200 transition-colors group"
                            title="Settings"
                        >
                            <Settings className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            {!isCollapsed && <span className="text-xs">Settings</span>}
                        </Link>
                        {/* Profile */}
                        {user && (
                            <Link
                                to="/profile"
                                className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-base-200 transition-colors group"
                                title="Profile"
                            >
                                <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                {!isCollapsed && <span className="text-xs">Profile</span>}
                            </Link>
                        )}
                        {user && (
                            /* Logout */
                            <button
                                onClick={logOut}
                                className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-red-900/10 hover:text-error transition-colors group w-full"
                                title="Logout"
                            >
                                <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                {!isCollapsed && <span className="text-xs">Logout</span>}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
