import axios from "../lib/axios";

import type {
  ExportPeriod,
  ReportPeriod,
  ReportSummary,
  StaffMealSummary,
} from "../types/report";

export type { ExportPeriod } from "../types/report";

export const reportService = {
  async summary(period: ReportPeriod) {
    const response = await axios.get<ReportSummary>(`/reports/${period}`);

    return response.data;
  },

  async staffSummary(period: ReportPeriod) {
    const response = await axios.get<{
      success: boolean;
      data: StaffMealSummary[];
    }>("/reports/staff-summary", { params: { period } });

    return response.data.data;
  },

  async downloadReport(period: ExportPeriod) {
    const response = await axios.get<Blob>("/reports/export", {
      params: { period },
      responseType: "blob",
    });

    return response.data;
  },
};
