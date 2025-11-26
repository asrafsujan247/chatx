import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useChatStore } from "../store/useChatStore";
import { UsersLoadingSkeleton } from "./UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";

export const ContactList = () => {
  // chat store methods to get all contacts
  const { getAllContacts, allContacts, isUsersLoading } =
    useChatStore();
  const navigate = useNavigate();
  // auth store methods to get online users
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  // if users are loading, show loading skeleton
  if (isUsersLoading) return <UsersLoadingSkeleton />;

  return (
    <>
      {allContacts.map((contact) => (
        <div
          key={contact._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => navigate(`/chat/${contact._id}`)}
        >
          <div className="flex items-center gap-3">
            <div
              className={`avatar ${
                onlineUsers.includes(contact._id) ? "online" : "offline"
              }`}
            >
              <div className="size-12 rounded-full">
                <img src={contact.profilePic || "/avatar.png"} />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium">{contact.fullName}</h4>
          </div>
        </div>
      ))}
    </>
  );
};
