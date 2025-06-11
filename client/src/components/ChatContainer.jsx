import { useEffect, useRef, memo, useCallback, useMemo } from "react";
import { useUserChatStore } from "../store/userChatStore";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";
import MessageSkeleton from "./Skeletons/MessageSkeleton";
import { useUserAuthStore } from "../store/userAuthStore";
import { formatMessageTime } from "../lib/utils";

// Separate component for file attachments
const FileAttachment = memo(({ file }) => {
    const renderFileContent = useMemo(() => {
        if (!file) return null;

        // Image files
        if (file.match(/\.(jpeg|png|gif|jpg)$/i)) {
            return (
                <img
                    src={file}
                    alt="Image attachment"
                    className="sm:max-w-[200px] rounded-md mb-2 object-cover"
                    loading="lazy"
                    onError={(e) => {
                        e.target.style.display = "none";
                        console.error("Failed to load image:", file);
                    }}
                />
            );
        }

        // Video files
        if (file.match(/\.(mp4|webm|ogg)$/i)) {
            return (
                <video
                    controls
                    className="w-full max-w-xs rounded-md mb-2"
                    preload="metadata"
                    onError={() => console.error("Failed to load video:", file)}
                >
                    <source src={file} />
                    Your browser does not support the video tag.
                </video>
            );
        }

        // PDF files
        if (file.endsWith(".pdf")) {
            return (
                <div className="mb-2">
                    <iframe
                        src={file}
                        title="PDF Document"
                        className="w-full max-w-sm h-64 rounded-md border"
                        onError={() => console.error("Failed to load PDF:", file)}
                    />
                </div>
            );
        }

        // Word documents
        if (file.match(/\.(doc|docx)$/i)) {
            return (
                <div className="mb-2">
                    <a
                        href={file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-500 hover:text-blue-700 underline transition-colors"
                        aria-label="Open Word document in new tab"
                    >
                        📄 View Word Document
                    </a>
                </div>
            );
        }

        // Excel files
        if (file.match(/\.(xls|xlsx)$/i)) {
            return (
                <div className="mb-2">
                    <a
                        href={file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-green-600 hover:text-green-800 underline transition-colors"
                        aria-label="Open Excel spreadsheet in new tab"
                    >
                        📊 View Excel Spreadsheet
                    </a>
                </div>
            );
        }

        // Generic file fallback
        return (
            <div className="mb-2">
                <a
                    href={file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 underline transition-colors"
                    aria-label="Open file in new tab"
                >
                    📎 View File
                </a>
            </div>
        );
    }, [file]);

    return renderFileContent;
});

FileAttachment.displayName = "FileAttachment";

// Individual message component
const MessageItem = memo(({ message, user, selectedUser, isLast, messageRef }) => {
    const isOwnMessage = message.senderId === user._id;
    const senderInfo = isOwnMessage ? user : selectedUser;

    const handleImageError = useCallback((e) => {
        e.target.src = "/default-avatar.png"; // Fallback avatar
    }, []);

    return (
        <div className={`chat ${isOwnMessage ? "chat-end" : "chat-start"}`} ref={isLast ? messageRef : null}>
            <div className="chat-image avatar">
                <div className="size-10 rounded-full border overflow-hidden bg-gray-200">
                    <img
                        src={senderInfo?.profileImage || "/default-avatar.png"}
                        alt={`${senderInfo?.name || "User"}'s profile`}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                    />
                </div>
            </div>

            <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">{formatMessageTime(message.createdAt)}</time>
            </div>

            <div className="chat-bubble flex flex-col max-w-xs sm:max-w-md">
                <FileAttachment file={message.file} />
                {message.text && <p className="whitespace-pre-wrap break-words">{message.text}</p>}
            </div>
        </div>
    );
});

MessageItem.displayName = "MessageItem";

// Empty state component
const EmptyState = memo(() => (
    <div className="flex-1 flex items-center justify-center text-gray-500 p-8">
        <div className="text-center">
            <div className="text-4xl mb-4">💬</div>
            <p className="text-lg font-medium mb-2">No messages yet</p>
            <p className="text-sm opacity-75">Start a conversation!</p>
        </div>
    </div>
));

EmptyState.displayName = "EmptyState";

// Error boundary for message rendering
const MessageListErrorBoundary = ({ children, fallback }) => {
    try {
        return children;
    } catch (error) {
        console.error("Error rendering messages:", error);
        return (
            fallback || (
                <div className="flex-1 flex items-center justify-center text-red-500 p-8">
                    <div className="text-center">
                        <p className="text-lg font-medium mb-2">Unable to load messages</p>
                        <p className="text-sm opacity-75">Please try refreshing the page</p>
                    </div>
                </div>
            )
        );
    }
};

// Main ChatContainer component
const ChatContainer = memo(() => {
    const { message, getMessages, isMessageLoading, selectedUser, subscribeToMessages, unSubscribeToMessages } =
        useUserChatStore();

    const { user } = useUserAuthStore();
    const messageEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    // Memoize the scroll to bottom function
    const scrollToBottom = useCallback(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        }
    }, []);

    // Handle message fetching and subscription
    useEffect(() => {
        if (selectedUser?._id && getMessages) {
            getMessages(selectedUser._id);

            if (subscribeToMessages) {
                subscribeToMessages();
            }
        }

        return () => {
            if (unSubscribeToMessages) {
                unSubscribeToMessages();
            }
        };
    }, [selectedUser?._id, getMessages, subscribeToMessages, unSubscribeToMessages]);

    // Auto-scroll when new messages arrive
    useEffect(() => {
        if (message && message.length > 0) {
            // Small delay to ensure DOM is updated
            const timeoutId = setTimeout(scrollToBottom, 100);
            return () => clearTimeout(timeoutId);
        }
    }, [message, scrollToBottom]);

    // Memoize messages to prevent unnecessary re-renders
    const memoizedMessages = useMemo(() => {
        if (!Array.isArray(message) || message.length === 0) {
            return [];
        }

        return message.map((msg, index) => (
            <MessageItem
                key={msg._id || `message-${index}`}
                message={msg}
                user={user}
                selectedUser={selectedUser}
                isLast={index === message.length - 1}
                messageRef={messageEndRef}
            />
        ));
    }, [message, user, selectedUser]);

    // Loading state with consistent layout
    if (isMessageLoading) {
        return (
            <div className="flex-1 flex flex-col h-full">
                <div className="shrink-0">
                    <ChatHeader />
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    <MessageSkeleton />
                </div>
                <div className="shrink-0">
                    <MessageInput />
                </div>
            </div>
        );
    }

    // Main render
    return (
        <div className="flex-1 flex flex-col h-full bg-base-100">
            {/* Header */}
            <div className="shrink-0 border-b border-base-300">
                <ChatHeader />
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth" ref={messagesContainerRef}>
                <MessageListErrorBoundary>
                    {memoizedMessages.length > 0 ? (
                        <>
                            {memoizedMessages}
                            {/* Invisible element to scroll to */}
                            <div ref={messageEndRef} className="h-0" />
                        </>
                    ) : (
                        <EmptyState />
                    )}
                </MessageListErrorBoundary>
            </div>

            {/* Message Input */}
            <div className="shrink-0 border-t border-base-300">
                <MessageInput />
            </div>
        </div>
    );
});

ChatContainer.displayName = "ChatContainer";

export default ChatContainer;
