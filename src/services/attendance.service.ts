import axios from "../lib/axios";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ScanPayload {
  qrCodeId: string;
}

export interface AttendanceResponse {
  id: string;
  scannedAt: string;

  staff: {
    firstName: string;
    lastName: string;
    department: string;
    staffNumber: string;
    qrImage: string;
  };
}

export const attendanceService = {
  async scan(data: ScanPayload) {
    const response =
      await axios.post<ApiResponse<AttendanceResponse>>(
        "/attendance/scan",
        data
      );

    return response.data;
  },
};