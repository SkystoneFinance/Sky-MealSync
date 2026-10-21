import api from "../lib/axios";

import type {
  MealSelection,
  MealSelectionsResponse,
  MealSelectionResponse,
} from "../types/mealSelection";

// Read-only: plans are submitted through mealPlan.service (PUT /meal-plan).
export const mealSelectionService = {
  async getMine(): Promise<MealSelection[]> {
    const response =
      await api.get<MealSelectionsResponse>(
        "/meal-selections/my"
      );

    return response.data.data;
  },

  async getMineByDate(
    date: string
  ): Promise<MealSelection | null> {
    try {
      const response =
        await api.get<MealSelectionResponse>(
          `/meal-selections/my/date?date=${encodeURIComponent(date)}`
        );

      return response.data.data;
    } catch (error: any) {
      // If your backend returns 404 when no selection
      // exists for that date, treat it as empty.
      if (error?.response?.status === 404) {
        return null;
      }

      throw error;
    }
  },
};