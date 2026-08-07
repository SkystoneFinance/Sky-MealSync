import {
  createContext,
  useEffect,
  useState,
} from "react";

import { authService } from "../../services/auth.service";
import type {
  LoginPayload,
  User,
} from "../../types/auth";

interface ContextType {
  user: User | null;

  loading: boolean;

  login: (
    data: LoginPayload
  ) => Promise<void>;

  logout: () => void;
}

export const AuthContext =
  createContext<ContextType>(
    {} as ContextType
  );

export default function AuthProvider({

  children,

}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    authService
      .me()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  async function login(
    data: LoginPayload
  ) {
    const result =
      await authService.login(data);

    localStorage.setItem(
      "token",
      result.token
    );

    setUser(result.user);
  }

  function logout() {
    localStorage.removeItem("token");

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}