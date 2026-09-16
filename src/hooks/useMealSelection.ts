import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  mealSelectionService,
  type CreateMealSelectionPayload,
} from "../services/mealSelection.service";

export function useMyMealSelections() {
  return useQuery({
    queryKey: ["meal-selections", "mine"],
    queryFn: mealSelectionService.getMine,
  });
}

export function useCreateMealSelection() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      data: CreateMealSelectionPayload
    ) =>
      mealSelectionService.create(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "meal-selections",
          "mine",
        ],
      });
    },
  });
}

export function useUpdateMealSelection() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      foodOptionId,
    }: {
      id: string;
      foodOptionId: string;
    }) =>
      mealSelectionService.update(id, {
        foodOptionId,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "meal-selections",
          "mine",
        ],
      });
    },
  });
}