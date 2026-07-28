import { useQuery } from "@tanstack/react-query";

import { dashboardService } from "../services/dashboard.service";
import { queryKeys } from "../lib/queryKeys";

export function useRecentAttendance() {
  return useQuery({
    queryKey: queryKeys.recentAttendance,
    queryFn: dashboardService.getRecentAttendance,
  });
}