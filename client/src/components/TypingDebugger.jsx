import { useState, useEffect } from "react";
import { useUserAuthStore } from "../store/userAuthStore";
import { useUserChatStore } from "../store/userChatStore";

// Debug component to test typing functionality
const TypingDebugger = () => {
    const { socket, user } = useUserAuthStore();
    const { selectedUser } = useUserChatStore();
    const [debugLogs, setDebugLogs] = useState([]);
    const [testMessage, setTestMessage] = useState("");

    const addLog = (message) => {
        const timestamp = new Date().toLocaleTimeString();
        setDebugLogs((prev) => [...prev.slice(-9), `${timestamp}: ${message}`]);
    };

    useEffect(() => {
        if (!socket) return;

        // Listen for typing events
        const handleUserTyping = (data) => {
            addLog(`🟢 User typing: ${data.userName || data.userId}`);
        };

        const handleUserStoppedTyping = (data) => {
            addLog(`🔴 User stopped typing: ${data.userId}`);
        };

        socket.on("user-typing", handleUserTyping);
        socket.on("user-stopped-typing", handleUserStoppedTyping);

        return () => {
            socket.off("user-typing", handleUserTyping);
            socket.off("user-stopped-typing", handleUserStoppedTyping);
        };
    }, [socket]);

    const testStartTyping = () => {
        if (socket && selectedUser && user) {
            socket.emit("typing-start", {
                userId: user._id,
                recipientId: selectedUser._id,
                userName: user.name,
            });
            addLog(`📤 Sent typing-start to ${selectedUser.name}`);
        } else {
            addLog("❌ Cannot send - missing socket, user, or selectedUser");
        }
    };

    const testStopTyping = () => {
        if (socket && selectedUser && user) {
            socket.emit("typing-stop", {
                userId: user._id,
                recipientId: selectedUser._id,
            });
            addLog(`📤 Sent typing-stop to ${selectedUser.name}`);
        } else {
            addLog("❌ Cannot send - missing socket, user, or selectedUser");
        }
    };

    const clearLogs = () => {
        setDebugLogs([]);
    };

    return (
        <div className="fixed bottom-4 right-4 w-80 bg-base-100 border border-base-300 rounded-lg p-4 shadow-lg z-50">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-sm">Typing Debug</h3>
                <button onClick={clearLogs} className="text-xs btn btn-ghost btn-xs">
                    Clear
                </button>
            </div>

            {/* Status */}
            <div className="text-xs space-y-1 mb-3">
                <div>Socket: {socket ? "✅ Connected" : "❌ Disconnected"}</div>
                <div>User: {user ? `✅ ${user.name}` : "❌ No user"}</div>
                <div>Selected: {selectedUser ? `✅ ${selectedUser.name}` : "❌ None"}</div>
            </div>

            {/* Test buttons */}
            <div className="flex gap-2 mb-3">
                <button
                    onClick={testStartTyping}
                    className="btn btn-primary btn-xs"
                    disabled={!socket || !selectedUser || !user}
                >
                    Start Typing
                </button>
                <button
                    onClick={testStopTyping}
                    className="btn btn-secondary btn-xs"
                    disabled={!socket || !selectedUser || !user}
                >
                    Stop Typing
                </button>
            </div>

            {/* Test input */}
            <input
                type="text"
                value={testMessage}
                onChange={(e) => {
                    setTestMessage(e.target.value);
                    if (e.target.value) {
                        testStartTyping();
                    } else {
                        testStopTyping();
                    }
                }}
                placeholder="Type to test..."
                className="input input-xs w-full mb-3"
            />

            {/* Debug logs */}
            <div className="text-xs bg-base-200 rounded p-2 h-32 overflow-y-auto">
                {debugLogs.length === 0 ? (
                    <div className="text-base-content/50">No logs yet...</div>
                ) : (
                    debugLogs.map((log, index) => (
                        <div key={index} className="font-mono">
                            {log}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TypingDebugger;
