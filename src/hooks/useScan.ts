import { useMutation } from "@tanstack/react-query";
import { attendanceService } from "../services/attendance.service";

export function useScan() {
  return useMutation({
    mutationFn: attendanceService.scan,
  });
}