import { useQuery } from "@tanstack/react-query";

import { reportService } from "../services/report.service";

export function useTodayReport() {
  return useQuery({
    queryKey: ["today-report"],
    queryFn: reportService.today,
  });
}

export function useWeeklyReport() {
  return useQuery({
    queryKey: ["weekly-report"],
    queryFn: reportService.weekly,
  });
}

export function useMonthlyReport() {
  return useQuery({
    queryKey: ["monthly-report"],
    queryFn: reportService.monthly,
  });
}

export function useStaffSummary(
  period: string,
) {
  return useQuery({
    queryKey: ["staff-summary", period],

    queryFn: () =>
      reportService.staffSummary(period),
  });
}