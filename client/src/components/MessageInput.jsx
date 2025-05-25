import { useState, useRef } from "react";
import { Paperclip, Send, X } from "lucide-react";
import { useUserChatStore } from "../store/userChatStore";
import TextareaAutosize from "react-textarea-autosize";

const MessageInput = () => {
    const [text, setText] = useState("");
    const [file, setFile] = useState(null);
    const [fileType, setFileType] = useState(null); // image, audio, file
    const [previewURL, setPreviewURL] = useState(null);

    const inputRef = useRef(null);
    const { sendMessage } = useUserChatStore();

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;

        setFile(selected);
        const type = selected.type;

        if (type.startsWith("image/")) {
            setFileType("image");
        } else if (type.startsWith("audio/")) {
            setFileType("audio");
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

    const handleSend = async (e) => {
        e.preventDefault();
        if (!text.trim() && !file) return;

        const formData = new FormData();
        formData.append("text", text);
        if (file) formData.append("file", file);
        await sendMessage(formData);

        // Reset
        setText("");
        removeAttachment();
    };

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
            <form onSubmit={handleSend} className="flex items-center gap-2">
                {/* Hidden File Input */}
                <input
                    type="file"
                    accept="image/*,audio/*,.pdf,.doc,.docx,.ppt,.pptx"
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
                    className="flex-1 resize-none bg-base-200 text-white rounded-xl p-3 text-sm placeholder-zinc-400 focus:outline-none"
                    placeholder="Type a message"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend(e);
                        }
                    }}
                />

                {/* Send Button */}
                <button type="submit" className="btn btn-circle" disabled={!text.trim() && !file}>
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};

export default MessageInput;
