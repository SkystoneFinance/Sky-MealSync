import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  foodOptionService,
  type CreateFoodOptionPayload,
  type UpdateFoodOptionPayload,
} from "../services/foodOption.service";


// ==========================================
// QUERY KEYS
// ==========================================

const FOOD_OPTIONS_KEY = ["food-options"] as const;


// ==========================================
// GET ALL FOOD OPTIONS
// ==========================================

export function useFoodOptions() {
  return useQuery({
    queryKey: FOOD_OPTIONS_KEY,
    queryFn: foodOptionService.getAll,
  });
}


// ==========================================
// GET FOOD OPTIONS BY DATE
// ==========================================

export function useFoodOptionsByDate(date: string) {
  return useQuery({
    queryKey: ["food-options", "date", date],
    queryFn: () => foodOptionService.getByDate(date),
    enabled: Boolean(date),
  });
}


// ==========================================
// GET FOOD DEMAND SUMMARY
// ==========================================

export function useFoodOptionSummary(date: string) {
  return useQuery({
    queryKey: ["food-options", "summary", date],
    queryFn: () => foodOptionService.getSummaryByDate(date),
    enabled: Boolean(date),
  });
}


// ==========================================
// CREATE FOOD OPTION
// ==========================================

export function useCreateFoodOption() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFoodOptionPayload) =>
      foodOptionService.create(data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: FOOD_OPTIONS_KEY,
      });
    },
  });
}


// ==========================================
// UPDATE FOOD OPTION
// ==========================================

export function useUpdateFoodOption() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateFoodOptionPayload;
    }) => foodOptionService.update(id, data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: FOOD_OPTIONS_KEY,
      });
    },
  });
}


// ==========================================
// UPDATE FOOD OPTION STATUS
// ==========================================

export function useUpdateFoodOptionStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      isActive,
    }: {
      id: string;
      isActive: boolean;
    }) =>
      foodOptionService.updateStatus(id, {
        isActive,
      }),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: FOOD_OPTIONS_KEY,
      });
    },
  });
}


// ==========================================
// DELETE FOOD OPTION
// ==========================================

export function useDeleteFoodOption() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      foodOptionService.remove(id),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: FOOD_OPTIONS_KEY,
      });
    },
  });
}