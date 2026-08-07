import api from "../lib/axios";
import type {
  LoginPayload,
  LoginResponse,
  User,
} from "../types/auth";

export const authService = {
  async login(data: LoginPayload) {
    const res = await api.post<LoginResponse>(
      "/auth/login",
      data
    );

    return res.data;
  },

  async me() {
    const res = await api.get<{
      success: boolean;
      user: User;
    }>("/auth/me");

    return res.data.user;
  },
};