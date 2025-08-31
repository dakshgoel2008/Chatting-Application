import { useEffect, useRef, memo, useCallback, useMemo, useState } from "react";
import { useUserChatStore } from "../store/userChatStore";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";
import MessageSkeleton from "./Skeletons/MessageSkeleton";
import { useUserAuthStore } from "../store/userAuthStore";
import { useUserAppearanceStore } from "../store/userAppearanceStore";
import { BACKGROUND_OPTIONS, BUBBLE_STYLES, FONT_SIZES, DENSITY_OPTIONS } from "../constants/appearanceSection.js";
import { formatMessageTime } from "../lib/utils";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Play, Pause, FileText as FileIcon, Download, Volume2 } from "lucide-react";
import MediaModal from "../models/MediaModel.jsx";

// Enhanced Audio Player Component
const AudioPlayer = ({ src }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const audioRef = useRef(null);

    const togglePlayPause = useCallback(() => {
        if (error || !audioRef.current) return;

        try {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        } catch (err) {
            console.error("Audio playback error:", err);
            setError(true);
        }
    }, [isPlaying, error]);

    const handleSeek = useCallback(
        (e) => {
            if (!audioRef.current || !duration) return;

            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const newTime = (clickX / rect.width) * duration;
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        },
        [duration]
    );

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleLoadedData = () => {
            setDuration(audio.duration || 0);
            setIsLoading(false);
            setError(false);
        };

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime || 0);
        };

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleEnded = () => setIsPlaying(false);

        const handleError = (e) => {
            console.error("Audio loading error:", e);
            setError(true);
            setIsLoading(false);
        };

        // Add all event listeners
        audio.addEventListener("loadeddata", handleLoadedData);
        audio.addEventListener("loadedmetadata", handleLoadedData);
        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("play", handlePlay);
        audio.addEventListener("pause", handlePause);
        audio.addEventListener("ended", handleEnded);
        audio.addEventListener("error", handleError);

        return () => {
            audio.removeEventListener("loadeddata", handleLoadedData);
            audio.removeEventListener("loadedmetadata", handleLoadedData);
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("play", handlePlay);
            audio.removeEventListener("pause", handlePause);
            audio.removeEventListener("ended", handleEnded);
            audio.removeEventListener("error", handleError);
        };
    }, [src]);

    const formatTime = useCallback((time) => {
        if (!time || isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }, []);

    const getFileName = useCallback(() => {
        try {
            const urlParts = src.split("/");
            const fileName = urlParts[urlParts.length - 1];
            return fileName.split("?")[0] || "Audio File";
        } catch {
            return "Audio File";
        }
    }, [src]);

    if (error) {
        return (
            <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg max-w-sm">
                <Volume2 className="w-5 h-5 text-red-400" />
                <div>
                    <p className="text-sm text-red-600 font-medium">Audio Error</p>
                    <p className="text-xs text-red-500">Unable to load audio file</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 p-3 bg-white/80 backdrop-blur-sm rounded-lg max-w-sm border border-gray-200 shadow-sm">
            {/* Audio info header */}
            <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-gray-500" />
                <span className="text-xs text-gray-600 font-medium truncate">{getFileName()}</span>
                <span className="text-xs text-gray-400 ml-auto">{formatTime(duration)}</span>
            </div>

            {/* Audio controls */}
            <div className="flex items-center gap-3">
                <audio ref={audioRef} src={src} preload="metadata" />

                <button
                    onClick={togglePlayPause}
                    disabled={isLoading}
                    className="flex items-center justify-center w-8 h-8 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-full transition-colors duration-200 shadow-sm"
                    title={isLoading ? "Loading..." : isPlaying ? "Pause" : "Play"}
                >
                    {isLoading ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : isPlaying ? (
                        <Pause size={14} />
                    ) : (
                        <Play size={14} className="ml-0.5" />
                    )}
                </button>

                {/* Progress bar */}
                <div className="flex-1 flex items-center gap-2">
                    <div
                        className="flex-1 h-2 bg-gray-200 rounded-full cursor-pointer relative overflow-hidden"
                        onClick={handleSeek}
                        title="Click to seek"
                    >
                        <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-100"
                            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                        />
                    </div>
                    <span className="text-xs text-gray-500 min-w-[35px] text-right">{formatTime(currentTime)}</span>
                </div>
            </div>
        </div>
    );
};

// Enhanced File Attachment Component
const FileAttachment = memo(({ file, onMediaClick }) => {
    const [imageError, setImageError] = useState(false);
    const [videoError, setVideoError] = useState(false);

    const renderFileContent = useMemo(() => {
        if (!file) {
            console.warn("FileAttachment: No file provided");
            return null;
        }

        // Image handling
        if (file.match(/\.(jpeg|png|gif|jpg|webp|svg)$/i)) {
            return (
                <button
                    onClick={() => onMediaClick(file, "image")}
                    className="block w-full max-w-[280px] rounded-lg overflow-hidden cursor-pointer group relative shadow-md hover:shadow-lg transition-all duration-300"
                >
                    {imageError ? (
                        <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                            <FileIcon className="w-8 h-8 text-gray-400" />
                            <span className="text-sm text-gray-500 ml-2">Image failed to load</span>
                        </div>
                    ) : (
                        <img
                            src={file}
                            alt="Image attachment"
                            className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-300"
                            loading="lazy"
                            onError={() => setImageError(true)}
                            onLoad={() => setImageError(false)}
                        />
                    )}
                </button>
            );
        }

        // Video handling
        if (file.match(/\.(mp4|webm|ogg|mov|avi)$/i)) {
            return (
                <button
                    onClick={() => onMediaClick(file, "video")}
                    className="w-full max-w-[280px] rounded-lg overflow-hidden relative group shadow-md hover:shadow-lg cursor-pointer transition-all duration-300"
                >
                    {videoError ? (
                        <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                            <FileIcon className="w-8 h-8 text-gray-400" />
                            <span className="text-sm text-gray-500 ml-2">Video failed to load</span>
                        </div>
                    ) : (
                        <>
                            <video
                                className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-300"
                                preload="metadata"
                                src={`${file}#t=0.1`}
                                onError={() => setVideoError(true)}
                                onLoadedData={() => setVideoError(false)}
                            >
                                <source src={file} />
                                Your browser does not support the video tag.
                            </video>
                            {/* Play overlay */}
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors duration-300">
                                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                                    <Play size={20} className="text-gray-700 ml-1" />
                                </div>
                            </div>
                        </>
                    )}
                </button>
            );
        }

        // Audio handling - This is the key fix!
        if (file.match(/\.(mp3|wav|ogg|m4a|aac|flac)$/i)) {
            return <AudioPlayer src={file} />;
        }

        // Other file types
        const fileName = file.split("/").pop() || "Unknown File";
        const fileExtension = fileName.split(".").pop()?.toUpperCase() || "";

        return (
            <a
                href={file}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg max-w-xs hover:bg-white/90 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
            >
                <div className="flex-shrink-0">
                    <FileIcon className="w-8 h-8 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-700 truncate" title={fileName}>
                        {fileName}
                    </p>
                    <p className="text-xs text-gray-500">{fileExtension} • Click to download</p>
                </div>
                <Download className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </a>
        );
    }, [file, onMediaClick, imageError, videoError]);

    return renderFileContent;
});
FileAttachment.displayName = "FileAttachment";

// Enhanced Message Item Component
const MessageItem = memo(({ message, user, selectedUser, isLast, messageRef, appearance, onMediaClick }) => {
    const isOwnMessage = message.senderId === user._id;
    const senderInfo = isOwnMessage ? user : selectedUser;
    const { bubbleStyle, showTimestamps, showAvatars, fontSize } = appearance;

    const bubbleClassName = BUBBLE_STYLES.find((style) => style.id === bubbleStyle)?.class || "rounded-2xl";
    const fontSizeClassName = FONT_SIZES.find((size) => size.id === fontSize)?.class || "text-base";

    // Check for any type of file attachment
    const fileUrl = message.image || message.video || message.audio || message.file;
    const hasFileAttachment = Boolean(fileUrl);
    const hasTextContent = Boolean(message.text?.trim());

    // Emoji detector - check if message is only emojis
    const isEmojiOnly = useMemo(() => {
        if (!message.text?.trim()) return false;
        // Remove all emojis and see if anything is left
        const textWithoutEmojis = message.text
            .replace(
                /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu,
                ""
            )
            .trim();
        return textWithoutEmojis.length === 0 && message.text.length > 0;
    }, [message.text]);

    return (
        <div className={`chat ${isOwnMessage ? "chat-end" : "chat-start"}`} ref={isLast ? messageRef : null}>
            {showAvatars && (
                <div className="chat-image avatar">
                    <div className="size-10 rounded-full border overflow-hidden bg-gray-200">
                        <img
                            src={senderInfo?.profileImage}
                            alt={`${senderInfo?.name || "User"}'s profile`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = "/default-avatar.png"; // Fallback avatar
                            }}
                        />
                    </div>
                </div>
            )}
            <div
                className={`relative chat-bubble flex flex-col ${bubbleClassName} shadow-md ${
                    hasFileAttachment || hasTextContent ? "p-0 overflow-hidden" : "p-4"
                } ${isOwnMessage ? "bg-[#bed2ef] text-gray-900" : "bg-[#ffeeab] text-black border"} ${
                    isEmojiOnly ? "bg-transparent !shadow-none" : ""
                }`}
                style={{ maxWidth: hasFileAttachment ? "320px" : "400px" }}
            >
                {/* File attachment rendering */}
                {hasFileAttachment && (
                    <div className={hasTextContent ? "mb-2" : ""}>
                        <FileAttachment file={fileUrl} onMediaClick={onMediaClick} />
                    </div>
                )}

                {/* Text content rendering */}
                {hasTextContent && (
                    <div
                        className={`${isEmojiOnly ? "text-4xl p-2" : `px-4 py-3 ${fontSizeClassName}`} ${
                            hasFileAttachment ? "pt-0" : ""
                        }`}
                    >
                        <ReactMarkdown
                            components={{
                                code({ node, inline, className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || "");
                                    return !inline && match ? (
                                        <div className="my-2 rounded-md overflow-hidden">
                                            <SyntaxHighlighter
                                                style={vscDarkPlus}
                                                language={match[1]}
                                                PreTag="div"
                                                wrapLines={true}
                                                customStyle={{
                                                    margin: 0,
                                                    borderRadius: "6px",
                                                    fontSize: "0.875rem",
                                                }}
                                                {...props}
                                            >
                                                {String(children).replace(/\n$/, "")}
                                            </SyntaxHighlighter>
                                        </div>
                                    ) : (
                                        <code
                                            className={`${className} bg-black/10 px-1 py-0.5 rounded text-sm`}
                                            {...props}
                                        >
                                            {children}
                                        </code>
                                    );
                                },
                                p({ children }) {
                                    return <p className="mb-1 last:mb-0">{children}</p>;
                                },
                                ul({ children }) {
                                    return <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>;
                                },
                                ol({ children }) {
                                    return <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>;
                                },
                            }}
                        >
                            {message.text}
                        </ReactMarkdown>
                    </div>
                )}

                {/* Timestamp */}
                {showTimestamps && (
                    <span className="text-[11px] text-slate-500 mt-1 mr-3 mb-2 self-end opacity-70 hover:opacity-100 transition-opacity duration-200">
                        {formatMessageTime(message.createdAt)}
                    </span>
                )}
            </div>
        </div>
    );
});
MessageItem.displayName = "MessageItem";

