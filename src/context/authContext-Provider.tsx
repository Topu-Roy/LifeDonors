"use client";

import { useCallback, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "./authContext";
import { useNewLocalStorage } from "@/hooks/useLocalStorage";

function AuthContextProvider({ children }: { children: ReactNode }) {
  const [userId_localStore] = useNewLocalStorage<string | null>("userId", null);
  const [token_localStore] = useNewLocalStorage<string | null>("token", null);

  const [token, setToken] = useState<string | null>(token_localStore);
  const [userId, setUserId] = useState<string | null>(userId_localStore);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const handleAuthenticate = useCallback(() => {
    if (token_localStore) {
      setIsAuthenticated(true);
      setToken(token_localStore);
      setUserId(userId_localStore);
    }
  }, [token_localStore, userId_localStore]);

  const logout = useCallback(() => {
    async function makeRequest() {
      try {
        const response = await fetch(
          `https://roktodan2.onrender.com/users/users/logout?auth_token=${token}`,
        );

        if (response.ok) {
          setToken(null);
          setUserId(null);
          setIsAuthenticated(false);
          router.push("/login");
        }
      } catch (error) {
        console.error(error);
      }
    }

    void makeRequest();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, userId, logout, handleAuthenticate }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
