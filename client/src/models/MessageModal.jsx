import { Star, Trash, X, Heart, ThumbsUp, Angry, Frown, Laugh } from "lucide-react";
import { useState, useEffect } from "react";

const MessageModal = ({ message, onClose, onStar, onDelete, onReact }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [activeTab, setActiveTab] = useState("actions");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Enhanced emoji options with categories
    const emojiCategories = {
        quick: [
            { emoji: "❤️", label: "Love" },
            { emoji: "😂", label: "Laugh" },
            { emoji: "👍", label: "Like" },
            { emoji: "😢", label: "Sad" },
            { emoji: "😠", label: "Angry" },
        ],
        extended: ["🔥", "💯", "🎉", "😍", "🤔", "😊", "👏", "🙌", "💔", "😴", "🤯", "🥳", "😎", "🤗", "😘", "🤝"],
    };

    useEffect(() => {
        setIsVisible(true);
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 200);
    };

    const handleDelete = () => {
        if (showDeleteConfirm) {
            onDelete(message._id);
            handleClose();
        } else {
            setShowDeleteConfirm(true);
        }
    };

    const handleStar = () => {
        onStar(message._id);
        handleClose();
    };

    const handleReact = (emoji) => {
        onReact(message._id, emoji);
        handleClose();
    };

    const getReactionCount = (emoji) => {
        return message.reactions?.filter((r) => r.emoji === emoji).length || 0;
    };

    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-all duration-300 ${
                isVisible ? "opacity-100" : "opacity-0"
            }`}
            onClick={handleClose}
        >
            <div
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md mx-4 transform transition-all duration-300 ${
                    isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Message Actions</h3>
                    <button
                        onClick={handleClose}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <X size={18} className="text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setActiveTab("actions")}
                        className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                            activeTab === "actions"
                                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                    >
                        Actions
                    </button>
                    <button
                        onClick={() => setActiveTab("reactions")}
                        className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                            activeTab === "reactions"
                                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                    >
                        Reactions
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {activeTab === "actions" && (
                        <div className="space-y-3">
                            {/* Star Action */}
                            <button
                                onClick={handleStar}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:text-yellow-600 dark:hover:text-yellow-400 group ${
                                    message.isStarred
                                        ? "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20"
                                        : "text-gray-700 dark:text-gray-300"
                                }`}
                            >
                                <Star
                                    size={20}
                                    className={`transition-transform group-hover:scale-110 ${
                                        message.isStarred ? "fill-current" : ""
                                    }`}
                                />
                                <span className="text-left font-medium">
                                    {message.isStarred ? "Remove from Starred" : "Add to Starred"}
                                </span>
                            </button>

                            {/* Delete Action */}
                            {!showDeleteConfirm ? (
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="w-full flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 text-gray-700 dark:text-gray-300 group"
                                >
                                    <Trash size={20} className="transition-transform group-hover:scale-110" />
                                    <span className="text-left font-medium">Delete Message</span>
                                </button>
                            ) : (
                                <div className="space-y-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                    <div className="text-center">
                                        <div className="text-red-600 dark:text-red-400 mb-2">
                                            <Trash size={24} className="mx-auto" />
                                        </div>
                                        <p className="text-sm font-medium text-red-600 dark:text-red-400">
                                            Delete this message?
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                            This action cannot be undone
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setShowDeleteConfirm(false)}
                                            className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="flex-1 px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "reactions" && (
                        <div className="space-y-4">
                            {/* Quick Reactions */}
                            <div>
                                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                                    Quick Reactions
                                </h4>
                                <div className="grid grid-cols-5 gap-2">
                                    {emojiCategories.quick.map(({ emoji, label }) => {
                                        const count = getReactionCount(emoji);

                                        return (
                                            <button
                                                key={emoji}
                                                onClick={() => handleReact(emoji)}
                                                className="relative p-3 rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-110 group"
                                                title={label}
                                            >
                                                <span className="text-2xl group-hover:scale-110 transition-transform">
                                                    {emoji}
                                                </span>
                                                {count > 0 && (
                                                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                                                        {count}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Extended Reactions */}
                            <div>
                                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                                    More Reactions
                                </h4>
                                <div className="grid grid-cols-8 gap-1 max-h-32 overflow-y-auto">
                                    {emojiCategories.extended.map((emoji) => {
                                        const count = getReactionCount(emoji);

                                        return (
                                            <button
                                                key={emoji}
                                                onClick={() => handleReact(emoji)}
                                                className="relative p-2 rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-110 group text-xl"
                                            >
                                                <span className="group-hover:scale-110 transition-transform">
                                                    {emoji}
                                                </span>
                                                {count > 0 && (
                                                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full min-w-[16px] h-[16px] flex items-center justify-center">
                                                        {count}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Current Reactions Display */}
                            {message.reactions && message.reactions.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                                        Current Reactions
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries(
                                            message.reactions.reduce((acc, reaction) => {
                                                acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
                                                return acc;
                                            }, {})
                                        ).map(([emoji, count]) => (
                                            <div
                                                key={emoji}
                                                className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1"
                                            >
                                                <span>{emoji}</span>
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    {count}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-b-2xl border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>Message ID: {message._id?.slice(-6)}</span>
                        <span>{new Date(message.createdAt).toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageModal;
