import api from "../lib/axios";

import type {
  FoodOption,
  FoodOptionsResponse,
  FoodOptionResponse,
} from "../types/foodOption";


// ==========================================
// PAYLOAD TYPES
// ==========================================

export interface CreateFoodOptionPayload {
  name: string;
  image: string;
  mealDate: string;
}


export interface UpdateFoodOptionPayload {
  name?: string;
  image?: string;
  mealDate?: string;
}


export interface UpdateFoodOptionStatusPayload {
  isActive: boolean;
}


// ==========================================
// FOOD OPTION SERVICE
// ==========================================

export const foodOptionService = {

  // ========================================
  // GET ALL
  // ========================================

  async getAll(): Promise<FoodOption[]> {

    const response =
      await api.get<FoodOptionsResponse>(
        "/food-options"
      );

    return response.data.data;
  },


  // ========================================
  // GET BY DATE
  // ========================================

  async getByDate(
    date: string
  ): Promise<FoodOption[]> {

    const response =
      await api.get<FoodOptionsResponse>(
        `/food-options/date?date=${encodeURIComponent(date)}`
      );

    return response.data.data;
  },


  // ========================================
  // GET BY ID
  // ========================================

  async getById(
    id: string
  ): Promise<FoodOption> {

    const response =
      await api.get<FoodOptionResponse>(
        `/food-options/${id}`
      );

    return response.data.data;
  },


  // ========================================
  // CREATE
  // ========================================

  async create(
    data: CreateFoodOptionPayload
  ): Promise<FoodOption> {

    const response =
      await api.post<FoodOptionResponse>(
        "/food-options",
        data
      );

    return response.data.data;
  },


  // ========================================
  // UPDATE
  // ========================================

  async update(
    id: string,
    data: UpdateFoodOptionPayload
  ): Promise<FoodOption> {

    const response =
      await api.patch<FoodOptionResponse>(
        `/food-options/${id}`,
        data
      );

    return response.data.data;
  },


  // ========================================
  // UPDATE STATUS
  // ========================================

  async updateStatus(
    id: string,
    data: UpdateFoodOptionStatusPayload
  ): Promise<FoodOption> {

    const response =
      await api.patch<FoodOptionResponse>(
        `/food-options/${id}/status`,
        data
      );

    return response.data.data;
  },


  // ========================================
  // DELETE
  // ========================================

  async remove(
    id: string
  ): Promise<void> {

    await api.delete(
      `/food-options/${id}`
    );

  },

};