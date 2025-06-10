import SideBar from "./../components/SideBar";
import NoChatSelected from "./../components/NoChatSelected";
import ChatContainer from "./../components/ChatContainer";
import { useUserChatStore } from "./../store/userChatStore";

const HomePage = () => {
    const { selectedUser } = useUserChatStore();

    return (
        <div className="h-screen w-screen overflow-hidden flex mt-10">
            {/* Sidebar */}
            <SideBar />

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">{!selectedUser ? <NoChatSelected /> : <ChatContainer />}</div>
        </div>
    );
};

export default HomePage;
