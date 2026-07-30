import axios from "../lib/axios";

import type {
  ReportSummary,
  StaffMealSummary,
} from "../types/report";

export const reportService = {
  async today() {
    const response =
      await axios.get<ReportSummary>(
        "/reports/today"
      );

    return response.data;
  },

  async weekly() {
    const response =
      await axios.get<ReportSummary>(
        "/reports/weekly"
      );

    return response.data;
  },

  async monthly() {
    const response =
      await axios.get<ReportSummary>(
        "/reports/monthly"
      );

    return response.data;
  },

  async staffSummary(
    period: string,
  ) {
    const response =
      await axios.get<{
        success: boolean;
        data: StaffMealSummary[];
      }>(
        `/reports/staff-summary?period=${period}`
      );

    return response.data.data;
  },

  async downloadReport(
    period: string,
  ) {
    const response =
      await axios.get(
        `/reports/export?period=${period}`,
        {
          responseType: "blob",
        }
      );

    return response.data;
  },
};