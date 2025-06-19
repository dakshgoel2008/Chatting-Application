import { useState, useRef, useEffect } from "react";
import { Mic, Paperclip, Send, Smile, X } from "lucide-react";
import { useUserChatStore } from "../store/userChatStore";
import { useUserAuthStore } from "../store/userAuthStore";
import TextareaAutosize from "react-textarea-autosize";
import { getFileIcon } from "../constants/messageInputHelper";
import { formatFileSize } from "../lib/utils";
// Import emoji-mart components
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const MessageInput = () => {
    const [text, setText] = useState("");
    const [file, setFile] = useState(null);
    const [fileType, setFileType] = useState(null); // image, audio, file
    const [previewURL, setPreviewURL] = useState(null);
    const [isTyping, setIsTyping] = useState(false);

    // for audios recordings:
    const [isRecording, setIsRecording] = useState(false);
    const [audioChunks, setAudioChunks] = useState([]);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const audioStreamRef = useRef(null);

    // for emoji picker and GIF and stickers
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const inputRef = useRef(null);
    const textareaRef = useRef(null);
    const emojiPickerRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const isTypingRef = useRef(false);

    const { sendMessage, selectedUser } = useUserChatStore();
    const { socket, user } = useUserAuthStore();

    // Function to start typing indicator
    const startTyping = () => {
        if (!socket || !selectedUser || !user) return;

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

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

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

    // Eventbutton handlers.

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

        if (value.trim()) {
            startTyping();
        } else {
            stopTyping();
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!text.trim() && !file) return;

        stopTyping();

        const formData = new FormData();
        formData.append("text", text);
        if (file) formData.append("file", file);
        await sendMessage(formData);

        setText("");
        removeAttachment();
        setShowEmojiPicker(false); // Close emoji picker after sending
    };

    const handleStartRecording = async () => {
        // Stop previous recording
        if (isRecording && mediaRecorder) {
            mediaRecorder.stop(); // This will trigger `onstop`
            return;
        }

        try {
            // start recording
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioStreamRef.current = stream;

            const recorder = new MediaRecorder(stream);
            setMediaRecorder(recorder);
            setAudioChunks([]);
            setIsRecording(true);

            recorder.ondataavailable = (e) => {
                // if data is given by user update the audio chunks
                if (e.data.size > 0) {
                    setAudioChunks((prev) => [...prev, e.data]);
                }
            };

            recorder.onstop = () => {
                // convert this to blob -> binary data (here audio)
                const blob = new Blob(audioChunks, { type: "audio/webm" });
                const audioURL = URL.createObjectURL(blob);

                // Store it as file for sending
                const audioFile = new File([blob], "voice-message.webm", {
                    type: "audio/webm",
                });

                setFile(audioFile);
                setFileType("audio");
                setPreviewURL(audioURL);

                // Stop stream
                if (audioStreamRef.current) {
                    audioStreamRef.current.getTracks().forEach((track) => track.stop());
                }

                setIsRecording(false);
            };

            recorder.start();
        } catch (err) {
            console.error("Microphone access denied or error:", err);
            alert("Please allow microphone access to record voice messages.");
        }
    };

    // Updated emoji handler
    const emojiHandler = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    // Handle emoji selection
    const onEmojiSelect = (emoji) => {
        // start from where ended typing
        const cursorPosition = textareaRef.current?.selectionStart || text.length;
        // can add text before or after the emojis
        const textBefore = text.substring(0, cursorPosition);
        const textAfter = text.substring(cursorPosition);
        // updating the new text thats it.
        const newText = textBefore + emoji.native + textAfter;

        setText(newText);

        // Focus back to textarea and set cursor position
        if (textareaRef.current) {
            textareaRef.current.focus(); // just for user experience
            // I want user should be able to type and see emojis to put parallely that's it.
            const newCursorPosition = cursorPosition + emoji.native.length;
            textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
        }
    };

    const formatText = (type) => {
        // if not using the textarea then return -> kind of error handler
        if (!textareaRef.current) return;

        const textarea = textareaRef.current; // select the text area
        const start = textarea.selectionStart; // get the start and end
        const end = textarea.selectionEnd;
        const selectedText = text.slice(start, end); // fetching the text from [start, end)

        let wrapper = "";
        if (type === "bold") wrapper = "**";
        if (type === "italic") wrapper = "_";
        //     if (type === "underline") {
        //     // Use HTML for underline
        //     const formatted = `<u>${selectedText}</u>`;
        //     const newText = text.slice(0, start) + formatted + text.slice(end);
        //     setText(newText);
        //     setTimeout(() => {
        //         textarea.focus();
        //         textarea.setSelectionRange(start + 3, end + 3); // +3 for <u>
        //     }, 0);
        //     return;
        // }

        const formatted = wrapper + selectedText + wrapper;
        const newText = text.slice(0, start) + formatted + text.slice(end);

        setText(newText);

        // Re-focus and place cursor properly
        // if not putting setTimeOut it is not wrapping the data in wrappers -> Dunno why
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + wrapper.length, end + wrapper.length);
        }, 0);
    };

    const handleBlur = () => {
        // just user experience
        setTimeout(() => {
            stopTyping();
        }, 100);
    };

    // Close emoji picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };

        if (showEmojiPicker) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showEmojiPicker]);

    // CLEANUP FUNCTIONS:
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

    // Cleanup media recorder on unmount
    useEffect(() => {
        return () => {
            if (mediaRecorder && mediaRecorder.state !== "inactive") {
                mediaRecorder.stop();
            }
            if (audioStreamRef.current) {
                audioStreamRef.current.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    return (
        <div className="p-4 w-full border-t border-zinc-700 bg-base-100">
            {/* Preview what user is sending */}
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

                        {/* remove button for file attachment */}
                        <button
                            onClick={removeAttachment}
                            type="button"
                            className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 group/btn"
                            title="Remove attachment"
                        >
                            <X size={16} className="group-hover/btn:rotate-90 transition-transform duration-200" />
                        </button>

                        {fileType === "image" && file?.size && (
                            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-white">
                                {formatFileSize(file.size)}
                            </div>
                        )}
                    </div>
                </div>
            )}
            {/* Emoji Picker */}
            {showEmojiPicker && (
                <div
                    ref={emojiPickerRef}
                    className="fixed bottom-20 left-15 z-[9999] animate-in slide-in-from-bottom-4 duration-100"
                    style={{ zIndex: 9999 }}
                >
                    <div className="shadow-2xl rounded-lg overflow-hidden border border-zinc-600">
                        <Picker
                            data={data}
                            onEmojiSelect={onEmojiSelect}
                            theme="dark"
                            set="native"
                            showPreview={true}
                            showSkinTones={true}
                            emojiSize={26}
                            perLine={12}
                            maxFrequentRows={2}
                        />
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

                    {/* Emoji Button */}
                    <button
                        type="button"
                        className={`btn btn-circle btn-ghost transition-colors duration-200 ${
                            showEmojiPicker ? "text-yellow-400 bg-yellow-400/10" : "text-zinc-500 hover:text-yellow-400"
                        }`}
                        onClick={emojiHandler}
                        title="Add emoji"
                    >
                        <Smile size={20} />
                    </button>

                    {/* Attach Button */}
                    <button
                        type="button"
                        className="btn btn-circle btn-ghost text-zinc-500 hover:text-white"
                        onClick={() => inputRef.current?.click()}
                        title="Attach file"
                    >
                        <Paperclip size={20} />
                    </button>

                    {/* Text Input */}
                    <TextareaAutosize
                        ref={textareaRef}
                        minRows={1}
                        maxRows={5}
                        className="flex-1 resize-none bg-base-200 rounded-xl p-3 text-sm placeholder-zinc-400 focus:outline-none"
                        placeholder="Type a message"
                        value={text}
                        onChange={handleTextChange}
                        onBlur={handleBlur}
                        onKeyDown={(e) => {
                            // for sending message on Enter
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSend(e);
                            }
                            // Close emoji picker on Escape
                            if (e.key === "Escape") {
                                setShowEmojiPicker(false);
                            }

                            // GBoard rich features.

                            // Bold: Ctrl+B or Cmd+B
                            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
                                e.preventDefault();
                                formatText("bold");
                            }

                            // Italic: Ctrl+I or Cmd+I
                            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "i") {
                                e.preventDefault();
                                formatText("italic");
                            }

                            // // Underline: Ctrl+U or Cmd+U
                            // if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "u") {
                            //     e.preventDefault();
                            //     formatText("underline");
                            // }
                        }}
                    />

                    {/* Voice recorder */}
                    <button
                        type="button"
                        onClick={handleStartRecording}
                        className={`btn btn-circle bg-[#bed2ef] text-gray-900 transition-all duration-200 ${
                            isRecording ? "text-red-600 animate-pulse" : "text-zinc-500 hover:text-white"
                        }`}
                        title={isRecording ? "Stop recording" : "Record voice message"}
                    >
                        <Mic size={20} />
                    </button>

                    {/* Send Button */}
                    <button
                        type="submit"
                        className="btn btn-circle bg-[#bed2ef]"
                        disabled={!text.trim() && !file}
                        title="Send message"
                    >
                        <Send size={20} />
                    </button>
                </form>

                {/* Typing indicator for current user */}
                {isTyping && <div className="absolute -top-6 left-2 text-xs text-primary animate-pulse">typing...</div>}

                {/* recording indicator */}
                {isRecording && (
                    <div className="absolute -top-6 left-2 text-md text-red-500 animate-pulse">
                        Recording... Tap again to stop
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessageInput;
