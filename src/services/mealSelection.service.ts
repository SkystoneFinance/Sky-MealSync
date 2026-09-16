import api from "../lib/axios";

import type {
  MealSelection,
  MealSelectionsResponse,
  MealSelectionResponse,
} from "../types/mealSelection";

export interface CreateMealSelectionPayload {
  foodOptionId: string;
  mealDate: string;
}

export interface UpdateMealSelectionPayload {
  foodOptionId: string;
}

export const mealSelectionService = {
  async create(
    data: CreateMealSelectionPayload
  ): Promise<MealSelection> {
    const response =
      await api.post<MealSelectionResponse>(
        "/meal-selections",
        data
      );

    return response.data.data;
  },

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

  async update(
    id: string,
    data: UpdateMealSelectionPayload
  ): Promise<MealSelection> {
    const response =
      await api.patch<MealSelectionResponse>(
        `/meal-selections/${id}`,
        data
      );

    return response.data.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(
      `/meal-selections/${id}`
    );
  },
};