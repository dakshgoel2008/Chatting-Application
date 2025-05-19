import { X } from "lucide-react";
import { useUserChatStore } from "../store/userChatStore";
import { useUserAuthStore } from "../store/userAuthStore";
import { capitaliseWords } from "../lib/capitalise";

const ChatHeader = () => {
    const { selectedUser, setSelectedUser } = useUserChatStore();
    const { onlineUsers } = useUserAuthStore();
    return (
        <div className="p-2.5 border-b border-base-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="avatar">
                        <div className="size-10 rounded-full relative">
                            <img src={selectedUser.profileImage} alt={selectedUser.username} />
                        </div>
                    </div>

                    {/* User info */}
                    <div>
                        <h3 className="font-medium">{capitaliseWords(selectedUser.name)}</h3>
                        <p className="text-sm text-base-content/70">
                            {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
                        </p>
                    </div>
                </div>

                {/* Close button */}
                <button onClick={() => setSelectedUser(null)}>
                    <X />
                </button>
            </div>
        </div>
    );
};
export default ChatHeader;
