import {
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import { isAxiosError } from "axios";

import { authService } from "../../services/auth.service";

import { queryClient } from "../../lib/queryClient";

import {
  SESSION_EXPIRED_EVENT,
  TOKEN_KEY,
  USER_KEY,
  clearSession,
  isRefreshDue,
  saveToken,
} from "../../lib/session";

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
  // LOGOUT
  // ===================================

  const logout = useCallback(() => {

    clearSession();

    // Don't leave the previous user's data in the cache
    queryClient.clear();

    setUser(null);

  }, []);


  // ===================================
  // SLIDING EXPIRY: SWAP TOKEN FOR A
  // FRESH ONE AT MOST ONCE A DAY
  // ===================================

  const refreshSession = useCallback(async () => {

    if (
      !localStorage.getItem(TOKEN_KEY) ||
      !isRefreshDue()
    ) {
      return;
    }


    try {

      const token =
        await authService.refresh();

      saveToken(token);

    } catch (error) {

      // A 401 is handled by the axios interceptor (logs out).
      // Anything else (offline, server down): try again later.
      console.error(
        "Session refresh failed:",
        error
      );

    }

  }, []);


  // ===================================
  // RESTORE AUTH
  // ===================================

  useEffect(() => {

    async function restoreAuth() {

      const token =
        localStorage.getItem(TOKEN_KEY);

      const savedUser =
        localStorage.getItem(USER_KEY);


      if (!token) {

        setLoading(false);

        return;

      }


      let storedUser:
        User | null = null;


      // ---------------------------------
      // RESTORE USER FROM STORAGE
      // ---------------------------------

      if (savedUser) {

        try {

          storedUser =
            JSON.parse(savedUser);

          setUser(storedUser);

        } catch {

          localStorage.removeItem(
            USER_KEY
          );

        }

      }


      try {

        // ---------------------------------
        // STAFF SESSION
        // ---------------------------------

        if (
          storedUser?.role === "USER"
        ) {

          const profile =
            await authService.staffMe();

          // /staff-auth/me returns the profile without role or
          // staffId; without them the app treats staff as admins
          const staff = {
            ...profile,
            staffId: profile.id,
            role: "USER",
          } as StaffUser;

          setUser(staff);

          localStorage.setItem(
            USER_KEY,
            JSON.stringify(staff)
          );

        }

        // ---------------------------------
        // ADMIN SESSION
        // ---------------------------------

        else {

          const currentUser =
            await authService.me();

          setUser(currentUser);

          localStorage.setItem(
            USER_KEY,
            JSON.stringify(currentUser)
          );

        }

        void refreshSession();

      } catch (error) {

        console.error(
          "Authentication restore failed:",
          error
        );


        // Only end the session if the server rejected it.
        // Network errors / server downtime keep the stored user
        // so long-lived sessions survive a bad connection.
        const status =
          isAxiosError(error)
            ? error.response?.status
            : undefined;

        if (
          status === 401 ||
          status === 403 ||
          status === 404
        ) {

          clearSession();

          setUser(null);

        }

      } finally {

        setLoading(false);

      }

    }


    restoreAuth();

  }, [refreshSession]);


  // ===================================
  // KEEP SESSION FRESH WHILE APP IS OPEN
  // (e.g. the kitchen scanner that is never reloaded)
  // ===================================

  useEffect(() => {

    if (!user) {
      return;
    }


    const interval =
      window.setInterval(
        () => void refreshSession(),
        1000 * 60 * 60
      );


    const handleVisibility = () => {

      if (
        document.visibilityState === "visible"
      ) {
        void refreshSession();
      }

    };


    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );


    return () => {

      window.clearInterval(interval);

      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );

    };

  }, [user, refreshSession]);


  // ===================================
  // API REJECTED OUR TOKEN → LOG OUT
  // ===================================

  useEffect(() => {

    window.addEventListener(
      SESSION_EXPIRED_EVENT,
      logout
    );


    return () => {

      window.removeEventListener(
        SESSION_EXPIRED_EVENT,
        logout
      );

    };

  }, [logout]);


  // ===================================
  // ADMIN LOGIN
  // ===================================

  async function login(
    data: LoginPayload
  ): Promise<void> {

    const result =
      await authService.login(data);


    saveToken(result.token);


    localStorage.setItem(
      USER_KEY,
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

    saveToken(token);


    localStorage.setItem(
      USER_KEY,
      JSON.stringify(staffUser)
    );


    setUser(staffUser);

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