import { X, Phone, Video, MoreVertical, Info } from "lucide-react";
import { useUserChatStore } from "../store/userChatStore";
import { useUserAuthStore } from "../store/userAuthStore";
import { capitaliseWords } from "../lib/utils";
import { useState, useEffect } from "react";

const ChatHeader = () => {
    const { selectedUser, setSelectedUser } = useUserChatStore();
    const { onlineUsers, socket } = useUserAuthStore();

    // Typing indicator state
    const [isTyping, setIsTyping] = useState(false);

    // Listening for typing events from socket
    useEffect(() => {
        if (!socket || !selectedUser) return;

        const handleUserTyping = (data) => {
            // Only show typing indicator if it's from the selected user
            if (data.userId === selectedUser._id) {
                setIsTyping(true);
            }
        };

        const handleUserStoppedTyping = (data) => {
            // Hide typing indicator immediately when user stops typing
            if (data.userId === selectedUser._id) {
                setIsTyping(false);
            }
        };

        // Listen for typing events
        socket.on("user-typing", handleUserTyping);
        socket.on("user-stopped-typing", handleUserStoppedTyping);

        // Cleanup function
        return () => {
            socket.off("user-typing", handleUserTyping);
            socket.off("user-stopped-typing", handleUserStoppedTyping);
        };
    }, [socket, selectedUser]);

    // Reset typing state when selectedUser changes
    useEffect(() => {
        setIsTyping(false);
    }, [selectedUser]);

    // check for online users.
    const isOnline = onlineUsers.includes(selectedUser._id);

    // Get user status text
    const getUserStatus = () => {
        if (isTyping) return "typing...";
        if (isOnline) return "Online";
        return "Offline";
    };

    // Handle dropdown menu actions
    const handleCallUser = () => {
        console.log("Calling user:", selectedUser.name);
        // Will implement call functionality
        alert("Demo: Calling user...");
    };

    const handleVideoCall = () => {
        console.log("Video calling user:", selectedUser.name);
        // Will Implement video call functionality
        alert("Demo: Video calling user...");
    };

    const handleViewProfile = () => {
        console.log("Viewing profile:", selectedUser.name);
        // Navigate to user profile or show profile modal
        alert("Demo: Viewing profile...");
    };

    const handleMuteNotifications = () => {
        console.log("Muting notifications for:", selectedUser.name);
        // Will implement mute notifications functionality
        alert("Demo: Muting notifications...");
    };

    const handleBlockUser = () => {
        console.log("Blocking user:", selectedUser.name);
        // Will implement block user functionality
        alert("Demo: Blocking user...");
    };

    return (
        <div className="p-3 border-b border-base-300 bg-base-100/80 backdrop-blur-sm relative z-50">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Avatar with online indicator */}
                    <div className="relative">
                        <div className="avatar">
                            <div className="size-10 rounded-full ring-2 ring-base-300">
                                <img src={selectedUser.profileImage} alt={selectedUser.name} className="object-cover" />
                            </div>
                        </div>
                        {/* Online indicator - hide when typing to avoid confusion */}
                        {isOnline && !isTyping && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-base-100"></div>
                        )}
                        {/* Typing indicator on avatar */}
                        {isTyping && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full border-2 border-base-100 animate-pulse"></div>
                        )}
                    </div>

                    {/* User info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base-content truncate">
                            {capitaliseWords(selectedUser.name)}
                        </h3>
                        <div className="flex items-center gap-1">
                            {/* Typing indicator dots */}
                            {isTyping && (
                                <div className="flex gap-1 mr-2">
                                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce"></div>
                                </div>
                            )}
                            <p
                                className={`text-sm truncate transition-colors duration-200 ${
                                    isTyping
                                        ? "text-primary font-medium"
                                        : isOnline
                                        ? "text-success"
                                        : "text-base-content/70"
                                }`}
                            >
                                {getUserStatus()}
                            </p>
                        </div>
                    </div>
                </div>

                {/*TODO: Action buttons */}
                <div className="flex items-center gap-1">
                    {/* Call button */}
                    <button
                        onClick={handleCallUser}
                        className="p-2 rounded-full hover:bg-base-200 transition-colors"
                        title="Voice Call"
                    >
                        <Phone className="w-5 h-5 text-base-content/70 hover:text-base-content transition-colors" />
                    </button>

                    {/* Video call button */}
                    <button
                        onClick={handleVideoCall}
                        className="p-2 rounded-full hover:bg-base-200 transition-colors "
                        title="Video Call"
                    >
                        <Video className="w-5 h-5 text-base-content/70 hover:text-base-content  transition-colors" />
                    </button>

                    {/* More options dropdown */}
                    <div className="dropdown dropdown-end relative">
                        <div
                            tabIndex={0}
                            role="button"
                            className="p-2 rounded-full hover:bg-base-200 transition-colors"
                            title="More Options"
                        >
                            <MoreVertical className="w-5 h-5 text-base-content/70 hover:text-base-content transition-colors" />
                        </div>
                        <ul
                            tabIndex={0}
                            className="dropdown-content menu bg-base-100 rounded-box z-[9999] w-52 p-2 shadow-xl border border-base-300"
                        >
                            <li>
                                <button onClick={handleViewProfile} className="flex items-center gap-2">
                                    <Info className="w-4 h-4" />
                                    View Profile
                                </button>
                            </li>
                            <li>
                                <button
                                    className="flex items-center gap-2 text-warning"
                                    onClick={handleMuteNotifications}
                                >
                                    <span className="w-4 h-4 flex items-center justify-center">🔇</span>
                                    Mute Notifications
                                </button>
                            </li>
                            <li>
                                <button className="flex items-center gap-2 text-error" onClick={handleBlockUser}>
                                    <span className="w-4 h-4 flex items-center justify-center">🚫</span>
                                    Block User
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={() => setSelectedUser(null)}
                        className="p-2 rounded-full hover:bg-base-200 transition-colors ml-1"
                        title="Close Chat"
                    >
                        <X className="w-5 h-5 text-base-content/70 hover:text-base-content transition-colors" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;
