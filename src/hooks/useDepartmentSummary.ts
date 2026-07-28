import { useQuery } from "@tanstack/react-query";

import { dashboardService } from "../services/dashboard.service";
import { queryKeys } from "../lib/queryKeys";

export function useDepartmentSummary() {
  return useQuery({
    queryKey: queryKeys.departmentSummary,
    queryFn: dashboardService.getDepartmentSummary,
  });
}