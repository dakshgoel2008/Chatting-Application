import { Link, useLocation } from "react-router-dom";
import {
    LogOut,
    Settings,
    User,
    ArrowLeftRight,
    Search,
    Archive,
    Moon,
    Sun,
    HelpCircle,
    Users,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useUserAuthStore } from "../store/userAuthStore";
import { useThemeStore } from "../store/userThemeStore";
import { THEMES } from "../constants";
import { useState, useEffect, useCallback, useMemo } from "react";
import ChatLogo from "./ChatLogo";

const NavBar = () => {
    const { user, logOut } = useUserAuthStore();
    const { theme, setTheme } = useThemeStore();
    const location = useLocation();

    // State management
    const [isRightSide, setIsRightSide] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Memoized theme calculations
    const isLightTheme = useMemo(() => {
        const lightThemes = ["light"];
        return lightThemes.includes(theme);
    }, [theme]);

    // Load user preferences
    useEffect(() => {
        const savedPosition = localStorage.getItem("navbar-position");
        const savedCollapsed = localStorage.getItem("navbar-collapsed") === "true";

        if (savedPosition === "right") setIsRightSide(true);
        setIsCollapsed(savedCollapsed);
    }, []);

    // Memoized navigation items
    const navigationItems = useMemo(
        () => [
            { path: "/", icon: Users, label: "Contacts", requiresAuth: true },
            // { path: "/starred", icon: Star, label: "Starred", requiresAuth: true },
            // { path: "/archived", icon: Archive, label: "Archive", requiresAuth: true },
        ],
        []
    );

    const quickActions = useMemo(() => [{ action: "search", icon: Search, label: "Search", requiresAuth: true }], []);

    // Handlers with useCallback for performance
    const togglePosition = useCallback(() => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        const newPosition = !isRightSide;
        setIsRightSide(newPosition);
        localStorage.setItem("navbar-position", newPosition ? "right" : "left");

        window.dispatchEvent(
            new CustomEvent("navbar-position-changed", {
                detail: { position: newPosition ? "right" : "left" },
            })
        );

        setTimeout(() => setIsTransitioning(false), 300);
    }, [isRightSide, isTransitioning]);

    const toggleTheme = useCallback(() => {
        const preferredLight = localStorage.getItem("preferred-light-theme") || "light";
        const preferredDark = localStorage.getItem("preferred-dark-theme") || "dark";

        const lightTheme = THEMES.includes(preferredLight) ? preferredLight : "light";
        const darkTheme = THEMES.includes(preferredDark) ? preferredDark : "dark";

        setTheme(isLightTheme ? darkTheme : lightTheme);
    }, [isLightTheme, setTheme]);

    const toggleCollapse = useCallback(() => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        const newCollapsed = !isCollapsed;
        setIsCollapsed(newCollapsed);
        localStorage.setItem("navbar-collapsed", newCollapsed.toString());

        setTimeout(() => setIsTransitioning(false), 300);
    }, [isCollapsed, isTransitioning]);

    const handleSearch = useCallback(() => {
        // console.log("Opening search...");
        alert("Demo: Opening search...");
    }, []);

    const handleLogout = useCallback(async () => {
        try {
            await logOut();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }, [logOut]);

    // Check if current path is active
    const isActivePath = useCallback(
        (path) => {
            return location.pathname === path;
        },
        [location.pathname]
    );

    // Dynamic classes
    const navClasses = useMemo(() => {
        const baseClasses = "fixed top-0 h-full z-40 backdrop-blur-lg transition-all duration-300 overflow-hidden";
        const widthClass = isCollapsed ? "w-16" : "w-20";
        const positionClass = isRightSide ? "right-0 border-l" : "left-0 border-r";
        const themeClasses = isLightTheme
            ? "bg-white/95 text-gray-900 border-gray-200"
            : "bg-gray-900/95 text-white border-gray-700";

        return `${baseClasses} ${widthClass} ${positionClass} ${themeClasses}`;
    }, [isCollapsed, isRightSide, isLightTheme]);

    // Navigation item component
    const NavItem = ({ item, isActive = false }) => (
        <Link
            to={item.path}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 group relative
                ${isActive ? "bg-primary/20 text-primary" : "hover:bg-base-200 hover:scale-105"}
            `}
            title={item.label}
            aria-label={item.label}
        >
            <item.icon
                className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? "scale-110" : ""}`}
            />
            {!isCollapsed && (
                <span className={`text-xs font-medium ${isActive ? "text-primary" : ""}`}>{item.label}</span>
            )}
            {isActive && (
                <div
                    className={`absolute -left-1 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-primary rounded-r
                    ${isRightSide ? "-right-1 left-auto rounded-l rounded-r-none" : ""}
                `}
                />
            )}
        </Link>
    );

    // Action button component
    const ActionButton = ({ onClick, icon: Icon, label, variant = "default", disabled = false }) => (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 group w-full
                ${variant === "danger" ? "hover:bg-red-500/10 hover:text-red-500" : "hover:bg-base-200 hover:scale-105"}
                ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
            title={label}
            aria-label={label}
        >
            <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
            {!isCollapsed && <span className="text-xs font-medium">{label}</span>}
        </button>
    );

    return (
        <nav className={navClasses} role="navigation" aria-label="Main navigation">
            <div className="flex flex-col h-full">
                {/* Logo Section */}
                <header className="flex-shrink-0 p-3 pb-0">
                    <Link
                        to="/"
                        className="flex flex-col items-center gap-1 hover:opacity-80 transition-all duration-200 group"
                        aria-label="WhatsUp Home"
                    >
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                            <ChatLogo size="small" />
                        </div>
                        {!isCollapsed && (
                            <span className="text-xs font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                WhatsUp
                            </span>
                        )}
                    </Link>
                </header>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-transparent p-3 pt-6">
                    {/* Quick Actions */}
                    {user && (
                        <section className="mb-4 pb-4 border-b border-base-300">
                            <div className="flex flex-col gap-2">
                                {quickActions.map((action) => (
                                    <ActionButton
                                        key={action.action}
                                        onClick={handleSearch}
                                        icon={action.icon}
                                        label={action.label}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Navigation Items */}
                    {user && (
                        <section className="mb-4">
                            <div className="flex flex-col gap-2">
                                {navigationItems.map((item) => (
                                    <NavItem key={item.path} item={item} isActive={isActivePath(item.path)} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Utility Controls */}
                    <section className="space-y-2">
                        {/* Theme Toggle */}
                        <ActionButton
                            onClick={toggleTheme}
                            icon={isLightTheme ? Moon : Sun}
                            label={`${isLightTheme ? "Dark" : "Light"} Mode`}
                        />

                        {/* Help - only when user is not logged in */}
                        {!user && (
                            <Link
                                to="/support"
                                className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-base-200 hover:scale-105 transition-all duration-200 group"
                                title="Help & Support"
                                aria-label="Help & Support"
                            >
                                <HelpCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                {!isCollapsed && <span className="text-xs font-medium">Help</span>}
                            </Link>
                        )}

                        {/* Collapse Toggle */}
                        <ActionButton
                            onClick={toggleCollapse}
                            icon={isCollapsed ? ChevronRight : ChevronLeft}
                            label={isCollapsed ? "Expand" : "Collapse"}
                            disabled={isTransitioning}
                        />

                        {/* Position Toggle */}
                        <ActionButton
                            onClick={togglePosition}
                            icon={ArrowLeftRight}
                            label={`Move ${isRightSide ? "Left" : "Right"}`}
                            disabled={isTransitioning}
                        />
                    </section>
                </main>

                {/* Bottom Fixed Section */}
                <footer className="flex-shrink-0 p-3 pt-0">
                    <div className="pt-3 border-t border-base-300 space-y-2">
                        {/* Settings */}
                        <Link
                            to="/settings"
                            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 group
                                ${
                                    isActivePath("/settings")
                                        ? "bg-primary/20 text-primary"
                                        : "hover:bg-base-200 hover:scale-105"
                                }
                            `}
                            title="Settings"
                            aria-label="Settings"
                        >
                            <Settings className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            {!isCollapsed && <span className="text-xs font-medium">Settings</span>}
                        </Link>

                        {/* Profile */}
                        {user && (
                            <Link
                                to="/profile"
                                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 group
                                    ${
                                        isActivePath("/profile")
                                            ? "bg-primary/20 text-primary"
                                            : "hover:bg-base-200 hover:scale-105"
                                    }
                                `}
                                title="Profile"
                                aria-label="Profile"
                            >
                                <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                {!isCollapsed && <span className="text-xs font-medium">Profile</span>}
                            </Link>
                        )}

                        {/* Logout */}
                        {user && <ActionButton onClick={handleLogout} icon={LogOut} label="Logout" variant="danger" />}
                    </div>
                </footer>
            </div>
        </nav>
    );
};

export default NavBar;
