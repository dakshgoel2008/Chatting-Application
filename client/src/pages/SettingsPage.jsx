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
        <div className="h-screen container mx-auto px-4 pt-20 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
                {/* Settings Navigation */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        <h2 className="text-2xl font-bold mb-6">Settings</h2>
                        <div className="space-y-2">
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
                                        <div>
                                            <div className="font-medium">{section.label}</div>
                                            <div
                                                className={`text-xs ${
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
                                    <strong>Sign in</strong> to access more settings and personalize your experience.
                                </p>
                                <button className="btn btn-warning btn-sm mt-2" onClick={() => navigate("/signup")}>
                                    Sign In
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Settings Content */}
                <div className="lg:col-span-3">
                    <div className="bg-base-100 rounded-xl p-6 shadow-sm">{renderSettingContent()}</div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
