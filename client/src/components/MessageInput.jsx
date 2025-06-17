import { useState, useRef, useEffect } from "react";
import { Mic, Paperclip, Send, X } from "lucide-react";
import { useUserChatStore } from "../store/userChatStore";
import { useUserAuthStore } from "../store/userAuthStore";
import TextareaAutosize from "react-textarea-autosize";

const MessageInput = () => {
    const [text, setText] = useState("");
    const [file, setFile] = useState(null);
    const [fileType, setFileType] = useState(null); // image, audio, file
    const [previewURL, setPreviewURL] = useState(null);
    // just for better user experience so as to show him also as of he is typing or what will be seen by the receiver side.
    // TODO: may be I will remove this. Dunno.
    const [isTyping, setIsTyping] = useState(false);

    const inputRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const isTypingRef = useRef(false);

    const { sendMessage, selectedUser } = useUserChatStore();
    const { socket, user } = useUserAuthStore();

    // Function to start typing indicator
    const startTyping = () => {
        if (!socket || !selectedUser || !user) return;

        // Only emit if not already typing
        if (!isTypingRef.current) {
            socket.emit("typing-start", {
                userId: user._id,
                recipientId: selectedUser._id,
                userName: user.name,
            });
            isTypingRef.current = true;
            setIsTyping(true);
            console.log("Started typing to:", selectedUser.name);
        }

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set timeout to stop typing after 1 second of inactivity
        typingTimeoutRef.current = setTimeout(() => {
            stopTyping();
        }, 1000);
    };

    // Function to stop typing indicator
    const stopTyping = () => {
        if (!socket || !selectedUser || !user) return;

        if (isTypingRef.current) {
            socket.emit("typing-stop", {
                userId: user._id,
                recipientId: selectedUser._id,
            });
            isTypingRef.current = false;
            setIsTyping(false);
            console.log("Stopped typing to:", selectedUser.name);
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
        }
    };

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;

        setFile(selected);
        const type = selected.type;

        if (type.startsWith("image/")) {
            setFileType("image");
        } else if (type.startsWith("audio/")) {
            setFileType("audio");
        } else if (type.startsWith("video/")) {
            setFileType("video");
        } else {
            setFileType("file");
        }

        const reader = new FileReader();
        reader.onloadend = () => setPreviewURL(reader.result);
        reader.readAsDataURL(selected);
    };

    const removeAttachment = () => {
        setFile(null);
        setFileType(null);
        setPreviewURL(null);
    };

    // Handle text input change with typing indicator
    const handleTextChange = (e) => {
        const value = e.target.value;
        setText(value);

        // Start typing indicator when user types
        if (value.trim()) {
            startTyping();
        } else {
            stopTyping();
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!text.trim() && !file) return;

        // Stop typing before sending message
        stopTyping();

        const formData = new FormData();
        formData.append("text", text);
        if (file) formData.append("file", file);
        await sendMessage(formData);

        // Reset
        setText("");
        removeAttachment();
    };

    // recording:
    const handleStartRecording = () => {
        setTimeout(() => {
            alert("Demo: Later I will be implementing recording of the audio message in this");
        }, 500);
    };

    // Handle input blur (when user clicks away) -> (just showoff😎)
    const handleBlur = () => {
        // Small delay to allow for form submission
        setTimeout(() => {
            stopTyping();
        }, 100);
    };

    // Cleanup on component unmount or selectedUser change
    useEffect(() => {
        return () => {
            stopTyping();
        };
    }, [selectedUser]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    // TODO: have to make it compatible to all types of files -> will improve it later.
    const getFileIcon = (filename) => {
        if (!filename) return "📄";

        const ext = filename.split(".").pop()?.toLowerCase();
        const iconMap = {
            pdf: "📕",
            doc: "📘",
            docx: "📘",
            ppt: "📙",
            pptx: "📙",
            xls: "📗",
            xlsx: "📗",
            txt: "📝",
            zip: "🗜️",
            rar: "🗜️",
            mp3: "🎵",
            wav: "🎵",
            flac: "🎵",
            mp4: "🎬",
            avi: "🎬",
            mov: "🎬",
            jpg: "🖼️",
            jpeg: "🖼️",
            png: "🖼️",
            gif: "🖼️",
        };

        return iconMap[ext] || "📄";
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    };

    return (
        <div className="p-4 w-full border-t border-zinc-700 bg-base-100">
            {/* Enhanced Preview */}
            {previewURL && (
                <div className="mb-3 animate-in slide-in-from-bottom-2 duration-200">
                    <div className="relative inline-block group">
                        {fileType === "image" ? (
                            <div className="relative">
                                <img
                                    src={previewURL}
                                    alt="Preview"
                                    className="w-32 h-32 object-cover rounded-xl border-2 border-zinc-600 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-colors duration-200" />
                            </div>
                        ) : fileType === "audio" ? (
                            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-4 rounded-xl border border-zinc-600 shadow-lg">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                        🎵
                                    </div>
                                    <span className="text-sm font-medium text-zinc-300 truncate max-w-[200px]">
                                        {file?.name || "Audio file"}
                                    </span>
                                </div>
                                <audio
                                    controls
                                    src={previewURL}
                                    className="w-full max-w-[280px] h-8 rounded-lg"
                                    style={{
                                        filter: "sepia(1) hue-rotate(200deg) saturate(0.8) brightness(0.9)",
                                    }}
                                />
                            </div>
                        ) : fileType === "video" ? (
                            <div className="relative">
                                <video
                                    controls
                                    src={previewURL}
                                    className="w-64 max-h-48 rounded-xl border-2 border-zinc-600 shadow-lg hover:shadow-xl transition-all duration-200"
                                    poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23374151' viewBox='0 0 24 24'%3E%3Cpath d='M8 5v14l11-7z'/%3E%3C/svg%3E"
                                />
                                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-white">
                                    📹 Video
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gradient-to-br from-zinc-700 to-zinc-800 p-4 rounded-xl border border-zinc-600 shadow-lg hover:shadow-xl transition-all duration-200 min-w-[200px]">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-zinc-600 rounded-lg flex items-center justify-center text-lg">
                                        {getFileIcon(file?.name)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">
                                            {file?.name || "Unknown file"}
                                        </p>
                                        <p className="text-xs text-zinc-400">
                                            {file?.size ? formatFileSize(file.size) : "Unknown size"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Enhanced Remove Button */}
                        <button
                            onClick={removeAttachment}
                            type="button"
                            className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 group/btn"
                            title="Remove attachment"
                        >
                            <X size={14} className="group-hover/btn:rotate-90 transition-transform duration-200" />
                        </button>

                        {/* File size indicator for images */}
                        {fileType === "image" && file?.size && (
                            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-white">
                                {formatFileSize(file.size)}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Input + Buttons */}
            <div className="relative">
                <form onSubmit={handleSend} className="flex items-center gap-2">
                    {/* Hidden File Input */}
                    <input
                        type="file"
                        accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.ppt,.pptx"
                        ref={inputRef}
                        className="hidden"
                        onChange={handleFileChange}
                    />

                    {/* Attach Button */}
                    <button
                        type="button"
                        className="btn btn-circle btn-ghost text-zinc-500 hover:text-white"
                        onClick={() => inputRef.current?.click()}
                    >
                        <Paperclip size={20} />
                    </button>

                    {/* Text Input */}
                    <TextareaAutosize
                        minRows={1}
                        maxRows={5}
                        className="flex-1 resize-none bg-base-200 rounded-xl p-3 text-sm placeholder-zinc-400 focus:outline-none"
                        placeholder="Type a message"
                        value={text}
                        onChange={handleTextChange}
                        onBlur={handleBlur}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSend(e);
                            }
                        }}
                    />
                    {/* voice recorder */}
                    <button type="*" className="btn btn-circle btn-ghost text-zinc-500" onClick={handleStartRecording}>
                        <Mic size={20} />
                    </button>
                    {/* Send Button */}
                    <button type="submit" className="btn btn-circle" disabled={!text.trim() && !file}>
                        <Send size={20} />
                    </button>
                </form>

                {/* Typing indicator for current user */}
                {isTyping && <div className="absolute -top-6 left-2 text-xs text-primary animate-pulse">typing...</div>}
            </div>
        </div>
    );
};

export default MessageInput;
