import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

// zustand store for chats
export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: localStorage.getItem("isSoundEnabled") === "true",
  // toggle sound
  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },
  // set active tab
  setActiveTab: (tab) => set({ activeTab: tab }),
  // set selected user
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  // get all contacts
  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // search user by email
  searchUserByEmail: async (email) => {
    try {
      const res = await axiosInstance.get(`/users/search?email=${encodeURIComponent(email)}`);
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "User not found");
      throw error;
    }
  },

  // add contact
  addContact: async (email) => {
    try {
      const res = await axiosInstance.post("/users/add-contact", { email });
      // Refresh contacts list after adding
      get().getAllContacts();
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add contact");
      throw error;
    }
  },

  // get my chat partners
  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // get messages by user id
  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      // get messages by user id from api
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      // show error toast if error
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // send message to user
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();

    const tempId = `temp-${Date.now()}`;

    // create optimistic message to show in ui immediately
    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true, // flag to identify optimistic messages (optional)
    };
    // immediately update the ui by adding the message
    set({ messages: [...messages, optimisticMessage] });

    try {
      // send message to user
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      // update messages state with new message
      set({ messages: messages.concat(res.data) });
    } catch (error) {
      // remove optimistic message on failure
      set({ messages: messages });
      // show error toast if error
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  },

  // subscribe to messages in real-time
  subscribeToMessages: () => {
    const { selectedUser, isSoundEnabled } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      const currentMessages = get().messages;
      set({ messages: [...currentMessages, newMessage] });

      // play notification sound if sound is enabled
      if (isSoundEnabled) {
        const notificationSound = new Audio("/sounds/notification.mp3");

        notificationSound.currentTime = 0; // reset to start
        notificationSound
          .play()
          .catch((e) => console.log("Audio play failed:", e));
      }
    });
  },

  // unsubscribe from messages in real-time
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
}));
