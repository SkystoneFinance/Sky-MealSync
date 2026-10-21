import { useQuery } from "@tanstack/react-query";

import {
  mealSelectionService,
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
