import { useEffect, useState, type ReactElement } from "react";
import { useRouter } from "next/navigation";
import { AuthContext, type LoginProps } from "./authContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";

type LoginResponse = {
  token: string;
  user_id: number;
};

function AuthContextProvider({ children }: { children: ReactElement }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const { setItem: setToken_LocalStore } = useLocalStorage("token");
  const { setItem: setUserId_LocalStore } = useLocalStorage("userId");

  const login = (data: LoginProps) => {
    async function makeRequest() {
      try {
        const response = await fetch(
          "https://roktodan2.onrender.com/users/users/login/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: data.username,
              password: data.password,
            }),
          },
        );

        const resData = (await response.json()) as LoginResponse;
        setToken(resData.token);
        setUserId(JSON.stringify(resData.user_id));
        setIsAuthenticated(true);
        router.push("/dashboard");
      } catch (error) {
        console.error(error);
      }
    }

    void makeRequest();
  };

  const logout = () => {
    async function makeRequest() {
      try {
        const response = await fetch(
          "https://roktodan2.onrender.com/users/users/logout/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            //   body: JSON.stringify({
            // username: data.username,
            // password: data.password,
            //   }),
          },
        );

        const resData = (await response.json()) as LoginResponse;
        setToken(resData.token);
        setUserId(JSON.stringify(resData.user_id));
        setIsAuthenticated(true);

        router.push("/dashboard");
      } catch (error) {
        console.error(error);
      }
    }

    void makeRequest();
    setIsAuthenticated(false);
    setToken(null);
    setUserId(null);
  };

  useEffect(() => {
    setToken_LocalStore(token);
    setUserId_LocalStore(userId);
  }, [isAuthenticated, token, userId]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, userId, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
