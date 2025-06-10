import { useEffect, useState } from "react";
import { useUserChatStore } from "./../store/userChatStore";
import SideBarSkeleton from "./Skeletons/SideBarSkeleton";
import { Search, Users, Lock } from "lucide-react";
import { useUserAuthStore } from "../store/userAuthStore";
import { capitaliseWords } from "./../lib/utils";
const SideBar = () => {
    const { getUsers, selectedUser, setSelectedUser, users, isUsersLoading } = useUserChatStore();
    const { onlineUsers } = useUserAuthStore();
    const [showOnlineUsersOnly, setShowOnlineUsersOnly] = useState(false);
    const [searchedInput, setSearchedInput] = useState("");
    const [searchedTerm, setSearchedTerm] = useState("");

    useEffect(() => {
        getUsers();
    }, [getUsers]);
    const searchHandler = (e) => {
        setSearchedInput(e.target.value.toLowerCase());
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setSearchedTerm(searchedInput);
            console.log(searchedInput);
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [searchedInput]);

    const filteredUsers = users
        .filter((user) => {
            if (showOnlineUsersOnly && !onlineUsers.includes(user._id)) return false;
            return true;
        })
        .filter((user) => user.name.toLowerCase().includes(searchedTerm));

    if (isUsersLoading) return <SideBarSkeleton></SideBarSkeleton>;
    return (
        <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
            {/* Top Section: Header, Search, Filter */}
            <div className="border-b border-base-300 w-full p-5">
                <div className="flex items-center gap-2">
                    <Users className="size-6" />
                    <span className="font-medium hidden lg:block">Contacts</span>
                </div>
                {/* Search Bar */}
                <div className="mt-3 hidden lg:block relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 size-5" />
                    <input
                        type="text"
                        placeholder="Search contacts..."
                        className="input input-bordered w-full pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        onChange={searchHandler}
                    />
                </div>

                {/* Online Filter Toggler */}
                <div className="mt-3 hidden lg:flex items-center gap-2">
                    <label className="cursor-pointer flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={showOnlineUsersOnly}
                            onChange={(e) => setShowOnlineUsersOnly(e.target.checked)}
                            className="checkbox checkbox-sm"
                        />
                        <span className="text-sm">Show online only</span>
                    </label>
                    <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
                </div>
            </div>

            {/* Contacts */}
            <div className="flex-1 overflow-y-auto py-3">
                {filteredUsers.map((user) => (
                    <button
                        key={user._id}
                        onClick={() => setSelectedUser(user)}
                        className={`w-full p-3 flex items-center gap-3
                    hover:bg-base-300 transition-colors
                    ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
                `}
                    >
                        <div className="relative mx-auto lg:mx-0">
                            <img
                                src={user.profileImage}
                                alt={user.name}
                                className="size-12 object-cover rounded-full"
                            />
                            {onlineUsers.includes(user._id) && (
                                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                            )}
                        </div>

                        {/* User info - only visible on larger screens */}
                        <div className="hidden lg:block text-left min-w-0">
                            <div className="font-medium truncate">
                                {user.name ? capitaliseWords(user.name) : "No Name"}
                            </div>
                            <div className="text-sm text-zinc-400">
                                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                            </div>
                        </div>
                    </button>
                ))}

                {filteredUsers.length === 0 && <div className="text-center text-zinc-500 py-4">No One to Chat</div>}
            </div>
        </aside>
    );
};

export default SideBar;
