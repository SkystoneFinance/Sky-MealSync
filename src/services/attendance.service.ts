import axios from "../lib/axios";
import type { Attendance } from "../types/attendance";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const attendanceService = {

  // =========================================
  // SCAN QR
  // =========================================

  async scan(
    data: { qrCodeId: string },
  ) {
    const response =
      await axios.post<
        ApiResponse<any>
      >(
        "/attendance/scan",
        data,
      );

    return response.data;
  },


  // =========================================
  // SERVE MEAL
  // =========================================

  async serveMeal(
    data: { staffId: string },
  ) {
    const response =
      await axios.post<
        ApiResponse<any>
      >(
        "/attendance/serve",
        data,
      );

    return response.data;
  },


  // =========================================
  // TODAY
  // =========================================

  async getToday() {
    const response =
      await axios.get<
        ApiResponse<Attendance[]>
      >(
        "/attendance/today",
      );

    return response.data.data;
  },


  // =========================================
  // HISTORY
  // =========================================

  async getHistory() {
    const response =
      await axios.get<
        ApiResponse<Attendance[]>
      >(
        "/attendance/history",
      );

    return response.data.data;
  },
};