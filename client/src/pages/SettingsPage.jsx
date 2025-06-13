import { useThemeStore } from "../store/userThemeStore.js";
import { useEffect, useState } from "react";
import { settingSections } from "../constants/settingSections.js";
import { useUserAuthStore } from "../store/userAuthStore.js";
import { useNavigate } from "react-router-dom";
import Appearance from "../components/SettingPageRenderers/Appearance.jsx";
import Profile from "../components/SettingPageRenderers/Profile.jsx";
import Notification from "../components/SettingPageRenderers/Notification.jsx";
import About from "../components/SettingPageRenderers/About.jsx";
import Privacy from "../components/SettingPageRenderers/Privacy.jsx";

const SettingsPage = () => {
    const { theme } = useThemeStore();
    const [activeSection, setActiveSection] = useState("appearance");
    const navigate = useNavigate();
    const { isLoggedIn } = useUserAuthStore();

    // Apply theme to document when component mounts or theme changes
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    const visibleSections = settingSections.filter((section) => !section.requiresAuth || isLoggedIn);

    const renderSettingContent = () => {
        switch (activeSection) {
            case "appearance":
                return <Appearance />;
            case "profile":
                return <Profile />;
            case "notifications":
                return <Notification />;
            case "privacy":
                return <Privacy />;
            case "about":
                return <About />;
            default:
                return <Appearance />;
        }
    };

    return (
        <div className="h-screen flex flex-col">
            <div className="flex-1 container mx-auto px-2 sm:px-4 pt-20 pb-8 max-w-6xl overflow-hidden">
                {/* Mobile Header */}
                <div className="lg:hidden mb-4">
                    <h2 className="text-2xl font-bold">Settings</h2>
                </div>

                <div className="h-full flex flex-col lg:grid lg:grid-cols-4 gap-4 lg:gap-6 overflow-hidden">
                    {/* Settings Navigation */}
                    <div className="lg:col-span-1 flex-shrink-0">
                        <div className="h-full lg:sticky lg:top-24">
                            {/* Desktop Header */}
                            <h2 className="hidden lg:block text-2xl font-bold mb-6">Settings</h2>

                            {/* Mobile Navigation - Horizontal Scroll */}
                            <div className="lg:hidden mb-4">
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                    {visibleSections.map((section) => {
                                        const IconComponent = section.icon;
                                        return (
                                            <button
                                                key={section.id}
                                                onClick={() => setActiveSection(section.id)}
                                                className={`
                                                    flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[80px]
                                                    ${
                                                        activeSection === section.id
                                                            ? "bg-primary text-primary-content"
                                                            : "hover:bg-base-200 bg-base-100"
                                                    }
                                                `}
                                            >
                                                <IconComponent size={18} />
                                                <span className="text-xs font-medium text-center whitespace-nowrap">
                                                    {section.label}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Desktop Navigation - Vertical */}
                            <div className="hidden lg:block">
                                <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                                    {visibleSections.map((section) => {
                                        const IconComponent = section.icon;
                                        return (
                                            <button
                                                key={section.id}
                                                onClick={() => setActiveSection(section.id)}
                                                className={`
                                                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors
                                                    ${
                                                        activeSection === section.id
                                                            ? "bg-primary text-primary-content"
                                                            : "hover:bg-base-200"
                                                    }
                                                `}
                                            >
                                                <IconComponent size={20} />
                                                <div className="min-w-0 flex-1">
                                                    <div className="font-medium truncate">{section.label}</div>
                                                    <div
                                                        className={`text-xs line-clamp-2 ${
                                                            activeSection === section.id
                                                                ? "text-primary-content/70"
                                                                : "text-base-content/60"
                                                        }`}
                                                    >
                                                        {section.description}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>

                                {!isLoggedIn && (
                                    <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
                                        <p className="text-sm text-warning-content">
                                            <strong>Log in</strong> to access more settings and personalize your
                                            experience.
                                        </p>
                                        <button
                                            className="btn btn-warning btn-sm mt-2"
                                            onClick={() => navigate("/login")}
                                        >
                                            LogIn
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Settings Content */}
                    <div className="lg:col-span-3 flex-1 min-h-0">
                        <div className="h-full bg-base-100 rounded-xl shadow-sm flex flex-col">
                            <div className="flex-1 p-4 sm:p-6 overflow-y-auto">{renderSettingContent()}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
