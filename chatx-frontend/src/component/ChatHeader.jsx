import { XIcon, ArrowLeft } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

export const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  // auth store methods to get online users
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);

  useEffect(() => {
    // handle esc key to close chat
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };

    window.addEventListener("keydown", handleEscKey);

    // cleanup function
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  return (
    <div
      className="flex justify-between items-center bg-slate-800/50 border-b
   border-slate-700/50 max-h-[89px] px-6 flex-1"
    >
      <div className="flex items-center space-x-3">
        {/* Back Button for Mobile */}
        <button className="md:hidden mr-2" onClick={() => setSelectedUser(null)}>
          <ArrowLeft className="w-6 h-6 text-slate-400" />
        </button>

        <div
          className={`avatar ${
            isOnline ? "online" : "offline"
          }`}
        >
          <div className="w-12 rounded-full">
            <img
              src={selectedUser.profilePic || "/avatar.png"}
              alt={selectedUser.fullName}
            />
          </div>
        </div>

        <div>
          <h3 className="text-slate-200 font-medium">
            {selectedUser.fullName}
          </h3>
          <p className="text-slate-400 text-sm">{isOnline ? "Online" : "Offline"}</p>
        </div>
      </div>

      <button
        className="tooltip"
        data-tip="Close"
        onClick={() => setSelectedUser(null)}
      >
        <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
      </button>
    </div>
  );
};
