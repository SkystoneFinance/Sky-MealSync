import { useQuery } from "@tanstack/react-query";

import { attendanceService } from "../services/attendance.service";

export const TODAY_ATTENDANCE_KEY = ["today-attendance"] as const;

export function useTodayAttendance() {
  return useQuery({
    queryKey: TODAY_ATTENDANCE_KEY,
    queryFn: attendanceService.getToday,
  });
}

export function useAttendanceHistory() {
  return useQuery({
    queryKey: ["attendance-history"],
    queryFn: attendanceService.getHistory,
  });
}
