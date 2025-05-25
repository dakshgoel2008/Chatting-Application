import { useEffect, useRef } from "react";
import { useUserChatStore } from "../store/userChatStore";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";
import MessageSkeleton from "./Skeletons/MessageSkeleton";
import { useUserAuthStore } from "../store/userAuthStore";
import { formatMessageTime } from "../lib/utils";
const ChatContainer = () => {
    const { message, getMessages, isMessageLoading, selectedUser, subscribeToMessages, unSubscribeToMessages } =
        useUserChatStore();
    const { user } = useUserAuthStore();
    const messageRef = useRef(null);

    useEffect(() => {
        if (selectedUser?._id) {
            getMessages(selectedUser._id);
            subscribeToMessages();
        }
        return () => unSubscribeToMessages();
    }, [selectedUser, getMessages, subscribeToMessages, unSubscribeToMessages]);

    useEffect(() => {
        if (messageRef.current && message) messageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    if (isMessageLoading)
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div>
        );
    // console.log(message);
    console.log(message);
    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {message.map((message) => (
                    <div
                        key={message._id}
                        className={`chat ${message.senderId === user._id ? "chat-end" : "chat-start"}`}
                        ref={messageRef}
                    >
                        {/*@DKG References: chat-end -> right rendered messages -> sent by loggedIn user */}
                        <div className="chat-image avatar">
                            <div className="size-10 rounded-full border">
                                <img
                                    src={message.senderId === user._id ? user.profileImage : selectedUser.profileImage}
                                    alt="profile pic"
                                />
                            </div>
                        </div>
                        <div className="chat-header mb-1">
                            <time className="text-xs opacity-50 ml-1">{formatMessageTime(message.createdAt)}</time>
                        </div>
                        <div className="chat-bubble flex flex-col">
                            {/* main chatting structure */}
                            <div className="chat-bubble flex flex-col">
                                {message.file && (
                                    <>
                                        {message.file.match(/\.(jpeg|png|gif|jpg)$/) && (
                                            <img
                                                src={message.file}
                                                alt="Attachment"
                                                className="sm:max-w-[200px] rounded-md mb-2"
                                            />
                                        )}

                                        {message.file.match(/\.(mp4|webm|ogg)$/) && (
                                            <video controls className="w-full max-w-xs rounded-md mb-2" alt="video">
                                                <source src={message.file} />
                                                Your browser does not support the video tag.
                                            </video>
                                        )}
                                        {message.file.endsWith(".pdf") && (
                                            <iframe
                                                src={message.file}
                                                title="PDF"
                                                className="w-full max-w-sm h-64 rounded-md border mb-2"
                                            />
                                        )}

                                        {(message.file.endsWith(".doc") || message.file.endsWith(".docx")) && (
                                            <div className="mb-2">
                                                <a
                                                    href={message.file}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-blue-500 underline"
                                                >
                                                    📄 View Word Document
                                                </a>
                                            </div>
                                        )}

                                        {(message.file.endsWith(".xls") || message.file.endsWith(".xlsx")) && (
                                            <div className="mb-2">
                                                <a
                                                    href={message.file}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-green-600 underline"
                                                >
                                                    📊 View Excel Spreadsheet
                                                </a>
                                            </div>
                                        )}
                                    </>
                                )}

                                {message.text && <p>{message.text}</p>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <MessageInput />
        </div>
    );
};

export default ChatContainer;
