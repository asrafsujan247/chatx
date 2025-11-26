import { ActiveTabSwitch } from "../component/ActiveTabSwitch";
import { useParams } from "react-router";
import { useEffect, useState } from "react";

import { ChatContainer } from "../component/ChatContainer";
import { ChatsList } from "../component/ChatsList";
import { ContactList } from "../component/ContactList";
import { NoConversationPlaceholder } from "../component/NoConversationPlaceholder";
import { ProfileHeader } from "../component/ProfileHeader";
import { AddContact } from "../component/AddContact";
import { useChatStore } from "../store/useChatStore";

const ChatPage = () => {
  const { activeTab, selectedUser, setSelectedUser, chats, allContacts } =
    useChatStore();
  const { id } = useParams();
  const [showAddContact, setShowAddContact] = useState(false);

  useEffect(() => {
    if (id) {
      const user =
        chats.find((c) => c._id === id) ||
        allContacts.find((c) => c._id === id);
      if (user) {
        setSelectedUser(user);
      }
    } else {
      // Only clear if we are on the root chat page and there is a selected user
      // This prevents clearing when navigating TO a chat
      // Actually, if id is undefined, we SHOULD clear selectedUser to show the list
      setSelectedUser(null);
    }
  }, [id, chats, allContacts, setSelectedUser]);

  return (
    <div className="relative w-full max-w-6xl h-[calc(100vh-2rem)] beautiful-bg rounded-2xl overflow-hidden flex">
      {/* LEFT SIDE */}
      <div
        className={`w-full md:w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col ${
          selectedUser ? "hidden md:flex" : "flex"
        }`}
      >
        {/* Profile Header */}
        <ProfileHeader onAddContactClick={() => setShowAddContact(true)} />
        {/* Active Tab Switch */}
        <ActiveTabSwitch />
        {/* Chats List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {activeTab === "chats" ? <ChatsList /> : <ContactList />}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div
        className={`flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm ${
          !selectedUser ? "hidden md:flex" : "flex"
        }`}
      >
        {/* Chat Container */}
        {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
      </div>

      {/* Add Contact Modal - Rendered at ChatPage level */}
      {showAddContact && (
        <AddContact onClose={() => setShowAddContact(false)} />
      )}
    </div>
  );
};

export default ChatPage;
