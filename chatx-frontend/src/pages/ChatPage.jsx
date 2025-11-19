import { ActiveTabSwitch } from "../component/ActiveTabSwitch";
import BorderAnimationContainer from "../component/BorderAnimationContainer";
import { ChatContainer } from "../component/ChatContainer";
import { ChatsList } from "../component/ChatsList";
import { ContactList } from "../component/ContactList";
import { NoConversationPlaceholder } from "../component/NoConversationPlaceholder";
import { ProfileHeader } from "../component/ProfileHeader";
import { useChatStore } from "../store/useChatStore";

const ChatPage = () => {
  const { activeTab, selectedUser } = useChatStore();

  return (
    <div className="relative w-full max-w-6xl h-[700px]">
      <BorderAnimationContainer>
        {/* LEFT SIDE */}
        <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col">
          {/* Profile Header */}
          <ProfileHeader />
          {/* Active Tab Switch */}
          <ActiveTabSwitch />
          {/* Chats List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === "chats" ? <ChatsList /> : <ContactList />}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
          {/* Chat Container */}
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>
      </BorderAnimationContainer>
    </div>
  );
};

export default ChatPage;
