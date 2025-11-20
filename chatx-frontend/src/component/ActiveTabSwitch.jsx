import { MessageCircle, User } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

export const ActiveTabSwitch = () => {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="p-2 m-2">
      <div className="relative bg-slate-800/80 backdrop-blur-sm rounded-xl p-1.5 flex gap-2 shadow-lg border border-slate-700/50">
        {/* Animated background slider */}
        <div
          className={`absolute top-1.5 bottom-1.5 w-[calc(50%-0.5rem)] bg-gradient-to-br from-cyan-500/40 to-blue-500/40 rounded-lg shadow-md transition-all duration-300 ease-in-out ${
            activeTab === "chats" ? "left-1.5" : "left-[calc(50%+0.25rem)]"
          }`}
        />

        {/* Chats Tab */}
        <button
          onClick={() => setActiveTab("chats")}
          className={`relative flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg transition-colors duration-300 ${
            activeTab === "chats"
              ? "text-white"
              : "text-slate-400 hover:text-slate-300"
          }`}
        >
          <MessageCircle className="size-5" />
          <span className="text-base font-semibold">Chats</span>
        </button>

        {/* Contacts Tab */}
        <button
          onClick={() => setActiveTab("contacts")}
          className={`relative flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg transition-colors duration-300 ${
            activeTab === "contacts"
              ? "text-white"
              : "text-slate-400 hover:text-slate-300"
          }`}
        >
          <User className="size-5" />
          <span className="text-base font-semibold">Contacts</span>
        </button>
      </div>
    </div>
  );
};
