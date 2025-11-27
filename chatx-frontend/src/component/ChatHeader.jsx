import { XIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

export const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const navigate = useNavigate();
  // auth store methods to get online users
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);

  useEffect(() => {
    // handle esc key to close chat
    const handleEscKey = (event) => {
      if (event.key === "Escape") navigate("/");
    };

    window.addEventListener("keydown", handleEscKey);

    // cleanup function
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser, navigate]);

  return (
    <div
      className="flex justify-between items-center bg-slate-800/50 border-b
   border-slate-700/50 max-h-[89px] px-3 md:px-6 flex-1 w-full overflow-hidden"
    >
      <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
        <div
          className={`avatar ${isOnline ? "online" : "offline"} flex-shrink-0`}
        >
          <div className="w-10 md:w-12 rounded-full">
            <img
              src={selectedUser.profilePic || "/avatar.png"}
              alt={selectedUser.fullName}
            />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-slate-200 font-medium truncate">
            {selectedUser.fullName}
          </h3>
          <p className="text-slate-400 text-sm truncate">
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <button
        className="tooltip flex-shrink-0 ml-2"
        data-tip="Close"
        onClick={() => navigate("/")}
      >
        <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
      </button>
    </div>
  );
};
