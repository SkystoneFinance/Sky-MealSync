import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { staffService } from "../services/staff.service";

import type { CreateStaffPayload, UpdateStaffPayload } from "../types/staff";

const STAFF_KEY = ["staff"] as const;

export function useStaff() {
  return useQuery({
    queryKey: STAFF_KEY,
    queryFn: staffService.getAll,
  });
}

export function useCreateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStaffPayload) => staffService.create(data),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: STAFF_KEY });
    },
  });
}

export function useUpdateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStaffPayload }) =>
      staffService.update(id, data),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: STAFF_KEY });
    },
  });
}

export function useImportStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => staffService.importStaff(file),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: STAFF_KEY });
    },
  });
}

export function useDeleteStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => staffService.delete(id),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: STAFF_KEY });
    },
  });
}

// ==========================================
// PIN RESETS
// ==========================================

const PIN_REQUESTS_KEY = ["staff", "pin-reset-requests"] as const;

export function usePinResetRequests(enabled = true) {
  return useQuery({
    queryKey: PIN_REQUESTS_KEY,
    queryFn: staffService.getPinResetRequests,
    enabled,
    refetchInterval: 60 * 1000,
  });
}

export function useResetPin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (staffId: string) => staffService.resetPin(staffId),
    onSuccess() {
      // Refreshes the staff list (hasPin) and the requests
      queryClient.invalidateQueries({ queryKey: STAFF_KEY });
    },
  });
}

export function useDismissPinResetRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) =>
      staffService.dismissPinResetRequest(requestId),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: PIN_REQUESTS_KEY });
    },
  });
}
