import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

// zustand store for authentication
export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  socket: null,
  onlineUsers: [],

  // auth check method
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in AuthCheck: ", error);
      set({ authUser: null });
    } finally {
      // Indicate that the auth check is complete
      set({ isCheckingAuth: false });
    }
  },

  // signup method
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      // Show success toast
      toast.success("Account created successfully!");
      get().connectSocket();
    } catch (error) {
      // Show error toast
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  // login method
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      // show success toast
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      // show error toast
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // logout method
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error("Error logging out");
      console.log("Logout error:", error);
    }
  },

  // update profile method
  updateProfile: async (data) => {
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      // show success toast
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in update profile:", error);
      // show error toast
      toast.error(error?.response?.data?.message);
    }
  },

  // socket connection method
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      // to ensure cookies are sent with the connection
      withCredentials: true,
    });

    socket.connect();

    set({ socket });

    // listen for online users event
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    // Listen for friend request notifications
    socket.on("friendRequest", (data) => {
      const { sender } = data;

      // Play notification sound if enabled
      import("./useChatStore").then(({ useChatStore }) => {
        const { isSoundEnabled } = useChatStore.getState();
        if (isSoundEnabled) {
          const notificationSound = new Audio("/sounds/notification.mp3");
          notificationSound
            .play()
            .catch((e) => console.log("Audio play failed:", e));
        }

        // Refresh pending requests
        useChatStore.getState().getPendingRequests();
      });

      // Show toast notification
      toast.success(`${sender.fullName} sent you a friend request!`, {
        duration: 4000,
        icon: "👋",
      });
    });

    // Listen for friend request response
    socket.on("requestResponse", (data) => {
      const { status, user } = data;

      // Play notification sound if enabled
      import("./useChatStore").then(({ useChatStore }) => {
        const { isSoundEnabled } = useChatStore.getState();
        if (isSoundEnabled) {
          const notificationSound = new Audio("/sounds/notification.mp3");
          notificationSound
            .play()
            .catch((e) => console.log("Audio play failed:", e));
        }

        if (status === "accepted") {
          // Refresh contacts and sent requests
          useChatStore.getState().getAllContacts();
          useChatStore.getState().getSentRequests();
        } else {
          // Refresh sent requests
          useChatStore.getState().getSentRequests();
        }
      });

      // Show toast notification
      if (status === "accepted") {
        toast.success(`${user.fullName} accepted your friend request!`, {
          duration: 4000,
          icon: "✅",
        });
      } else {
        toast(`${user.fullName} declined your friend request`, {
          duration: 4000,
          icon: "❌",
        });
      }
    });

    // Listen for message notifications
    socket.on("messageNotification", (data) => {
      const { senderId, senderName } = data;

      // Check if user is already viewing this chat
      import("./useChatStore").then(({ useChatStore }) => {
        const { selectedUser, isSoundEnabled } = useChatStore.getState();

        // Don't show notification if already viewing this chat
        if (selectedUser?._id === senderId) {
          return;
        }

        // Play notification sound if enabled
        if (isSoundEnabled) {
          const notificationSound = new Audio("/sounds/notification.mp3");
          notificationSound
            .play()
            .catch((e) => console.log("Audio play failed:", e));
        }

        // Show toast notification
        toast(`New message from ${senderName}`, {
          duration: 3000,
          icon: "💬",
        });
      });
    });
  },

  // socket disconnection method
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
