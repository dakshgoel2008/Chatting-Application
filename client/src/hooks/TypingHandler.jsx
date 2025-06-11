import { useEffect, useRef } from "react";
import { useUserAuthStore } from "../store/userAuthStore";

// Custom hook to handle typing indicators
export const useTypingIndicator = (recipientId) => {
    const { socket, user } = useUserAuthStore();
    const typingTimeoutRef = useRef(null);
    const isTypingRef = useRef(false);

    const startTyping = () => {
        if (!socket || !recipientId || !user) return;

        // Only emit if not already typing
        if (!isTypingRef.current) {
            socket.emit("typing-start", {
                userId: user._id,
                recipientId: recipientId,
                userName: user.name,
            });
            isTypingRef.current = true;
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

    const stopTyping = () => {
        if (!socket || !recipientId || !user) return;

        if (isTypingRef.current) {
            socket.emit("typing-stop", {
                userId: user._id,
                recipientId: recipientId,
            });
            isTypingRef.current = false;
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
        }
    };

    // Cleanup on unmount or when recipientId changes
    useEffect(() => {
        return () => {
            stopTyping();
        };
    }, [recipientId]);

    return { startTyping, stopTyping };
};

// Usage example for your message input component:
export const MessageInputWithTyping = ({ recipientId, onSendMessage }) => {
    const [message, setMessage] = useState("");
    const { startTyping, stopTyping } = useTypingIndicator(recipientId);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setMessage(value);

        // Start typing indicator when user types
        if (value.trim()) {
            startTyping();
        } else {
            stopTyping();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            // Stop typing before sending message
            stopTyping();
            onSendMessage(message.trim());
            setMessage("");
        }
    };

    // Stop typing when component loses focus
    const handleBlur = () => {
        stopTyping();
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border-t border-base-300">
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={message}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Type a message..."
                    className="flex-1 input input-bordered"
                />
                <button type="submit" disabled={!message.trim()} className="btn btn-primary">
                    Send
                </button>
            </div>
        </form>
    );
};
