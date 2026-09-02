import {
  createContext,
  useEffect,
  useState,
} from "react";

import { authService } from "../../services/auth.service";

import type {
  LoginPayload,
  User,
  StaffUser,
} from "../../types/auth";


interface AuthContextType {

  user: User | null;

  loading: boolean;


  // ADMIN LOGIN

  login: (
    data: LoginPayload
  ) => Promise<void>;


  // STAFF LOGIN

  staffLogin: (
    user: StaffUser,
    token: string
  ) => void;


  logout: () => void;

}


export const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
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


  // ===================================
  // RESTORE AUTH
  // ===================================

  useEffect(() => {

    const token =
      localStorage.getItem("token");


    const savedUser =
      localStorage.getItem("user");


    if (!token) {

      setLoading(false);

      return;

    }


    // Restore immediately from storage
    if (savedUser) {

      try {

        setUser(
          JSON.parse(savedUser)
        );

      } catch {

        localStorage.removeItem("user");

      }

    }


    // Verify admin token with backend
    authService
      .me()
      .then((currentUser) => {

        setUser(currentUser);

        localStorage.setItem(
          "user",
          JSON.stringify(currentUser)
        );

      })
      .catch(() => {

        // Don't immediately destroy staff sessions
        // because staff authentication currently
        // uses a different login response.

        if (!savedUser) {

          localStorage.removeItem("token");

          setUser(null);

        }

      })
      .finally(() => {

        setLoading(false);

      });

  }, []);


  // ===================================
  // ADMIN LOGIN
  // ===================================

  async function login(
    data: LoginPayload
  ): Promise<void> {

    const result =
      await authService.login(data);


    localStorage.setItem(
      "token",
      result.token
    );


    localStorage.setItem(
      "user",
      JSON.stringify(result.user)
    );


    setUser(result.user);

  }


  // ===================================
  // STAFF LOGIN
  // ===================================

  function staffLogin(
    staffUser: StaffUser,
    token: string
  ) {

    localStorage.setItem(
      "token",
      token
    );


    localStorage.setItem(
      "user",
      JSON.stringify(staffUser)
    );


    setUser(staffUser);

  }


  // ===================================
  // LOGOUT
  // ===================================

  function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setUser(null);

  }


  return (

    <AuthContext.Provider
      value={{

        user,

        loading,

        login,

        staffLogin,

        logout,

      }}
    >

      {children}

    </AuthContext.Provider>

  );

}