import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  mealSelectionService,
  type CreateMealSelectionPayload,
} from "../services/mealSelection.service";


// =========================================
// GET MY MEAL SELECTIONS
// =========================================

export function useMyMealSelections() {
  return useQuery({
    queryKey: ["meal-selections", "mine"],
    queryFn: mealSelectionService.getMine,
  });
}


// =========================================
// GET MY SELECTION FOR A SPECIFIC DATE
// =========================================

export function useMyMealSelectionByDate(
  date: string
) {
  return useQuery({
    queryKey: [
      "meal-selections",
      "mine",
      date,
    ],

    queryFn: () =>
      mealSelectionService.getMineByDate(
        date
      ),

    enabled: Boolean(date),
  });
}


// =========================================
// CREATE MEAL SELECTION
// =========================================

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


// =========================================
// UPDATE MEAL SELECTION
// =========================================

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
      mealSelectionService.update(
        id,
        {
          foodOptionId,
        }
      ),

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