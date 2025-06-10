import { Download } from "lucide-react";

const ChatBubble = ({ message, isOwnMessage }) => {
    const bubbleStyle = isOwnMessage ? "bg-emerald-600 text-white self-end" : "bg-zinc-200 text-black self-start";

    return (
        <div
            className={`max-w-xs sm:max-w-sm md:max-w-md flex flex-col gap-2 ${
                isOwnMessage ? "items-end" : "items-start"
            }`}
        >
            <div className={`p-3 rounded-xl ${bubbleStyle}`}>
                {message.text && <div className="whitespace-pre-line">{message.text}</div>}

                {message.image && <img src={message.image} alt="Sent Image" className="rounded-lg mt-2 max-w-full" />}

                {message.audio && <audio controls src={message.audio} className="mt-2 w-full rounded-md" />}

                {message.video && <video controls src={message.video} className="mt-2 w-full rounded-md" />}

                {message.file && (
                    <a
                        href={message.file}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 mt-2 text-sm underline"
                    >
                        <Download size={16} /> Download File
                    </a>
                )}
            </div>
        </div>
    );
};

export default ChatBubble;