// Rest of your components remain the same...
const EmptyState = memo(() => (
    <div className="flex-1 flex items-center justify-center text-gray-500 p-8">
        <div className="text-center">
            <p className="text-lg font-medium mb-2">No messages yet</p>
            <p className="text-sm opacity-75">Start a conversation!</p>
            <p className="text-md opacity-75 mt-12 italic">Your messages are end to end encrypted</p>
        </div>
    </div>
));
EmptyState.displayName = "EmptyState";

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

const ChatContainer = memo(() => {
    const { message, getMessages, isMessageLoading, selectedUser, subscribeToMessages, unSubscribeToMessages } =
        useUserChatStore();
    const [mediaInModal, setMediaInModal] = useState(null);
    const { user } = useUserAuthStore();
    const appearance = useUserAppearanceStore();
    const { chatBackground, density, animationsEnabled } = appearance;
    const messageEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    const background = BACKGROUND_OPTIONS.find((bg) => bg.id === chatBackground) || BACKGROUND_OPTIONS[0];
    const densitySettings = DENSITY_OPTIONS.find((d) => d.id === density) || DENSITY_OPTIONS[1];

    const handleMediaClick = useCallback((src, type) => {
        setMediaInModal({ src, type });
    }, []);

    const scrollToBottom = useCallback(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({
                behavior: animationsEnabled ? "smooth" : "auto",
                block: "end",
            });
        }
    }, [animationsEnabled]);

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

    useEffect(() => {
        if (message && message.length > 0) {
            const timeoutId = setTimeout(scrollToBottom, 100);
            return () => clearTimeout(timeoutId);
        }
    }, [message, scrollToBottom]);

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
                appearance={appearance}
                onMediaClick={handleMediaClick}
            />
        ));
    }, [message, user, selectedUser, appearance, handleMediaClick]);

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

    return (
        <div className="flex-1 flex flex-col h-full bg-base-100">
            <div className="shrink-0 border-b border-base-300">
                <ChatHeader />
            </div>
            <div
                className={`flex-1 overflow-y-auto scroll-smooth ${background.value} ${densitySettings.spacing} ${densitySettings.padding}`}
                style={
                    background.imageUrl
                        ? { backgroundImage: `url(${background.imageUrl})` }
                        : background.pattern
                        ? { backgroundImage: background.pattern, backgroundSize: background.patternSize || "20px 20px" }
                        : {}
                }
                ref={messagesContainerRef}
            >
                <MessageListErrorBoundary>
                    {memoizedMessages.length > 0 ? (
                        <>
                            {memoizedMessages}
                            <div ref={messageEndRef} className="h-0" />
                        </>
                    ) : (
                        <EmptyState />
                    )}
                </MessageListErrorBoundary>
            </div>
            <div className="shrink-0 border-t border-base-300">
                <MessageInput />
            </div>
            {mediaInModal && (
                <MediaModal src={mediaInModal.src} type={mediaInModal.type} onClose={() => setMediaInModal(null)} />
            )}
        </div>
    );
});

ChatContainer.displayName = "ChatContainer";
export default ChatContainer;
