import { create } from "zustand";

interface UserData {
  token: string | null;
  userId: string | null;
}

interface UserState {
  userData: UserData | null;
  setUser: (userData: UserData) => void;
  clearUser: () => void;
}

const getInitialUserData = (): UserData | null => {
  const token = sessionStorage.getItem("userToken");
  const userId = sessionStorage.getItem("userId");
  return token && userId ? { token, userId } : null;
};

export const useUserStore = create<UserState>((set) => ({
  userData: getInitialUserData(),

  setUser: (userData: UserData) => {
    sessionStorage.setItem("userToken", userData.token ?? "");
    sessionStorage.setItem("userId", userData.userId ?? "");
    set({ userData });
  },

  clearUser: () => {
    sessionStorage.removeItem("userToken");
    sessionStorage.removeItem("userId");
    set({ userData: null });
  },
}));
