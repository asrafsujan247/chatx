import React from "react";
import { useAuthStore } from "../store/useAuthStore";

const ChatPage = () => {
  const { logout } = useAuthStore();

  return (
    <div>
      <h1 className="text-blue-300 mb-2 text-3xl">chat page</h1>
      <button className="btn btn-secondary z-50 relative" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default ChatPage;
