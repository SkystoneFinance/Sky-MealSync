import axios from "../lib/axios";
import type { Attendance } from "../types/attendance";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const attendanceService = {
  async scan(data: { qrCodeId: string }) {
    const response = await axios.post<ApiResponse<any>>(
      "/attendance/scan",
      data
    );

    return response.data;
  },

  async getToday() {
    const response =
      await axios.get<ApiResponse<Attendance[]>>(
        "/attendance/today"
      );

    return response.data.data;
  },

  async getHistory() {
    const response =
      await axios.get<ApiResponse<Attendance[]>>(
        "/attendance/history"
      );

    return response.data.data;
  },
};