import { useQuery } from "@tanstack/react-query";

import { dashboardService } from "../services/dashboard.service";
import { queryKeys } from "../lib/queryKeys";

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: dashboardService.getDashboard,
  });
}
