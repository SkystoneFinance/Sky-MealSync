import { useMutation, useQueryClient } from "@tanstack/react-query";

import { attendanceService } from "../services/attendance.service";
import { queryKeys } from "../lib/queryKeys";
import { TODAY_ATTENDANCE_KEY } from "./useattendance";

// Records a serving, then refreshes every view that counts servings.
export function useServeMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: attendanceService.serveMeal,

    onSuccess() {
      queryClient.invalidateQueries({ queryKey: TODAY_ATTENDANCE_KEY });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: queryKeys.recentAttendance });
      queryClient.invalidateQueries({ queryKey: queryKeys.departmentSummary });
    },
  });
}
