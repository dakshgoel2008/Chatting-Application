import { useEffect, useState, useMemo, useCallback } from "react";
import { useUserChatStore } from "./../store/userChatStore";
import SideBarSkeleton from "./Skeletons/SideBarSkeleton";
import { Search, Users, X, Filter, MessageCircle, Settings, ChevronDown } from "lucide-react";
import { useUserAuthStore } from "../store/userAuthStore";
import { capitaliseWords } from "./../lib/utils";

const SideBar = () => {
    const { getUsers, selectedUser, setSelectedUser, users, isUsersLoading, message } = useUserChatStore();
    const { onlineUsers } = useUserAuthStore();
    const [showOnlineUsersOnly, setShowOnlineUsersOnly] = useState(false);
    const [searchedInput, setSearchedInput] = useState("");
    const [searchedTerm, setSearchedTerm] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sortBy, setSortBy] = useState("name");

    // TODO: have to Improve conversation cache
    const [conversationCache, setConversationCache] = useState({});
    const [loadingUser, setLoadingUser] = useState(null);
    const [lastSelectedUserId, setLastSelectedUserId] = useState(null);

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    // Clear cache for previous user when switching to prevent overlap
    useEffect(() => {
        if (selectedUser && lastSelectedUserId && selectedUser._id !== lastSelectedUserId) {
            // Clear the loading state for all users when switching
            setLoadingUser(null);
        }
        if (selectedUser) {
            setLastSelectedUserId(selectedUser._id);
        }
    }, [selectedUser, lastSelectedUserId]);

    // Update conversation cache only for the currently selected user
    useEffect(() => {
        if (selectedUser && message && Array.isArray(message)) {
            if (message.length > 0) {
                const lastMessage = message[message.length - 1];
                setConversationCache((prev) => ({
                    ...prev,
                    [selectedUser._id]: {
                        lastMessage,
                        messageCount: message.length,
                        updatedAt: new Date().toISOString(),
                        hasMessages: true,
                    },
                }));
            } else {
                // If no messages, mark as having no messages
                setConversationCache((prev) => ({
                    ...prev,
                    [selectedUser._id]: {
                        lastMessage: null,
                        messageCount: 0,
                        updatedAt: new Date().toISOString(),
                        hasMessages: false,
                    },
                }));
            }
        }
    }, [selectedUser, message]);

    const searchHandler = useCallback((e) => {
        setSearchedInput(e.target.value.toLowerCase());
    }, []);

    const clearSearch = useCallback(() => {
        setSearchedInput("");
        setSearchedTerm("");
    }, []);

    // Debounced search
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setSearchedTerm(searchedInput);
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [searchedInput]);

    // Improved function to get last message for user with better state management
    const getLastMessageForUser = useCallback(
        (userId) => {
            // If this is the currently selected user and we have messages, use them
            if (selectedUser?._id === userId && message && Array.isArray(message) && message.length > 0) {
                return message[message.length - 1];
            }

            // If this is the currently selected user but no messages, return null
            if (selectedUser?._id === userId && message && Array.isArray(message) && message.length === 0) {
                return null;
            }

            // For non-selected users, check cache
            const cachedConversation = conversationCache[userId];
            if (cachedConversation) {
                // Only return cached message if it exists and hasMessages is true
                if (cachedConversation.hasMessages && cachedConversation.lastMessage) {
                    return cachedConversation.lastMessage;
                }
                // If hasMessages is false, return null
                if (cachedConversation.hasMessages === false) {
                    return null;
                }
            }

            // Return null for users we haven't loaded yet
            return null;
        },
        [selectedUser, message, conversationCache]
    );

    // Check if we have conversation data for a user
    const hasConversationData = useCallback(
        (userId) => {
            if (selectedUser?._id === userId) {
                return true; // We always have current data for selected user
            }
            return conversationCache[userId] !== undefined;
        },
        [selectedUser, conversationCache]
    );

    // Memoized filtered and sorted users
    const filteredUsers = useMemo(() => {
        return users
            .filter((user) => {
                if (showOnlineUsersOnly && !onlineUsers.includes(user._id)) return false;
                return user.name.toLowerCase().includes(searchedTerm);
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case "online":
                        const aOnline = onlineUsers.includes(a._id);
                        const bOnline = onlineUsers.includes(b._id);
                        if (aOnline && !bOnline) return -1;
                        if (!aOnline && bOnline) return 1;
                        return a.name.localeCompare(b.name);
                    case "recent":
                        const aLastMsg = getLastMessageForUser(a._id);
                        const bLastMsg = getLastMessageForUser(b._id);
                        if (!aLastMsg && !bLastMsg) return a.name.localeCompare(b.name);
                        if (!aLastMsg) return 1;
                        if (!bLastMsg) return -1;
                        return new Date(bLastMsg.createdAt) - new Date(aLastMsg.createdAt);
                    default:
                        return a.name.localeCompare(b.name);
                }
            });
    }, [users, showOnlineUsersOnly, onlineUsers, searchedTerm, sortBy, getLastMessageForUser]);

    const getLastMessagePreview = useCallback(
        (userId) => {
            // Show loading state if this user is being loaded
            if (loadingUser === userId) {
                return "Loading messages...";
            }

            // Check if we have conversation data for this user
            if (!hasConversationData(userId)) {
                return "Tap to load messages";
            }

            const lastMsg = getLastMessageForUser(userId);

            // If no last message but we have conversation data, it means no messages exist
            if (!lastMsg) {
                return "No messages yet";
            }

            // Handle file messages
            if (lastMsg.file) {
                if (lastMsg.file.match(/\.(jpeg|png|gif|jpg)$/i)) return "📷 Photo";
                if (lastMsg.file.match(/\.(mp4|webm|ogg)$/i)) return "🎥 Video";
                if (lastMsg.file.endsWith(".pdf")) return "📄 PDF";
                if (lastMsg.file.match(/\.(doc|docx)$/i)) return "📄 Document";
                if (lastMsg.file.match(/\.(xls|xlsx)$/i)) return "📊 Spreadsheet";
                return "📎 File";
            }

            // Handle text messages
            if (lastMsg.text) {
                return lastMsg.text.length > 30 ? `${lastMsg.text.substring(0, 30)}...` : lastMsg.text;
            }

            return "Message";
        },
        [getLastMessageForUser, hasConversationData, loadingUser]
    );

    const getMessageTime = useCallback(
        (userId) => {
            const lastMsg = getLastMessageForUser(userId);
            if (!lastMsg?.createdAt) return "";

            const date = new Date(lastMsg.createdAt);
            const now = new Date();
            const diff = now - date;

            if (diff < 60000) return "now";
            if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
            if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
            if (diff < 604800000) return `${Math.floor(diff / 86400000)}d`;
            return date.toLocaleDateString();
        },
        [getLastMessageForUser]
    );

    // Handle user selection with improved loading state management
    const handleUserSelect = useCallback(
        async (user) => {
            if (selectedUser?._id === user._id) return; // Already selected

            // Set loading state only if we don't have cached data
            if (!hasConversationData(user._id)) {
                setLoadingUser(user._id);
            }

            setSelectedUser(user);

            // Clear loading state after messages are expected to load
            const timeout = setTimeout(() => {
                setLoadingUser(null);
            }, 2000); // Increased timeout for better UX

            // Cleanup timeout if component unmounts
            return () => clearTimeout(timeout);
        },
        [selectedUser, setSelectedUser, hasConversationData]
    );

    // Clear loading state when messages load for the selected user
    useEffect(() => {
        if (selectedUser && loadingUser === selectedUser._id && message !== undefined) {
            setLoadingUser(null);
        }
    }, [selectedUser, loadingUser, message]);

    // Close filter dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isFilterOpen && !event.target.closest(".filter-dropdown")) {
                setIsFilterOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isFilterOpen]);

    if (isUsersLoading) return <SideBarSkeleton />;

    return (
        <aside className="h-full w-20 lg:w-80 border-r border-base-300 flex flex-col transition-all duration-300 bg-base-100">
            {/* Header Section */}
            <div className="border-b border-base-300 w-full p-4 bg-base-200/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <MessageCircle className="size-5 text-primary" />
                        </div>
                        <div className="hidden lg:block">
                            <h2 className="font-semibold text-lg">Messages</h2>
                            <p className="text-xs text-base-content/60">
                                {filteredUsers.length} {filteredUsers.length === 1 ? "contact" : "contacts"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mt-4 hidden lg:block relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 size-4" />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchedInput}
                        className="input input-bordered w-full pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        onChange={searchHandler}
                    />
                    {searchedInput && (
                        <button
                            onClick={clearSearch}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content transition-colors"
                        >
                            <X className="size-4" />
                        </button>
                    )}
                </div>

                {/* Filter Controls */}
                <div className="mt-3 hidden lg:block">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="online-filter"
                                checked={showOnlineUsersOnly}
                                onChange={(e) => setShowOnlineUsersOnly(e.target.checked)}
                                className="checkbox checkbox-sm checkbox-primary"
                            />
                            <label htmlFor="online-filter" className="text-sm cursor-pointer">
                                Online only
                            </label>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                {Math.max(0, onlineUsers.length - 1)}
                            </span>
                        </div>

                        <div className="relative filter-dropdown">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="flex items-center gap-1 text-xs text-base-content/60 hover:text-base-content transition-colors"
                            >
                                <Filter className="size-3" />
                                Sort
                                <ChevronDown
                                    className={`size-3 transition-transform ${isFilterOpen ? "rotate-180" : ""}`}
                                />
                            </button>

                            {isFilterOpen && (
                                <div className="absolute right-0 top-full mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                                    {[
                                        { value: "name", label: "Name" },
                                        { value: "online", label: "Online first" },
                                        { value: "recent", label: "Recent" },
                                    ].map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => {
                                                setSortBy(option.value);
                                                setIsFilterOpen(false);
                                            }}
                                            className={`w-full text-left px-3 py-2 text-sm hover:bg-base-200 transition-colors ${
                                                sortBy === option.value ? "bg-primary/10 text-primary" : ""
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Contacts List */}
            <div className="flex-1 overflow-y-auto">
                {filteredUsers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                        <div className="p-4 bg-base-200 rounded-full mb-3">
                            <Users className="size-8 text-base-content/40" />
                        </div>
                        <p className="text-base-content/60 text-sm">
                            {searchedTerm ? "No contacts found" : "No contacts yet"}
                        </p>
                        {searchedTerm && (
                            <button onClick={clearSearch} className="mt-2 text-primary text-sm hover:underline">
                                Clear search
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="py-2">
                        {filteredUsers.map((user) => {
                            const isOnline = onlineUsers.includes(user._id);
                            const isSelected = selectedUser?._id === user._id;
                            const lastMsgTime = getMessageTime(user._id);
                            const isLoading = loadingUser === user._id;
                            const hasData = hasConversationData(user._id);

                            return (
                                <button
                                    key={user._id}
                                    onClick={() => handleUserSelect(user)}
                                    disabled={isLoading}
                                    className={`w-full p-3 flex items-center gap-3 hover:bg-base-200 transition-all duration-200 relative group ${
                                        isSelected ? "bg-primary/10 border-r-2 border-primary" : ""
                                    } ${isLoading ? "opacity-70" : ""}`}
                                >
                                    <div className="relative flex-shrink-0 mx-auto lg:mx-0">
                                        <div className="avatar">
                                            <div className="w-12 h-12 rounded-full ring-2 ring-base-300 ring-offset-2 ring-offset-base-100">
                                                <img
                                                    src={user.profileImage || "/default-avatar.png"}
                                                    alt={user.name}
                                                    className="w-full h-full object-cover rounded-full"
                                                    onError={(e) => {
                                                        e.target.src = "/default-avatar.png";
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        {isOnline && (
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full ring-2 ring-base-100 flex items-center justify-center">
                                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            </div>
                                        )}
                                        {isLoading && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                                                <div className="loading loading-spinner loading-sm text-primary"></div>
                                            </div>
                                        )}
                                    </div>

                                    {/* User info - only visible on larger screens */}
                                    <div className="hidden lg:block flex-1 text-left min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className={`font-medium truncate ${isSelected ? "text-primary" : ""}`}>
                                                {user.name ? capitaliseWords(user.name) : "Unknown User"}
                                            </h3>
                                            {lastMsgTime && (
                                                <span className="text-xs text-base-content/50 flex-shrink-0 ml-2">
                                                    {lastMsgTime}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p
                                                className={`text-sm truncate ${
                                                    !hasData
                                                        ? "text-base-content/40 italic"
                                                        : isLoading
                                                        ? "text-base-content/40"
                                                        : "text-base-content/60"
                                                }`}
                                            >
                                                {getLastMessagePreview(user._id)}
                                            </p>
                                            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                                                {isOnline ? (
                                                    <span className="text-xs text-green-600 font-medium">Online</span>
                                                ) : (
                                                    <span className="text-xs text-base-content/40">Offline</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Selection indicator */}
                                    {isSelected && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Footer - Quick Actions */}
            <div className="border-t border-base-300 p-3 hidden lg:block">
                <div className="flex items-center justify-between text-xs text-base-content/60">
                    <span>{filteredUsers.length} conversations</span>
                    <span>{Math.max(0, onlineUsers.length - 1)} online</span>
                </div>
            </div>
        </aside>
    );
};

export default SideBar;
