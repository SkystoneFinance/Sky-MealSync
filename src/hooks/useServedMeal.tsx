import { useMutation } from "@tanstack/react-query";

import { attendanceService } from "../services/attendance.service";

export function useServeMeal() {
  return useMutation({
    mutationFn:
      attendanceService.serveMeal,
  });
}