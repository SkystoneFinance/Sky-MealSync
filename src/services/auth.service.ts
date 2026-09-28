import api from "../lib/axios";

import type {
  LoginPayload,
  LoginResponse,
  StaffActivatePayload,
  StaffActivateResponse,
  StaffUser,
  User,
} from "../types/auth";


export const authService = {

  // ==========================================
  // ADMIN LOGIN
  // ==========================================

  async login(
    data: LoginPayload
  ) {

    const res =
      await api.post<LoginResponse>(
        "/auth/login",
        data
      );

    return res.data;
  },


  // ==========================================
  // STAFF FIRST-TIME ACTIVATION
  // ==========================================

  async activateStaff(
    data: StaffActivatePayload
  ) {

    const res =
      await api.post<StaffActivateResponse>(
        "/staff-auth/activate",
        data
      );

    return res.data;
  },


  // ==========================================
  // STAFF LOGIN
  // ==========================================

  async staffLogin(
    data: {
      staffNumber: string;
      pin: string;
    }
  ) {

    const res =
      await api.post<{
        success: boolean;
        message: string;
        token: string;
        user: StaffUser;
      }>(
        "/staff-auth/login",
        data
      );

    return res.data;
  },


  // ==========================================
  // ADMIN CURRENT USER
  // ==========================================

  async me() {

    const res =
      await api.get<{
        success: boolean;
        user: User;
      }>(
        "/auth/me"
      );

    return res.data.user;
  },


  // ==========================================
  // STAFF CURRENT PROFILE
  // ==========================================

  async staffMe() {

    const res =
      await api.get<{
        success: boolean;
        data: User;
      }>(
        "/staff-auth/me"
      );

    return res.data.data;
  },

};