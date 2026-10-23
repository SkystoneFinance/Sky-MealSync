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
  // FORGOT PIN: ask an administrator to reset it
  // ==========================================

  async requestPinReset(staffNumber: string) {

    const res =
      await api.post<{
        success: boolean;
        message: string;
      }>(
        "/staff-auth/pin-reset-request",
        { staffNumber }
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
  // REFRESH SESSION (ADMIN OR STAFF)
  // Swaps the current token for a fresh one.
  // ==========================================

  async refresh() {

    const res =
      await api.post<{
        success: boolean;
        token: string;
      }>(
        "/auth/refresh"
      );

    return res.data.token;
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