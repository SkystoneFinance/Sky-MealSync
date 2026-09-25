import api from "../lib/axios";

import type {
  LoginPayload,
  LoginResponse,
  StaffActivatePayload,
  StaffActivateResponse,
  StaffVerifyOtpPayload,
  StaffOtpResponse,
  User,
  StaffUser,
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
  // ADMIN CURRENT USER
  // ===============================

  async me() {

    const res =
      await api.get<{
        success: boolean;
        user: User;
      }>("/auth/me");

    return res.data.user;
  },


  // ===============================
  // STAFF CURRENT PROFILE
  // ===============================

  async staffMe() {

    const res =
      await api.get<{
        success: boolean;
        data: User;
      }>("/staff-auth/me");

    return res.data.data;
  },

  async staffLogin(data: {
  staffNumber: string;
  pin: string;
}) {
  const res = await api.post<{
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

};