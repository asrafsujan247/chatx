import { create } from "zustand";

export const useAuthStore = create((set) => ({
  userName: "nananana",
  id: "12345",
  login: () => {
    console.log("login user");
  },
}));
