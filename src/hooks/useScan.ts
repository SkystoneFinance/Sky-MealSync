import { useMutation } from "@tanstack/react-query";
import { attendanceService } from "../services/attendance.service";

// Looks up the staff member behind a QR code. Records nothing.
export function useScan() {
  return useMutation({
    mutationFn: attendanceService.scan,
  });
}
