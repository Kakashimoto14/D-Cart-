import { createContext, startTransition, useEffect, useState } from "react";
import { authApi } from "../api/authApi";

export const AuthContext = createContext(null);

const TOKEN_KEY = "dcart_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const restoreSession = async () => {
      if (!token) {
        setIsReady(true);
        return;
      }

      try {
        const response = await authApi.getMe();
        startTransition(() => {
          setUser(response.user);
        });
      } catch (error) {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      } finally {
        setIsReady(true);
      }
    };

    restoreSession();
  }, [token]);

  const login = ({ token: nextToken, user: nextUser }) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    setToken(nextToken);
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isReady,
        isAuthenticated: Boolean(user && token),
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
