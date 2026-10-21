import axios from "../lib/axios";
import type {
  Attendance,
  ScanPayload,
  ScanPreview,
  ServePayload,
  ServeResult,
} from "../types/attendance";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const attendanceService = {
  // Identify a staff member from their QR code (preview only).
  async scan(data: ScanPayload) {
    const response = await axios.post<ApiResponse<ScanPreview>>(
      "/attendance/scan",
      data
    );

    return response.data;
  },

  // Record one serving for the staff member.
  async serveMeal(data: ServePayload) {
    const response = await axios.post<ApiResponse<ServeResult>>(
      "/attendance/serve",
      data
    );

    return response.data;
  },

  async getToday() {
    const response = await axios.get<ApiResponse<Attendance[]>>(
      "/attendance/today"
    );

    return response.data.data;
  },

  async getHistory() {
    const response = await axios.get<ApiResponse<Attendance[]>>(
      "/attendance/history"
    );

    return response.data.data;
  },
};
