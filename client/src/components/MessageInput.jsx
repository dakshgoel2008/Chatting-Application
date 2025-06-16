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

    // Handle input blur (when user clicks away)
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

    return (
        <div className="p-4 w-full border-t border-zinc-700 bg-base-100">
            {/* Preview */}
            {previewURL && (
                <div className="mb-3 flex items-center gap-2">
                    <div className="relative">
                        {fileType === "image" ? (
                            <img src={previewURL} alt="Preview" className="w-24 h-24 object-cover rounded-lg border" />
                        ) : fileType === "audio" ? (
                            <audio controls src={previewURL} className="w-60 rounded-lg" />
                        ) : fileType === "video" ? (
                            <video controls src={previewURL} className="w-60 rounded-lg" />
                        ) : (
                            <div className="p-3 bg-base-200 rounded-lg text-sm font-medium">📎 {file.name}</div>
                        )}

                        <button
                            onClick={removeAttachment}
                            type="button"
                            className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center"
                        >
                            <X size={14} />
                        </button>
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
                {isTyping && <div className="absolute -top-6 left-2 text-xs text-primary animate-pulse">Typing...</div>}
            </div>
        </div>
    );
};

export default MessageInput;
