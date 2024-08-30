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
  login: (data: LoginProps) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
