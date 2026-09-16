import api from "../lib/axios";
import type {
  FoodOption,
  FoodOptionsResponse,
  FoodOptionResponse,
} from "../types/foodOption";

export const foodOptionService = {
  async getAll(): Promise<FoodOption[]> {
    const response =
      await api.get<FoodOptionsResponse>(
        "/food-options"
      );

    return response.data.data;
  },

  async getByDate(
    date: string
  ): Promise<FoodOption[]> {
    const response =
      await api.get<FoodOptionsResponse>(
        `/food-options/date?date=${encodeURIComponent(date)}`
      );

    return response.data.data;
  },

  async getById(
    id: string
  ): Promise<FoodOption> {
    const response =
      await api.get<FoodOptionResponse>(
        `/food-options/${id}`
      );

    return response.data.data;
  },
};