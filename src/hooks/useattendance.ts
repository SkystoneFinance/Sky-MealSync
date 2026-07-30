import { useQuery } from "@tanstack/react-query";

import { attendanceService } from "../services/attendance.service";

export function useTodayAttendance() {
  return useQuery({
    queryKey: ["today-attendance"],
    queryFn: attendanceService.getToday,
  });
}

export function useAttendanceHistory() {
  return useQuery({
    queryKey: ["attendance-history"],
    queryFn: attendanceService.getHistory,
  });
}