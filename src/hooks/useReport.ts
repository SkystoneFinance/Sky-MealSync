import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { reportService } from "../services/report.service";
import type { ReportPeriod } from "../types/report";

// Only the selected period is fetched; switching periods keeps the previous
// numbers on screen until the new ones arrive.
export function useReportSummary(period: ReportPeriod) {
  return useQuery({
    queryKey: ["reports", "summary", period],
    queryFn: () => reportService.summary(period),
    placeholderData: keepPreviousData,
  });
}

export function useStaffSummary(period: ReportPeriod) {
  return useQuery({
    queryKey: ["reports", "staff-summary", period],
    queryFn: () => reportService.staffSummary(period),
    placeholderData: keepPreviousData,
  });
}
