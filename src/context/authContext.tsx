import { createContext } from "react";

export type LoginProps = {
  username: string;
  password: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  userId: string | null;
  token: string | null;
  logout: () => void;
  handleAuthenticate: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
