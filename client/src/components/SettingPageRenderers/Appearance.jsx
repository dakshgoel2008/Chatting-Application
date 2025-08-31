import { THEMES } from "../../constants";
import { useThemeStore } from "../../store/userThemeStore";
import { useUserAppearanceStore } from "../../store/userAppearanceStore";
import { Send, Image, Palette, Type, MessageCircle, Eye, Monitor, Smartphone } from "lucide-react";
import { useState } from "react";
import {
    PREVIEW_MESSAGES,
    BACKGROUND_OPTIONS,
    BUBBLE_STYLES,
    FONT_SIZES,
    DENSITY_OPTIONS,
} from "../../constants/appearanceSection.js";

const Appearance = () => {
    const { theme, setTheme } = useThemeStore();
    const {
        chatBackground,
        bubbleStyle,
        fontSize,
        density,
        showTimestamps,
        showAvatars,
        animationsEnabled,
        setAppearance,
        resetAppearance,
    } = useUserAppearanceStore();

    const [activeTab, setActiveTab] = useState("themes");

    const getCurrentBackground = () => {
        const bg = BACKGROUND_OPTIONS.find((bg) => bg.id === chatBackground);
        return bg || BACKGROUND_OPTIONS[0];
    };

    const getCurrentBubbleStyle = () => {
        return BUBBLE_STYLES.find((style) => style.id === bubbleStyle)?.class || "rounded-xl";
    };

    const getCurrentFontSize = () => {
        return FONT_SIZES.find((size) => size.id === fontSize)?.class || "text-sm";
    };

    const getCurrentDensity = () => {
        return DENSITY_OPTIONS.find((d) => d.id === density) || DENSITY_OPTIONS[1];
    };

    const tabs = [
        { id: "themes", name: "Themes", icon: Palette },
        { id: "background", name: "Background", icon: Image },
        { id: "messages", name: "Messages", icon: MessageCircle },
        { id: "display", name: "Display", icon: Eye },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h3 className="text-xl font-semibold">Appearance Settings</h3>
                <p className="text-sm text-base-content/70">Customize your chat interface to match your style</p>
            </div>

            {/* Tab Navigation */}
            <div className="tabs tabs-boxed bg-base-200 p-1">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            className={`tab gap-2 flex-1 ${activeTab === tab.id ? "tab-active" : ""}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <Icon size={16} />
                            <span className="hidden sm:inline">{tab.name}</span>
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {/* Themes Tab */}
                {activeTab === "themes" && (
                    <div className="space-y-4">
                        <h4 className="text-lg font-medium flex items-center gap-2">
                            <Palette size={20} />
                            Color Themes
                        </h4>
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                            {THEMES.map((t) => (
                                <button
                                    key={t}
                                    className={`
                                        group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all duration-200
                                        ${
                                            theme === t
                                                ? "bg-base-200 ring-2 ring-primary scale-105"
                                                : "hover:bg-base-200/50 hover:scale-102"
                                        }
                                    `}
                                    onClick={() => setTheme(t)}
                                >
                                    <div className="relative h-8 w-full rounded-md overflow-hidden" data-theme={t}>
                                        <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                                            <div className="rounded bg-primary"></div>
                                            <div className="rounded bg-secondary"></div>
                                            <div className="rounded bg-accent"></div>
                                            <div className="rounded bg-neutral"></div>
                                        </div>
                                    </div>
                                    <span className="text-[11px] font-medium truncate w-full text-center">
                                        {t.charAt(0).toUpperCase() + t.slice(1)}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Background Tab */}
                {activeTab === "background" && (
                    <div className="space-y-4">
                        <h4 className="text-lg font-medium flex items-center gap-2">
                            <Image size={20} />
                            Chat Background
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {BACKGROUND_OPTIONS.map((bg) => (
                                <button
                                    key={bg.id}
                                    className={`
                                        relative h-20 rounded-lg border-2 overflow-hidden transition-all duration-200
                                        ${
                                            chatBackground === bg.id
                                                ? "border-primary ring-2 ring-primary/20"
                                                : "border-base-300 hover:border-base-400"
                                        }
                                    `}
                                    onClick={() => setAppearance({ chatBackground: bg.id })}
                                >
                                    <div
                                        className={`w-full h-full ${bg.value}`}
                                        style={
                                            bg.imageUrl
                                                ? { backgroundImage: `url(${bg.imageUrl})` }
                                                : bg.pattern
                                                ? {
                                                      backgroundImage: bg.pattern,
                                                      backgroundSize: bg.patternSize || "20px 20px",
                                                  }
                                                : {}
                                        }
                                    >
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-xs font-medium bg-black/20 text-white px-2 py-1 rounded">
                                                {bg.name}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Messages Tab */}
                {activeTab === "messages" && (
                    <div className="space-y-6">
                        <h4 className="text-lg font-medium flex items-center gap-2">
                            <MessageCircle size={20} />
                            Message Appearance
                        </h4>

                        {/* Bubble Style */}
                        <div className="space-y-3">
                            <h5 className="font-medium">Bubble Style</h5>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {BUBBLE_STYLES.map((style) => (
                                    <button
                                        key={style.id}
                                        className={`
                                            p-3 border-2 transition-all duration-200 ${style.class}
                                            ${
                                                bubbleStyle === style.id
                                                    ? "border-primary bg-primary/10"
                                                    : "border-base-300 hover:border-base-400"
                                            }
                                        `}
                                        onClick={() => setAppearance({ bubbleStyle: style.id })}
                                    >
                                        <div className={`w-full h-8 bg-primary/20 ${style.class} mb-2`}></div>
                                        <span className="text-sm font-medium">{style.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Font Size */}
                        <div className="space-y-3">
                            <h5 className="font-medium">Font Size</h5>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {FONT_SIZES.map((size) => (
                                    <button
                                        key={size.id}
                                        className={`
                                            p-3 border-2 rounded-lg transition-all duration-200
                                            ${
                                                fontSize === size.id
                                                    ? "border-primary bg-primary/10"
                                                    : "border-base-300 hover:border-base-400"
                                            }
                                        `}
                                        onClick={() => setAppearance({ fontSize: size.id })}
                                    >
                                        <div className={`${size.class} font-medium mb-1`}>Aa</div>
                                        <span className="text-xs">{size.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Display Tab */}
                {activeTab === "display" && (
                    <div className="space-y-6">
                        <h4 className="text-lg font-medium flex items-center gap-2">
                            <Eye size={20} />
                            Display Options
                        </h4>

                        {/* Density */}
                        <div className="space-y-3">
                            <h5 className="font-medium">Message Density</h5>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {DENSITY_OPTIONS.map((d) => (
                                    <button
                                        key={d.id}
                                        className={`
                                            p-4 border-2 rounded-lg transition-all duration-200 text-left
                                            ${
                                                density === d.id
                                                    ? "border-primary bg-primary/10"
                                                    : "border-base-300 hover:border-base-400"
                                            }
                                        `}
                                        onClick={() => setAppearance({ density: d.id })}
                                    >
                                        <div className={`${d.spacing} mb-2`}>
                                            <div className={`w-full h-2 bg-primary/20 rounded ${d.padding}`}></div>
                                            <div className={`w-3/4 h-2 bg-base-300 rounded ${d.padding}`}></div>
                                        </div>
                                        <span className="font-medium">{d.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Toggle Options */}
                        <div className="space-y-4">
                            <h5 className="font-medium">Display Elements</h5>
                            <div className="space-y-3">
                                <label className="flex items-center justify-between p-3 border border-base-300 rounded-lg hover:bg-base-50 cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="text-base-content">Show Timestamps</div>
                                        <div className="text-sm text-base-content/60">Display message time</div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary"
                                        checked={showTimestamps}
                                        onChange={(e) => setAppearance({ showTimestamps: e.target.checked })}
                                    />
                                </label>

                                <label className="flex items-center justify-between p-3 border border-base-300 rounded-lg hover:bg-base-50 cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="text-base-content">Show Avatars</div>
                                        <div className="text-sm text-base-content/60">Display profile pictures</div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary"
                                        checked={showAvatars}
                                        onChange={(e) => setAppearance({ showAvatars: e.target.checked })}
                                    />
                                </label>

                                <label className="flex items-center justify-between p-3 border border-base-300 rounded-lg hover:bg-base-50 cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="text-base-content">Animations</div>
                                        <div className="text-sm text-base-content/60">Enable smooth animations</div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary"
                                        checked={animationsEnabled}
                                        onChange={(e) => setAppearance({ animationsEnabled: e.target.checked })}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Preview Section */}
            <div className="space-y-3">
                <h4 className="text-lg font-medium">Live Preview</h4>
                <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg">
                    <div className="p-4 bg-base-200">
                        <div className="max-w-lg mx-auto">
                            {/* Mock Chat UI */}
                            <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
                                {/* Chat Header */}
                                <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                                    <div className="flex items-center gap-3">
                                        {showAvatars && (
                                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                                                J
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="font-medium text-sm">John Doe</h3>
                                            <p className="text-xs text-base-content/70">Online</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Chat Messages */}
                                <div
                                    className={`
                                        min-h-[200px] max-h-[200px] overflow-y-auto
                                        ${getCurrentBackground().value} ${getCurrentDensity().spacing} ${
                                        getCurrentDensity().padding
                                    }
                                    `}
                                    style={
                                        getCurrentBackground().imageUrl
                                            ? { backgroundImage: `url(${getCurrentBackground().imageUrl})` }
                                            : getCurrentBackground().pattern
                                            ? {
                                                  backgroundImage: getCurrentBackground().pattern,
                                                  backgroundSize: getCurrentBackground().patternSize || "20px 20px",
                                              }
                                            : {}
                                    }
                                >
                                    {PREVIEW_MESSAGES.map((message, index) => (
                                        <div
                                            key={message.id}
                                            className={`
                                                flex ${message.isSent ? "justify-end" : "justify-start"}
                                                ${animationsEnabled ? "transition-all duration-300 ease-in-out" : ""}
                                            `}
                                            style={
                                                animationsEnabled
                                                    ? {
                                                          animationDelay: `${index * 100}ms`,
                                                          animation: "fadeInUp 0.3s ease-out forwards",
                                                      }
                                                    : {}
                                            }
                                        >
                                            <div className="flex items-end gap-2 max-w-[80%]">
                                                {!message.isSent && showAvatars && (
                                                    <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-accent-content text-xs font-medium">
                                                        J
                                                    </div>
                                                )}
                                                <div>
                                                    <div
                                                        className={`
                                                            ${getCurrentBubbleStyle()} p-3 shadow-sm
                                                            ${
                                                                message.isSent
                                                                    ? "bg-primary text-primary-content"
                                                                    : "bg-base-200"
                                                            }
                                                        `}
                                                    >
                                                        <p className={getCurrentFontSize()}>{message.content}</p>
                                                        {showTimestamps && (
                                                            <p
                                                                className={`
                                                                    text-[10px] mt-1.5
                                                                    ${
                                                                        message.isSent
                                                                            ? "text-primary-content/70"
                                                                            : "text-base-content/70"
                                                                    }
                                                                `}
                                                            >
                                                                12:0{index} PM
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                {message.isSent && showAvatars && (
                                                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-content text-xs font-medium">
                                                        Y
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Chat Input */}
                                <div className="p-4 border-t border-base-300 bg-base-100">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            className={`input input-bordered flex-1 h-10 ${getCurrentFontSize()}`}
                                            placeholder="Type a message..."
                                            value="This is a live preview"
                                            readOnly
                                        />
                                        <button className="btn btn-primary h-10 min-h-0">
                                            <Send size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reset Button */}
            <div className="pt-4 border-t border-base-300">
                <button
                    className="btn btn-outline btn-error"
                    onClick={() => {
                        setTheme("light");
                        resetAppearance();
                    }}
                >
                    Reset to Defaults
                </button>
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default Appearance;
