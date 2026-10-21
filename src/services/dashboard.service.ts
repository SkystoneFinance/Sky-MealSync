import axios from "../lib/axios";

import type { ApiResponse } from "../types/api";

import type {
  DashboardStats,
  RecentAttendance,
} from "../types/dashboard";

export const dashboardService = {
  async getDashboard() {
    const response = await axios.get<ApiResponse<DashboardStats>>(
      "/dashboard"
    );

    return response.data.data;
  },

  async getRecentAttendance() {
    const response = await axios.get<
      ApiResponse<RecentAttendance[]>
    >("/dashboard/recent-attendance");

    return response.data.data;
  },
};