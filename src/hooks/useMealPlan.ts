import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { mealPlanService } from "../services/mealPlan.service";
import type { DayChoice } from "../types/mealPlan";

// ==========================================
// STAFF
// ==========================================

export function useMyMealPlan(weekStart?: string) {
  return useQuery({
    queryKey: ["meal-plan", "mine", weekStart ?? "next"],
    queryFn: () => mealPlanService.getMine(weekStart),
    staleTime: 60 * 1000,
  });
}

export function useMyPlanStatus() {
  return useQuery({
    queryKey: ["meal-plan", "status"],
    queryFn: mealPlanService.getMyStatus,
    // The banner should reflect a newly published menu
    staleTime: 60 * 1000,
  });
}

export function useSubmitMealPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      weekStart: string;
      selections: DayChoice[];
    }) => mealPlanService.submit(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["meal-plan"],
      });
      queryClient.invalidateQueries({
        queryKey: ["meal-selections"],
      });
    },
  });
}

// ==========================================
// CHEF / ADMIN
// ==========================================

export function useChefPlanStatus() {
  return useQuery({
    queryKey: ["menu-weeks", "status"],
    queryFn: mealPlanService.getStatus,
    staleTime: 60 * 1000,
  });
}

export function useMenuWeek(weekStart: string | undefined) {
  return useQuery({
    queryKey: ["menu-weeks", weekStart],
    queryFn: () => mealPlanService.getWeek(weekStart!),
    enabled: Boolean(weekStart),
  });
}

export function useMealPrepSummary(
  weekStart: string | undefined
) {
  return useQuery({
    queryKey: ["menu-weeks", weekStart, "summary"],
    queryFn: () => mealPlanService.getSummary(weekStart!),
    enabled: Boolean(weekStart),
    staleTime: 30 * 1000,
  });
}

function useInvalidateMenuWeeks() {
  const queryClient = useQueryClient();

  return () =>
    queryClient.invalidateQueries({
      queryKey: ["menu-weeks"],
    });
}

export function useSetClosedDays(weekStart: string) {
  const invalidate = useInvalidateMenuWeeks();

  return useMutation({
    mutationFn: (dates: string[]) =>
      mealPlanService.setClosedDays(weekStart, dates),
    onSuccess: invalidate,
  });
}

export function usePublishWeek(weekStart: string) {
  const invalidate = useInvalidateMenuWeeks();

  return useMutation({
    mutationFn: () => mealPlanService.publish(weekStart),
    onSuccess: invalidate,
  });
}

export function useReopenForStaff(weekStart: string) {
  const invalidate = useInvalidateMenuWeeks();

  return useMutation({
    mutationFn: (staffId: string) =>
      mealPlanService.reopenForStaff(weekStart, staffId),
    onSuccess: invalidate,
  });
}
