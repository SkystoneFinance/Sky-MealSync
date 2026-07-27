import { api } from "../../../lib/axios";
import type { DashboardResponse } from "../types/dashboard.types";

class DashboardService {
  /**
   * Fetch dashboard summary
   * GET /dashboard
   */
  async getDashboard(): Promise<DashboardResponse> {
    const { data } = await api.get<DashboardResponse>("/dashboard");

    return data;
  }
}

export const dashboardService = new DashboardService();