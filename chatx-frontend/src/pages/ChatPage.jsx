import React from "react";
import { useAuthStore } from "../store/useAuthStore";

const ChatPage = () => {
  const { userName, id, login } = useAuthStore();
  console.log("user name form chat page", userName);

  return (
    <div>
      <h1>chat page</h1>
    </div>
  );
};

export default ChatPage;
