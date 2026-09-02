import api from "../lib/axios";

import type {
  LoginPayload,
  LoginResponse,
  StaffActivatePayload,
  StaffActivateResponse,
  StaffVerifyOtpPayload,
  StaffOtpResponse,
  User,
} from "../types/auth";


export const authService = {

  // ===============================
  // ADMIN LOGIN
  // ===============================

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


  // ===============================
  // STAFF ACTIVATE / REQUEST OTP
  // ===============================

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


  // ===============================
  // STAFF VERIFY OTP
  // ===============================

  async verifyStaffOtp(
    data: StaffVerifyOtpPayload
  ) {

    const res =
      await api.post<StaffOtpResponse>(
        "/staff-auth/verify-otp",
        data
      );

    return res.data;
  },


  // ===============================
  // CURRENT USER
  // ===============================

  async me() {

    const res =
      await api.get<{
        success: boolean;
        user: User;
      }>("/auth/me");

    return res.data.user;
  },

};