import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

// zustand store for authentication
export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in AuthCheck: ", error);
      set({ authUser: null });
    } finally {
      // Indicate that the auth check is complete
      set({ isCheckingAuth: false });
    }
  },  
}));
